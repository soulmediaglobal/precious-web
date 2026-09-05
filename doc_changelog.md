# Precious CMS — Changelog

Terakhir diperbarui: 2026-09-06T00:11:36+07:00 (Asia/Jakarta).

## Governance wajib

AI mana pun yang mengakses atau mengerjakan project Precious wajib membaca `doc_changelog.md` dan `development_rules.md` terlebih dahulu. Bila menemukan atau mengusulkan perubahan mekanisme, arsitektur, workflow, stack, convention, atau keputusan lintas fitur, AI wajib sinkron ke **Nurey** terlebih dahulu. Perubahan tidak otomatis menjadi aturan canonical; Nurey memperbarui dokumentasi setelah instruksi/persetujuan **Ray**.

## Riwayat

Entry terbaru di atas, gunakan timestamp dengan zona waktu dan bukti verifikasi. Jangan mengarang versi atau histori rilis. Gunakan SemVer untuk rilis CMS; revisi dokumentasi bukan rilis aplikasi.

### 2026-09-06T00:11:36+07:00 — Baseline dokumentasi dan governance

- Menambahkan dua dokumen root untuk baseline Precious CMS, aturan development, dan sinkronisasi dokumentasi melalui Nurey.
- Inspeksi terbatas: kedua file belum ada; branch aktif `main`; remote `origin` menunjuk `https://github.com/soulmediaglobal/precious-web.git`; ada perubahan lokal lain yang tidak termasuk scope dokumentasi.
- Histori commit `7eb4334` berjudul “Complete Team CMS and optimize About page”. Judul commit ini bukan bukti audit fungsional.
- Baseline di bawah berasal dari konteks Ray. Implementasi fitur, database live, deployment, dan keberhasilan build/migration belum diaudit dalam pekerjaan dokumentasi ini.

## Baseline Precious

- Website: https://preciouscontractor.co.id — kontraktor struktural dan sipil B2B di Indonesia.
- Repo: https://github.com/soulmediaglobal/precious-web.git; lokal: `/Users/mymac/Documents/Precious/pc`.
- Framework: SvelteKit 2 + Svelte 5 runes; Tailwind CSS 4.
- Admin UI: Flowbite Svelte + `flowbite-svelte-admin-dashboard`.
- Data: Supabase PostgreSQL (project `wikqtjvlmgdmixgrntij`), Drizzle ORM + `postgres-js`.
- Auth: Supabase Auth email/password + `@supabase/ssr`; runtime Node.js melalui `@sveltejs/adapter-node`.
- Tujuh tabel baseline: `portfolio`, `portfolio_images`, `expertise`, `expertise_images`, `expertise_portfolio` (many-to-many), `team`, `settings` (key-value). Ini bukan inventaris skema terkini.
- Query layer: `src/lib/server/db/queries.ts`; route groups, auth, dan mapping data dijelaskan di `development_rules.md`.

## Status dari konteks awal — perlu verifikasi sebelum development

Dilaporkan selesai: auth, database, migrasi konten publik ke Supabase, dan shell dashboard admin.

Urutan backlog awal: dashboard KPI portfolio/expertise/team; Portfolio CRUD dan gambar; Expertise CRUD beserta relasi portfolio; Team CRUD; settings email/telepon. Jangan menganggap daftar ini status terbaru: histori Team CMS dan perubahan lokal menunjukkan pekerjaan telah berkembang.

Keputusan tertunda dari baseline: Supabase Storage vs upload manual ke `static/`. Konfirmasi keputusan terkini ke Ray sebelum membuat form upload gambar, lalu sinkronkan dokumentasinya melalui Nurey.
