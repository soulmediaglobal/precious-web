import { error, fail, redirect } from '@sveltejs/kit';
import {
	assignableCmsRoles,
	canAccessUserManagement,
	canManageCmsRole,
	cmsRoles,
	type CmsRole
} from '$lib/server/cms-user-access';
import { getCmsUser, updateCmsUserMembership } from '$lib/server/db/queries';
import { createSupabaseAdminClient } from '$lib/server/supabase-admin';
import type { Actions, PageServerLoad } from './$types';

function validateId(id: string) {
	if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
		throw error(404, 'User tidak ditemukan.');
	}
}

export const load: PageServerLoad = async ({ locals, params, url }) => {
	validateId(params.id);
	const actor = locals.cmsUser;

	if (!canAccessUserManagement(actor)) {
		throw error(403, 'Lo tidak punya akses untuk mengelola user.');
	}

	const target = await getCmsUser(params.id);

	if (!target) {
		throw error(404, 'Membership CMS tidak ditemukan.');
	}

	if (!canManageCmsRole(actor, target.role)) {
		throw error(403, 'Lo tidak boleh mengelola akun ini.');
	}

	const admin = createSupabaseAdminClient();
	const { data, error: authError } = await admin.auth.admin.getUserById(params.id);

	if (authError || !data.user) {
		throw error(503, 'Data akun Auth belum bisa dimuat.');
	}

	return {
		user: {
			id: target.userId,
			email: data.user.email ?? 'Email tidak tersedia',
			role: target.role,
			isActive: target.isActive
		},
		assignableRoles: assignableCmsRoles(actor),
		isSelf: actor!.userId === target.userId,
		saved: url.searchParams.get('saved') === '1'
	};
};

export const actions: Actions = {
	default: async ({ locals, params, request }) => {
		validateId(params.id);
		const actor = locals.cmsUser;

		if (!canAccessUserManagement(actor)) {
			throw error(403, 'Lo tidak punya akses untuk mengelola user.');
		}

		const formData = await request.formData();
		const requestedRole = formData.get('role');
		const requestedStatus = formData.get('isActive');

		if (
			typeof requestedRole !== 'string' ||
			!cmsRoles.includes(requestedRole as CmsRole) ||
			(requestedStatus !== 'true' && requestedStatus !== 'false')
		) {
			return fail(400, { message: 'Role atau status tidak valid.' });
		}

		const role = requestedRole as CmsRole;

		if (!canManageCmsRole(actor, role)) {
			throw error(403, 'Lo tidak boleh memberikan role tersebut.');
		}

		const result = await updateCmsUserMembership(
			actor!.userId,
			params.id,
			role,
			requestedStatus === 'true'
		);

		switch (result.status) {
			case 'forbidden':
				return fail(403, { message: 'Hak akses tidak mengizinkan perubahan ini.' });
			case 'missing':
				return fail(404, { message: 'Membership CMS tidak ditemukan.' });
			case 'self':
				return fail(409, {
					message: 'Lo tidak bisa mengganti role atau menonaktifkan akun sendiri.'
				});
			case 'last_admin':
				return fail(409, {
					message: 'Minimal satu admin aktif harus tetap tersedia.'
				});
			case 'ok':
				throw redirect(303, `/admin/users/${params.id}?saved=1`);
		}
	}
};
