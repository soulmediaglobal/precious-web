import { error } from '@sveltejs/kit';
import { getRabBuilder } from '$lib/server/db/queries';
import { positiveId } from '$lib/rab-builder/values';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	let projectId: number, rabId: number;
	try {
		projectId = positiveId(params.projectId);
		rabId = positiveId(params.rabId);
	} catch { error(404, 'Identitas tidak valid.'); }
	const builder = await getRabBuilder(projectId, rabId);
	if (!builder) error(404, 'RAB tidak ditemukan dalam Project ini.');
	// Unknown historical snapshots remain blocked; never substitute live masters.
	if (!builder.previewAvailable)
		error(409, 'Format snapshot dokumen historis belum didukung untuk preview.');
	setHeaders({ 'cache-control': 'private, no-store' });
	return builder;
};
