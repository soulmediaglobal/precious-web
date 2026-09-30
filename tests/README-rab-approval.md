# Issue #32 — internal RAB approval

Branch: `32-featrab-add-internal-approval-workflow-for-rab`.

## Migration and authorization

`0017_rab_internal_approval.sql` adds `cms_users` (UUID primary key, constrained
`staff|director`, active flag, timestamps), enables RLS without client policies,
and adds nullable request-user/request-time columns to `rabs`. Existing RAB rows,
statuses, document numbers and approval fields are preserved. Journal and snapshot
are generated with the existing Drizzle configuration. No remote migration is applied.

Supabase `auth.getUser()` remains the identity source. UUID mapping to Auth is logical,
not a cross-schema FK. No Auth metadata or `team.group` is used. Missing/inactive
membership fails closed for approval; existing login/read/edit permissions elsewhere
are unchanged. Any active Staff can submit a Draft in the shared workspace. Only an
active Director can approve `internal_review`, or directly approve their own Draft.
Direct approval of another creator's Draft (including null legacy creator) is denied.
Roles are evaluated at action time; role changes use trusted database administration.
`updated_at` must be set by those administrative updates.

Database connections must use a trusted server role that can read `cms_users` despite
RLS (table owner/BYPASSRLS). Never grant browser roles a policy to update membership.
Existing RAB tables and their API grants are outside this migration: runtime rollout
must ensure untrusted Supabase API roles cannot write RAB tables directly and bypass
the application's server guards. Live grants were not inspected or changed.

## Seed existing users for runtime QA — manual, after migration approval

There is no automatic role assignment and no default Director. Get the real UUIDs
from Supabase Authentication > Users; do not put passwords, keys or `.env` in chat.
A trusted operator should review and run the following in the intended environment,
replacing the UUID placeholders locally. This is an example, not an executed seed:

```sql
begin;
insert into public.cms_users (user_id, role, is_active)
select id, 'staff', true from auth.users where id = 'STAFF_AUTH_UUID'::uuid
on conflict (user_id) do update
set role = excluded.role, is_active = true, updated_at = now();
insert into public.cms_users (user_id, role, is_active)
select id, 'director', true from auth.users where id = 'DIRECTOR_AUTH_UUID'::uuid
on conflict (user_id) do update
set role = excluded.role, is_active = true, updated_at = now();
select user_id, role, is_active from public.cms_users
where user_id in ('STAFF_AUTH_UUID'::uuid, 'DIRECTOR_AUTH_UUID'::uuid);
commit;
```

Verify exactly two intended rows and roles before runtime QA. The `auth.users` select
avoids creating membership for an unknown Auth UUID. RABs with null creator cannot be
self-approved as Director; use a new Director-created Draft for that test.

## Freeze and preview

Submission/self-approval obtains the same RAB row lock used by Builder/Tahapan/Termin.
A repeatable-read transaction stores the complete current Builder document plus
Project/Client/bank masters in existing `frozen_document`. The new versioned payload
has a SHA-256 integrity checksum (corruption detection, not a cryptographic signature).
Approving review preserves snapshot bytes and request audit. Lifecycle/approval audit
is overlaid from the current RAB; document content comes exclusively from the snapshot.

Draft/review retain the DRAFT indicator; internal approval removes it from header and
footer. Client approval is untouched. Unknown/missing/corrupt historical snapshots
stay blocked for preview and approval; no live-master fallback is rendered. Drafts
with legacy inherited/frozen representations require a future compatible decoder.
The existing read-only Builder for unsupported history remains available as before;
it is not treated as a historical PDF. Existing hardcoded letterhead/logo/signature
presentation remains unchanged; this is not a renderer/versioned asset redesign.

## Tests

Only use a fresh disposable PostgreSQL database on localhost port 55414 named
`rab_builder_test` or `rab_builder_test_SUFFIX`. The test refuses other targets and
nonempty public schemas. It creates synthetic Supabase storage scaffolding and users;
no real Supabase Auth credentials are used. Migration 0016 contains a production-data
fingerprint that intentionally rejects an empty database. The test removes only that
fingerprint precondition in a temporary migration copy, retaining all DDL and leaving
the repository's 0016 untouched. Therefore this does not verify 0016's live-data boundary;
0017 runs unmodified.

```sh
RAB_BUILDER_TEST_URL='postgres://mymac@127.0.0.1:55414/rab_builder_test_issue32' npx tsx tests/rab-approval.test.ts
npm run check
npm run build
git diff --check
```

Coverage: missing/inactive roles, staff denial, Director own-draft rule, cross-project
scope, request/approve audit and duplicate protection, edit locks, concurrent requests,
edit/submission ordering, preserved masters/structure, corrupted/legacy preview guard,
RLS membership protection, real route action 401/403 and preview 409.

Runtime browser QA after approved migration/seed: log in separately as Staff and
Director, exercise request/review/approve and Director self-approve, verify Builder,
Tahapan and Termin are read-only after submission, and inspect printed preview for
DRAFT before approval and no DRAFT afterward. No rejection, return-to-draft, client
approval, notification, Invoice or BAST actions are added.

## Verification result — 2026-09-18

- `npm run check`: PASS, 0 errors / 0 warnings.
- `npm run build`: PASS, adapter-node. Existing Node `module.register()` deprecation warning.
- `git diff --check`: PASS.
- `drizzle-kit check`: PASS.
- `tests/rab-approval.test.ts`: PASS on disposable PostgreSQL 18, database
  `rab_builder_test_issue32_v2`; includes actual route action and preview load checks.
- Built preview component server rendering: PASS for draft/review (DRAFT present),
  internally approved (DRAFT absent), frozen project text retained.
- No real Supabase/browser login or native Print / Save PDF QA performed.
- No commit, push, deployment, remote migration or real-user seed performed.
- Runtime rollout prerequisites: approved migration, explicit Staff/Director seeds,
  trusted server DB role, and verification that public API roles cannot directly
  mutate RAB tables. Existing 0016 live fingerprint compatibility remains its own gate.
- Canonical documentation has older workflow sections. Locked decisions in the
  current Issue #32 request govern this implementation; canonical docs were not rewritten.

## Exact changed files

- `src/lib/server/db/schema.ts`
- `src/lib/server/db/queries.ts`
- `src/lib/rab-builder/approval.ts`
- `src/routes/admin/projects/[projectId]/rab/+page.svelte`
- `src/routes/admin/projects/[projectId]/rab/[rabId]/+page.server.ts`
- `src/routes/admin/projects/[projectId]/rab/[rabId]/+page.svelte`
- `src/routes/admin/projects/[projectId]/rab/[rabId]/preview/+page.server.ts`
- `src/routes/admin/projects/[projectId]/rab/[rabId]/preview/+page@.svelte`
- `drizzle/0017_rab_internal_approval.sql`
- `drizzle/meta/0017_snapshot.json`
- `drizzle/meta/_journal.json`
- `tests/rab-approval.test.ts`
- `tests/README-rab-approval.md`

## Current update — Issue #34, 2026-10-01

This section supersedes the older role and rollout assumptions above.
The original Issue #32 verification remains a historical record.

### Current authorization

- Active Admin and Director can approve internal review, or their own Draft.
- Active Manager and Staff can request approval for a Draft.
- Approval of another user's Draft remains denied.
- CMS login and protected admin routes require active CMS membership.
- Admin manages all four roles; Director cannot manage Admin accounts.
- Self role changes, self deactivation and self deletion are blocked.
- Self name/position editing is allowed.
- User mutations recheck authorization server-side.
- Concurrent mutations are serialized to preserve active Admin access.
- Pending deletion disables CMS access and blocks profile/role reactivation.
  Failed deletion can be retried.

### User management and migrations

User creation includes name, position, email, initial password and CMS role.
Position is a job title, separate from the access role.
Passwords are never returned in user lists or profile loads.

Applied migrations in the configured Supabase database:

- 0019_cms_user_roles: four CMS roles.
- 0020_cms_user_deletion_state: retryable deletion marker.
- 0021_cms_user_profile: name and position.

Supabase Admin operations require server-only SUPABASE_SECRET_KEY.
Never commit its value or expose it to browser code.

### Verification

- npm run check: PASS, 0 errors / 0 warnings.
- npm run build: PASS, adapter-node.
- tests/cms-user-access.test.ts: PASS.
- tests/rab-approval.test.ts: PASS on disposable local PostgreSQL,
  database rab_builder_test_issue34_roles_v2.
- tests/cms-user-transactions.test.ts: PASS on disposable local PostgreSQL,
  database rab_builder_test_issue34_cms_users.
- Browser QA reported successful: user creation, profile display/edit,
  active login, inactive login rejection, role-based user-management access,
  duplicate-account rejection and deletion of a disposable account.

The transaction test covers role restrictions, profile persistence,
self protection, pending-deletion retry, guarded membership cleanup,
and concurrent cross-deletion by two Admins leaving one active Admin.

Transaction tests use synthetic database identities, not real Supabase Auth.
They do not automatically verify external Auth deletion failures or creation
rollback network failures. The original 0016 production-data fingerprint
remains excluded only in temporary test migration copies.

### Local test commands

Start the disposable local PostgreSQL server first.
Each integration test requires its own fresh, empty database on port 55414,
named rab_builder_test or rab_builder_test_SUFFIX. Do not use Supabase.

    npx tsx tests/cms-user-access.test.ts
    RAB_BUILDER_TEST_URL='postgres://mymac@127.0.0.1:55414/rab_builder_test_NEW_APPROVAL_SUFFIX' npx tsx tests/rab-approval.test.ts
    RAB_BUILDER_TEST_URL='postgres://mymac@127.0.0.1:55414/rab_builder_test_NEW_CMS_SUFFIX' npx tsx tests/cms-user-transactions.test.ts

The database names above are placeholders; create fresh databases before running.
The disposable PostgreSQL server was stopped after verification.
Hostinger deployment has not been performed.
