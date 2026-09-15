import { error, fail, redirect } from '@sveltejs/kit';
import { createInitialRab, getProjectRabWorkspace } from '$lib/server/db/queries';
import type { Actions, PageServerLoad } from './$types';
function positiveId(value: string) {
	if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value)))
		error(404, 'Identitas tidak valid.');
	return Number(value);
}
export const load: PageServerLoad = async ({ params, url }) => {
	const workspace = await getProjectRabWorkspace(positiveId(params.projectId));
	if (!workspace) error(404, 'Project tidak ditemukan.');
	const requested = url.searchParams.get('rab');
	const revisions = workspace.families.flatMap((family) => family.revisions);
	const selected =
		requested === null
			? (revisions[0] ?? null)
			: revisions.find((rab) => rab.id === positiveId(requested));
	if (requested !== null && !selected) error(404, 'RAB tidak ditemukan dalam Project ini.');
	return { ...workspace, selected: selected ?? null };
};
export const actions: Actions = {
	create: async ({ params, locals }) => {
		const projectId = positiveId(params.projectId);
		const user = await locals.getUser();
		if (!user) error(401, 'Silakan login kembali.');
		let created;
		try {
			created = await createInitialRab(projectId, user.id);
		} catch {
			return fail(500, {
				message: 'RAB belum berhasil dibuat. Muat ulang daftar sebelum mencoba kembali.'
			});
		}
		if (!created) return fail(404, { message: 'Project tidak ditemukan.' });
		redirect(303, `/admin/projects/${projectId}/rab?rab=${created.id}`);
	}
};
