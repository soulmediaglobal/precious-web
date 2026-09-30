import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
	return {
		supabaseClientReady: Boolean(locals.supabase),
		cmsUser: locals.cmsUser
			? {
					userId: locals.cmsUser.userId,
					role: locals.cmsUser.role
				}
			: null
	};
};
