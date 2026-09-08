import { catalog } from './catalog.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { PGlite } from './runtime/node_modules/@electric-sql/pglite/dist/index.js';
import { generateMigration } from 'drizzle-kit/api';
const dir = '/private/tmp/precious-issue6/canonical';
const result = [];
for (const f of fs.readdirSync(dir + '/meta').filter((f) => f.endsWith('_snapshot.json'))) {
	const s = JSON.parse(fs.readFileSync(dir + '/meta/' + f));
	const empty = { ...structuredClone(s), tables: {}, sequences: {}, enums: {} };
	const ddl = await generateMigration(empty, s);
	const pg = new PGlite();
	try {
		if (Number(f.slice(0, 4)) >= 4) await pg.exec('CREATE SEQUENCE project_number_seq');
		await pg.exec(ddl.join('\n'));
		assert.deepEqual(
			await catalog(pg),
			JSON.parse(
				fs.readFileSync('/private/tmp/precious-issue6/catalog-' + Number(f.slice(0, 4)) + '.json')
			)
		);
		result.push({
			snapshot: f,
			fullCatalogMatchesAppliedSql: true,
			customSequenceFixture: Number(f.slice(0, 4)) >= 4
		});
	} catch (e) {
		result.push({ snapshot: f, generatedDdlValid: false, code: e.code, message: e.message });
	}
	await pg.close();
}
fs.writeFileSync('/private/tmp/precious-issue6/snapshot-ddl.json', JSON.stringify(result, null, 2));
console.log(result);

if (result.some((r) => !r.fullCatalogMatchesAppliedSql)) process.exitCode = 1;
