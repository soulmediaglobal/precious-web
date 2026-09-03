import { getAllExpertise, getAllPortfolio } from '$lib/server/db/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const [expertiseItems, portfolioItems] = await Promise.all([
    getAllExpertise(),
    getAllPortfolio()
  ]);

  return {
    expertises: expertiseItems.map((e) => ({
      title: e.title,
      slug: e.slug,
      images: e.images.map((img) => img.url),
      description: e.description,
      how: e.how,
      why: e.why
    })),
    portofolio: portfolioItems.map((p) => ({
      project_name: p.projectName,
      slug: p.slug,
      location: p.location,
      images: p.images.map((img) => img.url)
    }))
  };
};
