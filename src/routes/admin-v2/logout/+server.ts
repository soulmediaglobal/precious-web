import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
  const { error: signOutError } = await locals.supabase.auth.signOut();
  if (signOutError) error(503, 'Belum bisa keluar. Silakan coba lagi.');
  throw redirect(303, '/admin-v2/login');
};
