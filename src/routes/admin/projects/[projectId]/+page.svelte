<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	const date = (value: Date | string) =>
		new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeZone: 'Asia/Jakarta' }).format(
			new Date(value)
		);
</script>

<svelte:head><title>{data.project.projectName} | Precious Projects</title></svelte:head>
<div class="detail-page">
	<nav aria-label="Breadcrumb">
		<a href="/admin/projects">Projects</a> / {data.project.projectNumber}
	</nav>
	<header>
		<p class="identity">{data.project.projectNumber}</p>
		<h1>{data.project.projectName}</h1>
		<p>{data.clientName}</p>
		<span class="badge">{data.project.status.replaceAll('_', ' ')}</span>
	</header>
	<section class="panel">
		<h2>Project overview</h2>
		<dl>
			<div>
				<dt>Project ID</dt>
				<dd>{data.project.projectNumber}</dd>
			</div>
			<div>
				<dt>Client</dt>
				<dd>{data.clientName}</dd>
			</div>
			{#if data.project.location}<div>
					<dt>Location</dt>
					<dd>{data.project.location}</dd>
				</div>{/if}
			{#if data.project.acquisitionType}<div>
					<dt>Acquisition type</dt>
					<dd>{data.project.acquisitionType}</dd>
				</div>{/if}
			{#if data.project.transactionTitle}<div>
					<dt>Transaction title</dt>
					<dd>{data.project.transactionTitle}</dd>
				</div>{/if}
			<div>
				<dt>Created · WIB</dt>
				<dd>{date(data.project.createdAt)}</dd>
			</div>
			<div>
				<dt>Updated · WIB</dt>
				<dd>{date(data.project.updatedAt)}</dd>
			</div>
		</dl>
		{#if data.project.description}<div class="description">
				<h3>Description</h3>
				<p>{data.project.description}</p>
			</div>{/if}
	</section>
	<section class="panel module">
		<div>
			<p class="identity">PROJECT DOCUMENTS</p>
			<h2>Rencana Anggaran Biaya</h2>
			<p>Open RAB families and revisions, continue in Builder, or preview the PDF.</p>
		</div>
		<a class="primary" href={`/admin/projects/${data.project.id}/rab`}>Open RAB workspace →</a>
	</section>
	<a href="/admin/projects">← Back to Projects</a>
</div>

<style>
	.detail-page {
		display: grid;
		gap: 24px;
		min-width: 0;
	}
	nav,
	header p,
	dt,
	.module p {
		color: var(--ta-muted);
	}
	nav {
		font-size: 14px;
	}
	a {
		color: #a4bcfd;
	}
	h1 {
		font-size: 30px;
		line-height: 1.3;
		font-weight: 600;
		overflow-wrap: anywhere;
	}
	header p {
		margin: 8px 0;
	}
	.identity {
		color: #a4bcfd;
		font-size: 13px;
		letter-spacing: 0.04em;
	}
	.badge {
		display: inline-block;
		margin-top: 12px;
		padding: 6px 12px;
		background: #26365b;
		color: #c7d7fe;
		border-radius: 20px;
		text-transform: capitalize;
		font-size: 13px;
	}
	.panel {
		border: 1px solid var(--ta-border);
		border-radius: 16px;
		background: var(--ta-bg);
		padding: 24px;
	}
	h2 {
		font-size: 18px;
		font-weight: 600;
	}
	dl {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 24px;
		margin-top: 24px;
	}
	dt {
		font-size: 13px;
		margin-bottom: 6px;
	}
	dd {
		overflow-wrap: anywhere;
	}
	.description {
		border-top: 1px solid var(--ta-border);
		margin-top: 24px;
		padding-top: 24px;
	}
	.description p {
		white-space: pre-wrap;
		overflow-wrap: anywhere;
		color: var(--ta-muted);
		margin-top: 8px;
	}
	.module {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
	}
	.module p {
		margin: 8px 0;
		font-size: 14px;
	}
	.primary {
		display: inline-flex;
		justify-content: center;
		padding: 12px 18px;
		min-height: 44px;
		border-radius: 8px;
		background: #465fff;
		color: white;
		text-decoration: none;
		white-space: nowrap;
	}
	a:focus-visible {
		outline: 2px solid #a4bcfd;
		outline-offset: 4px;
	}
	@media (max-width: 700px) {
		dl {
			grid-template-columns: 1fr;
		}
		.module {
			align-items: stretch;
			flex-direction: column;
		}
		.panel {
			padding: 20px;
		}
		h1 {
			font-size: 24px;
		}
	}
</style>
