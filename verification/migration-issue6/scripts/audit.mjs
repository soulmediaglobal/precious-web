import fs from 'node:fs';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import postgres from '/Users/mymac/Documents/Precious/pc/node_modules/postgres/src/index.js';
import dotenv from '/Users/mymac/Documents/Precious/pc/node_modules/dotenv/lib/main.js';
const repo = '/Users/mymac/Documents/Precious/pc';
process.chdir(repo);
const hash = (b) => crypto.createHash('sha256').update(b).digest('hex');
const git = (...a) => execFileSync('git', a, { encoding: 'utf8' });
const files = git('ls-files', '-c', '-o', '--exclude-standard', '-z').split('\0').filter(Boolean);
fs.writeFileSync(
	'/private/tmp/precious-issue6/before-files.json',
	JSON.stringify(
		Object.fromEntries(
			files.filter((f) => fs.statSync(f).isFile()).map((f) => [f, hash(fs.readFileSync(f))])
		),
		null,
		2
	)
);
const journal = JSON.parse(fs.readFileSync('drizzle/meta/_journal.json'));
const inventory = journal.entries.map((e) => ({
	...e,
	sha256: hash(fs.readFileSync('drizzle/' + e.tag + '.sql'))
}));
const env = dotenv.parse(fs.readFileSync('.env'));
const db = postgres(env.DATABASE_URL, { max: 1, connect_timeout: 15 });
try {
	const rows =
		await db`select id,hash,created_at from drizzle.__drizzle_migrations order by created_at`;
	const matched =
		rows.length === inventory.length &&
		inventory.every(
			(e, i) => e.sha256 === rows[i].hash && String(e.when) === String(rows[i].created_at)
		);
	const columns =
		await db`select table_name,column_name,data_type,is_nullable,column_default from information_schema.columns where table_schema='public' order by table_name,ordinal_position`;
	const constraints =
		await db`select c.relname as table_name,con.conname,pg_get_constraintdef(con.oid) as definition from pg_constraint con join pg_class c on c.oid=con.conrelid join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' order by 1,2`;
	const tables =
		await db`select relname,relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and relkind='r' order by 1`;
	fs.writeFileSync(
		'/private/tmp/precious-issue6/audit.json',
		JSON.stringify(
			{
				head: git('rev-parse', 'HEAD').trim(),
				branch: git('branch', '--show-current').trim(),
				committed: git('ls-tree', '-r', '--name-only', 'HEAD', 'drizzle').trim().split('\n'),
				inventory,
				rows,
				matched,
				columns,
				constraints,
				tables
			},
			null,
			2
		)
	);
	console.log(
		JSON.stringify({ matched, historyRows: rows.length, tables: tables.map((x) => x.relname) })
	);
} catch (e) {
	console.error(e.code || e.name);
	process.exitCode = 1;
} finally {
	await db.end();
}
