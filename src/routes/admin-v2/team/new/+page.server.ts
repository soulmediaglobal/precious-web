import { fail, redirect } from '@sveltejs/kit';
import { createTeamMember } from '$lib/server/db/queries';
import { parseTeamForm, uploadTeamImage } from '$lib/server/team-cms';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const parsed = parseTeamForm(await request.formData());
    if (Object.keys(parsed.errors).length) {
      return fail(400, { values: parsed.values, errors: parsed.errors });
    }

    try {
      const image = parsed.file
        ? await uploadTeamImage(locals.supabase, parsed.file)
        : parsed.values.image;
      await createTeamMember({ ...parsed.values, image });
    } catch (cause) {
      return fail(500, {
        values: parsed.values,
        errors: {},
        message: cause instanceof Error ? cause.message : 'Could not create team member.'
      });
    }

    throw redirect(303, '/admin-v2/team');
  }
};
