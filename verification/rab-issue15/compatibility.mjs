// Re-run existing Task 2 assertions unchanged except harness/fixture adaptations documented below.
import { mkdtempSync, readFileSync, writeFileSync, copyFileSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import postgres from 'postgres';
const repo=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const url=process.env.ISSUE15_TEST_URL;
if(!url || !/^postgres:\/\/[^@]+@127\.0\.0\.1:55415\/issue15_/.test(url))throw Error('Isolated test URL required');
const admin=postgres(url.replace(/\/issue15_.*$/,'/postgres'),{max:1});
const name='issue15_compat_'+Date.now();await admin.unsafe(`CREATE DATABASE ${name}`);await admin.end();
const temp=mkdtempSync(join(tmpdir(),'issue15-compat-'));
writeFileSync(join(temp,'package.json'),' {"type":"module"}');symlinkSync(join(repo,'node_modules'),join(temp,'node_modules'));
for(const file of ['queries.ts','schema.ts'])copyFileSync(join(repo,'src/lib/server/db',file),join(temp,file));
copyFileSync(join(repo,'src/lib/server/rab-cms.ts'),join(temp,'rab-cms.ts'));
writeFileSync(join(temp,'index.ts'),`import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js'; import * as schema from './schema';
const client=postgres(process.env.DATABASE_URL!,{max:24,onnotice:()=>{}}); export const db=drizzle(client,{schema});
export const pg={exec:async(sql:string)=>client.begin(async tx=>{await tx.unsafe(sql)}),query:async(sql:string)=>({rows:Array.from(await client.unsafe(sql))}),close:()=>client.end()};`);
for(const [source,dest] of [['src/routes/admin/rab-preview/[projectId]/[rabId]/+page.server.ts','preview-route.ts'],['src/routes/admin/(app)/projects/[id]/rab/[rabId]/+page.server.ts','rab-route.ts']]){
writeFileSync(join(temp,dest),readFileSync(join(repo,source),'utf8').replaceAll("'$lib/server/db/queries'","'./queries'").replaceAll("'$lib/server/rab-cms'","'./rab-cms'").replaceAll("'@sveltejs/kit'",JSON.stringify(join(repo,'node_modules/@sveltejs/kit/src/exports/index.js'))));}
let fixture=readFileSync(join(repo,'verification/task2/fixture.mjs'),'utf8')
 .replace('CREATE ROLE authenticated;','')
 .replace('0000\\u20130011 applied to isolated PGlite PostgreSQL','0000–0013 applied to isolated PostgreSQL 18.6')
 .replace('"id", "rabId"','"familyId", "id", "rabId"')
 .replace('const before = await q.getRabById',`// Simulate a pre-family frozen snapshot without rewriting it in production.
await pg.exec("UPDATE rabs SET frozen_document=(frozen_document::jsonb - 'familyId')::text WHERE id="+rab.id);
const before = await q.getRabById`)
 .replace('PGlite adapter replaces postgres-js only in temporary harness; production query source copied verbatim.','Real PostgreSQL 18.6 via postgres-js; WIP query source copied verbatim; historical fixture omits familyId.')
 .replace('No live Supabase applied; no concurrency or browser runtime audit.','No live Supabase or browser runtime audit; allocation concurrency tested separately.');
// Extra structural assertion and duplicate-request regression; existing clone assertions retained.
fixture=fixture.replace('await pg.close();',`
const cp=await q.createProject({clientId:other.id,projectName:'Concurrent clone'},[]);
const cr=await q.createInitialRab(cp.id,null);await q.transitionRabStatus(cr.id,'internal_review',null);
const attempts=await Promise.all(Array.from({length:12},()=>q.createRabRevision(cp.id,cr.id,null)));
assert.equal(attempts.filter(Boolean).length,1);
const created=await q.getRabById(cp.id,attempts.find(Boolean).id);
assert.equal(created.familyId,(await db.select().from(s.rabs).where(eq(s.rabs.id,cr.id)))[0].familyId);
pass('12 concurrent clone requests: exactly one succeeds, same-family source; no duplicate clone');
writeFileSync(process.env.TASK2_RESULTS,JSON.stringify({passed:true,results,environment:'PostgreSQL 18.6 / postgres-js',scope:'WIP compatibility; not promotion of Task1/Task2 into staged HEAD',legacySnapshotWithoutFamilyId:true,concurrentCloneRequests:12,successfulClones:1,limitations:['No live apply, browser/PDF or broad editor concurrency certification','Task1/Task2 query implementation still pre-existing WIP']},null,2));
await pg.close();`);
writeFileSync(join(temp,'fixture.mjs'),fixture);
execFileSync(process.execPath,['--import','tsx','fixture.mjs'],{cwd:temp,stdio:'inherit',env:{...process.env,DATABASE_URL:url.replace(/\/issue15_.*$/,'/'+name),TASK2_REPO:repo,TASK2_RESULTS:join(repo,'verification/rab-issue15/task2-compatibility.json')}});
