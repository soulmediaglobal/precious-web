import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { team } from '$lib/server/db/schema';
import { parseTeamForm, uploadTeamImage } from '$lib/server/team-cms';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const parsed = parseTeamForm(await request.formData());
    if (Object.keys(parsed.errors).length) return fail(400, { values: parsed.values, errors: parsed.errors });
    try {
      const image = parsed.file ? await uploadTeamImage(locals.supabase, parsed.file) : parsed.values.image;
      await db.insert(team).values({ ...parsed.values, image, description: parsed.values.description || null, email: parsed.values.email || null, linkedin: parsed.values.linkedin || null });
    } catch (error) {
      return fail(500, { values: parsed.values, errors: {}, message: error instanceof Error ? error.message : 'Could not create team member.' });
    }
    throw redirect(303, '/admin/team');
  }
};
