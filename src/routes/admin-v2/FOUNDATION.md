# Admin v2 — foundation through Phase 6

Current status: Phase 6 Clients is implemented and finalized with static verification and Ray-reported browser/runtime QA PASS as documented below. Phase 5 Team remains finalized. This closes the Clients phase only, not the broader CMS. Phase 3 CMS auth parity is implemented. The Phase 1/2 notes below preserve historical scope; their unauthenticated-shell and deferred-auth descriptions are superseded by Phase 3. Full real authenticated login/logout E2E verification is still outstanding.

## Phase 1 — historical foundation

Official source: https://github.com/TailAdmin/tailadmin-free-tailwind-dashboard-template
Pinned source commit: 44ac4719ef1762907c84c4df459842de9eea70b0 (MIT; license alongside this file).

Adapted from src/partials/sidebar.html, src/partials/header.html, src/blank.html and src/css/style.css. Retains official 290px/90px sidebar, 1024px navigation breakpoint, header/menu geometry, dark gray/brand tokens and blank panel. SVG path data extracted from official sidebar/header. Alpine directives replaced by Svelte 5 runes; SvelteKit owns navigation. No Alpine, Webpack, Flowbite or new dependencies used by v2. Scoped CSS expresses the relevant official dark utility styles without importing TailAdmin's global reset/theme into v1. Existing Precious Montserrat and logo-white.svg retained; no TailAdmin demo branding or profile data.

Dashboard is a blank landing panel. Clients, Projects and Team use local hash placeholders, with no business routes/loaders. Mobile drawer supports Escape, focus trapping, backdrop dismissal and focus restoration. Desktop supports collapse; small header menu supports show/hide.

Ray explicitly approved the shared hook matcher correction: /admin and /admin/* remain protected; /admin-v2 is an unauthenticated static shell in Phase 1. Do not add data or deploy as a functional CMS before later auth work. Route /admin-v2 and this approved hook boundary need Nurey canonical documentation sync; canonical files were not edited here.

## Ray visual adjustments

Ray requested pure black backgrounds, a sidebar one-third narrower (290px → 193.333px), colored existing logo.svg one-third smaller (118px → 78.667px; proportional mobile/collapsed sizes), and typography matching https://demo.tailadmin.com/. Demo computed styles verified: Outfit, menu 14px/20px with 8px 12px padding and 12px gap; group headings 12px/20px. Outfit is loaded only by the v2 layout and applied only to .ta-shell. This supersedes the initial Montserrat/white-logo appearance noted above.

## Phase 2 — existing backend plumbing

The v2 server layout consumes `event.locals.supabase`, initialized for every request by `src/hooks.server.ts` using `createSupabaseServerClient` from `src/lib/server/supabase.ts`. The existing `App.Locals` types in `src/app.d.ts` apply to v2 too. No second client factory, browser client, environment configuration, or backend is introduced.

The existing factory uses `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` and the existing SSR cookie getAll/setAll adapter. Keep the existing Supabase project `wikqtjvlmgdmixgrntij`; do not put credentials or environment values in layout data. The only returned field, `supabaseClientReady`, means the request client exists locally. It does not prove network connectivity, valid credentials, an authenticated user, or database access. No live readiness request is made.

Future server loads/actions can use the same `locals.supabase` where appropriate; business database queries must continue through `src/lib/server/db/queries.ts`. Do not return the client or session to the browser. Phase 2 does not call `locals.getUser()`, add redirects/session gating, load dashboard business data, or change the static presentation. Login/auth parity belongs to Phase 3. Schema, migrations, storage and v1 behavior are unchanged.


## Phase 3 — CMS auth parity implemented

Phase 3 reuses existing Supabase Auth, `@supabase/ssr`, `locals.getUser()` and the per-request `event.locals.supabase` client. It introduces no new auth tables or separate auth system. The existing v1 auth guard remains unchanged.

- `/admin-v2/login` is public (the exact login path is exempt from the v2 guard). An already authenticated visitor is redirected to `/admin-v2`; successful email/password login also redirects there.
- `/admin-v2` and `/admin-v2/*` are protected except for the exact `/admin-v2/login` path. The shared server hook checks `locals.getUser()` and redirects unauthenticated requests to `/admin-v2/login`.
- Logout uses a form POST to `/admin-v2/logout`, calls the existing Supabase Auth `signOut()`, and redirects to `/admin-v2/login` on success. There is no GET logout handler; a returned sign-out error produces a generic 503 response.
- The login page bypasses the v2 sidebar/header. Login validation and service errors use non-sensitive messages; passwords, clients and sessions are not returned in page data.

`supabaseClientReady` remains only a server-client readiness boolean: it indicates that the request-local client exists. It is not proof of network connectivity, successful authentication, valid credentials or database access, and performs no live readiness request. Auth protection is handled separately by the guard and `locals.getUser()`.

Phase 3 adds no business queries, CRUD, database migrations, storage changes or dependency changes. The dashboard remains a blank landing panel; auth parity does not imply that business CMS features are implemented.

### Verification status

The prior review reported source review and mock checks PASS, with unauthenticated and invalid-login flows verified. This documentation update does not rerun those checks. Full real authenticated login/logout E2E is still outstanding and must not be claimed PASS; mock checks do not establish a successful real-user login/session/logout cycle.

## Phase 4 — Sales Dashboard static preview revised

Phase 4 supersedes the historical blank-dashboard descriptions above. The Phase 4 reference has changed from the default eCommerce TailAdmin dashboard at pinned free-template commit `44ac4719ef1762907c84c4df459842de9eea70b0` to the **live Sales Dashboard TailAdmin demo**, https://demo.tailadmin.com/sales, visually inspected on 2026-09-07. The live demo is not claimed to be part of that pinned commit; the existing pin/license continues to document the earlier shell foundation.

The page adapts the observed Sales composition: a Sales Dashboard heading and four KPI cards within one bordered overview panel, small illustrative sparklines, a full-width Users & Revenue Statistics two-series area chart, a three-column row with User Retention triangular heatmap, Sales by Channel segmented bar/table, and Sales by Country list, followed by a Top Products-style six-column table with five dummy rows. The geographic map is omitted; fictional country names, initial medallions and literal indicator bars replace real country/flag content. Product thumbnails use authored generic inline SVG boxes. Filter, Export, View More, Delete, See All, date pickers and chart period controls are omitted; the period text is a plain static label.

All content remains **static/view-only**. Values, names, periods, percentages, status labels and chart geometry are literal dummy examples, explicitly labeled as sample data rather than Precious business data. Charts are illustrative SVG, not calculated series or live metrics. No page script/state, runtime calculation, random/dynamic date, query/fetch, new load/action/backend file, real business data, Alpine/ApexCharts/jsVectorMap, dependency/package change, or global theme import is introduced.

Only `src/routes/admin-v2/+page.svelte` and this document are edited. Existing shell, Outfit, Precious logo and theme tokens are reused. Pure-black card surfaces and scoped local CSS preserve the requested visual direction. Four KPI columns and three insight columns reduce at narrower breakpoints; fluid SVGs and zero-minimum grid columns fit the available content width. The product table has a keyboard-focusable local horizontal scroll region on narrow screens. SVG titles/descriptions, captions, semantic table headers and explicit dummy labels are provided.

### Revision verification

Visual inspection of the live reference is complete. Local dashboard visual browser QA at desktop/tablet/mobile widths, horizontal overflow and sidebar collapse remains **outstanding**; responsive CSS alone does not establish a visual QA PASS. Check/build results are reported separately after verification.

Phase 3 full real authenticated login/session/logout E2E remains **outstanding**. Phase 4 static rendering or check/build results do not establish an authenticated E2E PASS.

## Phase 5 — Team finalized

Implementation checkpoint: `f6785299e0b29f0698d600d53c80a612ff14fa5c` (`feat(admin-v2): checkpoint team management (WIP)`). Team code is already committed in that checkpoint; this finalization changes only this document.

Phase 5 provides `/admin-v2/team`, `/admin-v2/team/new` and `/admin-v2/team/[id]`, a shared v2 Team form, and Team-aware sidebar navigation. It reuses the existing `parseTeamForm` / `uploadTeamImage` helpers and database query layer, with Team create/update/delete helpers added to `src/lib/server/db/queries.ts`. Clients and Projects remain placeholders; the Sales Dashboard remains static sample content. This is not completion of the broader CMS.

### Preserved baseline semantics

- Admin lists active and inactive members ordered by `sortOrder` ascending, without pagination or filtering. Hierarchy values remain `board`, `management`, and `staff`; admin data uses camelCase.
- Name and title are required; Board description is required. Empty description/email/LinkedIn values become null on database write. Email uses the existing simple regex; LinkedIn accepts HTTP/HTTPS URLs without restricting the domain. Display order uses `parseInt` with a nonnegative integer check; active is true when the submitted checkbox value is `on`.
- Portrait is required unless `currentImage` is supplied. Existing behavior trusts that submitted value. Uploads use the `team` bucket, JPEG/PNG/WebP MIME types, a maximum of 1 MiB (1,048,576 bytes), `portraits/UUID.ext`, `upsert: false`, and a stored public URL. The 4:5 ratio remains a recommendation.
- Replacing a portrait or deleting a member does not remove the old storage object. Delete removes only the database row. Upload happens before the database write, with no orphan cleanup if the write fails. These are preserved baseline limitations, not new guarantees or fixes.
- Public About shows only active members, grouped Board → Management → Staff with display order within each group; Board descriptions and existing settings/company LinkedIn contact fallbacks are retained.

### Finalization evidence

Ray confirmed the following in the continuation of **Melvin 2** on 2026-09-07:

- Browser read-only QA: **PASS**, reported by Ray.
- Runtime CRUD/upload: **PASS**, reported by Ray.
- Public About active/inactive visibility and hierarchy effect: **PASS**, reported by Ray.

These are Ray-reported category-level results, not browser tests rerun by this documentation task. No additional per-case outcomes, browser versions, viewport measurements, or error-path coverage are inferred.

Phase 3 full real authenticated login/session/logout E2E remains **outstanding**. Team QA does not explicitly establish that complete auth cycle. Phase 4 dashboard visual QA is not reclassified by the Team evidence.

Finalization validation on 2026-09-07: `npm run check` **PASS** (0 errors, 0 warnings); `npm run build` **PASS** using `@sveltejs/adapter-node`, with a Node `DEP0205` deprecation warning for `module.register()`; `git diff --check` **PASS**. Check/build ran against the current local working tree, which includes unrelated uncommitted work, not an isolated checkout of the WIP commit. No Team source changes were needed for validation. No deployment or migration was performed.

## Phase 6 — Clients finalized

Phase 6 implements `/admin-v2/clients`, `/admin-v2/clients/new` and `/admin-v2/clients/[id]`, with a shared v2 Client form and Clients href/active-state sidebar integration. Scope includes listing/search, project counts, create/edit forms for company, director and PIC details, and delete with confirmation and backend-result feedback. The routes reuse the existing local database query layer and `companyTypes` / `parseClientForm` helper. This supersedes the earlier Clients-placeholder notes; Projects remains a placeholder.

Strict parity search covers only `companyName`, `directorName`, `directorEmail`, `picName` and `picEmail`. Phone numbers and address are intentionally not searchable under the v1 parity baseline. Ray reported that phone search returned no results; this is accepted baseline behavior, not a bug, and no search enhancement is included.

### Finalization evidence

Ray reported all browser/runtime checklist items PASS, with the phone-search observation resolved as baseline behavior above. Phase 6 status is **IMPLEMENTED + STATIC PASS + BROWSER/RUNTIME QA PASS**. Browser/runtime evidence is Ray-reported, not rerun by this finalization task. No additional per-case results, viewport/browser coverage or error-path coverage are inferred.

Source inspection confirmed the seven new v2 Client files are within Phase 6 scope and the layout diff contains only Clients navigation/active-state changes. Finalization validation on 2026-09-07: `npm run check` **PASS** (0 errors, 0 warnings); `npm run build` **PASS** using `@sveltejs/adapter-node`, with Node `DEP0205` deprecation warning for `module.register()`; `git diff --check` **PASS**.

Validation ran against the current local working tree, including unrelated uncommitted backend work, not an isolated checkout of this commit. The v2 Clients routes depend on local `src/lib/server/db/queries.ts`, `src/lib/server/db/schema.ts` and `src/lib/server/client-cms.ts`; those backend changes are explicitly excluded from this finalization commit. These results do not establish that this commit builds independently without those local dependencies. Only this document was edited during finalization; existing Phase 6 implementation files are included unchanged. No deployment, migration or new runtime mutation was performed.

Phase 3 full real authenticated login/session/logout E2E remains **outstanding**. Clients QA does not establish that complete auth cycle. Phase 4 dashboard visual QA is not reclassified by the Clients evidence.
