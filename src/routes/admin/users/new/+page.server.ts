import { error, fail, redirect } from '@sveltejs/kit';
import {
	assignableCmsRoles,
	canAccessUserManagement,
	cmsRoles,
	type CmsRole
} from '$lib/server/cms-user-access';
import { createCmsUserMembership } from '$lib/server/db/queries';
import { createSupabaseAdminClient } from '$lib/server/supabase-admin';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (!canAccessUserManagement(locals.cmsUser)) {
		throw error(403, 'Lo tidak punya akses untuk menambah user.');
	}

	return {
		assignableRoles: assignableCmsRoles(locals.cmsUser)
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const actor = locals.cmsUser;

		if (!canAccessUserManagement(actor)) {
			throw error(403, 'Lo tidak punya akses untuk menambah user.');
		}

		const data = await request.formData();
		const email = String(data.get('email') ?? '')
			.trim()
			.toLowerCase();
		const password = String(data.get('password') ?? '');
		const requestedRole = String(data.get('role') ?? '');

		if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
			return fail(400, {
				message: 'Masukkan alamat email yang valid.',
				values: { email, role: requestedRole }
			});
		}

		if (password.length < 12) {
			return fail(400, {
				message: 'Password awal minimal 12 karakter.',
				values: { email, role: requestedRole }
			});
		}

		if (!cmsRoles.includes(requestedRole as CmsRole)) {
			return fail(400, {
				message: 'Role tidak valid.',
				values: { email, role: requestedRole }
			});
		}

		const role = requestedRole as CmsRole;

		if (!assignableCmsRoles(actor).includes(role)) {
			throw error(403, 'Lo tidak boleh memberikan role tersebut.');
		}

		const supabaseAdmin = createSupabaseAdminClient();
		const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
			email,
			password,
			email_confirm: true
		});

		if (createError || !authData.user) {
			console.error('Unable to create Supabase Auth user', createError);
			return fail(createError?.status === 422 ? 409 : 502, {
				message:
					createError?.status === 422
						? 'Email tersebut sudah terdaftar.'
						: 'Auth user belum berhasil dibuat. Coba lagi.',
				values: { email, role }
			});
		}

		try {
			const result = await createCmsUserMembership(actor!.userId, authData.user.id, role);

			if (result.status !== 'ok') {
				const { error: rollbackError } = await supabaseAdmin.auth.admin.deleteUser(
					authData.user.id
				);
				if (rollbackError)
					console.error('Unable to roll back unauthorized Auth user', rollbackError);
				throw error(403, 'Hak akses lo berubah. User tidak dibuat.');
			}
		} catch (membershipError) {
			if (
				membershipError &&
				typeof membershipError === 'object' &&
				'status' in membershipError &&
				membershipError.status === 403
			) {
				throw membershipError;
			}

			const { error: rollbackError } = await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
			if (rollbackError) console.error('Unable to roll back Auth user', rollbackError);
			console.error('Unable to create CMS membership', membershipError);

			return fail(500, {
				message: 'Membership CMS gagal dibuat. Auth user sudah dibatalkan.',
				values: { email, role }
			});
		}

		throw redirect(303, '/admin/users?created=1');
	}
};
