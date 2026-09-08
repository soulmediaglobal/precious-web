import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import postgres from '/Users/mymac/Documents/Precious/pc/node_modules/postgres/src/index.js';
import dotenv from '/Users/mymac/Documents/Precious/pc/node_modules/dotenv/lib/main.js';
const base = '/private/tmp/precious-issue6';
const audit = JSON.parse(fs.readFileSync(base + '/audit.json'));
const fresh = JSON.parse(fs.readFileSync(base + '/fresh.json'));
const journal = JSON.parse(fs.readFileSync(base + '/canonical/meta/_journal.json'));
const entry = journal.entries.at(-1);
const hash = crypto
	.createHash('sha256')
	.update(fs.readFileSync(base + '/canonical/' + entry.tag + '.sql', 'utf8'))
	.digest('hex');
const env = dotenv.parse(fs.readFileSync('/Users/mymac/Documents/Precious/pc/.env'));
const db = postgres(env.DATABASE_URL, { max: 1, connect_timeout: 15 });
try {
	const result = await db.begin(async (tx) => {
		await tx`SET LOCAL lock_timeout='5s'`;
		await tx`SET LOCAL statement_timeout='30s'`;
		await tx`LOCK TABLE drizzle.__drizzle_migrations IN EXCLUSIVE MODE`;
		await tx`LOCK TABLE public.contact_inquiries IN SHARE MODE`;
		const before =
			await tx`select id,hash,created_at from drizzle.__drizzle_migrations order by created_at`;
		assert.deepEqual([...before], audit.rows);
		assert(entry.when > Number(before.at(-1).created_at));
		const columns =
			await tx`select table_name,column_name,data_type,is_nullable,column_default from information_schema.columns where table_schema='public' and table_name='contact_inquiries' order by ordinal_position`;
		assert.deepEqual(
			[...columns],
			fresh.columns.filter((c) => c.table_name === 'contact_inquiries')
		);
		const constraints =
			await tx`select c.relname as table_name,con.conname,pg_get_constraintdef(con.oid) as definition from pg_constraint con join pg_class c on c.oid=con.conrelid where c.oid='public.contact_inquiries'::regclass order by 1,2`;
		assert.deepEqual(
			[...constraints],
			fresh.constraints.filter((c) => c.table_name === 'contact_inquiries')
		);
		const [security] =
			await tx`select relrowsecurity,relforcerowsecurity from pg_class where oid='public.contact_inquiries'::regclass`;
		assert.equal(security.relrowsecurity, true);
		assert.equal(security.relforcerowsecurity, false);
		const policies =
			await tx`select policyname from pg_policies where schemaname='public' and tablename='contact_inquiries'`;
		assert.equal(policies.length, 0);
		const triggers =
			await tx`select tgname from pg_trigger where tgrelid='public.contact_inquiries'::regclass and not tgisinternal`;
		assert.equal(triggers.length, 0);
		const indexes =
			await tx`select indexname,indexdef from pg_indexes where schemaname='public' and tablename='contact_inquiries' order by indexname`;
		assert.equal(indexes.length, 1);
		assert.equal(
			indexes[0].indexdef,
			'CREATE UNIQUE INDEX contact_inquiries_pkey ON public.contact_inquiries USING btree (id)'
		);
		const privileges = [];
		for (const role of ['anon', 'authenticated']) {
			const [p] =
				await tx`select has_table_privilege(${role},'public.contact_inquiries','SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') as table_access,has_sequence_privilege(${role},'public.contact_inquiries_id_seq','USAGE,SELECT,UPDATE') as sequence_access`;
			assert.equal(p.table_access, false);
			assert.equal(p.sequence_access, false);
			privileges.push({ role, ...p });
		}
		const fingerprint = async () => {
			const [x] =
				await tx`select count(*)::text as count,md5(coalesce(string_agg(row_to_json(c)::text,E'\n' order by id),'')) as digest from public.contact_inquiries c`;
			return x;
		};
		const dataBefore = await fingerprint();
		const seqBefore =
			await tx`select last_value::text,is_called from public.contact_inquiries_id_seq`;
		const inserted =
			await tx`INSERT INTO drizzle.__drizzle_migrations (hash,created_at) VALUES (${hash},${entry.when}) RETURNING id,hash,created_at`;
		const after =
			await tx`select id,hash,created_at from drizzle.__drizzle_migrations order by created_at`;
		assert.equal(after.length, 13);
		assert.deepEqual([...after.slice(0, 12)], audit.rows);
		assert.equal(after.at(-1).hash, hash);
		assert.equal(String(after.at(-1).created_at), String(entry.when));
		const dataAfter = await fingerprint();
		const seqAfter =
			await tx`select last_value::text,is_called from public.contact_inquiries_id_seq`;
		assert.deepEqual(dataAfter, dataBefore);
		assert.deepEqual(seqAfter, seqBefore);
		return {
			timestamp: new Date().toISOString(),
			sql: 'INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2) RETURNING id, hash, created_at',
			parameters: [hash, entry.when],
			inserted: [...inserted],
			before: [...before],
			after: [...after],
			columns: [...columns],
			constraints: [...constraints],
			security,
			policies: [...policies],
			indexes: [...indexes],
			privileges,
			dataBefore,
			dataAfter,
			contactSequenceBefore: [...seqBefore],
			contactSequenceAfter: [...seqAfter],
			applicationDdlExecuted: false
		};
	});
	const readback =
		await db`select id,hash,created_at from drizzle.__drizzle_migrations order by created_at`;
	assert.deepEqual([...readback], result.after);
	fs.writeFileSync(
		base + '/bookkeeping.json',
		JSON.stringify({ ...result, committedReadback: [...readback] }, null, 2)
	);
	console.log(
		'PASS: committed Contact accounting row, 13-row readback, original history/data/Contact sequence preserved'
	);
} catch (e) {
	console.error(e.code || e.name, e instanceof assert.AssertionError ? e.message : '');
	process.exitCode = 1;
} finally {
	await db.end();
}
