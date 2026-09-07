import { fail } from '@sveltejs/kit';
import { getAllPortfolio, deletePortfolio } from '$lib/server/db/queries';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  try {
    return { entries: await getAllPortfolio(), loadError: '', saved: url.searchParams.get('saved') };
  } catch {
    return { entries: [], loadError: 'Could not load Portfolio. Please reload to try again.', saved: null };
  }
};
export const actions: Actions = {
  delete: async ({ request }) => {
    const id = Number((await request.formData()).get('id'));
    if (!Number.isSafeInteger(id) || id <= 0) return fail(400, { message: 'Invalid Portfolio.' });
    try {
      const deleted = await deletePortfolio(id);
      if (!deleted.length) return fail(404, { message: 'Portfolio not found.' });
      return { success: true };
    } catch {
      return fail(500, { message: 'Could not delete Portfolio. Please try again.' });
    }
  }
};
