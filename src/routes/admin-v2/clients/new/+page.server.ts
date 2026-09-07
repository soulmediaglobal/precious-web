import { fail, redirect } from '@sveltejs/kit';
import { createClient } from '$lib/server/db/queries';
import { companyTypes, parseClientForm } from '$lib/server/client-cms';
import type { Actions, PageServerLoad } from './$types';
export const load: PageServerLoad = () => ({ companyTypes });

export const actions: Actions = {
	default: async ({ request }) => {
		const parsed = parseClientForm(await request.formData());
		if (Object.keys(parsed.errors).length) return fail(400, parsed);
		try {
			await createClient({
				...parsed.values,
				companyType: parsed.values.companyType || null,
				address: parsed.values.address || null,
				directorName: parsed.values.directorName || null,
				directorPhone: parsed.values.directorPhone || null,
				directorEmail: parsed.values.directorEmail || null,
				picName: parsed.values.picName || null,
				picPhone: parsed.values.picPhone || null,
				picEmail: parsed.values.picEmail || null
			});
		} catch (error) {
			return fail(500, {
				...parsed,
				message: error instanceof Error ? error.message : 'Could not create client.'
			});
		}
		throw redirect(303, '/admin-v2/clients');
	}
};
