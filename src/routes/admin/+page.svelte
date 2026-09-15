<script lang="ts">
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();
  let metrics = $derived([
    { label: 'Clients', value: data.counts.clients },
    { label: 'Projects', value: data.counts.projects },
    { label: 'Active projects', value: data.counts.activeProjects },
    { label: 'Portfolio', value: data.counts.portfolio }
  ]);
</script>

<svelte:head>
  <title>Dashboard | Precious Admin</title>
</svelte:head>

<div class="dashboard">
  <header>
    <h1>Dashboard</h1>
    <p>Project operations and website content at a glance.</p>
  </header>

  <section class="metrics" aria-label="Business overview">
    {#each metrics as item (item.label)}
      <div class="panel">
        <h2>{item.label}</h2>
        <p class="value">{item.value}</p>
      </div>
    {/each}
  </section>

  <section class="panel welcome">
    <h2>Welcome back</h2>
    <p class="email">{data.user?.email}</p>
    <p>Manage clients and website content from the navigation.</p>
    <nav aria-label="Content shortcuts">
      <a href="/admin/clients">Clients</a>
      <a href="/admin/portfolio">Portfolio</a>
      <a href="/admin/team">Team</a>
      <a href="/admin/contact">Contact Inbox</a>
    </nav>
  </section>
</div>

<style>
  .dashboard { display: grid; gap: 24px; min-width: 0; color: var(--ta-text); }
  h1, h2, p { margin: 0; }
  h1 { font-size: 28px; line-height: 36px; font-weight: 600; }
  header p, .welcome > p:last-of-type { margin-top: 8px; color: var(--ta-muted); font-size: 14px; line-height: 22px; }
  .metrics { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; }
  .panel { min-width: 0; padding: 24px; border: 1px solid var(--ta-border); border-radius: 16px; background: var(--ta-bg); overflow-wrap: anywhere; }
  h2 { color: var(--ta-muted); font-size: 14px; line-height: 22px; font-weight: 500; }
  .value { margin-top: 12px; font-size: 30px; line-height: 38px; font-weight: 600; }
  .email { margin-top: 8px; font-size: 20px; line-height: 28px; font-weight: 600; }
  nav { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
  nav a { display: inline-flex; align-items: center; min-height: 44px; padding: 10px 16px; border: 1px solid var(--ta-border); border-radius: 8px; color: var(--ta-text); text-decoration: none; font-size: 14px; }
  nav a:hover { background: rgb(70 95 255 / .12); }
  nav a:focus-visible { outline: 2px solid var(--ta-brand); outline-offset: 3px; }
  @media (max-width: 1023px) { .metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  @media (max-width: 639px) { .dashboard { gap: 16px; } .metrics { grid-template-columns: minmax(0, 1fr); gap: 16px; } .panel { padding: 16px; } h1 { font-size: 24px; line-height: 32px; } }
</style>
