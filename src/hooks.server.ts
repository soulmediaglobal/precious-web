import { redirect, type Handle } from '@sveltejs/kit';
import { getCmsUser } from '$lib/server/db/queries';
import { createSupabaseServerClient } from '$lib/server/supabase';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient(event.cookies);
	event.locals.cmsUser = null;

	event.locals.getUser = async () => {
		const {
			data: { user }
		} = await event.locals.supabase.auth.getUser();
		return user;
	};

	const isAdminRoute = event.url.pathname === '/admin' || event.url.pathname.startsWith('/admin/');
	const isLoginRoute = event.url.pathname === '/admin/login';

	if (isAdminRoute && !isLoginRoute) {
		const user = await event.locals.getUser();

		if (!user) {
			throw redirect(303, '/admin/login');
		}

		const cmsUser = await getCmsUser(user.id);

		if (!cmsUser?.isActive) {
			await event.locals.supabase.auth.signOut();
			throw redirect(303, '/admin/login?access=denied');
		}

		event.locals.cmsUser = cmsUser;
	}

	return resolve(event);
};
