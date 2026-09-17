<script lang="ts">
	type ClientOption = { id: number; companyName: string };
	type Values = {
		clientId: number;
		projectName: string;
		transactionTitle: string;
		location: string;
		acquisitionType: string;
		description: string;
	};
	type FormResult = { values?: Values; errors?: Record<string, string>; message?: string };
	let { clients, form = null }: { clients: ClientOption[]; form?: FormResult | null } = $props();
	let values = $derived(form?.values);
	let errors = $derived(form?.errors ?? {});
</script>

<form method="POST" class="project-form">
	{#if form?.message}<div class="notice" role="alert">{form.message}</div>{/if}
	<section class="panel" aria-labelledby="project-heading">
		<h2 id="project-heading">Project information</h2>
		<p class="intro">
			Project ID akan dibuat otomatis dengan format PRE berdasarkan tahun WIB saat disimpan.
		</p>
		<div class="fields">
			<label class="field full">
				<span>Client *</span>
				<select name="clientId" required aria-invalid={!!errors.clientId}>
					<option value="">Pilih client</option>
					{#each clients as client (client.id)}
						<option value={client.id} selected={values?.clientId === client.id}>
							{client.companyName}
						</option>
					{/each}
				</select>
				{#if errors.clientId}<small>{errors.clientId}</small>{/if}
			</label>
			<label class="field full">
				<span>Nama project *</span>
				<input
					name="projectName"
					value={values?.projectName ?? ''}
					required
					aria-invalid={!!errors.projectName}
				/>
				{#if errors.projectName}<small>{errors.projectName}</small>{/if}
			</label>
			<label class="field">
				<span>Judul transaksi</span>
				<input name="transactionTitle" value={values?.transactionTitle ?? ''} />
			</label>
			<label class="field">
				<span>Lokasi</span>
				<input name="location" value={values?.location ?? ''} />
			</label>
			<label class="field full">
				<span>Tipe akuisisi</span>
				<input name="acquisitionType" value={values?.acquisitionType ?? ''} />
			</label>
			<label class="field full">
				<span>Deskripsi</span>
				<textarea name="description" rows="5">{values?.description ?? ''}</textarea>
			</label>
		</div>
	</section>
	<div class="actions">
		<a class="button" href="/admin/projects">Cancel</a>
		<button class="button primary" type="submit" disabled={!clients.length}>Create Project</button>
	</div>
</form>

<style>
	.project-form { display: grid; gap: 24px; min-width: 0; }
	.panel { padding: 24px; border: 1px solid var(--ta-border); border-radius: 16px; background: var(--ta-bg); }
	h2 { margin: 0; font-size: 18px; font-weight: 600; color: #f2f4f7; }
	.intro { margin: 8px 0 24px; font-size: 14px; line-height: 22px; color: var(--ta-muted); }
	.fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
	.field { display: flex; min-width: 0; flex-direction: column; gap: 8px; font-size: 14px; font-weight: 500; }
	.full { grid-column: 1 / -1; }
	.field input, .field select, .field textarea { width: 100%; min-width: 0; min-height: 44px; border: 1px solid var(--ta-border); border-radius: 8px; background: #000; padding: 10px 12px; color: var(--ta-text); font: inherit; }
	.field textarea { resize: vertical; }
	.field small { color: #fda29b; font-weight: 400; }
	.actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 12px; }
	.button { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 10px 18px; border: 1px solid var(--ta-border); border-radius: 8px; background: transparent; color: var(--ta-text); font: inherit; font-size: 14px; font-weight: 500; text-decoration: none; }
	.button:hover { background: rgb(255 255 255 / 6%); }
	.primary { background: #465fff; border-color: #465fff; color: white; }
	.primary:hover { background: #3641f5; }
	.primary:disabled { cursor: not-allowed; opacity: 0.55; }
	.notice { padding: 14px 16px; border: 1px solid rgb(240 68 56 / 30%); border-radius: 8px; color: #fda29b; font-size: 14px; overflow-wrap: anywhere; }
	:is(a, button, input, select, textarea):focus-visible { outline: 2px solid #a4bcfd; outline-offset: 3px; }
	@media (max-width: 767px) {
		.panel { padding: 20px 16px; }
		.fields { grid-template-columns: minmax(0, 1fr); }
	}
</style>
