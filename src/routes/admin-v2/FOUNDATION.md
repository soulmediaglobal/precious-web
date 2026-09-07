# Admin v2 — Phase 1 foundation

Official source: https://github.com/TailAdmin/tailadmin-free-tailwind-dashboard-template
Pinned source commit: 44ac4719ef1762907c84c4df459842de9eea70b0 (MIT; license alongside this file).

Adapted from src/partials/sidebar.html, src/partials/header.html, src/blank.html and src/css/style.css. Retains official 290px/90px sidebar, 1024px navigation breakpoint, header/menu geometry, dark gray/brand tokens and blank panel. SVG path data extracted from official sidebar/header. Alpine directives replaced by Svelte 5 runes; SvelteKit owns navigation. No Alpine, Webpack, Flowbite or new dependencies used by v2. Scoped CSS expresses the relevant official dark utility styles without importing TailAdmin's global reset/theme into v1. Existing Precious Montserrat and logo-white.svg retained; no TailAdmin demo branding or profile data.

Dashboard is a blank landing panel. Clients, Projects and Team use local hash placeholders, with no business routes/loaders. Mobile drawer supports Escape, focus trapping, backdrop dismissal and focus restoration. Desktop supports collapse; small header menu supports show/hide.

Ray explicitly approved the shared hook matcher correction: /admin and /admin/* remain protected; /admin-v2 is an unauthenticated static shell in Phase 1. Do not add data or deploy as a functional CMS before later auth work. Route /admin-v2 and this approved hook boundary need Nurey canonical documentation sync; canonical files were not edited here.

## Ray visual adjustments

Ray requested pure black backgrounds, a sidebar one-third narrower (290px → 193.333px), colored existing logo.svg one-third smaller (118px → 78.667px; proportional mobile/collapsed sizes), and typography matching https://demo.tailadmin.com/. Demo computed styles verified: Outfit, menu 14px/20px with 8px 12px padding and 12px gap; group headings 12px/20px. Outfit is loaded only by the v2 layout and applied only to .ta-shell. This supersedes the initial Montserrat/white-logo appearance noted above.
