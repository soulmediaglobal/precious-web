<script lang="ts">
	import { enhance } from '$app/forms';
	import { navigating } from '$app/state';
	import type { PageData, ActionData } from './$types';
	let { data, form }: { data: PageData; form: ActionData } = $props();
	let creating = $state(false);
	const labels: Record<string, string> = {
		draft: 'Draf',
		internal_review: 'Review internal',
		internal_approved: 'Disetujui internal',
		submitted: 'Diajukan ke klien',
		client_approved: 'Disetujui klien',
		client_revision_requested: 'Klien meminta revisi',
		rejected: 'Ditolak',
		superseded: 'Digantikan revisi baru'
	};
	const revision = (n: number) => `R${String(n).padStart(2, '0')}`;
	const date = (value: Date | string) =>
		new Intl.DateTimeFormat('id-ID', {
			dateStyle: 'medium',
			timeStyle: 'short',
			timeZone: 'Asia/Jakarta'
		}).format(new Date(value));
	const money = (value: string) =>
		new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(value));
	let source = $derived(
		data.families.flatMap((f) => f.revisions).find((r) => r.id === data.selected?.supersedesRabId)
	);
</script>

<svelte:head><title>RAB · {data.project.projectNumber}</title></svelte:head>
<nav aria-label="Breadcrumb">
	<a href="/admin-v2/projects">Projects</a> / <a href={`/admin-v2/projects/${data.project.id}`}>{data.project.projectNumber}</a> / RAB
</nav>
<header>
	<div>
		<p class="eyebrow">{data.project.projectNumber}</p>
		<h1>{data.project.projectName}</h1>
		<p>{data.project.location ?? 'Workspace dokumen Project'}</p>
	</div>
	<span class="tab">RAB</span>
</header>
{#if form?.message}<p class="error" role="alert">{form.message}</p>{/if}
<p class="progress" aria-live="polite">
	{creating ? 'Membuat RAB…' : navigating.to ? 'Memuat dokumen…' : ''}
</p>
<div class="workspace" aria-busy={creating || Boolean(navigating.to)}>
	<aside aria-label="Keluarga RAB dan revisi">
		<div class="pane-title">
			<h2>Dokumen RAB</h2>
			<span>{data.families.length} keluarga</span>
		</div>
		<form
			method="POST"
			action="?/create"
			use:enhance={() => {
				creating = true;
				return async ({ update }) => {
					try {
						await update();
					} finally {
						creating = false;
					}
				};
			}}
		>
			<button disabled={creating} type="submit">{creating ? 'Membuat…' : '+ Create RAB'}</button>
		</form>
		<p class="hint">Buat keluarga RAB baru dengan revisi awal R00 berstatus Draf.</p>
		{#each data.families as family (family.id)}
			<section class="family">
				<h3>RAB-{String(family.familyNumber).padStart(3, '0')}</h3>
				{#each family.revisions as rab (rab.id)}
					<a
						class:selected={data.selected?.id === rab.id}
						aria-current={data.selected?.id === rab.id ? 'page' : undefined}
						href={`?rab=${rab.id}`}
					>
						<strong>{revision(rab.revisionNumber)}</strong><span class="status"
							>{labels[rab.status] ?? rab.status}</span
						><small>{rab.documentNumber}</small>
					</a>
				{:else}<p class="hint">Belum ada revisi.</p>{/each}
			</section>
		{:else}<div class="empty">
				<h3>Belum ada RAB</h3>
				<p>Buat RAB pertama untuk Project ini.</p>
			</div>{/each}
	</aside>
	<section class="detail" aria-label="Detail RAB">
		{#if data.selected}
			{@const rab = data.selected}
			<p class="eyebrow">DOKUMEN RAB · {revision(rab.revisionNumber)}</p>
			<h2>{rab.documentNumber}</h2>
			<span class="badge">{labels[rab.status] ?? rab.status}</span>
			<dl>
				<div>
					<dt>Project</dt>
					<dd>{data.project.projectName}<small>{data.project.projectNumber}</small></dd>
				</div>
				<div>
					<dt>Revisi</dt>
					<dd>{revision(rab.revisionNumber)}</dd>
				</div>
				<div>
					<dt>Dibuat · WIB</dt>
					<dd>{date(rab.createdAt)}</dd>
				</div>
				<div>
					<dt>Diperbarui · WIB</dt>
					<dd>{date(rab.updatedAt)}</dd>
				</div>
				<div>
					<dt>Total tersimpan</dt>
					<dd>{money(rab.grandTotal)}</dd>
				</div>
				<div>
					<dt>Revisi sumber</dt>
					<dd>
						{#if source}<a href={`?rab=${source.id}`}>{source.documentNumber}</a
							>{:else}{rab.supersedesRabId ? `RAB #${rab.supersedesRabId}` : 'Tidak ada'}{/if}
					</dd>
				</div>
			</dl>
			<a class="open" href={`/admin-v2/projects/${data.project.id}/rab/${rab.id}`}>Open RAB →</a>
			<section id="document" class="foundation">
				<h3>Ringkasan dokumen</h3>
				<p>
					Buka RAB untuk melihat rincian pekerjaan dan total. Dokumen Draft dapat diedit di Builder.
				</p>
			</section>
		{:else}<div class="empty">
				<h2>Workspace RAB</h2>
				<p>Pilih revisi di sebelah kiri atau buat RAB baru.</p>
			</div>{/if}
	</section>
</div>

<style>
	nav,
	.hint,
	dt,
	small,
	header p,
	.pane-title span {
		color: #98a2b3;
	}
	nav {
		font-size: 0.85rem;
	}
	a {
		color: #a4bcfd;
	}
	header {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		align-items: center;
		margin: 1.5rem 0 0;
	}
	h1 {
		font-size: 1.8rem;
		font-weight: 650;
	}
	.eyebrow {
		color: #a4bcfd;
		font-size: 0.8rem;
		letter-spacing: 0.07em;
		margin-bottom: 0.6rem;
	}
	.tab,
	.badge {
		background: #26365b;
		padding: 0.4rem 0.7rem;
		border-radius: 0.4rem;
		color: #c7d7fe;
		display: inline-block;
	}
	.workspace {
		display: grid;
		grid-template-columns: 320px minmax(0, 1fr);
		border: 1px solid #344054;
		border-radius: 12px;
		background: #101828;
		color: #f2f4f7;
		overflow: hidden;
	}
	aside {
		border-right: 1px solid #344054;
		padding: 1.25rem;
	}
	.pane-title {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
		align-items: center;
	}
	h2 {
		font-size: 1.1rem;
		font-weight: 600;
		overflow-wrap: anywhere;
	}
	button,
	.open {
		display: block;
		background: #465fff;
		color: white;
		padding: 0.7rem 1rem;
		border-radius: 6px;
		text-align: center;
		margin-top: 1rem;
	}
	button {
		width: 100%;
		cursor: pointer;
	}
	button:disabled {
		opacity: 0.55;
		cursor: wait;
	}
	.hint {
		font-size: 0.8rem;
		margin: 0.65rem 0 1.4rem;
	}
	.family {
		margin-top: 1rem;
	}
	h3 {
		font-weight: 600;
	}
	.family a {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin: 0.5rem 0 0.5rem 0.6rem;
		padding: 0.7rem;
		border-left: 2px solid #344054;
		color: #d0d5dd;
		border-radius: 4px;
	}
	.family a.selected {
		background: #1d2939;
		border-color: #8098f9;
	}
	.status {
		font-size: 0.75rem;
		margin-left: auto;
	}
	small {
		display: block;
		flex-basis: 100%;
		overflow-wrap: anywhere;
		font-size: 0.75rem;
	}
	.detail {
		padding: 2rem;
		min-width: 0;
	}
	.detail h2 {
		font-size: 1.35rem;
		margin-bottom: 0.9rem;
	}
	dl {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
		margin: 2rem 0;
	}
	dt {
		font-size: 0.8rem;
		margin-bottom: 0.4rem;
	}
	dd {
		overflow-wrap: anywhere;
	}
	.open {
		width: fit-content;
	}
	.foundation {
		margin-top: 2rem;
		padding-top: 1.5rem;
		border-top: 1px solid #344054;
	}
	.foundation p,
	.empty p {
		color: #98a2b3;
		margin-top: 0.7rem;
	}
	.empty {
		padding: 2rem 0;
	}
	.error {
		color: #fda29b;
		margin-top: 1rem;
	}
	.progress {
		min-height: 1.5rem;
		font-size: 0.8rem;
		color: #a4bcfd;
	}
	a:focus-visible,
	button:focus-visible {
		outline: 2px solid #a4bcfd;
		outline-offset: 3px;
	}
	@media (max-width: 850px) {
		.workspace {
			grid-template-columns: 1fr;
		}
		aside {
			border-right: 0;
			border-bottom: 1px solid #344054;
		}
		.detail {
			padding: 1.25rem;
		}
		dl {
			grid-template-columns: 1fr;
		}
		header {
			align-items: start;
		}
		h1 {
			font-size: 1.4rem;
		}
	}
</style>
