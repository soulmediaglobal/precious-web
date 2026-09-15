import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
  // hooks.server.ts already initializes the shared, cookie-aware SSR client.
  // This checks local plumbing only, not network reachability or authentication.
  // Never serialize the client, credentials, cookies, or session into page data.
  return {
    supabaseClientReady: Boolean(locals.supabase)
  };
};
