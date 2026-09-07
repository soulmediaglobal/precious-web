import { getAllContactInquiries } from '$lib/server/db/queries';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async () => {
  try { return { inquiries: await getAllContactInquiries(), loadError: false }; }
  catch { return { inquiries: [], loadError: true }; }
};
