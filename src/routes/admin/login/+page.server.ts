import { fail, redirect } from '@sveltejs/kit';
import { getCmsUser } from '$lib/server/db/queries';
import type { Actions, PageServerLoad } from './$types';

const accessDeniedMessage =
	'Akun ini tidak memiliki akses aktif ke Precious CMS. Hubungi administrator.';

export const load: PageServerLoad = async ({ locals, url }) => {
	const user = await locals.getUser();

	if (!user) {
		return {
			error: url.searchParams.get('access') === 'denied' ? accessDeniedMessage : null
		};
	}

	let cmsUser;

	try {
		cmsUser = await getCmsUser(user.id);
	} catch {
		return {
			error: 'Layanan login belum bisa dihubungi. Coba lagi dalam beberapa saat.'
		};
	}

	if (cmsUser?.isActive) {
		throw redirect(303, '/admin');
	}

	await locals.supabase.auth.signOut();

	return {
		error: accessDeniedMessage
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password) {
			return fail(400, { error: 'Email dan password wajib diisi.' });
		}

		let user;

		try {
			const result = await locals.supabase.auth.signInWithPassword({
				email: email.trim(),
				password
			});

			if (result.error) {
				return fail(400, {
					error:
						result.error.code === 'invalid_credentials'
							? 'Email atau password tidak sesuai.'
							: 'Belum bisa masuk. Coba lagi dalam beberapa saat.'
				});
			}

			user = result.data.user;
		} catch {
			return fail(503, {
				error: 'Layanan login belum bisa dihubungi. Coba lagi dalam beberapa saat.'
			});
		}

		try {
			const cmsUser = await getCmsUser(user.id);

			if (!cmsUser?.isActive) {
				await locals.supabase.auth.signOut();
				return fail(403, { error: accessDeniedMessage });
			}
		} catch {
			await locals.supabase.auth.signOut();
			return fail(503, {
				error: 'Layanan login belum bisa dihubungi. Coba lagi dalam beberapa saat.'
			});
		}

		throw redirect(303, '/admin');
	}
};
