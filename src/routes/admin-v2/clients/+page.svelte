<script lang="ts">
  import type { PageProps } from './$types';
  let { data, form }: PageProps = $props();
  function confirmDelete(event: MouseEvent, name: string) {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) event.preventDefault();
  }
</script>

<svelte:head><title>Clients | Precious Admin v2</title></svelte:head>

<div class="client-page">
  <header class="client-heading">
    <div>
      <p class="breadcrumb"><a href="/admin-v2">Home</a> / Clients</p>
      <h1>Clients</h1>
      <p class="intro">Manage project clients and contacts.</p>
    </div>
    <a class="button primary" href="/admin-v2/clients/new">Add client</a>
  </header>
  <form method="GET" class="search" role="search">
    <label for="client-search">Search clients</label>
    <div class="search-controls">
      <input id="client-search" name="q" value={data.q} placeholder="Search clients" />
      <button class="button" type="submit">Search</button>
    </div>
  </form>
  {#if form?.message}<div class="notice error" role="alert">{form.message}</div>{/if}
  <section class="client-panel" aria-label="Clients">
    {#if data.clients.length}
      <div class="table-scroll">
        <table>
          <thead><tr><th scope="col">Company Name / Type</th><th scope="col">Projects</th><th scope="col">Director</th><th scope="col">PIC</th><th scope="col">Actions</th></tr></thead>
          <tbody>
            {#each data.clients as row (row.client.id)}
              <tr>
                <th scope="row"><span class="company">{row.client.companyName}</span><span class="details">{row.client.companyType || 'Type not set'}</span></th>
                <td>{row.projectCount} project(s)</td>
                <td>{row.client.directorName || 'Not set'}</td>
                <td>{row.client.picName || 'Not set'}</td>
                <td>
                  <div class="actions">
                    <a class="button" href={`/admin-v2/clients/${row.client.id}`} aria-label={`Edit ${row.client.companyName}`}>Edit</a>
                    <form method="POST" action="?/delete">
                      <input type="hidden" name="id" value={row.client.id} />
                      <button class="button danger" type="submit" aria-label={`Delete ${row.client.companyName}`} onclick={(event) => confirmDelete(event, row.client.companyName)}>Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {:else}
      <div class="empty"><h2>No clients found</h2><p>Add the first client to get started.</p></div>
    {/if}
  </section>
</div>

<style>

  .client-page { display: grid; gap: 24px; min-width: 0; }
  .client-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; }
  .breadcrumb { margin: 0 0 12px; font-size: 14px; color: var(--ta-muted); }
  .breadcrumb a { color: inherit; text-decoration: none; }
  .breadcrumb a:hover { color: var(--ta-brand); }
  h1 { margin: 0; font-size: 28px; line-height: 36px; font-weight: 600; color: #f2f4f7; }
  .intro { margin: 8px 0 0; font-size: 14px; color: var(--ta-muted); }
  .client-panel { border: 1px solid var(--ta-border); border-radius: 16px; background: var(--ta-bg); overflow: hidden; }
  h2 { margin: 0; font-size: 16px; line-height: 24px; font-weight: 600; color: #f2f4f7; }
  .actions { display: flex; justify-content: flex-end; gap: 8px; }
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
    .client-heading { align-items: flex-start; flex-direction: column; }
    h1 { font-size: 24px; line-height: 32px; }
  }
  .search { display: grid; gap: 8px; font-size: 14px; }
  .search-controls { display: flex; gap: 8px; max-width: 560px; }
  .search input { flex: 1; min-width: 0; min-height: 44px; padding: 10px 12px; border: 1px solid var(--ta-border); border-radius: 8px; background: #000; color: var(--ta-text); font: inherit; }
  .search input::placeholder { color: var(--ta-muted); }
  .table-scroll { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; text-align: left; }
  th, td { padding: 20px 24px; border-bottom: 1px solid var(--ta-border); overflow-wrap: anywhere; }
  thead th { color: var(--ta-muted); font-weight: 500; }
  tbody th { font-weight: 500; }
  tbody tr:last-child th, tbody tr:last-child td { border-bottom: 0; }
  .company { display: block; color: #f2f4f7; }
  .details { display: block; margin-top: 6px; color: var(--ta-muted); font-weight: 400; }
  @media (max-width: 767px) {
    .search-controls { flex-direction: column; }
    th, td { padding: 16px; }
    table { min-width: 680px; }
  }
</style>
