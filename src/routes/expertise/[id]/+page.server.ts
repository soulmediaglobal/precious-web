import { error } from '@sveltejs/kit';
import { expertises } from '$lib';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
  const item = expertises.find((p) => p.slug === params.id);

  if (!item) {
    throw error(404, 'Expertise not found');
  }

  return {
    expertise: item
  };
};
