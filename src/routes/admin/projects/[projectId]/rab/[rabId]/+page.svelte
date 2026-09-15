<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { money, type BuilderKind } from '$lib/rab-builder/values';
	import type { PageData, ActionData } from './$types';
	let { data, form }: { data: PageData; form: ActionData } = $props();
	type Item = PageData['sections'][number]['groups'][number]['items'][number];
	type Editor = Record<string, string>;
	let editor = $state<Editor | null>(null);
	let saving = $state(false);
	let confirmingDelete = $state(false);
	let editorKey = $state(0);
	let editable = $derived(data.rab.status === 'draft');
	let hasLegacyItems = $derived(
		data.sections.some((section) =>
			section.groups.some((group) =>
				[...group.items, ...group.subgroups.flatMap((subgroup) => subgroup.items)].some(
					(item) =>
						item.materialUnitPrice === null &&
						item.jasaUnitPrice === null &&
						item.unitPrice != null
				)
			)
		)
	);
	const names: Record<string, string> = {
		section: 'Area',
		group: 'Kelompok',
		subgroup: 'Subkelompok',
		item: 'Item'
	};
	$effect(() => {
		if (form && 'values' in form && form.values) {
			editor = form.values;
		}
	});
	function openEditor(
		kind: BuilderKind,
		parentId: number | null,
		context: string,
		row?: object,
		subgroupId: number | null = null,
		sortOrder = 0
	) {
		editor = {
			kind,
			parentId: parentId ? String(parentId) : '',
			context,
			subgroupId: subgroupId ? String(subgroupId) : '',
			sortOrder: String(sortOrder),
			...Object.fromEntries(
				Object.entries(row ?? {}).map(([key, value]) => [key, value == null ? '' : String(value)])
			)
		};
		confirmingDelete = false;
		editorKey++;
		requestAnimationFrame(() =>
			document
				.getElementById('builder-editor')
				?.scrollIntoView({ behavior: 'smooth', block: 'start' })
		);
	}
	const nextOrder = (rows: { sortOrder: number }[]) =>
		Math.min(2147483647, Math.max(-1, ...rows.map((row) => row.sortOrder)) + 1);
	const submit: SubmitFunction = ({ cancel, formData }) => {
		if (saving) {
			cancel();
			return;
		}
		if (formData.get('operation') === 'delete' && !confirmingDelete) {
			cancel();
			return;
		}
		saving = true;
		return async ({ result, update }) => {
			try {
				await update({ reset: false });
				if (result.type === 'success') editor = null;
			} finally {
				saving = false;
			}
		};
	};
</script>

<svelte:head><title>Builder · {data.rab.documentNumber}</title></svelte:head>
<div class="builder">
	<nav aria-label="Breadcrumb">
		<a href="/admin/projects">Projects</a> /
		<a href={`/admin/projects/${data.project.id}`}>{data.project.projectNumber}</a> /
		<a href={`/admin/projects/${data.project.id}/rab?rab=${data.rab.id}`}
			>RAB</a
		> / Builder
	</nav>
	<header>
		<div>
			<p class="eyebrow">RAB BUILDER</p>
			<h1>{data.rab.documentNumber}</h1>
			<p>
				{data.project.projectName} <span class="muted">· Project {data.project.projectNumber}</span>
			</p>
		</div>
		<span class:locked={!editable} class="badge"
			>{editable ? 'Draft · Dapat diedit' : `${data.rab.status} · Read-only`}</span
		>
		{#if editable}<a class="preview-link" href={`/admin/projects/${data.project.id}/rab/${data.rab.id}/preview`} target="_blank" rel="noopener">Preview PDF ↗</a>{/if}
	</header>
	{#if !editable}<p class="notice">
			RAB terkunci / read-only. Hanya dokumen berstatus Draft yang dapat diubah.
		</p>{/if}
	<div class="toolbar">
		<div>
			<h2>Rincian pekerjaan</h2>
			<p class="muted">
				Area → Kelompok → Subkelompok (opsional) → Item. Urutan kecil tampil lebih dulu.
			</p>
		</div>
		{#if editable}<button
				disabled={saving}
				onclick={() =>
					openEditor(
						'section',
						null,
						data.rab.documentNumber,
						undefined,
						null,
						nextOrder(data.sections)
					)}>+ Area</button
			>{/if}
	</div>
	{#if form?.message}<p class:error={!(form && 'success' in form)} class="notice" role="status">
			{form.message}
		</p>{/if}
	{#if editor && editable}
		{#key editorKey}
			<section id="builder-editor" class="editor" aria-label="Editor baris">
				<h2>
					{editor.id ? 'Edit' : 'Tambah'}
					{names[editor.kind]} <small>· {editor.context}</small>
				</h2>
				<form method="POST" action="?/save" use:enhance={submit}>
					<input type="hidden" name="kind" value={editor.kind} /><input
						type="hidden"
						name="id"
						value={editor.id ?? ''}
					/>
					<input type="hidden" name="parentId" value={editor.parentId} /><input
						type="hidden"
						name="context"
						value={editor.context}
					/>
					<fieldset disabled={saving}>
						<div class="fields">
							{#if editor.kind === 'item'}
								{#if editor.id && editor.unitPrice && editor.total && !editor.materialUnitPrice && !editor.jasaUnitPrice}<p
										class="legacy wide"
									>
										Harga lama {money(editor.unitPrice)} / {editor.unit}. Total lama {money(
											editor.total
										)} tetap tersimpan sampai menentukan harga material dan jasa lalu menyimpan.
									</p>{/if}
								<label class="wide"
									>Deskripsi pekerjaan<input
										name="description"
										value={editor.description ?? ''}
										required
										maxlength="2000"
									/></label
								>
								<label
									>Satuan<input
										name="unit"
										value={editor.unit ?? ''}
										placeholder="m², m³, kg, ls"
										required
										maxlength="50"
									/></label
								>
								<label
									>Volume / QS<input
										name="volume"
										type="number"
										value={editor.volume ?? ''}
										min="0.0001"
										max="9999999999.9999"
										step="0.0001"
										required
									/></label
								>
								<label
									>Harga material / satuan (Rp)<input
										name="materialUnitPrice"
										type="number"
										value={editor.materialUnitPrice ?? ''}
										min="0"
										step="0.01"
										required
									/></label
								>
								<label
									>Harga jasa / satuan (Rp)<input
										name="jasaUnitPrice"
										type="number"
										value={editor.jasaUnitPrice ?? ''}
										min="0"
										step="0.01"
										required
									/></label
								>
								<label
									>Subkelompok<select name="subgroupId" value={editor.subgroupId ?? ''}
										><option value="">Tanpa subkelompok</option>{#each data.sections
											.flatMap((s) => s.groups)
											.find((g) => g.id === Number(editor?.parentId))?.subgroups ?? [] as subgroup}<option
												value={String(subgroup.id)}>{subgroup.name}</option
											>{/each}</select
									></label
								>
								<label
									>Urutan<input
										name="sortOrder"
										type="number"
										min="0"
										max="2147483647"
										step="1"
										value={editor.sortOrder}
										required
									/></label
								>
								<label class="wide"
									>Catatan<textarea
										name="notes"
										rows="2"
										maxlength="5000"
										value={editor.notes ?? ''}
									></textarea></label
								>
							{:else}
								<label class="grow"
									>Nama {names[editor.kind]}<input
										name="name"
										value={editor.name ?? ''}
										maxlength="250"
										required
									/></label
								>
								<label
									>Urutan<input
										name="sortOrder"
										type="number"
										min="0"
										max="2147483647"
										step="1"
										value={editor.sortOrder}
										required
									/></label
								>
							{/if}
						</div>
						<div class="form-actions">
							<button type="submit" name="operation" value="save"
								>{saving
									? 'Menyimpan…'
									: editor.id
										? 'Simpan perubahan'
										: `Tambah ${names[editor.kind]}`}</button
							><button class="secondary" type="button" onclick={() => (editor = null)}>Batal</button
							>
							{#if editor.id}
								{#if confirmingDelete}
									<span class="legacy">Hapus baris ini dan semua rincian di dalamnya?</span>
									<button
										class="danger"
										type="submit"
										name="operation"
										value="delete"
										formnovalidate>Ya, hapus</button
									>
									<button class="secondary" type="button" onclick={() => (confirmingDelete = false)}
										>Jangan hapus</button
									>
								{:else}
									<button class="danger" type="button" onclick={() => (confirmingDelete = true)}
										>Hapus {names[editor.kind]}</button
									>
								{/if}
							{/if}
						</div>
					</fieldset>
				</form>
			</section>
		{/key}
	{/if}

	{#snippet itemRow(item: Item, context: string)}
		<tr class="item-row"
			><td class="description"
				><strong>{item.description}</strong>{#if item.notes}<small>{item.notes}</small
					>{/if}</td
			>
			<td>{item.unit}</td><td class="num">{item.volume.replace(/\.?0+$/, '')}</td>
			<td class="num">{item.materialUnitPrice === null ? '—' : money(item.materialUnitPrice)}</td
			><td class="num">{item.jasaUnitPrice === null ? '—' : money(item.jasaUnitPrice)}</td>
			<td class="num">{item.materialTotal === null ? '—' : money(item.materialTotal)}</td><td
				class="num">{item.jasaTotal === null ? '—' : money(item.jasaTotal)}</td
			>
			<td class="num total">{money(item.total)}</td><td class="num"
				>{Number(item.weight).toFixed(4)}%</td
			><td class="num">{item.sortOrder}</td>
			<td
				>{#if editable}<button
						class="text-button"
						disabled={saving}
						aria-label={`Edit item ${item.description}`}
						onclick={() => openEditor('item', item.groupId, context, item)}>Edit</button
					>{/if}</td
			>
		</tr>
	{/snippet}
	{#if hasLegacyItems}
		<p class="legacy-notice">
			Beberapa item lama masih menggunakan harga satuan gabungan. Edit item untuk memisahkan harga material dan jasa.
		</p>
	{/if}
	<!-- svelte-ignore a11y_no_noninteractive_tabindex (keyboard users need to scroll the table) -->
	<div
		class="sheet"
		tabindex="0"
		role="region"
		aria-label="Tabel rincian RAB, geser horizontal untuk semua kolom"
	>
		<table>
			<thead
				><tr
					><th>Uraian pekerjaan</th><th>Unit</th><th class="num">Volume / QS</th><th class="num"
						>Harga material</th
					><th class="num">Harga jasa</th><th class="num">Total material</th><th class="num"
						>Total jasa</th
					><th class="num">Total (Rp)</th><th class="num">Bobot</th><th class="num">Urutan</th><th
						>Aksi</th
					></tr
				></thead
			>
			<tbody>
				{#each data.sections as section (section.id)}
					<tr class="section-row"
						><td colspan="7"
							><div class="hierarchy">
								<strong>AREA · {section.name}</strong>{#if editable}<span class="row-actions"
										><button
											disabled={saving}
											class="text-button"
											onclick={() => openEditor('section', null, data.rab.documentNumber, section)}
											>Edit area</button
										><button
											disabled={saving}
											class="text-button"
											onclick={() =>
												openEditor(
													'group',
													section.id,
													section.name,
													undefined,
													null,
													nextOrder(section.groups)
												)}>+ Kelompok</button
										></span
									>{/if}
							</div></td
						><td class="num total">{money(section.subtotal)}</td><td></td><td class="num"
							>{section.sortOrder}</td
						><td></td></tr
					>
					{#each section.groups as group (group.id)}
						<tr class="group-row"
							><td colspan="7"
								><div class="hierarchy">
									<strong>↳ {group.name}</strong>{#if editable}<span class="row-actions"
											><button
												disabled={saving}
												class="text-button"
												onclick={() => openEditor('group', section.id, section.name, group)}
												>Edit kelompok</button
											><button
												disabled={saving}
												class="text-button"
												onclick={() =>
													openEditor(
														'subgroup',
														group.id,
														group.name,
														undefined,
														null,
														nextOrder(group.subgroups)
													)}>+ Subkelompok</button
											><button
												disabled={saving}
												class="text-button"
												onclick={() =>
													openEditor(
														'item',
														group.id,
														group.name,
														undefined,
														null,
														nextOrder(group.items)
													)}>+ Item</button
											></span
										>{/if}
								</div></td
							><td class="num total">{money(group.subtotal)}</td><td></td><td class="num"
								>{group.sortOrder}</td
							><td></td></tr
						>
						{#each group.items as item (item.id)}{@render itemRow(item, group.name)}{/each}
						{#each group.subgroups as subgroup (subgroup.id)}
							<tr class="subgroup-row"
								><td colspan="7"
									><div class="hierarchy">
										<strong>↳ {subgroup.name}</strong>{#if editable}<span class="row-actions"
												><button
													disabled={saving}
													class="text-button"
													onclick={() => openEditor('subgroup', group.id, group.name, subgroup)}
													>Edit subkelompok</button
												><button
													disabled={saving}
													class="text-button"
													onclick={() =>
														openEditor(
															'item',
															group.id,
															`${group.name} / ${subgroup.name}`,
															undefined,
															subgroup.id,
															nextOrder(subgroup.items)
														)}>+ Item</button
												></span
											>{/if}
									</div></td
								><td class="num total">{money(subgroup.subtotal)}</td><td></td><td class="num"
									>{subgroup.sortOrder}</td
								><td></td></tr
							>
							{#each subgroup.items as item (item.id)}{@render itemRow(
									item,
									`${group.name} / ${subgroup.name}`
								)}{:else}<tr
									><td colspan="11" class="empty-row">Belum ada item dalam subkelompok ini.</td></tr
								>{/each}
						{/each}
						{#if !group.items.length && !group.subgroups.length}<tr
								><td colspan="11" class="empty-row"
									>Tambah item langsung atau buat subkelompok terlebih dahulu.</td
								></tr
							>{/if}
					{:else}<tr><td colspan="11" class="empty-row">Belum ada kelompok dalam area ini.</td></tr
						>{/each}
				{:else}<tr
						><td colspan="11" class="empty-row"
							>Belum ada rincian pekerjaan. {editable ? 'Mulai dengan + Area di atas.' : ''}</td
						></tr
					>{/each}
			</tbody>
		</table>
	</div>
	<footer>
		<p class="muted">
			Bobot = total item ÷ subtotal sebelum PPN × 100%.<br />Total material dan jasa dibulatkan 2
			desimal per item.<br />Total diperbarui setelah Simpan/Hapus.
		</p>
		<dl aria-label="Total RAB">
			<div>
				<dt>Grand subtotal</dt>
				<dd>{money(data.rab.subtotal)}</dd>
			</div>
			<div>
				<dt>PPN {Number(data.rab.taxRate)}%</dt>
				<dd>{money(data.rab.taxAmount)}</dd>
			</div>
			<div class="grand">
				<dt>Grand total</dt>
				<dd>{money(data.rab.grandTotal)}</dd>
			</div>
		</dl>
	</footer>
</div>

<style>
	.preview-link { background: #465fff; color: white; padding: 0.6rem 0.9rem; border-radius: 5px; font-size: 0.85rem; }
	.builder {
		color: #e4e7ec;
		min-width: 0;
	}
	nav,
	.muted,
	small {
		color: #98a2b3;
		font-size: 0.8rem;
	}
	a,
	.text-button {
		color: #a4bcfd;
	}
	header,
	.toolbar,
	footer,
	.hierarchy,
	.form-actions {
		display: flex;
		gap: 1rem;
		justify-content: space-between;
		align-items: center;
	}
	header {
		margin: 1.5rem 0;
		flex-wrap: wrap;
	}
	h1 {
		font-size: 1.5rem;
		font-weight: 650;
		overflow-wrap: anywhere;
	}
	h2 {
		font-weight: 600;
	}
	header p {
		margin-top: 0.4rem;
	}
	.eyebrow {
		color: #8098f9;
		font-size: 0.7rem;
		letter-spacing: 0.12em;
	}
	.badge {
		background: #053d32;
		color: #6ce9a6;
		padding: 0.45rem 0.65rem;
		border-radius: 6px;
		font-size: 0.75rem;
		white-space: nowrap;
	}
	.badge.locked {
		background: #3b2d15;
		color: #fec84b;
	}
	.toolbar {
		margin-bottom: 1rem;
	}
	.toolbar p {
		margin-top: 0.25rem;
	}
	button {
		cursor: pointer;
		background: #465fff;
		color: white;
		padding: 0.55rem 0.85rem;
		border-radius: 5px;
		font-size: 0.8rem;
		white-space: nowrap;
	}
	button:disabled {
		opacity: 0.5;
		cursor: wait;
	}
	.text-button {
		background: transparent;
		padding: 0.25rem 0.4rem;
	}
	button:hover:not(:disabled) {
		filter: brightness(1.2);
	}
	.secondary {
		background: #344054;
	}
	.danger {
		background: #4b2329;
		color: #fda29b;
		margin-left: auto;
	}
	.notice {
		background: #1d2939;
		padding: 0.8rem 1rem;
		margin-bottom: 1rem;
		border-left: 3px solid #8098f9;
		font-size: 0.85rem;
	}
	.legacy-notice {
		background: #1d2939;
		color: #d0d5dd;
		padding: 0.65rem 0.85rem;
		margin-bottom: 0.75rem;
		border-radius: 6px;
		font-size: 0.8rem;
	}
	.notice.error {
		color: #fda29b;
		border-color: #f97066;
	}
	.editor {
		padding: 1.2rem;
		margin-bottom: 1rem;
		border: 1px solid #465fff;
		border-radius: 8px;
		background: #101828;
		scroll-margin-top: 6rem;
	}
	.editor h2 {
		margin-bottom: 1rem;
	}
	.fields {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.8rem;
	}
	label {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		font-size: 0.8rem;
		color: #d0d5dd;
	}
	.wide {
		grid-column: 1 / -1;
	}
	.grow {
		grid-column: span 3;
	}
	input,
	select,
	textarea {
		min-width: 0;
		width: 100%;
		padding: 0.55rem 0.65rem;
		background: #1d2939;
		color: #f2f4f7;
		border: 1px solid #475467;
		border-radius: 5px;
		font: inherit;
		color-scheme: dark;
	}
	.form-actions {
		justify-content: start;
		margin-top: 1rem;
		flex-wrap: wrap;
	}
	.sheet {
		overflow-x: auto;
		border: 1px solid #344054;
		border-radius: 8px;
		background: #101828;
	}
	table {
		width: 100%;
		min-width: 1480px;
		border-collapse: collapse;
		font-size: 0.8rem;
	}
	th {
		font-size: 0.7rem;
		color: #98a2b3;
		font-weight: 500;
		background: #161f30;
		white-space: nowrap;
	}
	th,
	td {
		padding: 0.7rem 0.65rem;
		border-bottom: 1px solid #263244;
		vertical-align: top;
	}
	.num {
		text-align: right;
		white-space: nowrap;
		font-variant-numeric: tabular-nums;
	}
	.total {
		font-weight: 600;
		color: #f2f4f7;
	}
	.description {
		min-width: 260px;
		max-width: 400px;
		overflow-wrap: anywhere;
	}
	.description small {
		display: block;
		margin-top: 0.25rem;
		white-space: pre-wrap;
	}
	.section-row {
		background: #26365b;
	}
	.group-row {
		background: #1d2939;
	}
	.group-row .hierarchy {
		padding-left: 0.8rem;
	}
	.subgroup-row {
		background: #172132;
	}
	.subgroup-row .hierarchy {
		padding-left: 1.6rem;
	}
	.hierarchy {
		align-items: center;
		min-height: 1.7rem;
	}
	.row-actions {
		display: flex;
		gap: 0.35rem;
	}
	.empty-row {
		color: #98a2b3;
		padding: 1.25rem;
	}
	.legacy {
		color: #fec84b;
		font-size: 0.75rem;
	}
	footer {
		margin-top: 1.25rem;
		align-items: start;
		flex-wrap: wrap;
	}
	footer p {
		line-height: 1.7;
	}
	dl {
		width: min(100%, 420px);
		margin-left: auto;
	}
	dl div {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.55rem 0;
		font-size: 0.85rem;
	}
	dd {
		font-variant-numeric: tabular-nums;
		text-align: right;
	}
	.grand {
		border-top: 1px solid #475467;
		color: #c7d7fe;
		font-weight: 650;
		font-size: 1rem;
		margin-top: 0.35rem;
	}
	:is(button, a, input, select, textarea, .sheet):focus-visible {
		outline: 2px solid #a4bcfd;
		outline-offset: 2px;
	}
	@media (max-width: 700px) {
		h1 {
			font-size: 1.2rem;
		}
		.fields {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.grow {
			grid-column: 1 / -1;
		}
		.toolbar {
			align-items: start;
		}
		.editor {
			padding: 0.8rem;
		}
		.danger {
			margin-left: 0;
		}
	}
</style>
