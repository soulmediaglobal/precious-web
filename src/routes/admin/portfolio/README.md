# Portfolio CMS v2 MVP

Header is explicitly slot 0; content occupies slots 1–10. Empty content slots are compacted on save. Legacy URLs are retained verbatim. Edit replaces image rows transactionally with the retained/new URLs; Portfolio deletion uses existing FK cascades and does not delete Expertise records.

## Storage setup before upload QA

No bucket or database changes were applied. Bucket existence and policies have not been verified live.

- Supabase bucket ID/name: `portfolio`, public.
- Per-file size limit: `1048576` bytes.
- Allowed MIME types: `image/jpeg`, `image/png`, `image/gif`.
- Permit INSERT on `storage.objects` for the same authorized admin audience used by the existing Team upload policy, constrained to `bucket_id = 'portfolio'`. Do not grant anonymous upload. Runtime uses the signed-in Supabase client, with unique `images/<uuid>.<extension>` paths and no overwrite.
- Public bucket permits public image delivery. No UPDATE/DELETE object policy is needed by this MVP.
- Node adapter deployment must allow multipart requests for 11 files: set `BODY_SIZE_LIMIT=12582912` (12 MiB) in the server process environment and an equivalent or larger reverse-proxy request limit. Adapter default is too small. No environment files were modified.

## MVP limitations

Storage objects are not automatically deleted on replacement, removal, Portfolio deletion, partial upload failure, or DB save failure. Such objects may become orphans and require a later cleanup process. Files must be reselected after validation/save failure; retained URLs and text values are returned. Editing a slug changes the public URL without redirects. Concurrent editors use last-save-wins behavior. Legacy entries above 11 images are blocked from saving rather than silently truncated.

## Pending explicit live QA

With an authorized session and bucket configured, create an entry with one header, edit all fields, add up to ten content images, replace/remove content, and verify public detail at 1/2/11 total images. Check duplicate slug, unsupported format, and >1 MiB rejection. Confirm static URLs survive a text-only edit. Delete only a designated QA entry and verify cascading image/junction removal. No live CRUD or migration has been run by this implementation task.
