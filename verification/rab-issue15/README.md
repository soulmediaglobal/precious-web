# Issue #15 — implementation and QA evidence

Canonical v2.3.0; branch `15-define-and-implement-canonical-rab-family-identity-revision-integrity-and-pre-numbering-compatibility`; baseline HEAD/main/origin-main `fcc6f23792453c5784498428887dae7433089eb0`. Remote fetched and GitHub Issue #15 verified OPEN. Issue #12 remains FORMALLY BLOCKED pending Varek verification and merge. No UI, commit, push, PR, merge, deploy or live migration.

## Physical design and scope

Migration **0013_rab_family_identity.sql**, index 13, follows actual journal 0012. Generated Drizzle snapshot/journal from committed HEAD schema plus only Issue15 changes; SQL expanded for safe mapping/functions. Historical migration files unchanged.

`rab_families(id serial PK, project_id FK RESTRICT, family_number, last_revision_number)` is the smallest independent parent identity. Existing `rabs.id` stays the revision PK; all section/group/subgroup/item/stage/term FKs and ownership stay intact. A self-root-only design complicates R00 identity/backfill and counter ownership without reducing changes to the existing revision table. No parallel revision or builder model is introduced.

Family uniqueness `(project_id, family_number)`; revision uniqueness `(family_id, revision_number)` replaces `(project_id, revision_number)`. Composite FK `rabs(family_id,project_id) → rab_families(id,project_id)` prevents mismatched Project ownership. Composite FK `rabs(supersedes_rab_id,family_id) → rabs(id,family_id)` prevents orphan, cross-family and cross-project sources; NULL source is supported. Referenced pairs have explicit UNIQUE constraints. Self-source and negative revisions rejected. No status/lifecycle flattening. Source chronological ordering is checked for legacy mapping; this issue does not establish a new general lifecycle transition policy.

## Legacy mapping

Migration locks Projects/RABs and runs transactionally through Drizzle. Explicit source trees become families. Roots without source evidence become separate families, ordered by root PK within Project. No links inferred from document strings or mere adjacent revisions. Non-increasing/cyclic, orphan or cross-Project legacy sources fail closed. Existing revision numbers, document numbers, frozen/inherited text, timestamps, PKs and child rows stay unchanged. An unlinked R04 remains R04; migration does not fabricate R00 or previous links.

Counters seed from mapped families/max historical revision number. Existing PRE Project numbers reserve their year/number under the migration lock (parsing only reserves business-number space, never establishes relations). PC numbers remain unchanged. Legacy global Project sequence and old RAB annual counter table are retained but no longer used by the new primitives.

## Allocation

`project_number_counters(year PK,last_number)` and database default `next_project_number()` use atomic UPSERT. Year is **Asia/Jakarta at transaction start**, independent of session timezone. A new year starts 00001. Counter bounds fail rather than truncate beyond 99999/year; transaction rollback restores reservations. Function's explicit year parameter supports deterministic verification/import use; normal Project default supplies the current year.

`createCanonicalProject` uses that default and serializes the existing client-local ordinal with a Client row lock. Existing WIP `createProject` is minimally aligned to the same lock. No Project CRUD UI is staged.

`createInitialRab` locks Project, increments `rab_family_counters` atomically and inserts Family + R00 in one transaction. Each request creates a distinct Family. `allocateRabRevisionIdentity(tx,projectId,sourceRabId)` locks the live scoped source and increments the Family counter transactionally. The caller MUST write the revision/full snapshot within that transaction; the primitive alone does not implement cloning or lifecycle eligibility. Snapshot callers retain their existing eligibility checks. Human-readable number uses actual live Project root and relational Family/revision values, not a parsed source string. Padding is minimum width for families/revisions (no truncation at 100/1000).

DB uniqueness remains the final guard for direct/manual inserts. Manually supplied conflicting business IDs fail closed and may require reviewed reconciliation; nothing automatically renumbers historical IDs. These primitives do not promise request-key idempotency: simultaneous new-family requests intentionally create distinct Families.

## Canonical index versus pre-existing WIP

Committed HEAD contains no full Task1/Task2 clone/resolver implementation. The index adds only canonical allocation primitives and schema/migration. The working tree additionally has a **minimal adaptation** of existing WIP clone: lock live source before eligibility, obtain family/revision identity through the new primitive, preserve all snapshot/child copy logic and existing superseded transition. Old frozen payloads need not contain familyId; allocation reads the live row. `working-tree-integration.patch` records the exact reversible delta versus the baseline WIP.

The full Task1/Task2 WIP is NOT silently promoted into this issue. Compatibility tests exercise that WIP with the minimal adaptation; clean canonical candidate allocator tests/check/build also pass independently. Varek must review this integration boundary before promoting the existing WIP later. This evidence is not a claim that full clone/freeze implementation is now in committed HEAD or staged by Issue15.

## Verification

Real **PostgreSQL 18.6**, postgres-js, temporary cluster on 127.0.0.1:55415. Homebrew bottle downloaded with SHA256 verification and relocated only under /private/tmp; no service installed. Fresh 0000–0013 replay, representative 0012→0013 legacy upgrade, exact existing-row comparisons, failed orphan migration rollback, FK/unique rejection, PRE yearly reset/overflow/rollback, PC root compatibility passed. Minimal storage schema and anon/authenticated roles support old migrations; this is not Supabase Storage/RLS certification.

Concurrency: 20 Projects, 24 same-year allocations, 20 Families, 20 revisions, connection pool 24. All identities unique. Existing clone: 12 concurrent requests on one eligible source yield exactly one clone, preserving same-family lineage. See JSON evidence.

Task1 full child clone/remapping and source preservation passed. Task2 existing fixture assertions passed for freeze, master changes, historical reads, retention, legacy recovery refusal, and old snapshot without familyId. Existing UI route loader was tested via its server function only; no browser/PDF/render verification. Broader editor/master-write races and Task2 canonical compliance are not newly certified.

Both complete WIP copy and clean canonical candidate pass `npm run check` (0 errors/warnings) and `npm run build` (adapter-node). `drizzle-kit check` passed. Build/check use dummy public Supabase settings and isolated DB URL. No live credentials needed or copied.

## Reproduce

Use a disposable PostgreSQL 18 cluster listening only on loopback port 55415. Never point these scripts at production. From the repo:

```sh
ISSUE15_TEST_URL=postgres://YOUR_LOCAL_USER@127.0.0.1:55415/issue15_fresh node --import tsx verification/rab-issue15/verify.ts
ISSUE15_TEST_URL=postgres://YOUR_LOCAL_USER@127.0.0.1:55415/issue15_fresh node verification/rab-issue15/compatibility.mjs
```

Runner creates uniquely named test databases; cluster owner privileges are required for DB/role creation. Compatibility runner requires the preserved Task1/Task2 WIP and `verification/task2` fixture; that dependency is intentional and not staged wholesale. To reproduce the canonical-only suite, materialize the index into a separate checkout and run verify.ts there. Use normal Drizzle migration execution (transactional); do not apply the migration statement-by-statement in autocommit because temporary mapping and lock scope require one transaction.

Live DB was neither read nor mutated in this run. Existing audit sample was contextual only. Deployment/RLS service privileges and real historical production samples remain Varek/Ray rollout checks. Review the mapping on a fresh backup before any separately authorized live apply.
