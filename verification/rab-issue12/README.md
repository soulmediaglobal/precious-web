# Issue #12 — Project RAB workspace

PR #16 MERGED at `fdb2bda808ed4be3d7546b827e335b65a5c95acd`; Issue #15 CLOSED. Fetched origin/main contains this merge. Structural blocker removed. Canonical v2.3.0 remains the baseline.

Implementation is isolated on branch `issue12-rab-workspace` in `/tmp/precious-issue12`. Original repository remains on its Issue15 branch; local main is still behind. All 43 pre-existing dirty/untracked file hashes match, and its index remains empty.

## Scope

`/admin-v2/projects` lists existing Projects, linking to `/admin-v2/projects/[projectId]/rab`. No Project CRUD added. Workspace shows project business ID/name, families and nested revisions, granular Indonesian status labels, timestamps, stored total and read-only source. Stable revision selection/open is `?rab=<row-id>`; `#document` opens the Phase1 summary foundation. No builder, revision creation, lifecycle mutation, PDF, Tahapan, Termin, Invoice or BAST.

Query additions: `getRabWorkspaceProjects`, `getProjectRabWorkspace` in queries.ts. Grouping joins explicit Family/Project FKs; never parses document IDs. Existing `createInitialRab` reused unchanged for atomic new Family + Draft R00. Schema and migration files unchanged. Source/IDs/frozen data are never written by list/open queries.

## Verification

Fresh disposable PostgreSQL18 on loopback 55412: migrations 0000–0013 passed with minimal local Storage/role stubs. Family001/R00 + Family002/R00 coexist; PC root preserved. Unparseable historical number groups correctly by FK; descending revisions/source relation preserved. All RAB columns unchanged across repeated reads. `verify.ts` records these assertions; run only against its guarded disposable URL on a fresh test cluster.

Browser: desktop 1280×720 and mobile 390×844 visually inspected. Created Family003/R00 through real page action and selected it; history/source/open worked. Mobile document width 390px equals viewport. Auth was a local in-memory Vite fixture; production hooks untouched and real Supabase auth was not retested. HTTP checks cover missing/invalid IDs, cross-Project access, empty state, missing-Project action failure. SvelteKit action failure carries status404 in its JSON response.

Check: 0 errors/0 warnings. Build: adapter-node PASS. Drizzle check and whitespace check PASS. Live DB was neither read nor written; 0013 only applied to disposable DB. No secrets copied.

## Review boundary

Only the 15 paths in staged-files.txt are staged in the isolated worktree. Original WIP, old Issue15 evidence, Adminv1, Contact SQL and Task2 remain untouched and unstaged. No commit/push/PR/deploy. No implementation blocker; retain temporary worktree for review. Production migration rollout remains separate authorization.
