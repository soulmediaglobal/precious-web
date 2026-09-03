import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
  const user = await locals.getUser();
  return {
    user,
    pathname: url.pathname
  };
};
