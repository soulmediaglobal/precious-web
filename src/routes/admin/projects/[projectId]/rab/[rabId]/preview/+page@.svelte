<script lang="ts">
	import { paginatePreview } from '$lib/rab-builder/preview-pagination';
	import '$lib/rab-builder/preview.css';
	import { cents, money } from '$lib/rab-builder/values';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	const alphabetic = (index: number): string => {
		let result = '';
		for (let n = index + 1; n > 0; n = Math.floor((n - 1) / 26))
			result = String.fromCharCode(65 + ((n - 1) % 26)) + result;
		return result;
	};
	type Item = PageData['sections'][number]['groups'][number]['items'][number];
	const number = (value: string) => {
		const [whole, fraction = ''] = value.split('.');
		const decimals = fraction.replace(/0+$/, '');
		return new Intl.NumberFormat('id-ID').format(BigInt(whole)) + (decimals ? `,${decimals}` : '');
	};
	// Round the stored decimal percentage upward without floating-point drift.
	const weightHundredths = (value: string) => {
		const [whole, fraction = ''] = value.split('.');
		const hundredths =
			BigInt(whole) * 100n +
			BigInt(fraction.padEnd(2, '0').slice(0, 2)) +
			(/[1-9]/.test(fraction.slice(2)) ? 1n : 0n);
		return hundredths;
	};
	const formatWeight = (hundredths: bigint) =>
		`${number(`${hundredths / 100n}.${String(hundredths % 100n).padStart(2, '0')}`)}%`;
	const weight = (value: string) => formatWeight(weightHundredths(value));
	// Match the existing pre-tax weight basis; round only the exact parent ratio.
	const totalWeight = (subtotal: string, items: Item[]) => {
		if (!items.length) return '';
		const basis = cents(data.rab.subtotal);
		const scaled = cents(subtotal) * 10000n;
		return formatWeight(basis === 0n ? 0n : (scaled + basis - 1n) / basis);
	};
	type Group = PageData['sections'][number]['groups'][number];
	const groupLeaves = (group: Group) => [
		...group.items,
		...group.subgroups.flatMap((subgroup) => subgroup.items)
	];
	const creationDate = (value: Date | string) =>
		new Intl.DateTimeFormat('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			timeZone: 'Asia/Jakarta'
		}).format(new Date(value));
	const date = (value: string) =>
		new Intl.DateTimeFormat('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			timeZone: 'UTC'
		}).format(new Date(`${value}T00:00:00Z`));
</script>

<svelte:head>
	<title>Preview RAB · {data.rab.documentNumber}</title>
	<link
		href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap"
		rel="stylesheet"
	/>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>
<div class="rab-preview" use:paginatePreview>
	<nav aria-label="Kontrol preview">
		<a href={`/admin/projects/${data.project.id}/rab/${data.rab.id}`}>← Back to Builder</a>
		<p>Preview data tersimpan. Simpan perubahan di Builder sebelum mencetak.</p>
		<button data-print disabled onclick={() => window.print()}>Print / Save PDF</button>
	</nav>
	<p class="pagination-status" data-pagination-status role="status">Menyiapkan halaman A4…</p>
	<main data-pages aria-label="Preview RAB"></main>
	<div class="document-source" data-source aria-hidden="true" inert>
		<header data-letterhead>
			<img src="/logo.svg" alt="Precious Contractor" width="100" height="70" />
			<div class="company">
				<p class="company-name">PT PRECIOUS CONTRACTOR INDONESIA</p>
				<p class="office">GO WORK SOPO DEL TOWER B lt. 22</p>
				<p>Jl. Mega Kuningan Barat III No.Lot 10 Tower B, 22nd floor</p>
				<p>Kota Jakarta Selatan, DKI Jakarta 12950</p>
			</div>
		</header>
		<div data-content>
			<div class="introduction">
				<div class="document-title">
					<h1>Rencana Anggaran Biaya</h1>
					<p>{data.rab.documentNumber}</p>
				</div>
				<div class="draft">DRAFT · Belum diterbitkan / disetujui</div>
				<section class="metadata" aria-label="Identitas dokumen">
					<dl>
						<div>
							<dt>Project</dt>
							<dd>{data.project.projectName}</dd>
						</div>
						<div>
							<dt>ID Project</dt>
							<dd>{data.project.projectNumber}</dd>
						</div>
						{#if data.project.clientName}<div>
								<dt>Klien</dt>
								<dd>{data.project.clientName}</dd>
							</div>{/if}
						{#if data.project.location}<div>
								<dt>Lokasi</dt>
								<dd>{data.project.location}</dd>
							</div>{/if}
					</dl>
					<dl>
						<div>
							<dt>Tanggal</dt>
							<dd>{date(data.rab.offerDate)}</dd>
						</div>
						<div>
							<dt>Revisi</dt>
							<dd>{data.rab.revisionNumber}</dd>
						</div>
						<div>
							<dt>Status</dt>
							<dd>DRAFT</dd>
						</div>
					</dl>
				</section>
			</div>
			{#if data.rab.greeting}<p class="greeting">{data.rab.greeting}</p>{/if}
			{#snippet itemRow(item: Item, label: string, depth: number)}
				<tr style={`--hierarchy-depth: ${depth}`}
					><td
						><span class="hierarchy-number">{label}</span>{item.description}{#if item.notes}<small
								>{item.notes}</small
							>{/if}
						{#if item.materialUnitPrice === null || item.jasaUnitPrice === null}<small
								>Harga lama gabungan: {money(item.unitPrice)} / satuan (belum dipisah).</small
							>{/if}</td
					>
					<td>{item.unit}</td><td class="num">{number(item.volume)}</td><td class="num"
						>{item.materialUnitPrice === null ? '—' : money(item.materialUnitPrice)}</td
					><td class="num">{money(item.total)}</td><td class="num">{weight(item.weight)}</td></tr
				>
			{/snippet}
			<table class="work-table">
				<caption><span class="section-number">1</span> Rincian Pekerjaan</caption>
				<colgroup
					><col style="width:35%" /><col style="width:6%" /><col style="width:8%" /><col
						style="width:20%"
					/><col style="width:22%" /><col style="width:9%" /></colgroup
				>
				<thead
					><tr
						><th>Uraian Pekerjaan</th><th>Unit</th><th class="num">Volume</th><th class="num"
							>Harga Material<br />/ Satuan</th
						><th class="num">Total</th><th class="num">Bobot<br />(%)</th></tr
					></thead
				>
				<tbody>
					{#each data.sections as section, areaIndex}
						<tr class="area heading"
							><th colspan="4" scope="row"
								><span class="hierarchy-number">{alphabetic(areaIndex)}.</span>AREA · {section.name}</th
							><td class="num">{money(section.subtotal)}</td><td class="num"
								>{totalWeight(section.subtotal, section.groups.flatMap(groupLeaves))}</td
							></tr
						>
						{#each section.groups as group, groupIndex}
							{@const groupNumber = `${groupIndex + 1}`}
							<tr class="group heading"
								><th colspan="4" scope="row"
									><span class="hierarchy-number">{groupNumber}</span>{group.name}</th
								><td class="num">{money(group.subtotal)}</td><td class="num"
									>{totalWeight(group.subtotal, groupLeaves(group))}</td
								></tr
							>
							{#each group.items as item, itemIndex}{@render itemRow(
									item,
									`${groupNumber}.${itemIndex + 1}`,
									2
								)}{/each}
							{#each group.subgroups as subgroup, subgroupIndex}
								{@const subgroupNumber = `${groupNumber}.${group.items.length + subgroupIndex + 1}`}
								<tr class="subgroup heading"
									><th colspan="4" scope="row"
										><span class="hierarchy-number">{subgroupNumber}</span>{subgroup.name}</th
									><td class="num">{money(subgroup.subtotal)}</td><td class="num"
										>{totalWeight(subgroup.subtotal, subgroup.items)}</td
									></tr
								>
								{#each subgroup.items as item, itemIndex}{@render itemRow(
										item,
										`${subgroupNumber}.${itemIndex + 1}`,
										3
									)}{/each}
							{/each}
						{/each}
					{:else}<tr><td colspan="6">Belum ada rincian pekerjaan.</td></tr>{/each}
				</tbody>
			</table>
			<dl class="totals">
				<div>
					<dt>Subtotal sebelum PPN</dt>
					<dd>{money(data.rab.subtotal)}</dd>
				</div>
				<div>
					<dt>PPN {number(data.rab.taxRate)}%</dt>
					<dd>{money(data.rab.taxAmount)}</dd>
				</div>
				<div class="grand">
					<dt>Grand total</dt>
					<dd>{money(data.rab.grandTotal)}</dd>
				</div>
			</dl>
			{#if data.stages.length}
				<table class="stages-table">
					<caption><span class="section-number">2</span> Tahapan Pelaksanaan</caption>
					<colgroup
						><col style="width:8%" /><col style="width:30%" /><col style="width:62%" /></colgroup
					>
					<thead><tr><th>No.</th><th>Tahapan</th><th>Uraian Pelaksanaan</th></tr></thead>
					<tbody
						>{#each data.stages as stage, index}<tr
								><td>{index + 1}.</td><td><strong>{stage.name}</strong></td><td class="multiline"
									>{stage.description ?? '—'}</td
								></tr
							>{/each}</tbody
					>
				</table>
			{/if}
			{#if data.paymentTerms.length}
				<table class="terms-table">
					<caption><span class="section-number">3</span> Termin Pembayaran</caption>
					<colgroup
						><col style="width:33%" /><col style="width:27%" /><col style="width:14%" /><col
							style="width:26%"
						/></colgroup
					>
					<thead
						><tr
							><th>Termin</th><th>Tahapan</th><th class="num">Persentase</th><th class="num"
								>Nominal</th
							></tr
						></thead
					><tbody>
						{#each data.paymentTerms as term}<tr
								><td
									><strong>{term.name}</strong>{#if term.paymentTrigger}<small
											>{term.paymentTrigger}</small
										>{/if}</td
								><td>{data.stages.find((stage) => stage.id === term.stageId)?.name ?? '—'}</td><td
									class="num"
									>{term.percentage === null ? 'Legacy / —' : `${number(term.percentage)}%`}</td
								><td class="num">{money(term.amount)}</td></tr
							>{/each}
					</tbody>
				</table>
			{/if}
			<div class="signatory">
				<p>Jakarta, {creationDate(data.rab.createdAt)}</p>
				<p>Dibuat Oleh,</p>
				<div class="signature-space" aria-hidden="true"><br /><br /><br /></div>
				<strong>Nugroho Kristianto</strong>
				<p>Direktur</p>
			</div>
		</div>
		<footer>
			<span>Precious Contractor · DRAFT · Untuk peninjauan</span><span data-page-number></span>
		</footer>
	</div>
</div>
