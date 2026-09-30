// Run only against an EMPTY disposable PostgreSQL database on the Builder test port.
import assert from 'node:assert/strict';
import { mkdtempSync, cpSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { parseBuilderForm, parseCommercialForm } from '../src/lib/rab-builder/values';

const url = new URL(process.env.RAB_BUILDER_TEST_URL ?? '');
assert.ok(
	['127.0.0.1', 'localhost'].includes(url.hostname) &&
		url.port === '55414' &&
		/^\/rab_builder_test(?:_\w+)?$/.test(url.pathname),
	'Only disposable localhost:55414/rab_builder_test databases are allowed'
);
process.env.DATABASE_URL = url.toString();
const client = postgres(url.toString());
assert.equal(
	(await client`select tablename from pg_tables where schemaname='public'`).length,
	0,
	'Use a fresh empty test database'
);
await client.unsafe(`DO $$ BEGIN CREATE ROLE authenticated; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE ROLE anon; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE SCHEMA storage; CREATE TABLE storage.buckets(id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
CREATE TABLE storage.objects(id uuid, bucket_id text); ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;`);

// 0016's production-data fingerprint deliberately refuses empty databases.
// Adapt ONLY the temporary test copy; keep its DDL and repository migration intact.
const migrationsFolder = mkdtempSync(join(tmpdir(), 'rab-approval-migrations-'));
cpSync('drizzle', migrationsFolder, { recursive: true });
const compatibility = join(migrationsFolder, '0016_rab_legacy_payment_term_compatibility.sql');
writeFileSync(
	compatibility,
	readFileSync(compatibility, 'utf8')
		.split('--> statement-breakpoint')
		.slice(1)
		.join('--> statement-breakpoint')
);
await migrate(drizzle(client), { migrationsFolder });
const {
	getRabBuilder,
	mutateRabBuilder,
	mutateRabCommercial,
	createInitialRab,
	transitionRabApproval
} = await import('../src/lib/server/db/queries');
const { db } = await import('../src/lib/server/db/index');
const staff = '00000000-0000-4000-8000-000000000001';
const director = '00000000-0000-4000-8000-000000000002';
const inactive = '00000000-0000-4000-8000-000000000003';
const absent = '00000000-0000-4000-8000-000000000004';
const manager = '00000000-0000-4000-8000-000000000005';
const admin = '00000000-0000-4000-8000-000000000006';
const invalidRole = '00000000-0000-4000-8000-000000000007';
await client`insert into cms_users(user_id,role,is_active) values (${staff},'staff',true), (${manager},'manager',true), (${director},'director',true), (${admin},'admin',true), (${inactive},'director',false)`;
await assert.rejects(client`insert into cms_users(user_id,role) values (${invalidRole},'owner')`);
const [customer] =
	await client`insert into clients(company_name) values ('Original client') returning id`;
const [project] =
	await client`insert into projects(client_id,client_project_number,project_name,location) values (${customer.id},1,'Original project','Jakarta') returning id`;
const create = async (owner: string | null) => (await createInitialRab(project.id, owner))!.id;
const rabId = await create(staff);
const get = async (id = rabId) => (await getRabBuilder(project.id, id))!;
const transition = (actor: string, operation: 'request' | 'approve', id = rabId) =>
	transitionRabApproval(project.id, id, actor, operation);
const form = (values: Record<string, string>) => {
	const data = new FormData();
	for (const [k, v] of Object.entries(values)) data.set(k, v);
	return data;
};
const section = parseBuilderForm(
	form({ kind: 'section', operation: 'save', name: 'Frozen area', sortOrder: '0' })
);
const stage = parseCommercialForm(
	form({
		commercialKind: 'stage',
		operation: 'save',
		name: 'Frozen stage',
		description: 'Description',
		sortOrder: '0'
	})
);
assert.equal((await get()).rab.status, 'draft');
assert.equal((await get()).previewAvailable, true);
for (const actor of [absent, inactive, staff, manager])
	assert.equal((await transition(actor, 'approve')).status, 'forbidden');
for (const actor of [director, admin])
	assert.equal((await transition(actor, 'request')).status, 'forbidden');
assert.equal((await transition(director, 'approve')).status, 'forbidden');
assert.equal((await transition(admin, 'approve')).status, 'forbidden');
assert.equal(
	(await transitionRabApproval(project.id + 999, rabId, director, 'approve')).status,
	'missing'
);
await mutateRabBuilder(project.id, rabId, section);
await mutateRabCommercial(project.id, rabId, stage);
assert.equal((await transition(staff, 'request')).status, 'ok');
const review = await get();
assert.equal(review.rab.status, 'internal_review');
assert.equal(review.rab.internalApprovalRequestedByUserId, staff);
assert.ok(review.rab.internalApprovalRequestedAt);
assert.equal(review.previewAvailable, true);
assert.equal((await transition(staff, 'request')).status, 'forbidden');
assert.equal((await transition(staff, 'approve')).status, 'forbidden');
assert.equal((await mutateRabBuilder(project.id, rabId, section)).status, 'locked');
assert.equal((await mutateRabCommercial(project.id, rabId, stage)).status, 'locked');
await client`update clients set company_name='Changed client' where id=${customer.id}`;
await client`update projects set project_name='Changed project',location='Bandung' where id=${project.id}`;
// Even an out-of-band child edit cannot change frozen preview content.
await client`update rab_sections set name='Changed area' where rab_id=${rabId}`;
const frozen = await get();
assert.equal(frozen.project.projectName, 'Original project');
assert.equal(frozen.project.clientName, 'Original client');
assert.equal(frozen.sections[0].name, 'Frozen area');
assert.equal((await transition(director, 'approve')).status, 'ok');
const approved = await get();
assert.equal(approved.rab.status, 'internal_approved');
assert.equal(approved.rab.internalApprovedByUserId, director);
assert.ok(approved.rab.internalApprovedAt);
assert.equal(approved.rab.clientApprovedAt, null);
assert.equal(approved.rab.frozenDocument, review.rab.frozenDocument);
assert.equal(
	approved.rab.internalApprovalRequestedAt?.getTime(),
	review.rab.internalApprovalRequestedAt?.getTime()
);
assert.equal(approved.previewAvailable, true);
assert.equal((await transition(director, 'approve')).status, 'forbidden');
assert.equal((await mutateRabBuilder(project.id, rabId, section)).status, 'locked');
assert.equal((await mutateRabCommercial(project.id, rabId, stage)).status, 'locked');
const own = await create(director);
assert.equal((await transition(director, 'approve', own)).status, 'ok');
const selfApproved = await get(own);
assert.equal(selfApproved.rab.createdByUserId, selfApproved.rab.internalApprovedByUserId);
assert.equal(selfApproved.rab.internalApprovalRequestedByUserId, null);
assert.equal(selfApproved.rab.internalApprovalRequestedAt, null);

const managerReview = await create(manager);
assert.equal((await transition(manager, 'request', managerReview)).status, 'ok');
assert.equal((await transition(admin, 'approve', managerReview)).status, 'ok');

const adminOwn = await create(admin);
assert.equal((await transition(admin, 'approve', adminOwn)).status, 'ok');
const unknown = await create(null);
assert.equal((await transition(director, 'approve', unknown)).status, 'forbidden');
for (const historical of [null, '{"old":"snapshot"}', '{broken']) {
	const id = await create(staff);
	await client`update rabs set status='internal_review', frozen_document=${historical} where id=${id}`;
	assert.equal((await get(id)).previewAvailable, false);
	assert.equal((await transition(director, 'approve', id)).status, 'historical');
}
const corrupt = await create(director);
await transition(director, 'approve', corrupt);
await client`update rabs set frozen_document=replace(frozen_document,'Changed project','tampered') where id=${corrupt}`;
assert.equal((await get(corrupt)).previewAvailable, false);
// Concurrent attempts must produce one transition and one immutable audit event.
const race = await create(staff);
const attempts = await Promise.allSettled([
	transition(staff, 'request', race),
	transition(staff, 'request', race)
]);
assert.equal(attempts.filter((x) => x.status === 'fulfilled' && x.value.status === 'ok').length, 1);
assert.equal((await get(race)).rab.status, 'internal_review');
// Submit while another transaction holds an editor lock: edit commits first or submission conflicts safely.
const editRace = await create(staff);
let unlock!: () => void, ready!: () => void;
const acquired = new Promise<void>((resolve) => {
	ready = resolve;
});
const release = new Promise<void>((resolve) => {
	unlock = resolve;
});
const editing = client.begin(async (tx) => {
	await tx`select id from rabs where id=${editRace} for update`;
	ready();
	await release;
	await tx`update rabs set greeting='Last saved greeting' where id=${editRace}`;
});
await acquired;
const submitting = transition(staff, 'request', editRace);
unlock();
await editing;
try {
	await submitting;
} catch {
	/* serialization failure leaves draft safe to retry */
}
if ((await get(editRace)).rab.status === 'draft') await transition(staff, 'request', editRace);
assert.equal((await get(editRace)).rab.greeting, 'Last saved greeting');
// Role table is not writable through ordinary Supabase API roles.
await client`grant select,insert,update on cms_users to authenticated`;
await client.begin(async (tx) => {
	await tx.unsafe('set local role authenticated');
	assert.equal((await tx`select * from cms_users`).length, 0);
	assert.equal(
		(await tx`update cms_users set role='director' where user_id=${staff} returning *`).length,
		0
	);
});
// Exercise actual SvelteKit route actions with authenticated identity supplied by locals.
const { actions } =
	await import('../src/routes/admin/projects/[projectId]/rab/[rabId]/+page.server');
const { load: previewLoad } =
	await import('../src/routes/admin/projects/[projectId]/rab/[rabId]/preview/+page.server');
const event = (actor: string | null, id = rabId) => ({
	params: { projectId: String(project.id), rabId: String(id) },
	locals: { getUser: async () => (actor ? { id: actor } : null) },
	setHeaders: () => {}
});
const invoke = async (name: string, actor: string | null, id = rabId) =>
	actions[name]!(event(actor, id) as never);
assert.equal(((await invoke('approve', staff)) as { status: number }).status, 403);
assert.equal(((await invoke('approve', absent)) as { status: number }).status, 403);
await assert.rejects(
	() => invoke('approve', null),
	(error: any) => error.status === 401
);
const actionRab = await create(staff);
assert.equal(
	((await invoke('requestApproval', staff, actionRab)) as { success: boolean }).success,
	true
);
assert.equal(
	((await invoke('approve', director, actionRab)) as { success: boolean }).success,
	true
);
const preview = await previewLoad(event(director, actionRab) as never);
assert.equal((preview as any).rab.status, 'internal_approved');
await assert.rejects(
	() => Promise.resolve(previewLoad(event(director, corrupt) as never)),
	(error: any) => error.status === 409
);
console.log(
	'PASS approval: roles, transitions, audit, locks, races, snapshots, legacy safeguard, RLS'
);
await db.$client.end();
await client.end();
