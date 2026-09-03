import { redirect, type Handle } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/server/supabase';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createSupabaseServerClient(event.cookies);

  event.locals.getUser = async () => {
    const {
      data: { user }
    } = await event.locals.supabase.auth.getUser();
    return user;
  };

  const isAdminRoute = event.url.pathname.startsWith('/admin');
  const isLoginRoute = event.url.pathname === '/admin/login';

  if (isAdminRoute && !isLoginRoute) {
    const user = await event.locals.getUser();
    if (!user) {
      throw redirect(303, '/admin/login');
    }
  }

  return resolve(event);
};
