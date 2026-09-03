import { error } from '@sveltejs/kit';
import { getExpertiseBySlug } from '$lib/server/db/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const item = await getExpertiseBySlug(params.id);

  if (!item) {
    throw error(404, 'Expertise not found');
  }

  return {
    expertise: {
      title: item.title,
      slug: item.slug,
      images: item.images.map((img) => img.url),
      description: item.description,
      how: item.how,
      why: item.why,
      relatedPortfolio: item.relatedPortfolio.map((p) => ({
        project_name: p.projectName,
        slug: p.slug,
        location: p.location,
        images: p.images.map((img) => img.url)
      }))
    }
  };
};
