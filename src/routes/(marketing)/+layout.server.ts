import { getSettings } from '$lib/server/db/queries';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
  const settings = await getSettings();
  return {
    settings: {
      email: settings.email ?? '',
      phone: settings.phone ?? ''
    }
  };
};
