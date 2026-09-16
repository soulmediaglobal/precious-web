import { error, fail } from '@sveltejs/kit';
import { getRabBuilder, mutateRabBuilder, mutateRabCommercial } from '$lib/server/db/queries';
import {
	BuilderInputError,
	parseBuilderForm,
	parseCommercialForm,
	positiveId
} from '$lib/rab-builder/values';
import type { Actions, PageServerLoad } from './$types';

function routeId(value: string) {
	try {
		return positiveId(value);
	} catch {
		error(404, 'Identitas tidak valid.');
	}
}
export const load: PageServerLoad = async ({ params }) => {
	const builder = await getRabBuilder(routeId(params.projectId), routeId(params.rabId));
	if (!builder) error(404, 'RAB tidak ditemukan dalam Project ini.');
	return builder;
};
export const actions: Actions = {
	save: async ({ params, request, locals }) => {
		if (!(await locals.getUser())) error(401, 'Silakan login kembali.');
		const projectId = routeId(params.projectId),
			rabId = routeId(params.rabId);
		const form = await request.formData();
		// Return entered values for progressive enhancement and ordinary POST failures.
		const values = Object.fromEntries(
			[...form.entries()].map(([key, value]) => [key, String(value)])
		);
		try {
			const result = await mutateRabBuilder(projectId, rabId, parseBuilderForm(form));
			if (result.status === 'missing')
				return fail(404, { message: 'RAB tidak ditemukan.', values });
			if (result.status === 'locked')
				return fail(409, { message: 'RAB terkunci. Hanya Draft yang dapat diedit.', values });
			return {
				success: true,
				message:
					form.get('operation') === 'delete'
						? 'Baris dan rinciannya dihapus. Total diperbarui.'
						: 'Tersimpan. Total dan bobot diperbarui.'
			};
		} catch (cause) {
			if (cause instanceof BuilderInputError) return fail(400, { message: cause.message, values });
			const code =
				(cause as { cause?: { code?: string }; code?: string })?.cause?.code ??
				(cause as { code?: string })?.code;
			if (code === '22003')
				return fail(400, {
					message: 'Nilai melebihi kapasitas nominal RAB. Kurangi volume/harga.',
					values
				});
			console.error('RAB Builder save failed', { projectId, rabId, code });
			return fail(500, {
				message: 'Belum berhasil disimpan. Muat ulang RAB sebelum mencoba kembali.',
				values
			});
		}
	},
	commercial: async ({ params, request, locals }) => {
		if (!(await locals.getUser())) error(401, 'Silakan login kembali.');
		const projectId = routeId(params.projectId),
			rabId = routeId(params.rabId);
		const form = await request.formData();
		const values = Object.fromEntries(
			[...form.entries()].map(([key, value]) => [key, String(value)])
		);
		try {
			const input = parseCommercialForm(form);
			const result = await mutateRabCommercial(projectId, rabId, input);
			if (result.status === 'missing')
				return fail(404, { message: 'RAB tidak ditemukan.', values });
			if (result.status === 'locked')
				return fail(409, { message: 'RAB terkunci. Hanya Draft yang dapat diedit.', values });
			return {
				success: true,
				message:
					input.operation === 'delete'
						? 'Data Tahapan/Termin dihapus.'
						: 'Data Tahapan/Termin tersimpan.'
			};
		} catch (cause) {
			if (cause instanceof BuilderInputError) return fail(400, { message: cause.message, values });
			const code =
				(cause as { cause?: { code?: string }; code?: string })?.cause?.code ??
				(cause as { code?: string })?.code;
			console.error('RAB commercial save failed', { projectId, rabId, code });
			return fail(500, {
				message: 'Tahapan/Termin belum berhasil disimpan. Muat ulang RAB sebelum mencoba kembali.',
				values
			});
		}
	}
};
