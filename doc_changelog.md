# Precious CMS — Changelog

Terakhir diperbarui: 2026-09-06T00:45:11+07:00 (Asia/Jakarta).

Versi dokumentasi: **1.1.0** (SemVer dokumentasi, terpisah dari versi rilis CMS).

## Governance wajib

AI mana pun yang mengakses, menganalisis, atau mengerjakan project Precious wajib membaca `doc_changelog.md` dan `development_rules.md` terlebih dahulu. Role registry dan batas tanggung jawab canonical ditetapkan di `development_rules.md`.

Nurey **bukan gate untuk detail implementasi minor/lokal**: spacing, typo, responsive fix, atau small bug fix yang tidak mengubah convention tidak memerlukan governance sync.

**Governance sync wajib** untuk perubahan architecture; cross-feature DB/entity model; workflow/lifecycle; status convention; numbering convention; permission model; stack; repo/development convention; atau reusable mechanism lintas modul. Bila perubahan wajib governance muncul, AI harus sinkron ke **Nurey**; jangan langsung menetapkannya sebagai canonical. **Ray** adalah pengambil keputusan akhir, dan **Nurey** memperbarui dokumentasi canonical setelah persetujuan/instruksi Ray.

## Riwayat

Entry terbaru di atas, gunakan timestamp dengan zona waktu dan bukti verifikasi. Jangan mengarang versi atau histori rilis. Gunakan SemVer terpisah untuk dokumentasi dan rilis CMS; revisi dokumentasi bukan rilis aplikasi. Versi dokumentasi 1.0.0 memulai penomoran eksplisit; baseline sebelumnya tetap tanpa versi, dan versi rilis CMS tidak diubah atau diasumsikan.

### Dokumentasi 1.1.0 — 2026-09-06T00:45:11+07:00 (Asia/Jakarta) — Full snapshot Create Revision RAB

- Sesuai persetujuan dan instruksi Ray, menetapkan keputusan canonical bahwa `Create Revision` RAB wajib menghasilkan full snapshot dari source revision: sections, groups, subgroups, items beserta relationship-nya, stages, payment terms beserta relationship-nya, totals/tax, offer date, greeting, bank account/signatory data, dan seluruh data lain yang menentukan dokumen.
- Revision baru harus identik dengan source sebelum diedit dalam seluruh data penentu dokumen. Semua relation hasil clone harus menunjuk entity baru dalam revision baru, bukan entity source; struktur relationship dipertahankan melalui pemetaan entity hasil clone.
- Rule ditambahkan pada bagian mekanisme dan workflow RAB di `development_rules.md`. Versi minor dokumentasi naik menjadi 1.1.0 karena penambahan rule canonical; versi rilis CMS tidak berubah.
- Scope hanya dua dokumen canonical. Keputusan ini sudah canonical, bukan bukti bahwa implementation telah sesuai; implementation, stack, backlog lain, dan audit state tidak diubah. Inspeksi Git dilakukan pada branch `main` dengan remote `origin` repo Precious; perubahan lokal tak terkait dipertahankan di luar commit dokumentasi. Tidak dilakukan build, migration, deployment, atau audit fungsional.

### Dokumentasi 1.0.0 — 2026-09-06T00:26:34+07:00 (Asia/Jakarta) — Role registry dan batas governance

- Sesuai instruksi Ray, menetapkan role boundaries canonical: Ray=DECIDE (Final Decision Maker/Product Owner); Melvin=PRODUCT (WHAT/WHY/PRIORITY/EXPECTED BEHAVIOR, scope, roadmap, requirement, workflow produk, acceptance criteria, arahan fitur, task Dev AI); Nurey=CANONICAL (sinkronisasi dua dokumen, keputusan approved Ray, histori/state, dan drift; bukan PM kedua); Dev AI=IMPLEMENT (inspection, coding, migration, testing/build, evidence); Varek=VERIFY (independent audit).
- Menetapkan working model `Ray → Melvin → Dev AI → Varek → Ray/Nurey`. Melvin tidak mengambil alih canonical documentation atau independent audit.
- Menetapkan mode Varek `inspect → compare → verify → report`, membandingkan implementation dengan requirements/AC Melvin dan canonical docs Nurey, memverifikasi klaim build/migration/feature/QA dari evidence, serta memeriksa regression, data integrity, migration risk, permission/security gap, architectural drift, dan technical debt yang materially relevant. Default tanpa perubahan code, migration, workflow, atau canonical docs.
- Memperjelas Nurey bukan gate detail minor/lokal (spacing, typo, responsive fix, small bug fix tanpa perubahan convention). Sync wajib untuk architecture, cross-feature DB/entity model, workflow/lifecycle, status/numbering convention, permission model, stack, repo/development convention, dan reusable mechanism lintas modul.
- Tetap wajib membaca kedua dokumen sebelum mengakses/mengerjakan Precious. Perubahan governance wajib disinkronkan ke Nurey; Nurey memperbarui canonical docs setelah approval/instruksi Ray.
- Scope hanya dokumentasi governance/role registry; stack, baseline implementation state, dan versi rilis CMS tidak berubah. Branch saat inspeksi `main`, remote `origin` repo Precious; perubahan lokal tak terkait dipertahankan di luar commit dokumentasi. Tidak dilakukan audit fungsional, build, migration, atau deployment.

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
