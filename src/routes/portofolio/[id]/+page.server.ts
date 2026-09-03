import { error } from '@sveltejs/kit';
import { getPortfolioBySlug, getAllPortfolio } from '$lib/server/db/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const item = await getPortfolioBySlug(params.id);

  if (!item) {
    throw error(404, 'Portofolio not found');
  }

  const allItems = await getAllPortfolio();

  const mapped = (p: typeof item) => ({
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
  });

  let related = allItems.filter((p) => p.category === item.category && p.slug !== item.slug);
  if (related.length === 0) {
    related = allItems.filter((p) => p.slug !== item.slug).sort(() => 0.5 - Math.random());
  }

  return {
    portofolio: mapped(item),
    related: related.slice(0, 3).map(mapped)
  };
};
