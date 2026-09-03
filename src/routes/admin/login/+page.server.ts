import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const user = await locals.getUser();
  if (user) {
    throw redirect(303, '/admin');
  }
  return {};
};

export const actions: Actions = {
  default: async ({ request, locals, cookies }) => {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      return fail(400, { error: 'Email dan password wajib diisi' });
    }

    const { error } = await locals.supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return fail(400, { error: error.message });
    }

    throw redirect(303, '/admin');
  }
};
