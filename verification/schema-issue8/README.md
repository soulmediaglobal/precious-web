# Issue #8 — application schema alignment

Branch: `8-align-committed-drizzle-application-schema-with-canonical-migration-baseline`
HEAD: `95406e2c6cf1e0e9b417a586efa09c34f7824262`

22 canonical public tables versus 12 in HEAD. See table-inventory.md and committed-schema-gap.json for exact inventory. The ten missing tables are project_documents, project_work_types, rab_groups, rab_items, rab_number_counters, rab_payment_terms, rab_sections, rab_stages, rab_subgroups, work_types. No existing table definition needed correction; no duplicates. Contact stays unchanged including timezone timestamps and enabled RLS.

Only ten pgTable declarations appended to the exact HEAD schema. Export names adopted from verified WIP: projectDocuments, projectWorkTypes, rabGroups, rabItems, rabNumberCounters, rabPaymentTerms, rabSections, rabStages, rabSubgroups, workTypes. No queries, UI, workflows, or new ORM relations promoted. RAB remains PARKED.

## Proof

Installed drizzle-kit generateDrizzleJson on intended schema matches every semantic field in snapshot 0012 after JSON serialization. generateMigration(0012, intended) returns []. CLI check passes; CLI generate reports “No schema changes, nothing to migrate”. No DROP TABLE, DROP COLUMN or ALTER proposals; no new migration files. Canonical SQL/snapshots/journal unchanged (per-file hashes in migration-preservation.json).

Replayed all thirteen canonical SQL migrations in isolated PGlite 0.5.8 with minimal anon/authenticated and storage fixture. Compared complete resulting public table catalog with DDL generated from intended metadata: identical. Compared against fresh live catalog in postgres-js READ ONLY transaction: all 22 tables, 170 columns with defaults/types/nullability, 46 constraints including FK actions, 46 indexes, RLS and 19 sequence definitions match. No public policies or enums. PostgreSQL 18 separately exposes NOT NULL constraints; these catalog rows are excluded on both sides because nullability is independently compared for all columns. No live DDL, DML, sequence advancement, or migration-history writes.

## Preservation and validation

All 36 pre-existing modified/untracked files are byte-identical. Original index was empty. Canonical schema staged index-only; local schema retains additional WIP ORM relations and formatting. There are no noncanonical WIP table/column definitions. Working-tree versus index divergence is intentional: do not stage schema.ts from the working tree wholesale.

Isolated intended snapshot: npm run check passes with 0 errors and 0 warnings; npm run build passes with adapter-node. Only Node DEP0205 warning, previously documented in Issue #6. Existing exported symbols and relations are preserved byte-for-byte. Final working/staged diff checks and exact staged list are recorded separately.

## Boundaries

project_number_seq remains owned by custom SQL 0004 and referenced by the unchanged projects.projectNumber default; historical snapshot sequences is empty. Declaring pgSequence now would propose CREATE against an already-existing sequence, so no new sequence export was added. Its live parameters match canonical SQL. Serial sequences remain represented by serial columns. Storage policies and grants are SQL-managed outside public table metadata; no changes to those. The PGlite fixture is not a full Supabase service reproduction. Pending WIP behavior is not validated/promoted; tests target the intended committed snapshot. No commit/push/PR/merge/deploy. Stop after selective staging.
