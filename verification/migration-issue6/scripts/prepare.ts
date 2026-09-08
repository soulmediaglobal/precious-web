import fs from 'node:fs';
import { generateDrizzleJson, generateMigration } from 'drizzle-kit/api';
import * as schema from './head-schema';
const repo = '/Users/mymac/Documents/Precious/pc';
const out = '/private/tmp/precious-issue6/canonical';
fs.cpSync(repo + '/drizzle', out, { recursive: true });
async function main() {
	const old = JSON.parse(fs.readFileSync(out + '/meta/0011_snapshot.json', 'utf8'));
	const head = generateDrizzleJson(schema);
	const next = structuredClone(old);
	next.id = crypto.randomUUID();
	next.prevId = old.id;
	next.tables['public.contact_inquiries'] = head.tables['public.contact_inquiries'];
	const sql = await generateMigration(old, next);
	if (
		sql.length !== 2 ||
		!sql[0].includes('CREATE TABLE "contact_inquiries"') ||
		!sql[1].includes('ENABLE ROW LEVEL SECURITY')
	)
		throw Error(JSON.stringify(sql));
	fs.writeFileSync(
		out + '/0012_contact_inquiries.sql',
		sql.join('\n--> statement-breakpoint\n') +
			'\n--> statement-breakpoint\nREVOKE ALL ON TABLE public.contact_inquiries FROM anon, authenticated;\n--> statement-breakpoint\nREVOKE ALL ON SEQUENCE public.contact_inquiries_id_seq FROM anon, authenticated;\n'
	);
	fs.writeFileSync(out + '/meta/0012_snapshot.json', JSON.stringify(next, null, 2) + '\n');
	const j = JSON.parse(fs.readFileSync(out + '/meta/_journal.json', 'utf8'));
	j.entries.push({
		idx: 12,
		version: '7',
		when: Date.now(),
		tag: '0012_contact_inquiries',
		breakpoints: true
	});
	fs.writeFileSync(out + '/meta/_journal.json', JSON.stringify(j, null, 2) + '\n');
	fs.writeFileSync(
		'/private/tmp/precious-issue6/head-schema-gap.json',
		JSON.stringify(
			{
				missingFromHead: Object.keys(old.tables).filter((t) => !head.tables[t]),
				method:
					'0011 snapshot retained unchanged; Contact table metadata generated exclusively from committed HEAD export'
			},
			null,
			2
		)
	);
	console.log(sql);
}
main();
