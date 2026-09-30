import { error, redirect } from '@sveltejs/kit';
import { canAccessUserManagement } from '$lib/server/cms-user-access';
import { prepareCmsUserDeletion, deleteCmsUserMembership } from '$lib/server/db/queries';
import { createSupabaseAdminClient } from '$lib/server/supabase-admin';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, params, request }) => {
	const actor = locals.cmsUser;
	const targetId = params.id;

	if (!canAccessUserManagement(actor)) {
		throw error(403, 'Lo tidak punya akses untuk menghapus user.');
	}

	if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetId)) {
		throw error(404, 'User tidak ditemukan.');
	}

	const formData = await request.formData();

	if (formData.get('confirmDelete') !== targetId) {
		throw error(400, 'Konfirmasi penghapusan belum diberikan.');
	}

	const admin = createSupabaseAdminClient();
	const prepared = await prepareCmsUserDeletion(actor!.userId, targetId);

	switch (prepared.status) {
		case 'forbidden':
			throw error(403, 'Lo tidak boleh menghapus akun ini.');
		case 'missing':
			throw error(404, 'Membership CMS tidak ditemukan.');
		case 'self':
			throw redirect(303, `/admin/users/${targetId}?deleteError=self`);
		case 'last_admin':
			throw redirect(303, `/admin/users/${targetId}?deleteError=last_admin`);
	}

	try {
		const { error: deleteError } = await admin.auth.admin.deleteUser(targetId);

		if (deleteError && deleteError.code !== 'user_not_found') {
			console.error('CMS Auth deletion failed', {
				status: deleteError.status,
				code: deleteError.code
			});
			throw redirect(303, `/admin/users/${targetId}?deleteError=auth`);
		}
	} catch (deleteError) {
		if (
			deleteError &&
			typeof deleteError === 'object' &&
			'status' in deleteError &&
			deleteError.status === 303
		) {
			throw deleteError;
		}

		console.error('CMS Auth deletion request failed');
		throw redirect(303, `/admin/users/${targetId}?deleteError=auth`);
	}

	try {
		await deleteCmsUserMembership(targetId);
	} catch {
		console.error('CMS membership cleanup failed after Auth deletion');
		throw redirect(303, `/admin/users/${targetId}?deleteError=cleanup`);
	}

	throw redirect(303, '/admin/users?deleted=1');
};
