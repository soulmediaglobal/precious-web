<script lang="ts">
	import { money } from '$lib/rab-builder/values';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	type Item = PageData['sections'][number]['groups'][number]['items'][number];
	const number = (value: string) => {
		const [whole, fraction = ''] = value.split('.');
		const decimals = fraction.replace(/0+$/, '');
		return new Intl.NumberFormat('id-ID').format(BigInt(whole)) + (decimals ? `,${decimals}` : '');
	};
	// Round the stored decimal percentage upward without floating-point drift.
	const weight = (value: string) => {
		const [whole, fraction = ''] = value.split('.');
		const hundredths = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0').slice(0, 2))
			+ (/[1-9]/.test(fraction.slice(2)) ? 1n : 0n);
		return `${number(`${hundredths / 100n}.${String(hundredths % 100n).padStart(2, '0')}`)}%`;
	};
	const date = (value: string) => new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));
</script>

<svelte:head>
	<title>Preview RAB · {data.rab.documentNumber}</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>
<div class="preview">
	<nav aria-label="Kontrol preview">
		<a href={`/admin-v2/projects/${data.project.id}/rab/${data.rab.id}`}>← Back to Builder</a>
		<p>Preview data tersimpan. Simpan perubahan di Builder sebelum mencetak.</p>
		<button onclick={() => window.print()}>Print / Save PDF</button>
	</nav>
	<main class="document">
		<header>
			<img src="/logo.svg" alt="Precious Contractor" width="100" height="70" />
			<div class="company"><p class="company-name">PT PRECIOUS CONTRACTOR</p><p class="office">Office : GO WORK Sopo Del Tower B lt. 22, Jl. Mega Kuningan Barat III No.Lot 10 Tower B, 22nd floor, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12950</p></div>
		</header>
		<div class="document-title"><h1>Rencana Anggaran Biaya</h1><p>{data.rab.documentNumber}</p></div>
		<div class="draft">DRAFT · Belum diterbitkan / disetujui</div>
		<section class="metadata" aria-label="Identitas dokumen">
			<dl><div><dt>Project</dt><dd>{data.project.projectName}</dd></div><div><dt>ID Project</dt><dd>{data.project.projectNumber}</dd></div>
			{#if data.project.clientName}<div><dt>Klien</dt><dd>{data.project.clientName}</dd></div>{/if}
			{#if data.project.location}<div><dt>Lokasi</dt><dd>{data.project.location}</dd></div>{/if}</dl>
			<dl><div><dt>Tanggal</dt><dd>{date(data.rab.offerDate)}</dd></div><div><dt>Revisi</dt><dd>{data.rab.revisionNumber}</dd></div><div><dt>Status</dt><dd>DRAFT</dd></div></dl>
		</section>
		{#if data.rab.greeting}<p class="greeting">{data.rab.greeting}</p>{/if}
		{#snippet itemRow(item: Item)}
			<tr><td>{item.description}{#if item.notes}<small>{item.notes}</small>{/if}
			{#if item.materialUnitPrice === null || item.jasaUnitPrice === null}<small>Harga lama gabungan: {money(item.unitPrice)} / satuan (belum dipisah).</small>{/if}</td>
			<td>{item.unit}</td><td class="num">{number(item.volume)}</td><td class="num">{item.materialUnitPrice === null ? '—' : money(item.materialUnitPrice)}</td><td class="num">{item.jasaUnitPrice === null ? '—' : money(item.jasaUnitPrice)}</td><td class="num">{money(item.total)}</td><td class="num">{weight(item.weight)}</td></tr>
		{/snippet}
		<table>
			<colgroup><col style="width:28%" /><col style="width:6%" /><col style="width:8%" /><col style="width:15%" /><col style="width:15%" /><col style="width:19%" /><col style="width:9%" /></colgroup>
			<thead><tr><th>Uraian pekerjaan</th><th>Unit</th><th class="num">Volume</th><th class="num">Harga material<br />/ satuan</th><th class="num">Harga jasa<br />/ satuan</th><th class="num">Total</th><th class="num">Bobot<br />(%)</th></tr></thead>
			<tbody>
				{#each data.sections as section}
					<tr class="area heading"><th colspan="5" scope="row">AREA · {section.name}</th><td class="num">{money(section.subtotal)}</td><td></td></tr>
					{#each section.groups as group}
						<tr class="group heading"><th colspan="5" scope="row">{group.name}</th><td class="num">{money(group.subtotal)}</td><td></td></tr>
						{#each group.items as item}{@render itemRow(item)}{/each}
						{#each group.subgroups as subgroup}
							<tr class="subgroup heading"><th colspan="5" scope="row">{subgroup.name}</th><td class="num">{money(subgroup.subtotal)}</td><td></td></tr>
							{#each subgroup.items as item}{@render itemRow(item)}{/each}
						{/each}
					{/each}
				{:else}<tr><td colspan="7">Belum ada rincian pekerjaan.</td></tr>{/each}
			</tbody>
		</table>
		<dl class="totals"><div><dt>Subtotal sebelum PPN</dt><dd>{money(data.rab.subtotal)}</dd></div><div><dt>PPN {number(data.rab.taxRate)}%</dt><dd>{money(data.rab.taxAmount)}</dd></div><div class="grand"><dt>Grand total</dt><dd>{money(data.rab.grandTotal)}</dd></div></dl>
		{#if data.rab.signatoryName}<div class="signatory"><p>Disiapkan oleh,</p><strong>{data.rab.signatoryName}</strong>{#if data.rab.signatoryTitle}<p>{data.rab.signatoryTitle}</p>{/if}</div>{/if}
		<footer>Precious Contractor <span>DRAFT · Untuk peninjauan</span></footer>
	</main>
</div>

<style>
	:global(body) { background: #e9edf1; }
	.preview { color: #202b36; font-family: Arial, sans-serif; font-size: 12px; line-height: 1.5; }
	nav { max-width: 1000px; margin: auto; padding: 18px; display: flex; gap: 20px; align-items: center; justify-content: space-between; }
	nav p { color: #526170; font-size: 11px; flex: 1; }
	a { color: #204d70; } button { background: #204d70; color: white; padding: 10px 16px; border-radius: 5px; cursor: pointer; }
	.document { box-sizing: border-box; width: 210mm; min-height: 297mm; margin: 0 auto 30px; padding: 14mm 12mm; background: white; box-shadow: 0 3px 20px #20304015; }
	header { display: flex; align-items: center; gap: 24px; background: #000; color: #fff; padding: 22px; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
	header img { flex-shrink: 0; object-fit: contain; }
	.company { flex: 1; }
	.company-name { font-size: 18px; font-weight: 700; letter-spacing: 0.6px; margin-bottom: 8px; }
	.office { font-size: 10px; line-height: 1.65; color: #eee; }
	.document-title { text-align: right; margin-top: 20px; }
	h1 { font-size: 23px; font-weight: 700; margin: 5px 0; }
	.draft { border: 1px solid #a87622; color: #795619; padding: 6px 12px; margin: 16px 0; font-size: 11px; font-weight: bold; letter-spacing: 1px; text-align: center; }
	.metadata { display: grid; grid-template-columns: 3fr 2fr; gap: 25px; margin-bottom: 22px; } dl div { display: flex; gap: 12px; margin-bottom: 5px; } dt { color: #526170; min-width: 66px; } dd { margin: 0; overflow-wrap: anywhere; }
	.greeting { white-space: pre-wrap; margin-bottom: 20px; }
	table { width: 100%; table-layout: fixed; border-collapse: collapse; font-size: 9px; } th, td { padding: 8px 5px; text-align: left; border-bottom: 1px solid #d7dde3; vertical-align: top; overflow-wrap: anywhere; } thead th { background: #000; color: #fff; font-weight: 600; vertical-align: middle; padding: 11px 7px; line-height: 1.5; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
	thead th:nth-child(2), thead th:nth-child(3), tbody td:nth-child(2):not(.num) { text-align: center; } .num { text-align: right; font-variant-numeric: tabular-nums; } small { display: block; font-size: 8px; color: #586470; margin-top: 4px; white-space: pre-wrap; }
	.area { background: #dce6ed; font-weight: bold; } .group { background: #eef2f5; font-weight: bold; } .subgroup th { padding-left: 15px; } .subgroup { color: #42576a; }
	.totals { width: 60%; margin: 22px 0 24px auto; font-size: 12px; break-inside: avoid; } .totals div { justify-content: space-between; padding: 5px 0; } .totals dd { text-align: right; } .grand { border-top: 2px solid #204d70; font-weight: bold; font-size: 14px; } .signatory { break-inside: avoid; margin: 24px 0; } .signatory strong { display: block; margin-top: 24px; }
	footer { border-top: 1px solid #d7dde3; padding-top: 12px; margin-top: 30px; color: #526170; font-size: 10px; display: flex; justify-content: space-between; }
	@media screen and (max-width: 820px) { .preview { overflow-x: auto; } nav { min-width: 320px; flex-wrap: wrap; } nav p { flex-basis: 100%; order: 3; } }
	@page { size: A4 portrait; margin: 12mm; }
	@media print {
		.document::before { content: "DRAFT"; position: fixed; top: 42%; left: 22%; transform: rotate(-30deg); font-size: 100px; letter-spacing: 14px; color: #00000012; pointer-events: none; }
		:global(body) { background: white; } nav { display: none; } .document { width: 100%; min-height: 0; margin: 0; padding: 0; box-shadow: none; }
		thead { display: table-header-group; } tr { break-inside: avoid; } .heading { break-after: avoid; } header, .metadata, .draft { break-inside: avoid; }
		thead th { color: #fff; background: #000; border-bottom: 1px solid #000; } .draft { color: #63400b; } table { font-size: 9px; }
	}
</style>
