# RAB Builder MVP

Branch `rab-builder-mvp`, based on Issue #12 commit `2d01482`.
Route: `/admin/projects/[projectId]/rab/[rabId]`, linked from workspace **Open RAB**.

## Schema and calculation

Migration `0014_rab_builder_prices.sql` adds only nullable `material_unit_price` and
`jasa_unit_price` (`numeric(18,2)`). Apply through the normal Drizzle migrator only
after approval for the target environment. It has been applied only in disposable
local PostgreSQL for this task. **No live migration or live writes were performed.**

Existing rows retain their combined unit price, total and weight during migration.
Null component prices mean “not split yet”, never zero. Editing a legacy item requires
an explicit material/jasa split; until saved its price and total remain unchanged.
`unit_price` remains the combined price for compatibility.

Each component total is `round(volume × component unit price, 2)`; item total is the
sum of those two rounded totals. All persisted arithmetic uses PostgreSQL numeric.
Subtotals sum persisted item totals; tax uses the RAB's existing `tax_rate` (default 11%).
Stored weight remains `round(item.total / rab.subtotal × 100, 6)`, zero for zero subtotal.
Hierarchy changes, cascaded deletes, total refresh and weights share a transaction
holding the RAB row lock. Every mutation checks Draft status and relational ownership.
Parent IDs are explicit; labels and document numbers never determine ownership.

## Focused local tests

Use an empty disposable PostgreSQL database on **localhost:55414** named
`rab_builder_test` or `rab_builder_test_SUFFIX`. The test refuses other hosts/ports/names
and nonempty public schemas. It applies migrations, creates synthetic fixtures, tests
CRUD/calculations/locking/ownership/rollback, then leaves demo data for preview.

```sh
RAB_BUILDER_TEST_URL='postgres://mymac@127.0.0.1:55414/rab_builder_test_NEW' npx tsx tests/rab-builder.test.ts
```

Create the empty database first. This script does not load `.env`.
For check/build, supply your environment or local dummy Supabase values:

```sh
PUBLIC_SUPABASE_URL=http://127.0.0.1:54321 PUBLIC_SUPABASE_ANON_KEY=isolated-test DATABASE_URL=postgres://mymac@127.0.0.1:55414/rab_builder_test_3 npm run check
PUBLIC_SUPABASE_URL=http://127.0.0.1:54321 PUBLIC_SUPABASE_ANON_KEY=isolated-test DATABASE_URL=postgres://mymac@127.0.0.1:55414/rab_builder_test_3 npm run build
git diff --check
```

Current task's synthetic preview runs via `/tmp/rab-builder-preview.mjs` on port 51714,
using DB `rab_builder_test_3`. Its fixture auth exists only in the external preview
runner; committed application auth is unchanged. Restart: `node /tmp/rab-builder-preview.mjs`.

## Files staged for this MVP

- `src/lib/server/db/schema.ts`
- `src/lib/server/db/queries.ts`
- `src/lib/rab-builder/values.ts`
- `src/routes/admin/projects/[projectId]/rab/+page.svelte`
- `src/routes/admin/projects/[projectId]/rab/[rabId]/+page.server.ts`
- `src/routes/admin/projects/[projectId]/rab/[rabId]/+page.svelte`
- `drizzle/0014_rab_builder_prices.sql`
- `drizzle/meta/0014_snapshot.json`
- `drizzle/meta/_journal.json`
- `tests/rab-builder.test.ts`
- `tests/README-rab-builder.md`

QA: focused PostgreSQL tests passed, including legacy preservation, CRUD, two-group
aggregation, rounding, 11% PPN, weight, read-only, ownership and overflow rollback.
Browser passed Open RAB navigation, Area/Group/Subgroup/Item creation, editing, deletion,
validation errors, legacy pricing, locked view, desktop and 390px mobile sanity.

## Draft PDF preview

Route: `/admin/projects/[projectId]/rab/[rabId]/preview`.
Builder header opens Preview PDF in a new tab; Print / Save PDF uses browser printing.
The root-layout reset removes the admin shell. A4 portrait, repeated table headers,
row break protection, hidden print controls and a repeated print DRAFT watermark.
Uses the same repeatable-read Builder query and exact persisted totals; null split
prices show dashes with the legacy combined price. No actions or schema changes.
Non-draft/frozen previews return 409 until a canonical historical snapshot decoder
is available; cross-project and invalid identities return 404. Draft masters are live.

QA: check (0 errors/warnings), build and diff whitespace check passed. Local browser
verified synthetic Draft hierarchy, split/legacy prices, 11% tax and grand total
Rp 38.711.250,02; cross-project 404 and locked 409. Desktop layout inspected.
Print CSS reviewed; the in-app browser did not expose a native print dialog, so
native Print / Save PDF dialog and actual pagination still need Chrome/Safari verification.
