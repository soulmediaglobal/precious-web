import { fail } from '@sveltejs/kit';
import { getAllTeamAdmin, deleteTeamMember } from '$lib/server/db/queries';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({
  members: await getAllTeamAdmin()
});

export const actions: Actions = {
  delete: async ({ request }) => {
    const id = Number((await request.formData()).get('id'));
    if (!Number.isInteger(id)) {
      return fail(400, { message: 'Invalid team member.' });
    }

    const deleted = await deleteTeamMember(id);
    if (!deleted.length) {
      return fail(404, { message: 'Team member not found.' });
    }

    return { success: true };
  }
};
