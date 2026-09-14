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
	// Historical snapshot decoding is not implemented in this branch. Never substitute live masters.
	if (builder.rab.status !== 'draft' || builder.rab.frozenDocument)
		error(409, 'Preview dokumen historis belum tersedia. Preview PDF saat ini khusus Draft.');
	setHeaders({ 'cache-control': 'private, no-store' });
	return builder;
};
