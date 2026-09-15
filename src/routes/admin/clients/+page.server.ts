import { fail } from '@sveltejs/kit';
import { deleteClient, getAllClients } from '$lib/server/db/queries';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => ({
	clients: await getAllClients(url.searchParams.get('q')?.trim() ?? ''),
	q: url.searchParams.get('q') ?? ''
});
export const actions: Actions = {
	delete: async ({ request }) => {
		const id = Number((await request.formData()).get('id'));
		if (!Number.isInteger(id)) return fail(400, { message: 'Invalid client.' });
		const result = await deleteClient(id);
		if (!result.deleted)
			return fail(result.reason ? 409 : 404, { message: result.reason ?? 'Client not found.' });
		return { success: true };
	}
};
