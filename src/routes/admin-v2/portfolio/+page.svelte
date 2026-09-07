<script lang="ts">
  import type { PageProps } from './$types';
  let { data, form }: PageProps = $props();
  function confirmDelete(event: SubmitEvent, name: string) {
    if (!window.confirm(`Delete ${name}? Its images and Expertise links will be removed from the database. This cannot be undone.`)) event.preventDefault();
  }
</script>
<svelte:head><title>Portfolio | Precious Admin v2</title></svelte:head>
<div class="team-page">
  <header class="team-heading">
    <div><p class="breadcrumb"><a href="/admin-v2">Home</a> / Portfolio</p><h1>Portfolio</h1><p class="intro">Manage projects shown on the public Portfolio page.</p></div>
    <a class="button primary" href="/admin-v2/portfolio/new">Add Portfolio</a>
  </header>
  {#if form?.message}<div class="notice error" role="alert">{form.message}</div>{/if}
  {#if form?.success}<div class="notice" role="status">Portfolio deleted.</div>
  {:else if data.saved === 'created' || data.saved === 'updated'}<div class="notice" role="status">Portfolio {data.saved}.</div>{/if}
  {#if data.loadError}<div class="notice error" role="alert">{data.loadError} <a href="/admin-v2/portfolio">Retry</a></div>
  {:else}
    <section class="team-panel" aria-label="Portfolio entries">
      {#if data.entries.length}
        <ul class="member-list">
          {#each data.entries as entry (entry.id)}
            <li class="member">
              {#if entry.images[0]}<img class="portrait" src={entry.images[0].url} alt={`${entry.projectName} header`} />{:else}<span class="details">No header</span>{/if}
              <div class="profile"><h2>{entry.projectName}</h2><p class="details">Client: {entry.client}</p><p class="details">Location: {entry.location}</p><p class="details">Status: {entry.status}</p></div>
              <div class="actions">
                <a class="button" href={`/admin-v2/portfolio/${entry.id}`}>Edit</a>
                <a class="button" href={`/portofolio/${encodeURIComponent(entry.slug)}`}>View public</a>
                <form method="POST" action="?/delete" onsubmit={(event) => confirmDelete(event, entry.projectName)}><input type="hidden" name="id" value={entry.id} /><button class="button danger" type="submit">Delete</button></form>
              </div>
            </li>
          {/each}
        </ul>
      {:else}<div class="empty"><h2>No Portfolio yet</h2><p>Add the first project to get started.</p></div>{/if}
    </section>
  {/if}
</div>
<style>
  .team-page { display: grid; gap: 24px; min-width: 0; }
  .team-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; }
  .breadcrumb { margin: 0 0 12px; font-size: 14px; color: var(--ta-muted); }
  .breadcrumb a { color: inherit; text-decoration: none; }
  .breadcrumb a:hover { color: var(--ta-brand); }
  h1 { margin: 0; font-size: 28px; line-height: 36px; font-weight: 600; color: #f2f4f7; }
  .intro { margin: 8px 0 0; font-size: 14px; color: var(--ta-muted); }
  .team-panel { border: 1px solid var(--ta-border); border-radius: 16px; background: var(--ta-bg); overflow: hidden; }
  .member-list { list-style: none; margin: 0; padding: 0; }
  .member { display: grid; grid-template-columns: 64px minmax(0, 1fr) auto; align-items: center; gap: 20px; padding: 24px; }
  .member + .member { border-top: 1px solid var(--ta-border); }
  .portrait { width: 64px; aspect-ratio: 1; object-fit: cover; border-radius: 8px; background: #171717; }
  .profile { min-width: 0; overflow-wrap: anywhere; }
  h2 { margin: 0; font-size: 16px; line-height: 24px; font-weight: 600; color: #f2f4f7; }
  .details { margin: 6px 0 0; font-size: 14px; color: var(--ta-muted); }
  .actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; }
  .actions form { margin: 0; }
  .button { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 10px 16px; border: 1px solid var(--ta-border); border-radius: 8px; background: transparent; color: var(--ta-text); font: inherit; font-size: 14px; font-weight: 500; text-decoration: none; }
  .button:hover { background: rgb(255 255 255 / 6%); }
  .primary { background: #465fff; border-color: #465fff; color: white; }
  .primary:hover { background: #3641f5; }
  .danger { border-color: rgb(240 68 56 / 30%); color: #fda29b; }
  .danger:hover { background: rgb(240 68 56 / 10%); }
  .notice { padding: 14px 16px; border: 1px solid var(--ta-border); border-radius: 8px; font-size: 14px; }
  .error { border-color: rgb(240 68 56 / 30%); color: #fda29b; }
  .empty { padding: 48px 24px; text-align: center; }
  .empty p { margin: 8px 0 0; color: var(--ta-muted); font-size: 14px; }
  @media (max-width: 767px) {
    .team-heading { align-items: flex-start; flex-direction: column; }
    h1 { font-size: 24px; line-height: 32px; }
    .member { grid-template-columns: 64px minmax(0, 1fr); gap: 16px; padding: 16px; }
    .actions { grid-column: 1 / -1; }
  }</style>
