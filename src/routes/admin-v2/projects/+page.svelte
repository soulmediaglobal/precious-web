<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	let search = $state('');
	let status = $state('');
	let client = $state('');
	const label = (value: string) => value.replaceAll('_', ' ');
	let statuses = $derived([...new Set(data.projects.map((p) => p.status))].sort());
	let clients = $derived(
		[...new Map(data.projects.map((p) => [String(p.clientId), p.clientName])).entries()].sort(
			(a, b) => a[1].localeCompare(b[1])
		)
	);
	let filtered = $derived(
		data.projects.filter(
			(p) =>
				(!status || p.status === status) &&
				(!client || String(p.clientId) === client) &&
				[p.projectName, p.projectNumber, p.clientName, p.location ?? '']
					.join(' ')
					.toLowerCase()
					.includes(search.trim().toLowerCase())
		)
	);
	function reset() {
		search = '';
		status = '';
		client = '';
	}
</script>

<svelte:head><title>Projects | Precious Admin v2</title></svelte:head>
<div class="projects-page">
	<header>
		<nav aria-label="Breadcrumb"><a href="/admin-v2">Home</a> / Projects</nav>
		<h1>Projects</h1>
		<p>Manage your projects and open their RAB workspace.</p>
	</header>
	<section class="metrics" aria-label="Project totals">
		<article><span>Total Projects</span><strong>{data.projects.length}</strong></article>
		<article><span>Clients with Projects</span><strong>{clients.length}</strong></article>
		{#each statuses as item}<article>
				<span class="status-label">{label(item)}</span><strong
					>{data.projects.filter((p) => p.status === item).length}</strong
				>
			</article>{/each}
	</section>
	<section class="panel" aria-label="Projects list">
		<div class="filters">
			<label class="search"
				>Search projects<input
					type="search"
					bind:value={search}
					placeholder="Name, ID, client or location"
				/></label
			>
			<label
				>Status<select bind:value={status}
					><option value="">All statuses</option>{#each statuses as item}<option value={item}
							>{label(item)}</option
						>{/each}</select
				></label
			>
			<label
				>Client<select bind:value={client}
					><option value="">All clients</option>{#each clients as [id, name]}<option value={id}
							>{name}</option
						>{/each}</select
				></label
			>
			<button onclick={reset}>Reset</button>
		</div>
		<p class="count" aria-live="polite">{filtered.length} of {data.projects.length} projects</p>
		{#if filtered.length}
			<div class="table-scroll">
				<table>
					<thead
						><tr
							><th scope="col">Project ID</th><th scope="col">Project Name</th><th scope="col"
								>Client</th
							><th scope="col">Status</th><th scope="col">Action</th></tr
						></thead
					>
					<tbody
						>{#each filtered as project (project.id)}<tr>
								<td class="identity">{project.projectNumber}</td>
								<th scope="row"
									><a href={`/admin-v2/projects/${project.id}`}>{project.projectName}</a
									>{#if project.location}<small>{project.location}</small>{/if}</th
								>
								<td>{project.clientName}</td><td
									><span class="badge">{label(project.status)}</span></td
								>
								<td
									><a
										class="open"
										href={`/admin-v2/projects/${project.id}`}
										aria-label={`Open Project: ${project.projectName}`}>Open Project →</a
									></td
								>
							</tr>{/each}</tbody
					>
				</table>
			</div>
		{:else}<div class="empty">
				<h2>{data.projects.length ? 'No matching projects' : 'No projects yet'}</h2>
				<p>
					{data.projects.length
						? 'Try another search or clear the filters.'
						: 'Projects will appear here once they have been created.'}
				</p>
				{#if data.projects.length}<button onclick={reset}>Clear filters</button>{/if}
			</div>{/if}
	</section>
</div>

<style>
	.projects-page {
		display: grid;
		gap: 24px;
		min-width: 0;
	}
	nav,
	header p,
	small,
	.count,
	.metrics span {
		color: var(--ta-muted);
	}
	nav {
		font-size: 14px;
		margin-bottom: 12px;
	}
	a {
		color: inherit;
		text-decoration: none;
	}
	a:hover {
		color: #a4bcfd;
	}
	h1 {
		font-size: 28px;
		font-weight: 600;
		color: #f2f4f7;
	}
	header p {
		margin-top: 8px;
		font-size: 14px;
	}
	.metrics {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		gap: 16px;
	}
	.metrics article,
	.panel {
		border: 1px solid var(--ta-border);
		border-radius: 16px;
		background: var(--ta-bg);
	}
	.metrics article {
		padding: 20px;
	}
	.metrics span {
		font-size: 13px;
	}
	.status-label,
	.badge {
		text-transform: capitalize;
	}
	.metrics strong {
		display: block;
		font-size: 30px;
		margin-top: 12px;
		color: #f2f4f7;
	}
	.panel {
		overflow: hidden;
	}
	.filters {
		display: flex;
		gap: 16px;
		align-items: end;
		padding: 24px 24px 12px;
		flex-wrap: wrap;
	}
	label {
		display: grid;
		gap: 8px;
		font-size: 13px;
		flex: 1;
		min-width: 150px;
	}
	.search {
		flex: 2;
	}
	input,
	select,
	button {
		min-height: 44px;
		border: 1px solid var(--ta-border);
		border-radius: 8px;
		padding: 10px 12px;
		background: #101828;
		color: #f2f4f7;
		font: inherit;
		max-width: 100%;
		min-width: 0;
	}
	button {
		cursor: pointer;
	}
	.count {
		padding: 0 24px 16px;
		font-size: 13px;
	}
	.table-scroll {
		overflow-x: auto;
	}
	table {
		width: 100%;
		border-collapse: collapse;
		text-align: left;
		font-size: 14px;
	}
	th,
	td {
		padding: 20px 24px;
		border-top: 1px solid var(--ta-border);
	}
	thead th {
		color: var(--ta-muted);
		font-weight: 500;
	}
	tbody th {
		font-weight: 500;
		min-width: 210px;
	}
	tbody tr:hover {
		background: rgb(255 255 255 / 3%);
	}
	small {
		display: block;
		margin-top: 6px;
		font-weight: 400;
	}
	.identity {
		white-space: nowrap;
		color: #a4bcfd;
	}
	.badge {
		display: inline-block;
		padding: 5px 10px;
		border-radius: 20px;
		background: #26365b;
		color: #c7d7fe;
		white-space: nowrap;
		font-size: 12px;
	}
	.open {
		color: #a4bcfd;
		white-space: nowrap;
		display: inline-flex;
		align-items: center;
		min-height: 44px;
	}
	.empty {
		padding: 48px 24px;
		text-align: center;
	}
	.empty h2 {
		font-size: 18px;
	}
	.empty p {
		color: var(--ta-muted);
		margin: 10px 0 20px;
	}
	:is(a, button, input, select):focus-visible {
		outline: 2px solid #a4bcfd;
		outline-offset: 3px;
	}
	@media (max-width: 640px) {
		.filters {
			padding: 16px;
			display: grid;
			grid-template-columns: minmax(0, 1fr);
		}
		label {
			min-width: 0;
		}
		.metrics {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.metrics article {
			padding: 16px;
		}
		th,
		td {
			padding: 16px;
		}
		h1 {
			font-size: 24px;
		}
	}
</style>
