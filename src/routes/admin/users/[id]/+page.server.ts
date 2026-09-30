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

const deletionMessages: Record<string, string> = {
	self: 'Lo tidak bisa menghapus akun sendiri.',
	last_admin: 'Minimal satu admin aktif harus tetap tersedia.',
	auth: 'Akun belum berhasil dihapus dari Supabase. Akses CMS sudah dinonaktifkan. Coba Retry deletion; jika tetap gagal, periksa kepemilikan file Storage akun ini.',
	cleanup:
		'Akun Auth sudah dihapus, tetapi membership belum selesai dibersihkan. Klik Retry deletion.'
};

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
	const authAlreadyDeleted =
		Boolean(target.deletionStartedAt) && authError?.code === 'user_not_found';

	if ((authError || !data.user) && !authAlreadyDeleted) {
		throw error(503, 'Data akun Auth belum bisa dimuat.');
	}

	return {
		user: {
			id: target.userId,
			name: target.name ?? '',
			position: target.position ?? '',
			email: data.user?.email ?? 'Akun Auth sudah dihapus',
			role: target.role,
			isActive: target.isActive,
			deletionPending: Boolean(target.deletionStartedAt)
		},
		assignableRoles: assignableCmsRoles(actor),
		isSelf: actor!.userId === target.userId,
		saved: url.searchParams.get('saved') === '1',
		deleteMessage: deletionMessages[url.searchParams.get('deleteError') ?? ''] ?? null
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
		const name = String(formData.get('name') ?? '').trim();
		const position = String(formData.get('position') ?? '').trim();
		const requestedRole = formData.get('role');
		const requestedStatus = formData.get('isActive');
		const values = { name, position };

		if (!name || name.length > 120) {
			return fail(400, {
				message: 'Nama wajib diisi, maksimal 120 karakter.',
				values
			});
		}

		if (!position || position.length > 160) {
			return fail(400, {
				message: 'Posisi wajib diisi, maksimal 160 karakter.',
				values
			});
		}

		if (
			typeof requestedRole !== 'string' ||
			!cmsRoles.includes(requestedRole as CmsRole) ||
			(requestedStatus !== 'true' && requestedStatus !== 'false')
		) {
			return fail(400, { message: 'Role atau status tidak valid.', values });
		}

		const role = requestedRole as CmsRole;

		if (!canManageCmsRole(actor, role)) {
			throw error(403, 'Lo tidak boleh memberikan role tersebut.');
		}

		const result = await updateCmsUserMembership(
			actor!.userId,
			params.id,
			role,
			requestedStatus === 'true',
			{ name, position }
		);

		switch (result.status) {
			case 'deleting':
				return fail(409, {
					message: 'Akun sedang dalam proses hapus. Profil dan akses tidak bisa diubah.',
					values
				});
			case 'forbidden':
				return fail(403, {
					message: 'Hak akses tidak mengizinkan perubahan ini.',
					values
				});
			case 'missing':
				return fail(404, { message: 'Membership CMS tidak ditemukan.', values });
			case 'self':
				return fail(409, {
					message: 'Lo tidak bisa mengganti role atau menonaktifkan akun sendiri.',
					values
				});
			case 'last_admin':
				return fail(409, {
					message: 'Minimal satu admin aktif harus tetap tersedia.',
					values
				});
			case 'ok':
				throw redirect(303, `/admin/users/${params.id}?saved=1`);
		}
	}
};
