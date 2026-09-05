# Precious CMS — Development Rules

Terakhir diperbarui: 2026-09-06T00:11:36+07:00 (Asia/Jakarta).

## Governance wajib

AI mana pun yang mengakses, menganalisis, atau mengerjakan project Precious wajib membaca **`doc_changelog.md` dan `development_rules.md` terlebih dahulu**.

Bila menemukan, membutuhkan, atau mengusulkan perubahan mekanisme, arsitektur, workflow, stack, convention, atau keputusan lintas fitur, AI wajib **sinkron ke Nurey terlebih dahulu**. Jangan langsung menetapkan perubahan sebagai canonical. **Ray** adalah pengambil keputusan akhir; **Nurey** memperbarui kedua dokumen sesuai perubahan setelah instruksi/persetujuan Ray.

`development_rules.md` menyimpan aturan kerja; `doc_changelog.md` menyimpan histori, baseline, status beserta bukti, dan keputusan tertunda. Jika kondisi repo berbeda dari baseline, laporkan perbedaannya untuk sinkronisasi; jangan menghapus pekerjaan existing agar cocok dengan dokumen lama.

## Komunikasi dan UI

- Pakai bahasa Indonesia casual (gw/lo), ringkas, presisi, dan langkah kecil siap dijalankan. Nama assistant/penjaga dokumentasi: Nurey.
- Pertahankan identitas, aset, dan komponen Precious existing. Jangan menetapkan logo, warna, atau font baru tanpa dasar/persetujuan Ray. Admin memakai Flowbite Svelte.

## Stack dan arsitektur

- Pertahankan SvelteKit 2, Svelte 5 runes (`$state`, `$derived`, `$props`), Tailwind CSS 4, Flowbite Svelte + `flowbite-svelte-admin-dashboard`, Supabase PostgreSQL, Drizzle + `postgres-js`, Supabase Auth + `@supabase/ssr`, serta `@sveltejs/adapter-node`. Perubahan stack harus dibahas terlebih dahulu.
- Query baru melalui `src/lib/server/db/queries.ts`, bukan Drizzle langsung di `+page.server.ts`.
- Pertahankan route groups: `src/routes/(marketing)/` untuk publik (Header, Footer, `layout.css`); `admin/login/` tanpa sidebar; `admin/logout/` sebagai POST sign-out; `admin/(app)/` untuk shell admin (Sidebar/Navbar).
- Root `src/routes/+layout.svelte` sengaja kosong dari layout publik; jangan menaruh Header/Footer/CSS publik yang bocor ke admin.
- Pertahankan proteksi `/admin/*` kecuali `/admin/login` melalui `event.locals.getUser()` di `hooks.server.ts`; Supabase client per request di `event.locals.supabase`.
- Server load memetakan camelCase Drizzle (misalnya `projectName`) ke snake_case template lama (`project_name`) untuk menjaga kompatibilitas.
- Putuskan strategi penyimpanan gambar bersama Ray sebelum mengembangkan form upload. Jangan menganggap keputusan baseline yang tertunda sudah selesai.

## Workflow dan verifikasi

- Inspeksi file existing, instruksi repo, `git status`, branch, dan remote sebelum menulis. Jangan overwrite, stage, atau commit perubahan lokal tak terkait.
- Jika memandu Ray lewat terminal, berikan command lengkap siap-paste, quote path yang mengandung `[id]` atau tanda kurung, dan gunakan heredoc dengan delimiter unik untuk isi file. Jika akses langsung telah diotorisasi, kerjakan dalam scope tersebut.
- Setelah heredoc besar, verifikasi isi/jumlah baris sebelum lanjut; bila Ray yang menjalankan, minta hasil verifikasi. Tag pembuka yang hilang saat paste dapat memicu error penutup elemen Svelte.
- Jangan meminta atau menampilkan isi `.env` maupun credential. Verifikasi tanpa membocorkan nilainya dan pastikan `.env` tidak ter-track/ikut commit.
- Review diff dan jalankan pemeriksaan yang relevan. Bedakan hasil terverifikasi, laporan konteks, dan asumsi; jangan klaim audit, build, migration, atau deployment sukses tanpa bukti.
- Setelah satu unit kerja selesai, review status lalu commit file yang relevan secara eksplisit dan push ke branch yang aman. Jangan force-push atau memasukkan pekerjaan lain tanpa instruksi Ray.
- Catat keputusan permanen dan perubahan relevan melalui governance di atas; jangan mengimpor aturan project lain yang tidak relevan dengan Precious.
