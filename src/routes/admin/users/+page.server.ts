import { error } from '@sveltejs/kit';
import {
	canAccessUserManagement,
	canManageCmsRole,
	type CmsRole
} from '$lib/server/cms-user-access';
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
	const supabaseAdmin = createSupabaseAdminClient();

	const { data, error: authError } = await supabaseAdmin.auth.admin.listUsers({
		page: 1,
		perPage: 1000
	});

	if (authError) {
		console.error('Unable to list Supabase Auth users', authError);
		throw error(503, 'Daftar user belum bisa dimuat.');
	}

	const authIds = new Set(data.users.map((user) => user.id));

	const users = data.users.map((user) => {
		const membership = membershipById.get(user.id) ?? null;
		const role = membership?.role ?? null;

		return {
			id: user.id,
			email: user.email ?? 'Email tidak tersedia',
			role,
			isActive: membership?.isActive ?? false,
			createdAt: user.created_at,
			lastSignInAt: user.last_sign_in_at ?? null,
			hasMembership: Boolean(membership),
			canManage: role ? canManageCmsRole(actor, role as CmsRole) : true
		};
	});

	for (const membership of memberships) {
		if (authIds.has(membership.userId)) continue;

		users.push({
			id: membership.userId,
			email: 'Auth user tidak ditemukan',
			role: membership.role,
			isActive: membership.isActive,
			createdAt: membership.createdAt.toISOString(),
			lastSignInAt: null,
			hasMembership: true,
			canManage: canManageCmsRole(actor, membership.role)
		});
	}

	users.sort((a, b) => a.email.localeCompare(b.email));

	return {
		actorRole: actor!.role,
		users,
		created: url.searchParams.get('created') === '1'
	};
};
