import { error } from '@sveltejs/kit';
import { getAdminProjectDetail } from '$lib/server/db/queries';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ params }) => {
	if (!/^[1-9]\d*$/.test(params.projectId) || !Number.isSafeInteger(Number(params.projectId)))
		error(404, 'Project tidak ditemukan.');
	const detail = await getAdminProjectDetail(Number(params.projectId));
	if (!detail) error(404, 'Project tidak ditemukan.');
	return detail;
};
