import { error, fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { team } from '$lib/server/db/schema';
import { getTeamById } from '$lib/server/db/queries';
import { parseTeamForm, uploadTeamImage } from '$lib/server/team-cms';
import { eq } from 'drizzle-orm';
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
    if (Object.keys(parsed.errors).length) return fail(400, { values: parsed.values, errors: parsed.errors });
    try {
      const image = parsed.file ? await uploadTeamImage(locals.supabase, parsed.file) : parsed.values.image;
      const updated = await db.update(team).set({ ...parsed.values, image, description: parsed.values.description || null, email: parsed.values.email || null, linkedin: parsed.values.linkedin || null, updatedAt: new Date() }).where(eq(team.id, id)).returning({ id: team.id });
      if (!updated.length) throw error(404, 'Team member not found');
    } catch (cause) {
      if (cause && typeof cause === 'object' && 'status' in cause) throw cause;
      return fail(500, { values: parsed.values, errors: {}, message: cause instanceof Error ? cause.message : 'Could not update team member.' });
    }
    throw redirect(303, '/admin/team');
  }
};
