<script lang="ts">
  import TeamForm from '$lib/components/admin-v2/TeamForm.svelte';
  import type { PageProps } from './$types';
  let { data, form }: PageProps = $props();
</script>

<svelte:head>
  <title>Edit {data.member.name} | Precious Admin v2</title>
</svelte:head>

<div class="editor">
  <header>
    <a href="/admin-v2/team">← Back to team</a>
    <h1>Edit team member</h1>
    <p>{data.member.name}</p>
  </header>
  <TeamForm member={data.member} {form} submitLabel="Save changes" />
</div>

<style>
  .editor { display: grid; gap: 24px; max-width: 896px; margin: 0 auto; min-width: 0; }
  header { overflow-wrap: anywhere; }
  header a { color: var(--ta-muted); font-size: 14px; text-decoration: none; }
  header a:hover { color: var(--ta-brand); }
  h1 { margin: 16px 0 0; color: #f2f4f7; font-size: 28px; line-height: 36px; font-weight: 600; }
  header p { margin: 8px 0 0; color: var(--ta-muted); font-size: 14px; }
  @media (max-width: 767px) { h1 { font-size: 24px; line-height: 32px; } }
</style>
