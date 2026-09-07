<script lang="ts">
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();
  const received = (date: Date) => new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date)) + ' WIB';
</script>
<div class="contact-page">
  <header><p class="muted"><a href="/admin-v2">Home</a> / Contact Inbox</p><h1>Contact Inbox</h1></header>
  {#if data.loadError}
    <p class="notice error" role="alert">Inbox belum bisa dimuat. <a href="/admin-v2/contact">Coba lagi</a>.</p>
  {:else}
    <section class="panel" aria-label="Pesan masuk">
      {#each data.inquiries as inquiry (inquiry.id)}
        <a class="row" href={`/admin-v2/contact/${inquiry.id}`}>
          <div><strong>{inquiry.firstName} {inquiry.lastName ?? ''}</strong><div class="muted">{[inquiry.email, inquiry.phone].filter(Boolean).join(' · ')}</div></div>
          <span class="muted">{received(inquiry.createdAt)}</span>
          <span class="badge" class:done={inquiry.isFollowedUp}>{inquiry.isFollowedUp ? 'Sudah Follow Up' : 'Belum Follow Up'}</span>
        </a>
      {:else}<p class="muted">Belum ada pesan masuk.</p>{/each}
    </section>
  {/if}
</div>

<style>
  .contact-page { display: grid; gap: 24px; min-width: 0; color: var(--ta-text); }
  h1 { font-size: 28px; font-weight: 600; margin: 0; }
  a { color: inherit; } .muted { color: var(--ta-muted); font-size: 14px; }
  .panel { padding: 24px; background: var(--ta-bg); border: 1px solid var(--ta-border); border-radius: 16px; min-width: 0; }
  .notice { padding: 16px; border: 1px solid var(--ta-border); border-radius: 8px; } .error { color: #fda29b; }
  .row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; padding: 20px 0; text-decoration: none; overflow-wrap: anywhere; }
  .row + .row { border-top: 1px solid var(--ta-border); } .row:hover { color: #a4bcfd; }
  .badge { font-size: 12px; padding: 6px 10px; border-radius: 999px; background: rgb(247 144 9 / 12%); color: #fec84b; } .done { background: rgb(18 183 106 / 12%); color: #6ce9a6; }
  @media (max-width: 767px) { .panel { padding: 16px; } h1 { font-size: 24px; } }
</style>
