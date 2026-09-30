<script lang="ts">
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const roleLabels: Record<string, string> = {
		admin: 'Admin',
		director: 'Director',
		manager: 'Manager',
		staff: 'Staff'
	};
</script>

<svelte:head>
	<title>Add User | Precious Admin</title>
</svelte:head>

<div class="user-form-page">
	<header>
		<p class="breadcrumb"><a href="/admin">Home</a> / <a href="/admin/users">Users</a> / Add</p>
		<h1>Add User</h1>
		<p>Buat akun login baru dan tentukan aksesnya ke Precious CMS.</p>
	</header>

	{#if form?.message}
		<div class="notice error" role="alert">{form.message}</div>
	{/if}

	<form method="POST">
		<label for="email">Email</label>
		<input
			id="email"
			name="email"
			type="email"
			autocomplete="off"
			value={form?.values?.email ?? ''}
			required
		/>

		<label for="password">Initial password</label>
		<input
			id="password"
			name="password"
			type="password"
			autocomplete="new-password"
			minlength="12"
			required
		/>
		<p class="help">Minimal 12 karakter. Bagikan password awal melalui kanal yang aman.</p>

		<label for="role">Role</label>
		<select id="role" name="role" required>
			{#each data.assignableRoles as role}
				<option value={role} selected={form?.values?.role === role}>
					{roleLabels[role]}
				</option>
			{/each}
		</select>

		<div class="actions">
			<a class="button" href="/admin/users">Cancel</a>
			<button class="button primary" type="submit">Create user</button>
		</div>
	</form>
</div>

<style>
	.user-form-page {
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
	header > p:last-child {
		margin: 8px 0 0;
		color: var(--ta-muted);
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
	input,
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
	.help {
		margin: 0;
		color: var(--ta-muted);
		font-size: 13px;
	}
	.actions {
		display: flex;
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
		font-weight: 500;
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
	}
	.error {
		border-color: rgb(240 68 56 / 30%);
		color: #fda29b;
	}
</style>
