import { error, fail, redirect } from '@sveltejs/kit';
import { getClientById, updateClient } from '$lib/server/db/queries';
import { companyTypes, parseClientForm } from '$lib/server/client-cms';
import type { Actions, PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ params }) => {
	const client = await getClientById(Number(params.id));
	if (!client) throw error(404, 'Client not found');
	return { client, companyTypes };
};
export const actions: Actions = {
	default: async ({ request, params }) => {
		const id = Number(params.id);
		if (!Number.isInteger(id)) throw error(404, 'Client not found');
		const parsed = parseClientForm(await request.formData());
		if (Object.keys(parsed.errors).length) return fail(400, parsed);
		const updated = await updateClient(id, {
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
		if (!updated.length) throw error(404, 'Client not found');
		throw redirect(303, '/admin-v2/clients');
	}
};
