import { error } from '@sveltejs/kit';
import { canAccessLogManagement } from '$lib/server/cms-user-access';
import { getCmsActivityLogs } from '$lib/server/db/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!canAccessLogManagement(locals.cmsUser)) {
		throw error(403, 'Log Management hanya bisa diakses Admin.');
	}

	const pageValue = url.searchParams.get('page') ?? '1';
	if (!/^[1-9][0-9]{0,4}$/.test(pageValue) || Number(pageValue) > 10000) {
		throw error(400, 'Nomor halaman tidak valid.');
	}

	let result: Awaited<ReturnType<typeof getCmsActivityLogs>>;
	try {
		result = await getCmsActivityLogs(locals.cmsUser!.userId, Number(pageValue));
	} catch {
		throw error(503, 'Log aktivitas belum bisa dimuat. Coba lagi nanti.');
	}

	if (result.status === 'forbidden') {
		throw error(403, 'Log Management hanya bisa diakses Admin aktif.');
	}

	return {
		logs: result.logs.map((log) => ({
			...log,
			occurredAt: log.occurredAt.toISOString()
		})),
		page: result.page,
		pageSize: result.pageSize,
		hasMore: result.hasMore
	};
};
