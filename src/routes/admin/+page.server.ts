import type { PageServerLoad } from './$types';
import { getDashboardCounts } from '$lib/server/db/queries';

export const load: PageServerLoad = async ({ locals }) => {
  const user = await locals.getUser();
  return { user, counts: await getDashboardCounts() };
};
