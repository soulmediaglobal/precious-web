import { fail, redirect } from '@sveltejs/kit';
import { parseContactForm } from '$lib/server/contact-cms';
import { createContactInquiry } from '$lib/server/db/queries';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => ({ sent: url.searchParams.get('sent') === '1' });
export const actions: Actions = {
  default: async ({ request }) => {
    const { values, errors } = parseContactForm(await request.formData());
    if (Object.keys(errors).length) return fail(400, { values, errors, message: 'Please check the fields below.' });
    try { await createContactInquiry(values); }
    catch { return fail(500, { values, errors, message: 'Unable to send your message. Please try again later.' }); }
    redirect(303, '/contact?sent=1#contact');
  }
};
