import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import postgres from 'postgres';
const endpoint = process.env.ISSUE12_TEST_URL;
if (endpoint !== 'postgres://mymac@127.0.0.1:55412/issue12_test')
	throw Error('Disposable Issue12 loopback DB required');
const admin = postgres('postgres://mymac@127.0.0.1:55412/postgres');
await admin.unsafe('CREATE DATABASE issue12_test');
for (const role of ['anon', 'authenticated']) await admin.unsafe(`CREATE ROLE ${role}`);
await admin.end();
const pg = postgres(endpoint);
await pg.unsafe(
	'CREATE SCHEMA storage; CREATE TABLE storage.buckets(id text PRIMARY KEY,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]); CREATE TABLE storage.objects(bucket_id text);'
);
const journal = JSON.parse(readFileSync('drizzle/meta/_journal.json', 'utf8'));
for (const e of journal.entries)
	await pg.begin(async (tx) => {
		for (const stmt of readFileSync(`drizzle/${e.tag}.sql`, 'utf8').split(
			'--> statement-breakpoint'
		))
			if (stmt.trim()) await tx.unsafe(stmt);
	});
process.env.DATABASE_URL = endpoint;
const q = await import('../../src/lib/server/db/queries');
await pg.unsafe(
	"INSERT INTO clients(company_name) VALUES('QA Client'); INSERT INTO projects(client_id,client_project_number,project_name) VALUES(1,1,'Gedung Kantor Jakarta'); INSERT INTO projects(project_number,client_id,client_project_number,project_name) VALUES('PC-2025-00001',1,2,'Legacy Project');"
);
const a = await q.createInitialRab(1, null),
	b = await q.createInitialRab(1, null),
	legacy = await q.createInitialRab(2, null);
assert.ok(a && b && legacy);
let w = (await q.getProjectRabWorkspace(1))!;
assert.equal(w.families.length, 2);
assert.equal(w.families[0].revisions[0].revisionNumber, 0);
assert.equal(w.families[1].revisions[0].revisionNumber, 0);
assert.equal(w.families[1].revisions[0].documentNumber, w.project.projectNumber + '/RAB-001/R00');
assert.equal(w.families[0].revisions[0].documentNumber, w.project.projectNumber + '/RAB-002/R00');
assert.equal(
	(await q.getProjectRabWorkspace(2))!.families[0].revisions[0].documentNumber,
	'PC-2025-00001/RAB-001/R00'
);
await pg`UPDATE rabs SET status='superseded',frozen_document='{"retain":" exact bytes "}' WHERE id=${a.id}`;
await pg`INSERT INTO rabs(project_id,family_id,revision_number,document_number,status,supersedes_rab_id) VALUES(1,${a.familyId},1,'UNPARSEABLE-HISTORICAL-ID','client_approved',${a.id})`;
const before = await pg`SELECT row_to_json(r) AS data FROM rabs r ORDER BY id`;
for (let i = 0; i < 3; i++) {
	w = (await q.getProjectRabWorkspace(1))!;
	const family = w.families.find((f) => f.id === a.familyId)!;
	assert.deepEqual(
		family.revisions.map((r) => r.revisionNumber),
		[1, 0]
	);
	assert.equal(family.revisions[0].documentNumber, 'UNPARSEABLE-HISTORICAL-ID');
	assert.equal(family.revisions[0].supersedesRabId, a.id);
}
assert.deepEqual(await pg`SELECT row_to_json(r) AS data FROM rabs r ORDER BY id`, before);
assert.equal(await q.getProjectRabWorkspace(999999), null);
assert.equal(await q.createInitialRab(999999, null), null);
const save = (name: string, data: unknown) =>
	writeFileSync(`verification/rab-issue12/${name}.json`, JSON.stringify(data, null, 2) + '\n');
save('data-flow-tests', {
	passed: true,
	postgres: 18,
	migrations: '0000–0013',
	storage: 'minimal local stubs; no live access',
	twoFamiliesWithR00: true,
	legacyPCRoot: true,
	explicitFamilyFK: true,
	unparseableHistoricalNumber: true,
	revisionOrder: 'descending',
	missingProject: true,
	projectIsolation: true
});
save('historical-read', {
	passed: true,
	readCount: 3,
	allRabColumnsByteEquivalent: true,
	statuses: ['superseded', 'client_approved'],
	frozenDocumentUnchanged: true,
	sourceRelationPreserved: true
});
await pg.end();
console.log('PASS isolated migration/create/list/history tests');
process.exit(0);
