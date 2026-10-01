import assert from 'node:assert/strict';
import { mkdtempSync, cpSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

const url = new URL(process.env.RAB_BUILDER_TEST_URL ?? '');
assert.ok(
	['127.0.0.1', 'localhost'].includes(url.hostname) &&
		url.port === '55414' &&
		/^\/rab_builder_test(?:_\w+)?$/.test(url.pathname),
	'Only disposable localhost:55414/rab_builder_test databases are allowed'
);

const client = postgres(url.toString(), { max: 1 });
const hasCode = (code: string) => (error: unknown) =>
	Boolean(error && typeof error === 'object' && 'code' in error && error.code === code);

try {
	assert.equal(
		(await client`select tablename from pg_tables where schemaname = 'public'`).length,
		0,
		'Use a fresh empty test database'
	);

	await client.unsafe(`
		DO $$ BEGIN CREATE ROLE authenticated; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
		DO $$ BEGIN CREATE ROLE anon; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
		DO $$ BEGIN CREATE ROLE postgres NOLOGIN; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
		CREATE SCHEMA storage;
		CREATE TABLE storage.buckets(
			id text primary key, name text, public boolean,
			file_size_limit bigint, allowed_mime_types text[]
		);
		CREATE TABLE storage.objects(id uuid, bucket_id text);
		ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
	`);

	const migrationsFolder = mkdtempSync(join(tmpdir(), 'cms-audit-test-migrations-'));
	cpSync('drizzle', migrationsFolder, { recursive: true });
	const compatibility = join(migrationsFolder, '0016_rab_legacy_payment_term_compatibility.sql');
	// Only adapt the disposable copy of the production-data fingerprint.
	writeFileSync(
		compatibility,
		readFileSync(compatibility, 'utf8')
			.split('--> statement-breakpoint')
			.slice(1)
			.join('--> statement-breakpoint')
	);
	await migrate(drizzle(client), { migrationsFolder });

	const actorId = '00000000-0000-4000-8000-000000000037';
	const correlationId = '00000000-0000-4000-8000-000000000038';
	await client`
		insert into cms_users(user_id, name, role)
		values (${actorId}, 'Audit Test Actor', 'admin')
	`;
	const [event] = await client`
		insert into cms_activity_logs(
			actor_user_id, actor_name, actor_role, action,
			entity_type, entity_id, outcome, summary, correlation_id
		) values (
			${actorId}, 'Audit Test Actor', 'admin', 'user.created',
			'user', ${actorId}, 'success', 'Synthetic test activity', ${correlationId}
		) returning *
	`;
	assert.ok(event.id);
	assert.ok(event.occurred_at);
	assert.equal(event.correlation_id, correlationId);

	await assert.rejects(
		client`update cms_activity_logs set summary = 'Changed' where id = ${event.id}`,
		hasCode('42501')
	);
	await assert.rejects(
		client`delete from cms_activity_logs where id = ${event.id}`,
		hasCode('42501')
	);
	await assert.rejects(client`truncate cms_activity_logs`, hasCode('42501'));

	await assert.rejects(
		client`
			insert into cms_activity_logs(action, entity_type, outcome, summary, correlation_id)
			values ('test', 'test', 'invalid', 'Synthetic test', ${correlationId})
		`,
		hasCode('23514')
	);

	const [security] = await client`
		select relrowsecurity from pg_class
		where oid = 'public.cms_activity_logs'::regclass
	`;
	assert.equal(security.relrowsecurity, true);
	const policies = await client`
		select policyname from pg_policies
		where schemaname = 'public' and tablename = 'cms_activity_logs'
	`;
	assert.equal(policies.length, 0);

	for (const role of ['anon', 'authenticated'] as const) {
		for (const operation of [
			'select * from public.cms_activity_logs',
			`insert into public.cms_activity_logs(action, entity_type, outcome, summary, correlation_id)
			 values ('test', 'test', 'success', 'Synthetic test', '${correlationId}')`,
			"update public.cms_activity_logs set summary = 'Changed'",
			'delete from public.cms_activity_logs',
			'truncate public.cms_activity_logs'
		]) {
			await assert.rejects(
				client.begin(async (tx) => {
					await tx.unsafe(`SET LOCAL ROLE ${role}`);
					await tx.unsafe(operation);
				}),
				hasCode('42501')
			);
		}
	}

	await client`delete from cms_users where user_id = ${actorId}`;
	const [preserved] = await client`select * from cms_activity_logs where id = ${event.id}`;
	assert.equal(preserved.actor_user_id, actorId);
	assert.equal(preserved.actor_name, 'Audit Test Actor');
	assert.equal(preserved.actor_role, 'admin');
	assert.equal(preserved.summary, 'Synthetic test activity');
	assert.equal((await client`select id from cms_activity_logs`).length, 1);

	console.log(
		'PASS audit database: migrations, insert, immutable logs, browser denial, retained attribution'
	);
} finally {
	await client.end();
}
