<script lang="ts">
	import ProjectForm from '$lib/components/admin/ProjectForm.svelte';
	import type { PageProps } from './$types';
	let { data, form }: PageProps = $props();
</script>

<svelte:head><title>New Project | Precious Admin</title></svelte:head>
<div class="editor">
	<header>
		<a href="/admin/projects">← Back to Projects</a>
		<h1>New Project</h1>
		<p>Create the Project identity and continue into its RAB workspace.</p>
	</header>
	{#if data.clients.length}
		<ProjectForm clients={data.clients} {form} />
	{:else}
		<section class="empty">
			<h2>Add a client first</h2>
			<p>A Project must belong to an existing Client.</p>
			<a href="/admin/clients/new">Add Client</a>
		</section>
	{/if}
</div>

<style>
	.editor { display: grid; gap: 24px; max-width: 896px; margin: 0 auto; min-width: 0; }
	header a { color: var(--ta-muted); font-size: 14px; text-decoration: none; }
	header a:hover { color: var(--ta-brand); }
	h1 { margin: 16px 0 0; color: #f2f4f7; font-size: 28px; line-height: 36px; font-weight: 600; }
	header p { margin-top: 8px; color: var(--ta-muted); font-size: 14px; }
	.empty { padding: 32px 24px; border: 1px solid var(--ta-border); border-radius: 16px; background: var(--ta-bg); }
	.empty h2 { color: #f2f4f7; font-size: 18px; font-weight: 600; }
	.empty p { margin: 8px 0 20px; color: var(--ta-muted); }
	.empty a { display: inline-flex; min-height: 44px; align-items: center; padding: 10px 18px; border-radius: 8px; background: #465fff; color: white; text-decoration: none; }
	@media (max-width: 767px) { h1 { font-size: 24px; line-height: 32px; } }
</style>
