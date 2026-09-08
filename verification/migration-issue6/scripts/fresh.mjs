import { catalog } from './catalog.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { PGlite } from './runtime/node_modules/@electric-sql/pglite/dist/index.js';
import { drizzle } from './runtime/node_modules/drizzle-orm/pglite/index.js';
import { migrate } from './runtime/node_modules/drizzle-orm/pglite/migrator.js';
const base = '/private/tmp/precious-issue6',
	folder = base + '/canonical';
const pg = new PGlite();
const db = drizzle(pg);
const q = async (s) => (await pg.query(s)).rows;
await pg.exec(
	`CREATE ROLE anon;CREATE ROLE authenticated;CREATE SCHEMA storage;CREATE TABLE storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);CREATE TABLE storage.objects(id uuid,bucket_id text);ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;`
);
const j = JSON.parse(fs.readFileSync(folder + '/meta/_journal.json'));
const prefix = base + '/prefix';
fs.cpSync(folder, prefix, { recursive: true });
let previous = '00000000-0000-0000-0000-000000000000';
const snapshots = [];
for (let i = 0; i < j.entries.length; i++) {
	fs.writeFileSync(
		prefix + '/meta/_journal.json',
		JSON.stringify({ ...j, entries: j.entries.slice(0, i + 1) })
	);
	await migrate(db, { migrationsFolder: prefix });
	const path = folder + '/meta/' + String(i).padStart(4, '0') + '_snapshot.json';
	if (!fs.existsSync(path)) {
		assert.equal(i, 2);
		continue;
	}
	const s = JSON.parse(fs.readFileSync(path));
	assert.equal(s.prevId, previous);
	previous = s.id;
	const cols = await q(
		`select table_name,column_name,is_nullable from information_schema.columns where table_schema='public' order by table_name,ordinal_position`
	);
	assert.deepEqual(
		[...new Set(cols.map((c) => c.table_name))].sort(),
		Object.values(s.tables)
			.map((t) => t.name)
			.sort()
	);
	for (const t of Object.values(s.tables)) {
		assert.deepEqual(
			cols
				.filter((c) => c.table_name === t.name)
				.map((c) => c.column_name)
				.sort(),
			Object.keys(t.columns).sort()
		);
		for (const c of Object.values(t.columns))
			assert.equal(
				cols.find((x) => x.table_name === t.name && x.column_name === c.name).is_nullable,
				c.notNull ? 'NO' : 'YES'
			);
	}
	fs.writeFileSync(base + '/catalog-' + i + '.json', JSON.stringify(await catalog(pg)));
	snapshots.push({
		index: i,
		id: s.id,
		prevId: s.prevId,
		tables: Object.keys(s.tables).length,
		tableColumnNullabilityMatch: true
	});
}
const columns = await q(
	`select table_name,column_name,data_type,is_nullable,column_default from information_schema.columns where table_schema='public' order by table_name,ordinal_position`
);
const constraints = await q(
	`select c.relname as table_name,con.conname,pg_get_constraintdef(con.oid) as definition from pg_constraint con join pg_class c on c.oid=con.conrelid join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and con.contype!='n' order by 1,2`
);
const tables = await q(
	`select relname,relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and relkind='r' order by 1`
);
const before = await q('select * from drizzle.__drizzle_migrations order by created_at');
await migrate(db, { migrationsFolder: folder });
assert.deepEqual(await q('select * from drizzle.__drizzle_migrations order by created_at'), before);
const live = JSON.parse(fs.readFileSync(base + '/audit.json'));
assert.deepEqual(columns, live.columns);
assert.deepEqual(
	constraints,
	live.constraints.filter((c) => !c.definition.startsWith('NOT NULL'))
);
const rls = await q(
	`select relrowsecurity from pg_class where oid='public.contact_inquiries'::regclass`
);
assert.equal(rls[0].relrowsecurity, true);
for (const role of ['anon', 'authenticated']) {
	const [a] = await q(
		`select has_table_privilege('${role}','public.contact_inquiries','SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') as table_access,has_sequence_privilege('${role}','public.contact_inquiries_id_seq','USAGE,SELECT,UPDATE') as seq_access`
	);
	assert.equal(a.table_access, false);
	assert.equal(a.seq_access, false);
}
fs.writeFileSync(
	base + '/fresh.json',
	JSON.stringify(
		{
			engine:
				'PGlite ' +
				JSON.parse(
					fs.readFileSync(base + '/runtime/node_modules/@electric-sql/pglite/package.json')
				).version,
			postgres: await q('select version()'),
			fixture:
				'minimal storage.buckets/storage.objects plus anon/authenticated roles; no Supabase services',
			snapshots,
			history: before,
			columns,
			constraints,
			tables,
			allLivePublicColumnsAndConstraintsMatch: true,
			contactRlsAndRevokes: true,
			rerunNoop: true
		},
		null,
		2
	)
);
console.log(
	'PASS: 13 migrations, snapshot chain, all live public columns/constraints, Contact RLS/revokes, rerun no-op'
);
await pg.close();
