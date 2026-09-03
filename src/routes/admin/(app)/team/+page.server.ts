import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { team } from '$lib/server/db/schema';
import { getAllTeamAdmin } from '$lib/server/db/queries';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({ members: await getAllTeamAdmin() });

export const actions: Actions = {
  delete: async ({ request }) => {
    const id = Number((await request.formData()).get('id'));
    if (!Number.isInteger(id)) return fail(400, { message: 'Invalid team member.' });
    const deleted = await db.delete(team).where(eq(team.id, id)).returning({ id: team.id });
    if (!deleted.length) return fail(404, { message: 'Team member not found.' });
    return { success: true };
  }
};
