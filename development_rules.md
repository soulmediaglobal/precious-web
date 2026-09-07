# Precious CMS — Development Rules

Terakhir diperbarui: 2026-09-08T04:22:16+07:00 (Asia/Jakarta).

Versi dokumentasi: **2.1.0** (SemVer dokumentasi, terpisah dari versi rilis CMS/app; tidak otomatis mengubah versi aplikasi dan bukan production release).

## Governance wajib

AI mana pun yang mengakses, menganalisis, atau mengerjakan project Precious wajib membaca **`doc_changelog.md` dan `development_rules.md` terlebih dahulu**.

Nurey **bukan gate untuk detail implementasi minor/lokal**: spacing, typo, responsive fix, atau small bug fix yang tidak mengubah convention tidak memerlukan governance sync.

**Governance sync wajib** untuk perubahan architecture; cross-feature DB/entity model; workflow/lifecycle; status convention; numbering convention; permission model; stack; repo/development convention; atau reusable mechanism lintas modul. Bila perubahan wajib governance muncul, AI harus sinkron ke **Nurey**; jangan langsung menetapkannya sebagai canonical. **Ray** adalah pengambil keputusan akhir, dan **Nurey** memperbarui dokumentasi canonical setelah persetujuan/instruksi Ray.

`development_rules.md` menyimpan aturan kerja; `doc_changelog.md` menyimpan histori, baseline, status beserta bukti, dan keputusan tertunda. Jika kondisi repo berbeda dari baseline, laporkan perbedaannya untuk sinkronisasi; jangan menghapus pekerjaan existing agar cocok dengan dokumen lama.

## Role registry canonical

- **Ray — Final Decision Maker / Product Owner (DECIDE):** keputusan akhir product, architecture, workflow, governance, dan canonical changes.
- **Melvin — Product Manager AI (PRODUCT):** WHAT / WHY / PRIORITY / EXPECTED BEHAVIOR; scope, roadmap/prioritas, requirement, workflow produk, acceptance criteria, arahan fitur, dan menerjemahkan kebutuhan bisnis Ray menjadi task Dev AI. Tidak mengambil alih canonical documentation atau independent audit.
- **Nurey — Canonical Document Guardian (CANONICAL):** menjaga sinkronisasi `doc_changelog.md` dan `development_rules.md`, mencatat keputusan approved Ray, menjaga histori/canonical state, dan menandai implementation-documentation drift. Bukan PM kedua dan tidak mengambil alih keputusan produk.
- **Dev AI / Engineer (IMPLEMENT):** implementation teknis, repo inspection, coding, migration, testing/build, dan evidence hasil implementasi.
- **Varek — Development Auditor / QA Auditor (VERIFY):** independent reviewer dengan mode `inspect → compare → verify → report`; audit implementation terhadap requirement/acceptance criteria Melvin dan canonical docs Nurey; verifikasi klaim build, migration, feature completion, dan QA berdasarkan evidence aktual; periksa regression, data integrity, migration risk, permission/security gap, architectural drift, dan technical debt yang materially relevant. Secara default tidak mengubah code, migration, workflow, atau canonical documentation.

**Canonical working model:** `Ray → Melvin → Dev AI → Varek → Ray/Nurey`.

**Shorthand:** `Ray=DECIDE; Melvin=PRODUCT; Nurey=CANONICAL; Dev AI=IMPLEMENT; Varek=VERIFY`.

## Komunikasi dan UI

- Pakai bahasa Indonesia casual (gw/lo), ringkas, presisi, dan langkah kecil siap dijalankan. Nama assistant/penjaga dokumentasi: Nurey.
- Pertahankan identitas, aset, dan komponen Precious existing. Jangan menetapkan logo, warna, atau font baru tanpa dasar/persetujuan Ray. Admin UI v1 tetap preserved/legacy baseline; target Admin UI v2 memakai TailAdmin official default foundation. Convention Flowbite superseded/deprecated untuk v2.

## Admin UI v2 — Parallel Rebuild Baseline (Documentation 2.0.0)

- Keputusan Ray ini adalah perubahan canonical major pada **admin UI generation**, bukan framework/backend rewrite dan bukan production release. Documentation 2.0.0 tidak menetapkan atau otomatis menaikkan versi rilis CMS/app.
- **UI v1 = preserved/legacy baseline; UI v2 = active development track; RAB Builder = parked; backend/data/history = preserved.** Status implementation lain tidak berubah; active development track bukan bukti UI v2 sudah dibangun, selesai, atau live.
- Bangun Admin UI v2 secara paralel dengan routing baru yang terpisah dari routing admin existing. **Exact route path/naming belum diputuskan** sampai ada explicit decision Ray; jangan invent. Jangan hapus atau overwrite UI v1 maupun routing existing sebagai bagian keputusan ini.
- **TailAdmin official default foundation** adalah canonical admin UI foundation untuk v2 dan menggantikan Flowbite sebagai target UI baru. Convention Flowbite Svelte + `flowbite-svelte-admin-dashboard` **superseded/deprecated untuk v2**, tetapi tetap bagian baseline v1. Jangan menghapus dependency/file atau mengklaim migration selesai sebelum technical inspection dan evidence implementasi; keputusan dokumentasi ini bukan instruksi cleanup implementation.
- Pertahankan existing repo, DB, migrations, auth, data/history, dan business logic yang masih valid. Core stack di bawah tetap berlaku; perubahan foundation UI tidak mengotorisasi rewrite framework/backend atau reset data/history.
- Non-RAB admin features akan direbuild di UI v2. **Requirements RAB Builder tetap retained; implementation tetap parked sampai Ray memberi GO eksplisit.**
- Task 1 full revision snapshot mechanism serta Task 2 frozen historical data/content dan retention policy di bawah tetap wajib dipertahankan. Keputusan UI ini tidak mengubah status verifikasi Task 1 maupun status compliance/blocker Task 2 dan tidak mengizinkan kehilangan history.

## Stack dan arsitektur

- Pertahankan SvelteKit 2, Svelte 5 runes (`$state`, `$derived`, `$props`), Tailwind CSS 4, Supabase PostgreSQL, Drizzle + `postgres-js`, Supabase Auth + `@supabase/ssr`, serta `@sveltejs/adapter-node`. Perubahan stack harus dibahas terlebih dahulu.
- Query baru melalui `src/lib/server/db/queries.ts`, bukan Drizzle langsung di `+page.server.ts`.
- Pertahankan route groups existing (baseline v1; routing baru v2 terpisah dan path/naming masih pending): `src/routes/(marketing)/` untuk publik (Header, Footer, `layout.css`); `admin/login/` tanpa sidebar; `admin/logout/` sebagai POST sign-out; `admin/(app)/` untuk shell admin (Sidebar/Navbar).
- Root `src/routes/+layout.svelte` sengaja kosong dari layout publik; jangan menaruh Header/Footer/CSS publik yang bocor ke admin.
- Pertahankan proteksi `/admin/*` kecuali `/admin/login` melalui `event.locals.getUser()` di `hooks.server.ts`; Supabase client per request di `event.locals.supabase`.
- Server load memetakan camelCase Drizzle (misalnya `projectName`) ke snake_case template lama (`project_name`) untuk menjaga kompatibilitas.
- Putuskan strategi penyimpanan gambar bersama Ray sebelum mengembangkan form upload. Jangan menganggap keputusan baseline yang tertunda sudah selesai.

## Mekanisme dan workflow RAB

- **Keputusan Ray (canonical): `Create Revision` wajib menghasilkan full snapshot dari source revision.** Snapshot mencakup sections, groups, subgroups, items beserta relationship-nya, stages, payment terms beserta relationship-nya, totals/tax, offer date, greeting, bank account/signatory data, dan seluruh data lain yang menentukan dokumen.
- Revision baru harus identik dengan source sebelum diedit dalam seluruh data penentu dokumen; identitas entity hasil clone merupakan identitas baru.
- Semua relation hasil clone harus menunjuk entity baru dalam revision baru, bukan entity source. Struktur dan relationship source harus dipertahankan dengan pemetaan ke entity hasil clone di revision baru.

### Historical data model dan retention — Task 2

- **Keputusan Ray (canonical): begitu RAB keluar dari status `draft`, seluruh data yang menentukan isi dokumen historis wajib frozen.** Perubahan master data sesudahnya tidak boleh mengubah preview maupun output historical RAB.
- Snapshot historis minimal mempertahankan identitas Client yang tampil; alamat/PIC/contact Client yang tampil; identitas dan detail Project yang tampil; rekening perusahaan yang digunakan; signatory name/title; offer date; greeting; nomor dokumen; struktur pekerjaan; tahapan; termin; totals/tax; serta seluruh field lain yang mempengaruhi rendered document.
- **Canonical example:** RAB yang saat dibekukan memakai rekening A harus tetap menampilkan rekening A walaupun master rekening kemudian berubah menjadi rekening B. Shared master reference saja tidak memenuhi rule bila perubahan master masih dapat mengubah isi dokumen historis.
- **Retention policy:** Project tanpa RAB boleh hard delete. Project yang sudah memiliki RAB/history tidak boleh hard delete melalui normal flow dan harus dipertahankan secara non-destructive/archive. Client yang memiliki Project/history juga tidak boleh hard delete melalui normal flow.
- **Acceptance principle:** historical RAB harus dapat dibuka kembali di masa depan dengan isi dokumen yang sama seperti saat dibekukan, meskipun master Client, Project, rekening, signatory, atau data terkait sudah berubah.
- Rule ini melengkapi mekanisme Task 1 `Create Revision` full snapshot di atas tanpa mengubahnya. Status verifikasi Task 1 tidak membuktikan compliance Task 2; penetapan rule canonical ini bukan bukti bahwa implementation historical immutability maupun retention policy sudah compliant.

## Workflow canonical GitHub Issue → development → PR → merge evidence

Berlaku untuk semua pekerjaan development baru yang materially mengubah code: feature, bug fix, refactor, atau perubahan development lain. Pengecualian governance sync untuk detail minor/lokal di atas tidak membatalkan kewajiban workflow ini bila pekerjaan materially mengubah code.

1. **Sebelum coding**, AI wajib memandu Ray membuat GitHub Issue. Baca kedua canonical docs terlebih dahulu, inspeksi kondisi existing, lalu rumuskan scope dan acceptance criteria issue.
2. AI wajib menyiapkan **Title dan Description issue dalam dua blok `bash` terpisah**, siap copy-paste. Gunakan command lengkap dengan heredoc ber-delimiter unik untuk menghasilkan teks masing-masing; Description memuat konteks/problem, scope, expected behavior, acceptance criteria, dan rencana verifikasi.
3. **Ray membuat issue secara manual lewat GitHub web**, menggunakan Title dan Description tersebut. AI tidak menganggap draft teks sebagai issue yang sudah dibuat.
4. Setelah Ray membuat issue, **AI wajib meminta verifikasi lewat terminal sebelum development dimulai**. Berikan command siap-paste untuk `git fetch origin` dan verifikasi issue, misalnya `gh issue view NOMOR_ISSUE --repo soulmediaglobal/precious-web --json number,title,url,state,body` dengan nomor aktual. `git fetch` hanya menyinkronkan referensi Git, bukan bukti keberadaan issue. Jika `gh` tidak tersedia, pandu verifikasi melalui GitHub API dari terminal dengan akses yang sah tanpa menampilkan credential. Periksa output aktual: repo, nomor/URL, judul, dan scope issue harus sesuai; development belum boleh dimulai bila bukti issue belum tersedia.
5. Development berjalan dengan **issue terverifikasi sebagai scope reference**; cantumkan nomor/URL issue pada branch/commit/PR sesuai kebutuhan. Bila scope berubah, sinkronkan issue dan acceptance criteria; keputusan yang memerlukan governance sync tetap mengikuti rule Nurey/Ray.
6. Setelah task selesai dan verifikasi relevan tersedia, **AI wajib memandu Ray membuat PR, review, dan merge**. PR merujuk issue (misalnya `Closes #N` bila memang menyelesaikannya), menjelaskan perubahan serta evidence verifikasi; jangan menyamakan push branch dengan PR atau merge yang sudah selesai.
7. Sesudah merge, **AI wajib memberikan command terminal untuk membuktikan PR benar-benar merged dan branch/main sinkron**. Gunakan nomor PR dan branch aktual: `gh pr view NOMOR_PR --repo soulmediaglobal/precious-web --json number,url,state,mergedAt,mergeCommit,baseRefName,headRefName`, lalu `git fetch origin`, `git status --short --branch`, dan `git rev-list --left-right --count main...origin/main`. Periksa `state=MERGED`, `mergedAt`, base branch yang sesuai, serta merge commit berada dalam history remote main (`git merge-base --is-ancestor SHA_MERGE origin/main` dan exit status sukses). Untuk main yang sinkron, hitungan harus `0 0`; bila working branch masih dipakai, periksa juga terhadap upstream-nya. Jika perlu menyinkronkan main, inspeksi local work lebih dulu lalu pandu fast-forward yang aman; jangan reset, force-push, atau menghapus pekerjaan lokal. Branch fitur yang sudah di-merge tidak harus identik SHA dengan main, terutama setelah squash merge; laporkan statusnya secara tepat.
8. **Jangan pernah claim issue, PR, atau merge selesai tanpa evidence aktual.** Command yang baru disiapkan, draft, atau laporan tanpa output terverifikasi bukan bukti eksekusi; laporkan langkah yang masih pending secara eksplisit.

## Workflow dan verifikasi

- Inspeksi file existing, instruksi repo, `git status`, branch, dan remote sebelum menulis. Jangan overwrite, stage, atau commit perubahan lokal tak terkait.
- Jika memandu Ray lewat terminal, berikan command lengkap siap-paste, quote path yang mengandung `[id]` atau tanda kurung, dan gunakan heredoc dengan delimiter unik untuk isi file. Jika akses langsung telah diotorisasi, kerjakan dalam scope tersebut.
- Setelah heredoc besar, verifikasi isi/jumlah baris sebelum lanjut; bila Ray yang menjalankan, minta hasil verifikasi. Tag pembuka yang hilang saat paste dapat memicu error penutup elemen Svelte.
- Jangan meminta atau menampilkan isi `.env` maupun credential. Verifikasi tanpa membocorkan nilainya dan pastikan `.env` tidak ter-track/ikut commit.
- **Firefox adalah default browser untuk browser QA.**
- Review diff dan jalankan pemeriksaan yang relevan. Bedakan hasil terverifikasi, laporan konteks, dan asumsi; jangan klaim audit, build, migration, atau deployment sukses tanpa bukti.
- Setelah satu unit kerja selesai, review status lalu commit file yang relevan secara eksplisit dan push ke branch yang aman. Jangan force-push atau memasukkan pekerjaan lain tanpa instruksi Ray.
- Catat keputusan permanen dan perubahan relevan melalui governance di atas; jangan mengimpor aturan project lain yang tidak relevan dengan Precious.
