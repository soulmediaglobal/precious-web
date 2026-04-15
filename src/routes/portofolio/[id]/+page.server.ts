import { error } from '@sveltejs/kit';
import { portofolio } from '$lib';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
  console.log('params', params);
  const item = portofolio.find((p) => p.slug === params.id);
  console.log('item', item);

  if (!item) {
    throw error(404, 'Portofolio not found');
  }

  return {
    portofolio: item
  };
};
