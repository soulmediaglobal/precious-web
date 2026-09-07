import { error, fail, redirect } from '@sveltejs/kit';
import { getTeamById, updateTeamMember } from '$lib/server/db/queries';
import { parseTeamForm, uploadTeamImage } from '$lib/server/team-cms';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const member = await getTeamById(Number(params.id));
  if (!member) throw error(404, 'Team member not found');
  return { member };
};

export const actions: Actions = {
  default: async ({ request, locals, params }) => {
    const id = Number(params.id);
    if (!Number.isInteger(id)) throw error(404, 'Team member not found');

    const parsed = parseTeamForm(await request.formData());
    if (Object.keys(parsed.errors).length) {
      return fail(400, { values: parsed.values, errors: parsed.errors });
    }

    try {
      const image = parsed.file
        ? await uploadTeamImage(locals.supabase, parsed.file)
        : parsed.values.image;
      const updated = await updateTeamMember(id, { ...parsed.values, image });
      if (!updated.length) throw error(404, 'Team member not found');
    } catch (cause) {
      if (cause && typeof cause === 'object' && 'status' in cause) throw cause;
      return fail(500, {
        values: parsed.values,
        errors: {},
        message: cause instanceof Error ? cause.message : 'Could not update team member.'
      });
    }

    throw redirect(303, '/admin-v2/team');
  }
};
