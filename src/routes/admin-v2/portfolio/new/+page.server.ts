import { error, fail, redirect } from '@sveltejs/kit';
import { getPortfolioById, createPortfolio, updatePortfolio } from '$lib/server/db/queries';
import { parsePortfolioForm, uploadPortfolioImages, portfolioSaveError } from '$lib/server/portfolio-cms';
import type { Actions, PageServerLoad } from './$types';
export const actions: Actions = {
  default: async ({ request, locals, params }) => {
    const parsed = parsePortfolioForm(await request.formData(), [], true);
    const feedback = { values: parsed.values, images: parsed.images, errors: parsed.errors };
    if (Object.keys(parsed.errors).length) return fail(400, feedback);
    try {
      const images = await uploadPortfolioImages(locals.supabase, parsed.slots);
      await createPortfolio(parsed.values, images);
    } catch (cause) {
      return fail(400, { ...feedback, message: portfolioSaveError(cause) });
    }
    redirect(303, '/admin-v2/portfolio?saved=created');
  }
};
