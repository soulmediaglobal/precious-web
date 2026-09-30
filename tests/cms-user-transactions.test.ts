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

process.env.DATABASE_URL = url.toString();
const client = postgres(url.toString(), { max: 5 });
let closeBackend: (() => Promise<void>) | undefined;

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

	const migrationsFolder = mkdtempSync(join(tmpdir(), 'cms-user-test-migrations-'));
	cpSync('drizzle', migrationsFolder, { recursive: true });

	// Adapt only the disposable copy of 0016's production-data fingerprint.
	const compatibility = join(migrationsFolder, '0016_rab_legacy_payment_term_compatibility.sql');
	writeFileSync(
		compatibility,
		readFileSync(compatibility, 'utf8')
			.split('--> statement-breakpoint')
			.slice(1)
			.join('--> statement-breakpoint')
	);

	await migrate(drizzle(client), { migrationsFolder });

	const {
		createCmsUserMembership,
		updateCmsUserMembership,
		prepareCmsUserDeletion,
		deleteCmsUserMembership,
		getCmsUser
	} = await import('../src/lib/server/db/queries');
	const { db } = await import('../src/lib/server/db/index');
	closeBackend = async () => {
		await db.$client.end();
	};

	const id = (n: number) => `00000000-0000-4000-8000-${n.toString(16).padStart(12, '0')}`;

	const adminA = id(1);
	const adminB = id(2);
	const director = id(3);
	const staff = id(4);
	const inactiveAdmin = id(5);
	const manager = id(6);
	const forbiddenTarget = id(7);
	const profile = { name: 'Test Manager', position: 'Project Manager' };

	await client`
    insert into cms_users(user_id, role, is_active) values
      (${adminA}, 'admin', true),
      (${adminB}, 'admin', true),
      (${director}, 'director', true),
      (${staff}, 'staff', true),
      (${inactiveAdmin}, 'admin', false)
  `;

	assert.equal(
		(await createCmsUserMembership(director, forbiddenTarget, 'admin', profile)).status,
		'forbidden'
	);
	assert.equal(
		(await createCmsUserMembership(staff, forbiddenTarget, 'staff', profile)).status,
		'forbidden'
	);
	assert.equal(
		(await createCmsUserMembership(inactiveAdmin, forbiddenTarget, 'staff', profile)).status,
		'forbidden'
	);
	assert.equal(await getCmsUser(forbiddenTarget), null);

	assert.equal((await createCmsUserMembership(director, manager, 'manager', profile)).status, 'ok');
	assert.equal((await getCmsUser(manager))?.name, profile.name);
	assert.equal((await getCmsUser(manager))?.position, profile.position);

	assert.equal(
		(await updateCmsUserMembership(director, manager, 'admin', true, profile)).status,
		'forbidden'
	);
	assert.equal(
		(await updateCmsUserMembership(director, adminA, 'director', true, profile)).status,
		'forbidden'
	);
	assert.equal((await prepareCmsUserDeletion(director, adminA)).status, 'forbidden');

	assert.equal((await updateCmsUserMembership(adminA, adminA, 'staff', true)).status, 'self');
	assert.equal((await updateCmsUserMembership(adminA, adminA, 'admin', false)).status, 'self');
	assert.equal((await prepareCmsUserDeletion(adminA, adminA)).status, 'self');

	assert.equal(
		(
			await updateCmsUserMembership(adminA, adminA, 'admin', true, {
				name: 'Updated Admin',
				position: 'Administrator'
			})
		).status,
		'ok'
	);
	assert.equal((await getCmsUser(adminA))?.name, 'Updated Admin');
	assert.equal((await getCmsUser(adminA))?.role, 'admin');

	assert.equal(
		(await updateCmsUserMembership(director, manager, 'manager', false, profile)).status,
		'ok'
	);
	assert.equal((await getCmsUser(manager))?.isActive, false);
	assert.equal(
		(await updateCmsUserMembership(director, manager, 'manager', true, profile)).status,
		'ok'
	);

	// Cleanup must not delete an account that has not entered deletion.
	assert.equal((await deleteCmsUserMembership(manager)).length, 0);
	assert.ok(await getCmsUser(manager));

	assert.equal((await prepareCmsUserDeletion(director, manager)).status, 'ok');
	const pending = await getCmsUser(manager);
	assert.equal(pending?.isActive, false);
	assert.ok(pending?.deletionStartedAt);

	assert.equal(
		(
			await updateCmsUserMembership(adminA, manager, 'admin', true, {
				name: 'Should not save',
				position: 'Should not save'
			})
		).status,
		'deleting'
	);
	assert.equal((await getCmsUser(manager))?.name, profile.name);

	// Simulate retry after an external deletion failure: retain the same marker.
	assert.equal((await prepareCmsUserDeletion(director, manager)).status, 'ok');
	assert.equal(
		(await getCmsUser(manager))?.deletionStartedAt?.getTime(),
		pending?.deletionStartedAt?.getTime()
	);
	assert.equal((await deleteCmsUserMembership(manager)).length, 1);
	assert.equal(await getCmsUser(manager), null);
	assert.equal((await deleteCmsUserMembership(manager)).length, 0);

	// Two admins cannot concurrently revoke both remaining admin accounts.
	const race = await Promise.all([
		prepareCmsUserDeletion(adminA, adminB),
		prepareCmsUserDeletion(adminB, adminA)
	]);

	assert.equal(race.filter((result) => result.status === 'ok').length, 1);
	assert.equal(race.filter((result) => result.status === 'forbidden').length, 1);

	const activeAdmins = await client`
    select user_id from cms_users where role = 'admin' and is_active = true
  `;
	assert.equal(activeAdmins.length, 1);

	const survivor = activeAdmins[0].user_id;
	assert.equal((await prepareCmsUserDeletion(survivor, survivor)).status, 'self');
	assert.equal((await updateCmsUserMembership(survivor, survivor, 'staff', true)).status, 'self');

	console.log(
		'PASS CMS transactions: roles, profiles, self protection, deletion retry, cleanup, concurrent admin protection'
	);
} finally {
	await closeBackend?.();
	await client.end();
}
