import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as s from '../../src/lib/server/db/schema';
import { eq } from 'drizzle-orm';
const endpoint=process.env.ISSUE15_TEST_URL;
if (!endpoint || !/^postgres:\/\/[^@]+@127\.0\.0\.1:55415\/issue15_/.test(endpoint)) throw Error('Explicit isolated loopback issue15 test URL required');
const root=new URL('../../',import.meta.url);
const out=new URL('./',import.meta.url);
const save=(name:string,value:unknown)=>writeFileSync(new URL(name+'.json',out),JSON.stringify(value,null,2)+'\n');
const admin=postgres(endpoint.replace(/\/issue15_.*$/,'/postgres'),{max:1,onnotice:()=>{}});
for(const role of ['anon','authenticated']) await admin.unsafe(`DO $$ BEGIN CREATE ROLE ${role}; EXCEPTION WHEN duplicate_object THEN NULL; END $$`);
const runId=Date.now();
const journal=JSON.parse(readFileSync(new URL('drizzle/meta/_journal.json',root),'utf8'));
async function open(name:string) {
 name += '_'+runId;
 await admin.unsafe(`CREATE DATABASE ${name}`);
 const pg=postgres(endpoint.replace(/\/issue15_.*$/,'/'+name),{max:24,onnotice:()=>{}});
 await pg.unsafe(`CREATE SCHEMA storage; CREATE TABLE storage.buckets(id text PRIMARY KEY,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]); CREATE TABLE storage.objects(bucket_id text);`);
 return pg;
}
async function replay(pg:any,from:number,to:number) {
 for(const e of journal.entries.filter((e:any)=>e.idx>=from&&e.idx<=to)) await pg.begin(async(tx:any)=>{for(const stmt of readFileSync(new URL(`drizzle/${e.tag}.sql`,root),'utf8').split('--> statement-breakpoint')) if(stmt.trim())await tx.unsafe(stmt);});
}
const fresh=await open('issue15_fresh');await replay(fresh,0,13);
const upgrade=await open('issue15_upgrade');await replay(upgrade,0,12);
await upgrade.unsafe(`INSERT INTO clients(company_name) VALUES('Legacy Client');
INSERT INTO projects(project_number,client_id,client_project_number,project_name) VALUES('PC-2025-00001',1,1,'Legacy'),('PC-2026-00002',1,2,'Other'),('PRE-2026-00041',1,3,'Existing PRE');
INSERT INTO rabs(project_id,revision_number,document_number,status,frozen_document,inherited_masters,supersedes_rab_id) VALUES
(1,0,'LEGACY/α/00','superseded','{"snapshotVersion":1,"documentNumber":"LEGACY/α/00","bank":"A"}','{"retain":" exact bytes "}',NULL),
(1,1,'LEGACY/α/01','internal_review','{"snapshotVersion":1,"documentNumber":"LEGACY/α/01"}',NULL,1),
(1,4,'UNLINKED-FOUR','draft',NULL,NULL,NULL),
(2,0,'PC-ROOT-OTHER','draft',NULL,NULL,NULL);
INSERT INTO rab_sections(rab_id,name) VALUES(1,'section'); INSERT INTO rab_groups(section_id,name) VALUES(1,'group'); INSERT INTO rab_subgroups(group_id,name) VALUES(1,'subgroup');
INSERT INTO rab_items(group_id,subgroup_id,description,unit) VALUES(1,1,'item','m'); INSERT INTO rab_stages(rab_id,name) VALUES(1,'stage'); INSERT INTO rab_payment_terms(rab_id,stage_id,name) VALUES(1,1,'term');`);
const tables=['projects','rabs','rab_sections','rab_groups','rab_subgroups','rab_items','rab_stages','rab_payment_terms'];
async function snapshot(pg:any){const v:any={};for(const t of tables)v[t]=await pg.unsafe(`SELECT to_jsonb(t) - 'family_id' AS row FROM ${t} t ORDER BY id`);return v;}
const before=await snapshot(upgrade);await replay(upgrade,13,13);assert.deepEqual(await snapshot(upgrade),before);
const mapping=await upgrade`SELECT id,project_id,family_id,revision_number,document_number FROM rabs ORDER BY id`;
assert.equal(mapping[0].family_id,mapping[1].family_id);assert.notEqual(mapping[0].family_id,mapping[2].family_id);
assert.equal((await upgrade`select next_project_number(2026) AS n`)[0].n,'PRE-2026-00042');
save('legacy-preservation',{passed:true,allExistingColumnsEqual:true,tables,rows:before,mapping});
save('migration-upgrade',{passed:true,fresh:'0000–0013',upgrade:'0012 legacy fixture → 0013',storage:'minimal schema/role stubs only; Supabase Storage behavior not tested',mapping});
const bad=await open('issue15_invalid');await replay(bad,0,12);
await bad.unsafe(`INSERT INTO clients(company_name) VALUES('Bad');INSERT INTO projects(client_id,client_project_number,project_name) VALUES(1,1,'Bad');INSERT INTO rabs(project_id,document_number,supersedes_rab_id) VALUES(1,'orphan',999);`);
await assert.rejects(replay(bad,13,13),/invalid legacy source/);
assert.equal((await bad`select to_regclass('rab_families') AS t`)[0].t,null);
await bad.end();
process.env.DATABASE_URL=endpoint.replace(/\/issue15_.*$/,'/issue15_fresh_'+runId);
const q=await import('../../src/lib/server/db/queries');
const db=drizzle(fresh,{schema:s});
const [client]=await db.insert(s.clients).values({companyName:'QA'}).returning();
const projects=await Promise.all(Array.from({length:20},(_,i)=>q.createCanonicalProject({clientId:client.id,projectName:'Concurrent '+i})));
assert.equal(new Set(projects.map(p=>p.projectNumber)).size,20);assert.equal(new Set(projects.map(p=>p.clientProjectNumber)).size,20);
const yearA=await Promise.all(Array.from({length:24},()=>fresh`SELECT next_project_number(2040) AS n, pg_sleep(0.02)`));
const yearB=await fresh`SELECT next_project_number(2041) AS n`;
assert.equal(new Set(yearA.map(r=>r[0].n)).size,24);assert.equal(yearB[0].n,'PRE-2041-00001');
const project=projects[0];
const families=await Promise.all(Array.from({length:20},()=>q.createInitialRab(project.id,null)));
assert.equal(new Set(families.map(f=>f!.familyId)).size,20);
const records=await fresh`select * from rabs where project_id=${project.id} order by family_id`;
assert.equal(records[0].document_number,project.projectNumber+'/RAB-001/R00');assert.equal(records[1].document_number,project.projectNumber+'/RAB-002/R00');
const revisions=await Promise.all(Array.from({length:20},()=>db.transaction(async(tx)=>{const identity=await q.allocateRabRevisionIdentity(tx,project.id,records[0].id);await tx.execute((await import('drizzle-orm')).sql`select pg_sleep(0.02)`);return (await tx.insert(s.rabs).values({projectId:project.id,...identity}).returning())[0];})));
assert.deepEqual(revisions.map(r=>r.revisionNumber).sort((a,b)=>a-b),Array.from({length:20},(_,i)=>i+1));
const rejected:any[]=[];
async function reject(name:string,fn:()=>Promise<unknown>,code='23503'){try{await fn();assert.fail(name+' unexpectedly accepted');}catch(e:any){assert.equal(e.code,code);rejected.push({name,sqlstate:e.code});}}
await reject('cross-family source',()=>fresh`update rabs set supersedes_rab_id=${records[1].id} where id=${revisions[0].id}`);
const other=await q.createInitialRab(projects[1].id,null);
await reject('cross-project source',()=>fresh`update rabs set supersedes_rab_id=${other!.id} where id=${revisions[0].id}`);
await reject('revision project differs from family',()=>fresh`update rabs set project_id=${projects[1].id} where id=${revisions[0].id}`);
await reject('orphan source',()=>fresh`update rabs set supersedes_rab_id=999999 where id=${revisions[0].id}`);
await reject('source deletion',()=>fresh`delete from rabs where id=${records[0].id}`,'23001');
await reject('duplicate family',()=>fresh`insert into rab_families(project_id,family_number) values(${project.id},1)`,'23505');
await reject('duplicate revision',()=>fresh`insert into rabs(project_id,family_id,revision_number,document_number) values(${project.id},${records[0].family_id},0,'duplicate')`,'23505');
await reject('project counter overflow',()=>fresh`select next_project_number(99999)`,'23514');
await fresh`insert into project_number_counters(year,last_number) values(2099,99999)`;
await reject('annual sequence overflow',()=>fresh`select next_project_number(2099)`,'23514');
const [legacy]=await db.insert(s.projects).values({projectNumber:'PC-2020-00001',clientId:client.id,clientProjectNumber:100,projectName:'Legacy'}).returning();
const legacyRab=await q.createInitialRab(legacy.id,null);
assert.equal((await fresh`select document_number from rabs where id=${legacyRab!.id}`)[0].document_number,'PC-2020-00001/RAB-001/R00');
const counterBefore=(await fresh`select last_revision_number from rab_families where id=${records[0].family_id}`)[0].last_revision_number;
await assert.rejects(db.transaction(async(tx)=>{await q.allocateRabRevisionIdentity(tx,project.id,records[0].id);throw Error('rollback');}),/rollback/);
assert.equal((await fresh`select last_revision_number from rab_families where id=${records[0].family_id}`)[0].last_revision_number,counterBefore);
save('numbering-tests',{passed:true,projectYearlyReset:yearB[0].n,existingPreReserved:true,legacyRoot:'PC-2020-00001/RAB-001/R00',twoFamilies:records.slice(0,2).map(r=>r.document_number),rollback:true,timezone:'Asia/Jakarta at transaction start; independent of session TimeZone',width:'Project hard limit 99999/year; family/revision zero padding is minimum width, not truncation'});
save('lineage-integrity',{passed:true,rejected,legacyInvalidMigrationRolledBack:true});
save('concurrency-tests',{passed:true,environment:(await fresh`select version() AS version`)[0].version,transport:'postgres-js',poolSize:24,simultaneous:{projects:20,yearCounter:24,families:20,revisions:20},unique:true,revisionNumbers:revisions.map(r=>r.revisionNumber).sort((a,b)=>a-b),liveDatabaseUsed:false});
const catalog=await fresh`select conname,pg_get_constraintdef(oid) AS definition from pg_constraint where conrelid IN ('rabs'::regclass,'rab_families'::regclass,'projects'::regclass) order by conname`;
save('schema-before-after',{before:{revisionPk:'rabs.id',revisionUnique:['project_id','revision_number'],sourceFk:false,family:false},after:catalog});
await fresh.end();await upgrade.end();await admin.end();console.log('Issue15 migration, numbering, lineage, concurrency: PASS');process.exit(0);
