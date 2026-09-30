<script lang="ts">
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
	let accessLocked = $derived(data.isSelf || data.user.deletionPending);

	const roleLabels: Record<string, string> = {
		admin: 'Admin',
		director: 'Director',
		manager: 'Manager',
		staff: 'Staff'
	};

	function confirmDeletion(event: SubmitEvent) {
		if (
			!window.confirm(
				'Hapus akun ini secara permanen? Akun login tidak dapat dipulihkan melalui CMS.'
			)
		) {
			event.preventDefault();
		}
	}
</script>

<svelte:head>
	<title>Manage User | Precious Admin</title>
</svelte:head>

<div class="user-page">
	<header>
		<p class="breadcrumb">
			<a href="/admin">Home</a> / <a href="/admin/users">Users</a> / Manage
		</p>
		<h1>Manage User</h1>
		<p class="email">{data.user.email}</p>
	</header>

	{#if form?.message}
		<div class="notice error" role="alert">{form.message}</div>
	{:else if data.deleteMessage}
		<div class="notice error" role="alert">{data.deleteMessage}</div>
	{:else if data.user.deletionPending}
		<div class="notice error" role="status">
			Proses hapus belum selesai. Akses CMS dinonaktifkan; gunakan Retry deletion untuk melanjutkan.
		</div>
	{:else if data.saved}
		<div class="notice success" role="status">Profil dan akses user berhasil diperbarui.</div>
	{/if}

	<form method="POST">
		<label for="name">Nama</label>
		<input
			id="name"
			name="name"
			type="text"
			autocomplete="name"
			maxlength="120"
			value={form?.values?.name ?? data.user.name}
			disabled={data.user.deletionPending}
			required
		/>

		<label for="position">Posisi / jabatan</label>
		<input
			id="position"
			name="position"
			type="text"
			autocomplete="organization-title"
			maxlength="160"
			value={form?.values?.position ?? data.user.position}
			disabled={data.user.deletionPending}
			required
		/>
		<p class="help">Jabatan pekerjaan, terpisah dari role akses CMS.</p>

		<label for="email">Email</label>
		<input id="email" type="email" value={data.user.email} disabled />
		<p class="help">Email login ditampilkan sebagai referensi.</p>

		{#if data.isSelf}
			<p class="help">Lo boleh mengedit profil sendiri. Role dan status akun tetap dilindungi.</p>
			<input type="hidden" name="role" value={data.user.role} />
			<input type="hidden" name="isActive" value={String(data.user.isActive)} />
		{/if}

		<label for="role">Role</label>
		<select id="role" name="role" disabled={accessLocked} required>
			{#each data.assignableRoles as role}
				<option value={role} selected={data.user.role === role}>
					{roleLabels[role]}
				</option>
			{/each}
		</select>

		<label for="isActive">CMS access</label>
		<select id="isActive" name="isActive" disabled={accessLocked} required>
			<option value="true" selected={data.user.isActive}>Active</option>
			<option value="false" selected={!data.user.isActive}>Inactive</option>
		</select>
		<p class="help">
			User inactive ditolak saat membuka halaman atau mengirim tindakan CMS berikutnya.
		</p>

		<div class="actions">
			<a class="button" href="/admin/users">Back to users</a>
			{#if !data.user.deletionPending}
				<button class="button primary" type="submit">Save changes</button>
			{/if}
		</div>
	</form>

	{#if !data.isSelf}
		<section class="deletion-panel">
			<h2>{data.user.deletionPending ? 'Continue deletion' : 'Delete account'}</h2>
			<p class="help">
				Menghapus akun login dan akses CMS secara permanen. Untuk mencabut akses sementara, gunakan
				status Inactive.
			</p>

			<form method="POST" action={`/admin/users/${data.user.id}/delete`} onsubmit={confirmDeletion}>
				<label class="delete-confirm">
					<input type="checkbox" name="confirmDelete" value={data.user.id} required />
					<span>Saya memahami akun ini akan dihapus permanen.</span>
				</label>

				<div class="actions">
					<button class="button danger" type="submit">
						{data.user.deletionPending ? 'Retry deletion' : 'Delete user'}
					</button>
				</div>
			</form>
		</section>
	{/if}
</div>

<style>
	.user-page {
		display: grid;
		gap: 24px;
		max-width: 720px;
	}
	header,
	form {
		padding: 24px;
		border: 1px solid var(--ta-border);
		border-radius: 16px;
		background: var(--ta-bg);
	}
	.breadcrumb {
		margin: 0 0 12px;
		font-size: 14px;
		color: var(--ta-muted);
	}
	.breadcrumb a {
		color: inherit;
		text-decoration: none;
	}
	h1 {
		margin: 0;
		font-size: 28px;
		line-height: 36px;
		color: #f2f4f7;
	}
	.email {
		margin: 8px 0 0;
		color: var(--ta-muted);
		overflow-wrap: anywhere;
	}
	form {
		display: grid;
		gap: 10px;
	}
	label {
		margin-top: 10px;
		color: #f2f4f7;
		font-size: 14px;
		font-weight: 500;
	}
	input:not([type='checkbox']):not([type='hidden']),
	select {
		width: 100%;
		min-height: 46px;
		padding: 10px 12px;
		border: 1px solid var(--ta-border);
		border-radius: 8px;
		background: #171717;
		color: var(--ta-text);
		font: inherit;
	}
	input:disabled,
	select:disabled {
		opacity: 0.6;
	}
	.help {
		margin: 0;
		color: var(--ta-muted);
		font-size: 13px;
		line-height: 1.6;
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 10px;
		margin-top: 18px;
	}
	.button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 44px;
		padding: 10px 16px;
		border: 1px solid var(--ta-border);
		border-radius: 8px;
		background: transparent;
		color: var(--ta-text);
		font: inherit;
		font-size: 14px;
		text-decoration: none;
		cursor: pointer;
	}
	.primary {
		background: #465fff;
		border-color: #465fff;
		color: white;
	}
	.notice {
		padding: 14px 16px;
		border: 1px solid var(--ta-border);
		border-radius: 8px;
		line-height: 1.6;
	}
	.error {
		border-color: rgb(240 68 56 / 30%);
		color: #fda29b;
	}
	.success {
		border-color: rgb(18 183 106 / 30%);
		color: #6ce9a6;
	}
	.deletion-panel {
		padding: 24px;
		border: 1px solid rgb(240 68 56 / 30%);
		border-radius: 16px;
		background: var(--ta-bg);
	}
	.deletion-panel h2 {
		margin: 0 0 12px;
		font-size: 18px;
		color: #fda29b;
	}
	.deletion-panel form {
		padding: 0;
		margin-top: 16px;
		border: 0;
		background: transparent;
	}
	.delete-confirm {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		line-height: 1.6;
	}
	.delete-confirm input {
		margin-top: 4px;
	}
	.danger {
		border-color: rgb(240 68 56 / 40%);
		color: #fda29b;
	}
</style>
