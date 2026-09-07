import { error, fail, redirect } from '@sveltejs/kit';
import { getPortfolioById, createPortfolio, updatePortfolio } from '$lib/server/db/queries';
import { parsePortfolioForm, uploadPortfolioImages, portfolioSaveError } from '$lib/server/portfolio-cms';
import type { Actions, PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ params }) => {
  const id = Number(params.id);
  if (!Number.isSafeInteger(id) || id <= 0) error(404, 'Portfolio not found');
  const entry = await getPortfolioById(id);
  if (!entry) error(404, 'Portfolio not found');
  return { entry };
};
export const actions: Actions = {
  default: async ({ request, locals, params }) => {
    const id = Number(params.id);
    if (!Number.isSafeInteger(id) || id <= 0) error(404, 'Portfolio not found');
    const existing = await getPortfolioById(id);
    if (!existing) error(404, 'Portfolio not found');
    const parsed = parsePortfolioForm(await request.formData(), existing.images, false);
    const feedback = { values: parsed.values, images: parsed.images, errors: parsed.errors };
    if (Object.keys(parsed.errors).length) return fail(400, feedback);
    try {
      const images = await uploadPortfolioImages(locals.supabase, parsed.slots);
      const updated = await updatePortfolio(id, parsed.values, images);
      if (!updated) return fail(404, { ...feedback, message: 'Portfolio no longer exists.' });
    } catch (cause) {
      return fail(400, { ...feedback, message: portfolioSaveError(cause) });
    }
    redirect(303, '/admin-v2/portfolio?saved=updated');
  }
};
