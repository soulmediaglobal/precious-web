# Issue #4 — Contact Inbox MVP

Continuation completed through selective staging only. Branch: `4-admin-v2-contact-inbox-cms-with-follow-up-tracking`; HEAD: `03ee431d456b1c0e6673fbf95c874c323e4ae267`. Issue #4 verified OPEN with matching Contact scope. No commit, push, PR, merge, deployment or unrelated migration. RAB remains PARKED.

## Canonical Contact migration

`20260908_issue4_contact_inquiries.sql` is the standalone canonical artifact for this issue, outside the active Drizzle migration directory. Apply this file ONLY inside a PostgreSQL transaction with the existing server database connection. It is intentionally fail-fast if the table already exists; do not rerun on this live DB.

Reconciliation found committed journal 0000–0002, local journal 0000–0011, and 12 live `drizzle.__drizzle_migrations` rows. Every local SQL SHA-256 and journal timestamp matches its live row exactly, including unrelated untracked 0003–0011. Full matching evidence is in `live-migration.json`. This is newer evidence than the historical Task 2 README's not-applied checkpoint.

The committed snapshots also lag committed schema. A sequential Contact migration plus snapshot/journal would therefore encode unrelated baseline drift or depend on uncommitted Project/RAB history. Per Ray's explicit standalone fallback authorization, no journal/snapshot was changed or staged, and no broad generator/migrator was run. The standalone identity does not consume/collide with numeric Drizzle 0003–0011. Contact is NOT registered in Drizzle history; future reconciliation must account for this already-applied table before generating/applying Contact DDL. This is an Issue #4 exception, not a new cross-project migration convention.

`contact_inquiries.pending.sql` remains preserved and unstaged as historical input; it is superseded and must not be used for deployment.

## Live application and readback

On 2026-09-08 WIB, the exact pending CREATE TABLE was applied in one transaction after rechecking all 12 history rows and confirming the table did not exist. It creates only Contact table and serial sequence. No unrelated migration was applied.

Readback discovered Supabase default grants expose new tables to anon/authenticated. Before QA inserted data, a second Contact-only transaction enabled RLS and revoked all table/sequence privileges from those roles. The canonical file includes both operations; schema Contact uses `.enableRLS()`. No policies are added: existing postgres-js server connection continues to work. Final readback: RLS true, anon access false, authenticated access false. Existing hooks unchanged. Initial and final artifact hashes plus exact SQL metadata are recorded in `live-migration.json`.

Verified all 11 columns, nullability and defaults: serial integer primary key; required first_name/message; nullable last_name/email/phone; consent_accepted and is_followed_up required/default false; created_at required/default now(); followed_up_at nullable. Both timestamps are `timestamp with time zone`. Primary key is `contact_inquiries_pkey`. Length/contact-method/status validation remains in the locked server helper; no extra DB CHECK constraints were invented. Drizzle's 12 history rows remained unchanged.

## Minimal live smoke

Evidence: `live-smoke.json`. One clearly marked TEST inquiry, ID 1, 493-character multiline message including literal HTML and a long word.

- PASS: public local `/contact` HTTP POST persisted the inquiry with exact message and default not-followed-up state. Initial request's default Accept returned HTTP 200, not the asserted 303; QA recovered that exact row instead of sending another inquiry. Browser success/redirect rendering is not claimed.
- PASS: unauthenticated `/admin-v2/contact` HTTP request redirects to `/admin-v2/login`.
- PASS: actual list server load, loaded through Vite with live postgres-js, places ID 1 first. Only one row existed; multi-row tie ordering was inspected in query source (`createdAt DESC, id DESC`), not tested with extra live rows.
- PASS: actual detail load returns the complete message unchanged.
- PASS: actual detail server action marks Sudah Follow Up / Email, then fresh load returns persisted status/method/timestamp.
- PASS: repeated action preserves the exact DB timestamp `2026-09-07 22:45:05.438773+00`, including microseconds.
- PASS: reset to Belum Follow Up clears method and timestamp on fresh load.
- PASS: marking again gives new timestamp `2026-09-07 22:45:07.780637+00`.
- PASS: cleanup deleted only ID 1 matching both exact TEST marker and message; readback count 0. Sequence was not reset.
- PENDING: complete authenticated browser submit/click/reload flow, readable desktop/mobile visual QA. Firefox native AX omits page body; screenshot stayed on old inbox despite URL/tab changes. No session extraction, auth bypass, or changes to hooks. Admin tests invoked actual server load/actions directly, so they verify server/DB behavior rather than authenticated HTTP routing. Full escaping/newline/long-word wrapping reviewed in Svelte source, not asserted from browser rendering.
- PENDING: concurrent DB integration testing (not part of this minimal sequential smoke).

## Selective staging and preservation

Index schema is committed HEAD plus Contact block only. Index queries is committed HEAD plus Contact imports/four queries and required `desc` import only. Unrelated schema/queries working-tree prefixes remain preserved. Reach changes are form wiring/feedback/copy; public contact title fixed; sidebar Contact link added; existing non-expanded CTA preserved. Six new application files provide validation, public action, list and detail.

SHA-256 manifest captured before this continuation verified every pre-existing tracked/untracked file unchanged except the Contact-only `.enableRLS()` ending in schema and this updated README. Unrelated migrations 0003–0011, snapshots, journal, Project/RAB/admin v1 and verification/task2 remain byte-for-byte unchanged and unstaged. `.env` is not tracked/staged. Staged scope is listed in `staged-files.txt`.

## Checks

Working-tree `npm run check`: PASS (0 errors, 0 warnings). `npm run build`: PASS, adapter-node. 33 targeted helper cases: PASS. `git diff --check`: PASS. Build emits existing Node DEP0205 deprecation warning.

Staged application snapshot is separately checked/built without unrelated working-tree files. An initial isolated check lacked environment declarations and an initial isolated build hit sandbox cache permission; rerun uses existing environment in-process, never copied/logged credentials. Rerun PASS: staged snapshot check 0 errors/0 warnings and staged snapshot build PASS (adapter-node).

Stop state: selectively staged, not committed. Remaining browser QA and eventual Drizzle reconciliation are explicitly retained; no claim of Issue #4 closed or app deployed.
