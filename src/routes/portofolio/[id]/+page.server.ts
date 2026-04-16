import { error } from '@sveltejs/kit';
import { portofolio } from '$lib';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
  const item = portofolio.find((p) => p.slug === params.id);

  if (!item) {
    throw error(404, 'Portofolio not found');
  }

  return {
    portofolio: item
  };
};
