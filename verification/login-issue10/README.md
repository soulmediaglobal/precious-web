# Issue #10 — Precious brand login

Scope: `/admin-v2/login` visual redesign only. Stop after selective staging; no commit, push, PR, merge, deploy, DB/schema/migration changes, or live data writes. RAB remains PARKED.

## Implementation
- Desktop/tablet 50:50 full-height split; mobile stacks a 260px brand header and form.
- Reuses `/home-image-1.webp`, `/logo.svg`, `/mask-6.webp` from the public homepage.
- Homepage Montserrat font (already loaded by root CSS), #e0b126 yellow, #060606 panel, #0d172d navy and rgba(5,12,28) overlay. White text and existing neutral colors; existing error colors retained.
- Scoped page CSS follows existing login styling convention. No library/dependency or shared CSS changes.
- Existing POST/default action, email/password names, required fields, autocomplete, enhance callback, pending/disabled behavior and client-side password toggle retained. Error remains role=alert and is now associated with both fields.

## Evidence
- `checks.json`: check/build/diff results, Firefox measurements, actual HTTP checks, and isolated unchanged-auth source checks.
- `responsive-qa.md`: viewport summary and screenshots.
- `preservation.json`: SHA-256 before/after for all 36 unrelated WIP files and auth/layout sources; comparison of all 316 tracked files.
- `final-state.json` and `staged-files.txt`: exact final Git state and selective staging.

Successful authenticated login/redirect and authenticated live logout E2E remain PENDING because no safe test account/session was supplied. Mocked auth source checks are explicitly not E2E. No credentials are stored in evidence.
