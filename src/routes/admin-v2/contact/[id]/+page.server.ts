import { error, fail, redirect } from '@sveltejs/kit';
import { getContactInquiryById, updateContactInquiryFollowUp } from '$lib/server/db/queries';
import { parseContactId, parseContactFollowUpForm } from '$lib/server/contact-cms';
import type { Actions, PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ params, url }) => {
  const id = parseContactId(params.id);
  if (id === null) error(404, 'Inquiry tidak ditemukan.');
  let inquiry;
  try { inquiry = await getContactInquiryById(id); }
  catch { error(503, 'Pesan belum bisa dimuat. Coba lagi nanti.'); }
  if (!inquiry) error(404, 'Inquiry tidak ditemukan.');
  return { inquiry, saved: url.searchParams.get('saved') === '1' };
};
export const actions: Actions = {
  default: async ({ params, request }) => {
    const id = parseContactId(params.id);
    if (id === null) error(404, 'Inquiry tidak ditemukan.');
    const { values, nextState, errors } = parseContactFollowUpForm(await request.formData());
    // Check existence before returning validation errors for a missing record.
    try { if (!await getContactInquiryById(id)) return fail(404, { values, errors, message: 'Inquiry tidak ditemukan.' }); }
    catch { return fail(503, { values, errors, message: 'Pesan belum bisa dimuat. Coba lagi nanti.' }); }
    if (Object.keys(errors).length) return fail(400, { values, errors, message: 'Periksa pilihan follow-up.' });
    let updated;
    try { updated = await updateContactInquiryFollowUp(id, nextState); }
    catch { return fail(500, { values, errors, message: 'Perubahan belum tersimpan. Coba lagi nanti.' }); }
    if (!updated.length) return fail(404, { values, errors, message: 'Inquiry tidak ditemukan.' });
    redirect(303, `/admin-v2/contact/${id}?saved=1`);
  }
};
