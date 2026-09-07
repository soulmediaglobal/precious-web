import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (await locals.getUser()) throw redirect(303, '/admin-v2');
  return {};
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');
    if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password) {
      return fail(400, { error: 'Email dan password wajib diisi.' });
    }
    try {
      const { error } = await locals.supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        return fail(400, { error: error.code === 'invalid_credentials'
          ? 'Email atau password tidak sesuai.'
          : 'Belum bisa masuk. Coba lagi dalam beberapa saat.' });
      }
    } catch {
      return fail(503, { error: 'Layanan login belum bisa dihubungi. Coba lagi dalam beberapa saat.' });
    }
    throw redirect(303, '/admin-v2');
  }
};
