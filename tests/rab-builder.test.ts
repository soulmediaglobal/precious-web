// Run only against an EMPTY disposable PostgreSQL database on the Builder test port.
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { parseBuilderForm, sumMoney, money } from '../src/lib/rab-builder/values';

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
const journal = JSON.parse(readFileSync('drizzle/meta/_journal.json', 'utf8'));
const prefix = mkdtempSync(join(tmpdir(), 'rab-builder-migrations-'));
cpSync('drizzle', prefix, { recursive: true });
writeFileSync(
	join(prefix, 'meta/_journal.json'),
	JSON.stringify({ ...journal, entries: journal.entries.slice(0, -1) })
);
await migrate(drizzle(client), { migrationsFolder: prefix });
const [customer] =
	await client`insert into clients (company_name) values ('Builder Demo Client') returning id`;
const [project] =
	await client`insert into projects (client_id, client_project_number, project_name, location) values (${customer.id}, 1, 'Demo · Gedung Operasional Precious', 'Jakarta') returning id`;
const [family] =
	await client`insert into rab_families (project_id, family_number) values (${project.id},1) returning id`;
await client`insert into rab_family_counters (project_id,last_number) values (${project.id},1)`;
const [rab] =
	await client`insert into rabs (project_id, family_id, document_number, subtotal, tax_amount, grand_total) values (${project.id}, ${family.id}, 'DEMO/RAB-001/R00', 150, 16.50, 166.50) returning id`;
const [legacySection] =
	await client`insert into rab_sections (rab_id,name) values (${rab.id},'Existing area') returning id`;
const [legacyGroup] =
	await client`insert into rab_groups (section_id,name) values (${legacySection.id},'Existing group') returning id`;
const [legacy] =
	await client`insert into rab_items (group_id,description,unit,volume,unit_price,total,weight) values (${legacyGroup.id},'Harga lama belum dipisah','ls',2,75,150,100) returning *`;
await migrate(drizzle(client), { migrationsFolder: 'drizzle' });
const [preserved] = await client`select * from rab_items where id=${legacy.id}`;
assert.deepEqual(preserved, { ...legacy, material_unit_price: null, jasa_unit_price: null });
assert.equal(
	(await client`select grand_total from rabs where id=${rab.id}`)[0].grand_total,
	'166.50'
);
console.log('PASS migration preserves legacy prices, totals and weight');

const { getRabBuilder, mutateRabBuilder, createInitialRab } =
	await import('../src/lib/server/db/queries');
const { db } = await import('../src/lib/server/db/index');
const mutate = async (values: Record<string, unknown>, projectId = project.id, rabId = rab.id) => {
	const form = new FormData();
	for (const [key, value] of Object.entries({ sortOrder: 0, operation: 'save', ...values }))
		if (value != null) form.set(key, String(value));
	return mutateRabBuilder(projectId, rabId, parseBuilderForm(form));
};
const get = async () => (await getRabBuilder(project.id, rab.id))!;
const itemValues = {
	kind: 'item',
	description: 'Beton K-300',
	unit: 'm³',
	volume: '2.5',
	materialUnitPrice: '100.10',
	jasaUnitPrice: '20.20',
	notes: 'Concrete fixture'
};
await mutate({ kind: 'section', name: 'Struktur', sortOrder: 2 });
let view = await get();
const section = view.sections.find((row) => row.name === 'Struktur')!;
await mutate({ kind: 'group', parentId: section.id, name: 'Beton', sortOrder: 2 });
await mutate({ kind: 'group', parentId: section.id, name: 'Bekisting', sortOrder: 1 });
view = await get();
let groups = view.sections.find((row) => row.id === section.id)!.groups;
assert.deepEqual(
	groups.map((g) => g.name),
	['Bekisting', 'Beton']
);
const concrete = groups.find((g) => g.name === 'Beton')!,
	formwork = groups.find((g) => g.name === 'Bekisting')!;
await mutate({ kind: 'subgroup', parentId: concrete.id, name: 'Kolom' });
await mutate({ kind: 'subgroup', parentId: formwork.id, name: 'Lantai' });
view = await get();
groups = view.sections.find((row) => row.id === section.id)!.groups;
const column = groups.find((g) => g.id === concrete.id)!.subgroups[0],
	floor = groups.find((g) => g.id === formwork.id)!.subgroups[0];
await mutate({ ...itemValues, parentId: concrete.id, subgroupId: column.id });
await mutate({
	...itemValues,
	description: 'Pekerjaan langsung',
	parentId: concrete.id,
	volume: '3',
	materialUnitPrice: '10.10',
	jasaUnitPrice: '0'
});
await mutate({
	...itemValues,
	description: 'Panel bekisting',
	parentId: formwork.id,
	subgroupId: floor.id,
	volume: '4',
	materialUnitPrice: '50',
	jasaUnitPrice: '5'
});
view = await get();
const builtSection = view.sections.find((row) => row.id === section.id)!;
const concreteGroup = builtSection.groups.find((g) => g.id === concrete.id)!;
const item = concreteGroup.subgroups[0].items[0];
assert.equal(item.materialTotal, '250.25');
assert.equal(item.jasaTotal, '50.50');
assert.equal(item.total, '300.75');
assert.equal(item.unitPrice, '120.30');
assert.equal(concreteGroup.subtotal, '331.05');
assert.equal(builtSection.groups.find((g) => g.id === formwork.id)!.subtotal, '220.00');
assert.equal(builtSection.subtotal, '551.05');
assert.equal(view.rab.subtotal, '701.05');
assert.equal(view.rab.taxRate, '11.00');
assert.equal(view.rab.taxAmount, '77.12');
assert.equal(view.rab.grandTotal, '778.17');
assert.equal(view.sections[0].groups[0].items[0].total, '150.00');
assert.equal(item.weight, '42.899936');
console.log(
	'PASS Area → two Groups → Subgroups + direct Items; exact component/hierarchy totals, 11% PPN and bobot'
);
await mutate({
	...itemValues,
	id: item.id,
	parentId: concrete.id,
	subgroupId: column.id,
	volume: '3',
	materialUnitPrice: '200',
	jasaUnitPrice: '25',
	notes: 'Edited',
	sortOrder: 9
});
view = await get();
assert.equal(view.rab.subtotal, '1075.30');
assert.equal(view.rab.grandTotal, '1193.58');
await mutate({
	kind: 'item',
	operation: 'delete',
	id: item.id,
	parentId: concrete.id,
	subgroupId: column.id
});
view = await get();
assert.equal(view.rab.subtotal, '400.30');
assert.equal(view.rab.taxAmount, '44.03');
assert.equal(view.rab.grandTotal, '444.33');
console.log('PASS edit item and delete item recalculate totals');
await mutate({ kind: 'section', id: section.id, name: 'Struktur utama', sortOrder: 0 });
await mutate({
	kind: 'group',
	id: concrete.id,
	parentId: section.id,
	name: 'Beton bertulang',
	sortOrder: 0
});
await mutate({
	kind: 'subgroup',
	id: column.id,
	parentId: concrete.id,
	name: 'Kolom utama',
	sortOrder: 3
});
view = await get();
assert.equal(view.sections[0].name, 'Existing area'); // same order uses ID tie-break
assert.equal(view.sections.find((s) => s.id === section.id)!.groups[0].name, 'Beton bertulang');
await assert.rejects(
	() => mutate({ ...itemValues, parentId: concrete.id, subgroupId: floor.id }),
	/Subkelompok/
);
const other = (await createInitialRab(project.id, null))!;
await assert.rejects(
	() => mutate({ ...itemValues, parentId: concrete.id }, project.id, other.id),
	/Kelompok/
);
assert.equal(await getRabBuilder(project.id + 999, rab.id), null);
assert.equal(
	(await mutate({ kind: 'section', name: 'Wrong project' }, project.id + 999)).status,
	'missing'
);
// Force a decimal overflow after entering a transaction; verify the whole write rolls back.
const beforeOverflow = await get();
await assert.rejects(() =>
	mutate({
		...itemValues,
		parentId: concrete.id,
		volume: '9999999999.9999',
		materialUnitPrice: '9999999999999999.99'
	})
);
assert.deepEqual(await get(), beforeOverflow);
for (const bad of [
	{ volume: '-1' },
	{ materialUnitPrice: 'NaN' },
	{ jasaUnitPrice: '1.001' },
	{ sortOrder: '1.2' },
	{ volume: '' }
]) {
	await assert.rejects(() => mutate({ ...itemValues, parentId: concrete.id, ...bad }));
}
console.log('PASS rename/sort, hierarchy ownership, validation and transactional rollback');
await client`update rabs set status='submitted' where id=${rab.id}`;
const locked = await get();
for (const values of [
	{ kind: 'section', name: 'Blocked' },
	{ ...itemValues, parentId: concrete.id },
	{ kind: 'section', id: section.id, operation: 'delete' }
])
	assert.equal((await mutate(values)).status, 'locked');
assert.deepEqual(await get(), locked);
await client`update rabs set status='draft' where id=${rab.id}`;
await mutate({ kind: 'subgroup', operation: 'delete', id: floor.id, parentId: formwork.id });
assert.equal((await get()).rab.subtotal, '180.30');
await mutate({ kind: 'group', operation: 'delete', id: concrete.id, parentId: section.id });
assert.equal((await get()).rab.subtotal, '150.00');
await mutate({ kind: 'section', operation: 'delete', id: legacySection.id });
view = await get();
assert.equal(view.rab.subtotal, '0.00');
assert.equal(view.rab.taxAmount, '0.00');
assert.equal(view.rab.grandTotal, '0.00');
console.log(
	'PASS locked RAB blocks all writes; subgroup/group/area cascade deletes refresh totals'
);
// Exact half-cent rounding; sum of rounded components is the item total.
await mutate({
	...itemValues,
	parentId: formwork.id,
	description: 'Rounding',
	volume: '0.5',
	materialUnitPrice: '0.01',
	jasaUnitPrice: '0.01'
});
assert.equal((await get()).rab.subtotal, '0.02');
assert.equal(sumMoney(['90071992547409.91', '0.01']), '90071992547409.92');
assert.equal(money('90071992547409.92'), 'Rp 90.071.992.547.409,92');
// Leave useful synthetic demo rows and a locked RAB for browser QA and founder preview.
await mutate({
	...itemValues,
	parentId: formwork.id,
	description: 'Bekisting kolom',
	volume: '42.5',
	materialUnitPrice: '185000',
	jasaUnitPrice: '65000'
});
await mutate({ kind: 'section', name: 'Lantai 1', sortOrder: 1 });
view = await get();
const demoArea = view.sections.find((s) => s.name === 'Lantai 1')!;
await mutate({ kind: 'group', name: 'Pekerjaan struktur', parentId: demoArea.id });
view = await get();
const demoGroup = view.sections.find((s) => s.id === demoArea.id)!.groups[0];
await mutate({ kind: 'subgroup', name: 'Pelat lantai', parentId: demoGroup.id });
view = await get();
const demoSubgroup = view.sections.find((s) => s.id === demoArea.id)!.groups[0].subgroups[0];
await mutate({
	...itemValues,
	parentId: demoGroup.id,
	subgroupId: demoSubgroup.id,
	volume: '18.75',
	materialUnitPrice: '985000',
	jasaUnitPrice: '175000',
	notes: 'Termasuk pengecoran dan perawatan beton.'
});
// A legacy demo uses the actual nullable columns, no invented price split.
await client`insert into rab_items(group_id,description,unit,volume,unit_price,total) values (${demoGroup.id}, 'Mobilisasi (harga lama)', 'ls', 1, 2500000, 2500000)`;
await mutate({
	kind: 'group',
	id: demoGroup.id,
	name: 'Pekerjaan struktur',
	parentId: demoArea.id
});
await client`update rabs set status='submitted' where id=${other.id}`;
console.log(
	`PASS decimal rounding. Preview Draft /admin/projects/${project.id}/rab/${rab.id}; read-only /admin/projects/${project.id}/rab/${other.id}`
);
await db.$client.end();
await client.end();
