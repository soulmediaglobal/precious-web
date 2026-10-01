<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const outcomeLabels: Record<string, string> = {
		success: 'Berhasil',
		failure: 'Gagal',
		denied: 'Ditolak',
		pending: 'Hasil belum tercatat',
		uncertain: 'Belum pasti'
	};

	const dateFormatter = new Intl.DateTimeFormat('id-ID', {
		dateStyle: 'medium',
		timeStyle: 'medium',
		timeZone: 'Asia/Jakarta'
	});

	function formatTime(value: string) {
		return dateFormatter.format(new Date(value));
	}
</script>

<svelte:head>
	<title>Log Management | Precious Admin</title>
</svelte:head>

<div class="log-page">
	<header>
		<p class="breadcrumb"><a href="/admin">Home</a> / Log Management</p>
		<h1>Log Management</h1>
		<p>Riwayat aktivitas CMS. Semua waktu ditampilkan dalam WIB.</p>
	</header>

	<div class="notice">
		Saat ini mencatat pembuatan user dan perubahan profil/akses user sejak audit diaktifkan.
		Aktivitas modul lain akan ditambahkan bertahap. Riwayat lama tidak dibuat ulang. Log tidak bisa
		diedit atau dihapus melalui CMS.
	</div>

	<section class="log-panel" aria-label="Daftar aktivitas">
		{#if data.logs.length === 0}
			<p class="empty">
				{data.page === 1
					? 'Belum ada log aktivitas yang tercatat.'
					: 'Tidak ada log di halaman ini.'}
			</p>
		{:else}
			<div class="table-scroll">
				<table>
					<thead>
						<tr>
							<th scope="col">Waktu (WIB)</th>
							<th scope="col">User</th>
							<th scope="col">Aktivitas</th>
							<th scope="col">Hasil</th>
							<th scope="col">Detail</th>
						</tr>
					</thead>
					<tbody>
						{#each data.logs as log (log.id)}
							<tr>
								<td><time datetime={log.occurredAt}>{formatTime(log.occurredAt)}</time></td>
								<td>
									<strong
										>{log.actorName ||
											(log.actorUserId ? 'Nama belum diisi' : 'Tidak teridentifikasi')}</strong
									>
									<span class="secondary">{log.actorRole ?? 'Tanpa identitas terverifikasi'}</span>
								</td>
								<td>
									{log.summary}
									<span class="secondary">{log.action}</span>
								</td>
								<td>
									<span class="badge" data-outcome={log.outcome}>
										{outcomeLabels[log.outcome] ?? log.outcome}
									</span>
								</td>
								<td>
									<details>
										<summary>Lihat detail</summary>
										<dl>
											<dt>ID log</dt>
											<dd>{log.id}</dd>
											<dt>ID pelaku</dt>
											<dd>{log.actorUserId ?? 'Tidak tersedia'}</dd>
											<dt>Jenis objek</dt>
											<dd>{log.entityType}</dd>
											<dt>ID objek</dt>
											<dd>{log.entityId ?? 'Belum tersedia'}</dd>
											<dt>ID proses</dt>
											<dd>{log.correlationId}</dd>
										</dl>
									</details>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>

	<nav class="pagination" aria-label="Halaman log aktivitas">
		{#if data.page > 1}
			<a class="button" href={`/admin/logs?page=${data.page - 1}`}>Sebelumnya</a>
		{:else}
			<span class="button disabled" aria-disabled="true">Sebelumnya</span>
		{/if}
		<span>Halaman {data.page} · maksimal {data.pageSize} log per halaman</span>
		{#if data.hasMore && data.page < 10000}
			<a class="button" href={`/admin/logs?page=${data.page + 1}`}>Berikutnya</a>
		{:else}
			<span class="button disabled" aria-disabled="true">Berikutnya</span>
		{/if}
	</nav>
</div>

<style>
	.log-page {
		display: grid;
		gap: 24px;
	}
	header,
	.log-panel {
		border: 1px solid var(--ta-border);
		border-radius: 16px;
		background: var(--ta-bg);
	}
	header {
		padding: 24px;
	}
	.breadcrumb {
		margin: 0 0 12px;
		color: var(--ta-muted);
		font-size: 14px;
	}
	.breadcrumb a {
		color: inherit;
		text-decoration: none;
	}
	h1 {
		margin: 0;
		color: var(--ta-text);
		font-size: 28px;
	}
	header > p:last-child {
		margin: 8px 0 0;
		color: var(--ta-muted);
	}
	.notice {
		padding: 16px;
		border: 1px solid var(--ta-border);
		border-radius: 12px;
		color: var(--ta-muted);
		line-height: 1.6;
	}
	.table-scroll {
		overflow-x: auto;
	}
	table {
		width: 100%;
		border-collapse: collapse;
		text-align: left;
	}
	th,
	td {
		padding: 16px;
		border-bottom: 1px solid var(--ta-border);
		vertical-align: top;
	}
	th {
		color: var(--ta-muted);
		font-size: 13px;
	}
	td {
		color: var(--ta-text);
		font-size: 14px;
		line-height: 1.6;
	}
	tbody tr:last-child td {
		border-bottom: 0;
	}
	time {
		white-space: nowrap;
	}
	.secondary {
		display: block;
		color: var(--ta-muted);
		font-size: 12px;
		overflow-wrap: anywhere;
	}
	.badge {
		display: inline-block;
		padding: 3px 9px;
		border: 1px solid var(--ta-border);
		border-radius: 999px;
		white-space: nowrap;
		font-size: 12px;
	}
	.badge[data-outcome='success'] {
		color: #6ce9a6;
	}
	.badge[data-outcome='failure'],
	.badge[data-outcome='denied'] {
		color: #fda29b;
	}
	.badge[data-outcome='pending'],
	.badge[data-outcome='uncertain'] {
		color: #fec84b;
	}
	summary {
		cursor: pointer;
		white-space: nowrap;
	}
	dl {
		min-width: 220px;
		margin: 12px 0 0;
	}
	dt {
		color: var(--ta-muted);
		font-size: 12px;
	}
	dd {
		margin: 0 0 8px;
		overflow-wrap: anywhere;
	}
	.empty {
		padding: 24px;
		margin: 0;
		color: var(--ta-muted);
	}
	.pagination {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		color: var(--ta-muted);
		font-size: 13px;
	}
	.button {
		padding: 10px 16px;
		border: 1px solid var(--ta-border);
		border-radius: 8px;
		color: var(--ta-text);
		text-decoration: none;
	}
	.disabled {
		opacity: 0.45;
	}
</style>
