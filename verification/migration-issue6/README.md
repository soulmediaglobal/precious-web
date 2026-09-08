# Issue #6 — migration accounting reconciliation

Scope: https://github.com/soulmediaglobal/precious-web/issues/6 (OPEN verified in the supplied handoff). Branch: 6-reconcile-canonical-drizzle-migration-state-with-live-database. HEAD: 2e5896cccefedf7f5f77af568a7e8b968a29e8a7. Stopped at selective staging. No commit/push/PR/merge/deployment. RAB remains PARKED; no application source edits.

## Before and exact applied artifacts

HEAD tracked SQL 0000–0002 and snapshots 0000/0001. Local journal contained 0000–0011; SQL/snapshots 0003–0011 were untracked. Live had 12 rows. Every SQL SHA-256 and journal timestamp matched its corresponding live row. See live-before.json (inventory, committed filenames, live rows, public columns/constraints). Existing SQL 0000–0011 and every existing snapshot are byte-for-byte preserved. Journal entries 0000–0011 are unchanged; only entry 0012 is appended. No old migration was replayed live.

Snapshot predecessor IDs form a valid chain. There is no 0002 snapshot because that migration only updates Supabase Storage bucket configuration. 0003 correctly follows 0001. Snapshot-validation.json proves each snapshot's generated DDL yields the same public table catalog (types/defaults/nullability, constraints, indexes and RLS) as replay of its SQL prefix. Snapshots 0004 onward require the custom project_number_seq created by SQL 0004; it is deliberately not retroactively invented in historical snapshot metadata. Drizzle-kit check passes.

## Contact 0012

Canonical artifact: drizzle/0012_contact_inquiries.sql; snapshot: drizzle/meta/0012_snapshot.json. The snapshot is an exact structural copy of 0011 plus Contact metadata generated with installed drizzle-kit from committed HEAD's contactInquiries export, with a fresh ID and predecessor 0011. No dirty schema exports were used. Generated diff is only Contact CREATE and ENABLE RLS; exact table/sequence REVOKE statements from Issue #4 are appended. Existing Issue #4 evidence is at ../contact-issue4/README.md and its standalone SQL is historical provenance, not a second migration to apply.

Installed drizzle-orm 0.45.2 migrator.js hashes the entire UTF-8 SQL with SHA-256 and takes folderMillis from journal.when. pg-core/dialect.js stores this in created_at (bigint), then applies only entries newer than the latest created_at, within a transaction. Thus registering the exact verified already-applied Contact DDL makes future migrations skip its CREATE. Identity is timestamp-based, not ID-based; row ID is the DB serial.

Live transaction: exclusive lock on migration history and share lock on Contact, 5-second lock timeout, 30-second statement timeout. Rechecked all 12 history rows; compared every Contact column/default/nullability and constraint to isolated replay; checked single PK index, RLS enabled/not forced, no policies/custom triggers, and no anon/authenticated table or sequence privileges. Then only:

`INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2) RETURNING id, hash, created_at`

- SHA-256: 633682ff30aa133b7cfec1eed49a4b35f1a9afc93fac80ac132ff28d3ca55ad3
- created_at / journal.when: 1788853539219
- inserted row ID: 13
- executed at: 2026-09-08T07:47:37.878Z

Committed readback has 13 rows; original 12 are unchanged. Contact count and aggregate digest before/after are identical (1 rows); Contact serial last_value/is_called are unchanged. No application DDL/DML was executed. Full parameterized write/readback and security proof: contact-bookkeeping.json. The history table's serial naturally advances by one.

## Fresh reproduction — PASS with platform limits

PGlite 0.5.8, PostgreSQL engine reported in fresh-results.json. Installed Drizzle 0.45.2 PGlite driver calls the same PgDialect migration implementation as postgres-js. All 13 exact SQL files replayed from an empty isolated in-memory database. Minimal Supabase roles/storage.buckets/storage.objects fixture is created first because canonical 0001/0002 require those platform objects. All live public columns and constraints exactly match fresh results. Contact RLS and role revokes pass; second migration run is a no-op with identical 13-row history.

PASS: real PostgreSQL SQL execution through the shared Drizzle dialect, all migration prefixes and snapshots, final catalog comparison, Contact access restrictions, rerun no-op.
PENDING: native postgres-js network-driver replay against a separate full Supabase/PostgreSQL server; no server binary is installed. Supabase services, full Storage schema/policies and production default-grant behavior are not emulated. The fixture is not a complete Supabase clone. Production itself was inspected for Contact grants and policies before bookkeeping.

To repeat isolated validation on this Mac (temp-only; no live access):

```sh
mkdir -p /private/tmp/precious-issue6/runtime
npm install --prefix /private/tmp/precious-issue6/runtime @electric-sql/pglite@0.5.8 --no-audit --no-fund
cd /Users/mymac/Documents/Precious/pc
cp -R node_modules/drizzle-orm /private/tmp/precious-issue6/runtime/node_modules/
mkdir -p /private/tmp/precious-issue6/canonical
cp -R drizzle/. /private/tmp/precious-issue6/canonical/
ln -sfn /Users/mymac/Documents/Precious/pc/node_modules /private/tmp/precious-issue6/node_modules
cp verification/migration-issue6/scripts/{fresh.mjs,snapshot-check.mjs,catalog.mjs} /private/tmp/precious-issue6/
cp verification/migration-issue6/live-before.json /private/tmp/precious-issue6/audit.json
node /private/tmp/precious-issue6/fresh.mjs
node /private/tmp/precious-issue6/snapshot-check.mjs
cd /private/tmp/precious-issue6
node /Users/mymac/Documents/Precious/pc/node_modules/drizzle-kit/bin.cjs check --dialect postgresql --out canonical
```

Scripts audit.mjs, prepare.ts and bookkeep.mjs are retained as historical execution evidence, NOT setup commands. Do not rerun prepare.ts against the registered artifact: it assigns a new timestamp/ID. Bookkeeping's exact 12-row assertion rejects a second insertion. None prints credentials. The replay scripts require the temporary node_modules symlink to the project for drizzle-kit resolution, as established during this run.

## Preserved schema drift / limitations

Committed HEAD omits ten tables present in verified applied migration history (head-schema-gap.json), and has other older Project/RAB definitions. This predates Issue #6. A whole-schema generate against HEAD can propose unrelated DROP/ALTER operations; do not apply those as Contact changes. 0012 preserves the full migration baseline and adds Contact only. No claim that ordinary generate from HEAD is globally drift-free. Resolving the application-to-migration schema gap remains pending outside this accounting-only scope, without promoting parked RAB application WIP. Also custom SQL Storage policies, grants and project_number_seq are not fully represented by generated snapshots; canonical SQL remains required for fresh environments.

## Validation and staging

npm run check: PASS, 0 errors/0 warnings. npm run build: PASS, adapter-node; existing warnings recorded in checks.json. Drizzle-kit check: PASS. Working/staged whitespace checks and preservation are recorded in final-state.json. Exact canonical SQL inventory/hashes: inventory-after.json. Exact staged files: staged-files.txt. Unstaged/untracked state: unstaged-status.txt. preservation-before.json contains only hashes of tracked/untracked nonignored files (no .env). All pre-existing files except the intentionally extended journal remain byte-identical. No schema.ts, queries.ts, Admin v1, RAB, or other application files staged. No .env tracked/staged.
