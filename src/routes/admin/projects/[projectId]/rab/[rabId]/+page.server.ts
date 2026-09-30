import { error, fail } from '@sveltejs/kit';
import {
	getRabBuilder,
	mutateRabBuilder,
	mutateRabCommercial,
	getCmsUser,
	transitionRabApproval
} from '$lib/server/db/queries';
import {
	BuilderInputError,
	parseBuilderForm,
	parseCommercialForm,
	positiveId
} from '$lib/rab-builder/values';
import { approvalPermissions } from '$lib/rab-builder/approval';
import type { Actions, PageServerLoad } from './$types';

function routeId(value: string) {
	try {
		return positiveId(value);
	} catch {
		error(404, 'Identitas tidak valid.');
	}
}
export const load: PageServerLoad = async ({ params, locals }) => {
	const builder = await getRabBuilder(routeId(params.projectId), routeId(params.rabId));
	if (!builder) error(404, 'RAB tidak ditemukan dalam Project ini.');
	const user = await locals.getUser();
	const actor = user ? await getCmsUser(user.id) : null;
	return { ...builder, approval: approvalPermissions(actor, builder.rab) };
};
const approvalAction =
	(operation: 'request' | 'approve'): NonNullable<Actions[string]> =>
	async ({ params, locals }) => {
		const user = await locals.getUser();
		if (!user) error(401, 'Silakan login kembali.');
		const projectId = routeId(params.projectId),
			rabId = routeId(params.rabId);
		try {
			const result = await transitionRabApproval(projectId, rabId, user.id, operation);
			if (result.status === 'missing') return fail(404, { message: 'RAB tidak ditemukan.' });
			if (result.status === 'forbidden')
				return fail(403, {
					message: 'Role aktif atau status RAB tidak mengizinkan tindakan ini. Muat ulang RAB.'
				});
			if (result.status === 'historical')
				return fail(409, {
					message: 'Format snapshot historis belum didukung. Dokumen tetap dipertahankan.'
				});
			return {
				success: true,
				message:
					operation === 'request'
						? 'Approval diminta. RAB sekarang read-only.'
						: 'RAB disetujui internal. Ini bukan persetujuan klien.'
			};
		} catch {
			return fail(409, {
				message:
					'Approval belum tersimpan. Muat ulang untuk memeriksa status terbaru sebelum mencoba kembali.'
			});
		}
	};

export const actions: Actions = {
	requestApproval: approvalAction('request'),
	approve: approvalAction('approve'),
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
