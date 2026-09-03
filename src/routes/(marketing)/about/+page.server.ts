import { getAllTeam } from '$lib/server/db/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const teamMembers = await getAllTeam();
  return {
    teams: teamMembers.map((t) => ({
      name: t.name,
      title: t.title,
      image: t.image,
      group: t.group,
      description: t.description,
      email: t.email,
      linkedin: t.linkedin
    }))
  };
};
