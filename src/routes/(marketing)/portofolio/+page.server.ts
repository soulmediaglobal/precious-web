import { getAllPortfolio } from '$lib/server/db/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const items = await getAllPortfolio();
  return {
    portofolio: items.map((p) => ({
      project_name: p.projectName,
      slug: p.slug,
      client: p.client,
      short_description: p.shortDescription,
      long_description_p1: p.longDescriptionP1,
      long_description_p2: p.longDescriptionP2,
      location: p.location,
      category: p.category,
      status: p.status,
      images: p.images.map((img) => img.url)
    }))
  };
};
