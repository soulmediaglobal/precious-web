import { error, fail, redirect } from '@sveltejs/kit';
import { parseProjectForm } from '$lib/server/project-cms';
import { createCanonicalProject, getProjectFormClients } from '$lib/server/db/queries';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({ clients: await getProjectFormClients() });

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const parsed = parseProjectForm(await request.formData());
		if (Object.keys(parsed.errors).length) return fail(400, parsed);
		const user = await locals.getUser();
		if (!user) error(401, 'Silakan login kembali.');
		let project;
		try {
			project = await createCanonicalProject({
				clientId: parsed.values.clientId,
				projectName: parsed.values.projectName,
				transactionTitle: parsed.values.transactionTitle || null,
				location: parsed.values.location || null,
				acquisitionType: parsed.values.acquisitionType || null,
				description: parsed.values.description || null,
				createdByUserId: user.id
			});
		} catch (cause) {
			if (cause instanceof Error && cause.message === 'Client not found') {
				return fail(400, {
					...parsed,
					errors: { ...parsed.errors, clientId: 'Client tidak ditemukan. Pilih client lain.' },
					message: 'Client yang dipilih sudah tidak tersedia.'
				});
			}
			return fail(500, {
				...parsed,
				message: 'Project belum berhasil dibuat. Coba lagi dalam beberapa saat.'
			});
		}
		redirect(303, `/admin/projects/${project.id}`);
	}
};
