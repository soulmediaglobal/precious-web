<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const roleLabels: Record<string, string> = {
		admin: 'Admin',
		director: 'Director',
		manager: 'Manager',
		staff: 'Staff'
	};

	const date = new Intl.DateTimeFormat('id-ID', {
		dateStyle: 'medium',
		timeStyle: 'short'
	});

	function formatDate(value: string | null) {
		return value ? date.format(new Date(value)) : 'Belum pernah';
	}
</script>

<svelte:head>
	<title>Users | Precious Admin</title>
</svelte:head>

<div class="users-page">
	<header class="users-heading">
		<div>
			<p class="breadcrumb"><a href="/admin">Home</a> / Users</p>
			<h1>User Management</h1>
			<p class="intro">Kelola akses admin, director, manager, dan staff ke Precious CMS.</p>
		</div>
		<a class="button primary" href="/admin/users/new">Add user</a>
	</header>

	<section class="users-panel" aria-label="CMS users">
		{#if data.users.length}
			<div class="table-wrap">
				<table>
					<thead>
						<tr>
							<th>Email</th>
							<th>Role</th>
							<th>Status</th>
							<th>Last sign in</th>
							<th><span class="sr-only">Actions</span></th>
						</tr>
					</thead>
					<tbody>
						{#each data.users as user (user.id)}
							<tr>
								<td>
									<strong>{user.email}</strong>
									{#if !user.hasMembership}<small>Belum memiliki akses CMS</small>{/if}
								</td>
								<td>{user.role ? roleLabels[user.role] : 'No access'}</td>
								<td>
									<span class:active={user.isActive} class="status">
										{user.isActive ? 'Active' : 'Inactive'}
									</span>
								</td>
								<td>{formatDate(user.lastSignInAt)}</td>
								<td class="actions">
									{#if user.canManage}
										<a class="button" href={`/admin/users/${user.id}`}>Manage</a>
									{:else}
										<span class="protected">Protected</span>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="empty">
				<h2>No users found</h2>
				<p>Tambahkan user pertama untuk mulai mengelola akses CMS.</p>
			</div>
		{/if}
	</section>
</div>

<style>
	.users-page {
		display: grid;
		gap: 24px;
		min-width: 0;
	}
	.users-heading {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 20px;
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
		font-weight: 600;
		color: #f2f4f7;
	}
	.intro {
		margin: 8px 0 0;
		font-size: 14px;
		color: var(--ta-muted);
	}
	.users-panel {
		border: 1px solid var(--ta-border);
		border-radius: 16px;
		background: var(--ta-bg);
		overflow: hidden;
	}
	.table-wrap {
		overflow-x: auto;
	}
	table {
		width: 100%;
		border-collapse: collapse;
	}
	th,
	td {
		padding: 18px 20px;
		border-bottom: 1px solid var(--ta-border);
		text-align: left;
		font-size: 14px;
		white-space: nowrap;
	}
	th {
		color: var(--ta-muted);
		font-size: 12px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	tbody tr:last-child td {
		border-bottom: 0;
	}
	td strong {
		display: block;
		color: #f2f4f7;
		font-weight: 500;
	}
	td small {
		display: block;
		margin-top: 5px;
		color: #fda29b;
	}
	.status {
		display: inline-flex;
		padding: 4px 9px;
		border-radius: 999px;
		background: rgb(240 68 56 / 12%);
		color: #fda29b;
		font-size: 12px;
	}
	.status.active {
		background: rgb(18 183 106 / 12%);
		color: #6ce9a6;
	}
	.actions {
		text-align: right;
	}
	.button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 40px;
		padding: 8px 14px;
		border: 1px solid var(--ta-border);
		border-radius: 8px;
		background: transparent;
		color: var(--ta-text);
		font: inherit;
		font-size: 14px;
		font-weight: 500;
		text-decoration: none;
	}
	.button:hover {
		background: rgb(255 255 255 / 6%);
	}
	.primary {
		min-height: 44px;
		background: #465fff;
		border-color: #465fff;
		color: white;
	}
	.primary:hover {
		background: #3641f5;
	}
	.protected {
		color: var(--ta-muted);
		font-size: 13px;
	}
	.empty {
		padding: 48px 24px;
		text-align: center;
	}
	.empty h2 {
		margin: 0;
		color: #f2f4f7;
	}
	.empty p {
		margin: 8px 0 0;
		color: var(--ta-muted);
	}
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
	@media (max-width: 767px) {
		.users-heading {
			align-items: flex-start;
			flex-direction: column;
		}
		h1 {
			font-size: 24px;
			line-height: 32px;
		}
		th,
		td {
			padding: 14px 16px;
		}
	}
</style>
