<script lang="ts">
  import ClientForm from '$lib/components/admin-v2/ClientForm.svelte';
  import type { PageProps } from './$types';
  let { data, form }: PageProps = $props();
</script>

<svelte:head>
  <title>Add Client | Precious Admin v2</title>
</svelte:head>

<div class="editor">
  <header>
    <a href="/admin-v2/clients">← Back to clients</a>
    <h1>Add client</h1>
  </header>
  <ClientForm companyTypes={data.companyTypes} {form} submitLabel="Add client" />
</div>

<style>
  .editor { display: grid; gap: 24px; max-width: 896px; margin: 0 auto; min-width: 0; }
  header a { color: var(--ta-muted); font-size: 14px; text-decoration: none; }
  header a:hover { color: var(--ta-brand); }
  h1 { margin: 16px 0 0; color: #f2f4f7; font-size: 28px; line-height: 36px; font-weight: 600; }
  @media (max-width: 767px) { h1 { font-size: 24px; line-height: 32px; } }
</style>
