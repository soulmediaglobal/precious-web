import { error } from '@sveltejs/kit';
import type { User } from '@supabase/supabase-js';
import { canAccessUserManagement, canManageCmsRole } from '$lib/server/cms-user-access';
import { getAllCmsUsers } from '$lib/server/db/queries';
import { createSupabaseAdminClient } from '$lib/server/supabase-admin';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const actor = locals.cmsUser;

	if (!canAccessUserManagement(actor)) {
		throw error(403, 'Lo tidak punya akses untuk mengelola user.');
	}

	const memberships = await getAllCmsUsers();
	const membershipById = new Map(memberships.map((membership) => [membership.userId, membership]));
	const admin = createSupabaseAdminClient();
	const authUsers: User[] = [];

	for (let page = 1; ; page++) {
		const { data, error: authError } = await admin.auth.admin.listUsers({
			page,
			perPage: 200
		});

		if (authError) {
			console.error('CMS user directory failed', {
				status: authError.status,
				code: authError.code
			});
			throw error(503, 'Daftar user belum bisa dimuat.');
		}

		authUsers.push(...data.users);
		if (data.users.length < 200) break;
	}

	const authIds = new Set(authUsers.map((user) => user.id));

	const users = authUsers.map((user) => {
		const membership = membershipById.get(user.id) ?? null;

		return {
			id: user.id,
			name: membership?.name ?? '',
			position: membership?.position ?? '',
			email: user.email ?? 'Email tidak tersedia',
			role: membership?.role ?? null,
			isActive: membership?.isActive ?? false,
			deletionPending: Boolean(membership?.deletionStartedAt),
			createdAt: user.created_at,
			lastSignInAt: user.last_sign_in_at ?? null,
			hasMembership: Boolean(membership),
			canManage: membership ? canManageCmsRole(actor, membership.role) : false
		};
	});

	for (const membership of memberships) {
		if (authIds.has(membership.userId)) continue;

		users.push({
			id: membership.userId,
			name: membership.name ?? '',
			position: membership.position ?? '',
			email: 'Auth user tidak ditemukan',
			role: membership.role,
			isActive: membership.isActive,
			deletionPending: Boolean(membership.deletionStartedAt),
			createdAt: membership.createdAt.toISOString(),
			lastSignInAt: null,
			hasMembership: true,
			canManage: Boolean(membership.deletionStartedAt) && canManageCmsRole(actor, membership.role)
		});
	}

	users.sort((a, b) => (a.name || a.email).localeCompare(b.name || b.email));

	return {
		actorRole: actor!.role,
		users,
		created: url.searchParams.get('created') === '1',
		deleted: url.searchParams.get('deleted') === '1'
	};
};
