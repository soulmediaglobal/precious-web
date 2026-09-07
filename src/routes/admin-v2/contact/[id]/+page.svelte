<script lang="ts">
  import type { PageProps } from './$types';
  let { data, form }: PageProps = $props();
  const methods = ['WhatsApp', 'Phone', 'Email', 'Lainnya'];
  let status = $derived(form?.values?.status ?? (data.inquiry.isFollowedUp ? 'Sudah Follow Up' : 'Belum Follow Up'));
  let method = $derived(form?.values?.followUpMethod ?? data.inquiry.followUpMethod ?? '');
  const received = (date: Date) => new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date)) + ' WIB';
</script>
<div class="contact-page">
  <header><p class="muted"><a href="/admin-v2/contact">Contact Inbox</a> / Detail</p><h1>Pesan masuk</h1></header>
  <section class="panel details">
    <h2>{data.inquiry.firstName} {data.inquiry.lastName ?? ''}</h2>
    <p>{data.inquiry.email ?? '—'} · {data.inquiry.phone ?? '—'}</p>
    <p class="muted">Diterima: {received(data.inquiry.createdAt)}</p>
    <p class="muted">Consent: {data.inquiry.consentAccepted ? 'Ya' : 'Tidak'}</p>
    <h2>Message</h2>
    <div class="message">{data.inquiry.message}</div>
  </section>
  <section class="panel">
    <h2>Follow-up</h2>
    {#if form?.message}<p class="notice error" role="alert">{form.message}</p>
    {:else if data.saved}<p class="notice" role="status">Status follow-up tersimpan.</p>{/if}
    {#if data.inquiry.followedUpAt}<p class="muted">Follow-up: {received(data.inquiry.followedUpAt)}</p>{/if}
    <form method="POST" action={`/admin-v2/contact/${data.inquiry.id}`}>
      <label>Status
        <select name="status" bind:value={status} aria-invalid={!!form?.errors?.status}>
          <option>Belum Follow Up</option><option>Sudah Follow Up</option>
        </select>
      </label>
      {#if form?.errors?.status}<p class="error" role="alert">{form.errors.status}</p>{/if}
      <label>Metode follow-up
        <select name="followUpMethod" bind:value={method} required={status === 'Sudah Follow Up'} disabled={status !== 'Sudah Follow Up'} aria-invalid={!!form?.errors?.followUpMethod}>
          <option value="">Pilih metode</option>
          {#each methods as item}<option value={item}>{item}</option>{/each}
        </select>
      </label>
      {#if form?.errors?.followUpMethod}<p class="error" role="alert">{form.errors.followUpMethod}</p>{/if}
      <button type="submit">Simpan</button>
    </form>
  </section>
</div>

<style>
  .contact-page { display: grid; gap: 24px; min-width: 0; color: var(--ta-text); }
  h1 { font-size: 28px; font-weight: 600; margin: 0; } h2 { font-size: 18px; font-weight: 600; }
  a { color: inherit; } .muted { color: var(--ta-muted); font-size: 14px; }
  .panel { padding: 24px; background: var(--ta-bg); border: 1px solid var(--ta-border); border-radius: 16px; min-width: 0; }
  .notice { padding: 16px; border: 1px solid var(--ta-border); border-radius: 8px; } .error { color: #fda29b; }
  .message { white-space: pre-wrap; overflow-wrap: anywhere; line-height: 1.7; }
  label { display: grid; gap: 8px; margin-bottom: 16px; } select { background: var(--ta-bg); border: 1px solid var(--ta-border); color: inherit; border-radius: 8px; padding: 12px; width: 100%; }
  button { background: #465fff; color: white; padding: 12px 20px; border-radius: 8px; } .details { overflow-wrap: anywhere; }
  @media (max-width: 767px) { .panel { padding: 16px; } h1 { font-size: 24px; } }
</style>
