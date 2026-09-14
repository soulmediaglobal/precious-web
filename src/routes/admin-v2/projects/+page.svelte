<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<div class="ta-page-heading">
	<h1>Projects</h1>
	<span>Home / Projects</span>
</div>
<section class="ta-panel">
	<h2>Dokumen RAB per Project</h2>
	<p>Pilih Project untuk melihat keluarga RAB dan seluruh revisinya.</p>
	{#each data.projects as project}
		<a class="project" href={`/admin-v2/projects/${project.id}/rab`}>
			<strong>{project.projectName}</strong><span>{project.projectNumber}</span><span
				>Buka RAB →</span
			>
		</a>
	{:else}<p>Belum ada Project tersedia.</p>{/each}
</section>

<style>
	.project {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		padding: 1.25rem 0;
		border-bottom: 1px solid #344054;
		color: inherit;
	}
	.project strong {
		flex: 1;
		min-width: 12rem;
	}
	.project span {
		color: #a4bcfd;
	}
	h2 {
		font-size: 1.25rem;
	}
	p {
		margin: 0.75rem 0;
	}
</style>
