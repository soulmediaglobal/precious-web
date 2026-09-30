# Precious Contractor

Website publik dan CMS internal Precious Contractor.

## Stack

- SvelteKit 2 dan Svelte 5
- Tailwind CSS 4
- Supabase Auth, PostgreSQL, dan Storage
- Drizzle ORM
- Node.js adapter

## Requirements

- Node.js 22.12.0 atau lebih baru
- npm
- Environment variables sesuai `.env.example`

Jangan commit file `.env` atau credentials ke repository.

## Commands

- Install dependencies: `npm ci`
- Development server: `npm run dev`
- Type and Svelte check: `npm run check`
- Production build: `npm run build`
- Preview build: `npm run preview`
- Production server: `npm start`

Production output dibuat di folder `build/` oleh `@sveltejs/adapter-node`.
