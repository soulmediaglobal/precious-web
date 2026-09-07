import { db } from './index';
import { portfolio, portfolioImages, expertise, expertiseImages, team, settings, clients, projects, rabs } from './schema';
import { eq, asc, ilike, or, count, sql } from 'drizzle-orm';

export async function getAllPortfolio() {
  return db.query.portfolio.findMany({
    with: { images: { orderBy: asc(portfolioImages.sortOrder) } },
    orderBy: (p, { desc }) => [desc(p.createdAt)]
  });
}

export async function getPortfolioBySlug(slug: string) {
  return db.query.portfolio.findFirst({
    where: eq(portfolio.slug, slug),
    with: { images: { orderBy: asc(portfolioImages.sortOrder) } }
  });
}

export async function getAllExpertise() {
  return db.query.expertise.findMany({
    with: { images: { orderBy: asc(expertiseImages.sortOrder) } }
  });
}

export async function getExpertiseBySlug(slug: string) {
  const item = await db.query.expertise.findFirst({
    where: eq(expertise.slug, slug),
    with: {
      images: { orderBy: asc(expertiseImages.sortOrder) },
      portfolio: {
        with: {
          portfolio: {
            with: { images: { orderBy: asc(portfolioImages.sortOrder) } }
          }
        }
      }
    }
  });

  if (!item) return null;

  return {
    ...item,
    relatedPortfolio: item.portfolio.map((link) => link.portfolio)
  };
}

export async function getAllTeam() {
  return db.query.team.findMany({
    where: eq(team.isActive, true),
    orderBy: asc(team.sortOrder)
  });
}

export async function getAllTeamAdmin() {
  return db.query.team.findMany({ orderBy: asc(team.sortOrder) });
}

export async function getTeamById(id: number) {
  return db.query.team.findFirst({ where: eq(team.id, id) });
}

export async function getSettings() {
  const rows = await db.query.settings.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export type TeamMemberValues = Pick<
	typeof team.$inferSelect,
	'name' | 'title' | 'image' | 'group' | 'description' | 'email' | 'linkedin' | 'sortOrder' | 'isActive'
>;

export async function createTeamMember(values: TeamMemberValues) {
	return db.insert(team).values({
		...values,
		description: values.description || null,
		email: values.email || null,
		linkedin: values.linkedin || null
	}).returning({ id: team.id });
}

export async function updateTeamMember(id: number, values: TeamMemberValues) {
	return db.update(team).set({
		...values,
		description: values.description || null,
		email: values.email || null,
		linkedin: values.linkedin || null,
		updatedAt: new Date()
	}).where(eq(team.id, id)).returning({ id: team.id });
}

export async function deleteTeamMember(id: number) {
	return db.delete(team).where(eq(team.id, id)).returning({ id: team.id });
}

export type ClientValues = typeof clients.$inferInsert;

export async function getAllClients(search = '') {
	const where = search
		? or(
				ilike(clients.companyName, `%${search}%`),
				ilike(clients.directorName, `%${search}%`),
				ilike(clients.directorEmail, `%${search}%`),
				ilike(clients.picName, `%${search}%`),
				ilike(clients.picEmail, `%${search}%`)
			)
		: undefined;
	return db
		.select({ client: clients, projectCount: count(projects.id) })
		.from(clients)
		.leftJoin(projects, eq(projects.clientId, clients.id))
		.where(where)
		.groupBy(clients.id)
		.orderBy(asc(clients.companyName));
}

export async function getClientById(id: number) {
	return db.query.clients.findFirst({ where: eq(clients.id, id) });
}
export async function createClient(values: ClientValues) {
	return db.insert(clients).values(values).returning({ id: clients.id });
}
export async function updateClient(id: number, values: Partial<ClientValues>) {
	return db
		.update(clients)
		.set({ ...values, updatedAt: new Date() })
		.where(eq(clients.id, id))
		.returning({ id: clients.id });
}
export async function deleteClient(id: number) {
	const [{ value }] = await db
		.select({ value: count() })
		.from(projects)
		.where(eq(projects.clientId, id));
	const history = await db.query.rabs.findFirst({
		where: sql`(${rabs.frozenDocument}::jsonb #>> '{project,client,id}')::integer = ${id}
			or (${rabs.inheritedMasters}::jsonb #>> '{project,client,id}')::integer = ${id}`,
		columns: { id: true }
	});
	if (value > 0 || history)
		return { deleted: false, reason: 'Client masih memiliki project dan tidak bisa dihapus.' };
	const deleted = await db.delete(clients).where(eq(clients.id, id)).returning({ id: clients.id });
	return { deleted: deleted.length > 0 };
}
// Portfolio CMS: slot 0 is the header; slots 1..10 are content images.
export type PortfolioValues = Pick<typeof portfolio.$inferInsert,
  'slug' | 'projectName' | 'client' | 'shortDescription' | 'location' |
  'category' | 'status' | 'longDescriptionP1' | 'longDescriptionP2'>;

export async function getPortfolioById(id: number) {
  return db.query.portfolio.findFirst({
    where: eq(portfolio.id, id),
    with: { images: { orderBy: asc(portfolioImages.sortOrder) } }
  });
}

export async function createPortfolio(values: PortfolioValues, images: string[]) {
  return db.transaction(async (tx) => {
    const [entry] = await tx.insert(portfolio).values(values).returning({ id: portfolio.id });
    await tx.insert(portfolioImages).values(images.map((url, sortOrder) => ({ portfolioId: entry.id, url, sortOrder })));
    return entry;
  });
}

export async function updatePortfolio(id: number, values: PortfolioValues, images: string[]) {
  return db.transaction(async (tx) => {
    const [entry] = await tx.update(portfolio).set({ ...values, updatedAt: new Date() })
      .where(eq(portfolio.id, id)).returning({ id: portfolio.id });
    if (!entry) return null;
    await tx.delete(portfolioImages).where(eq(portfolioImages.portfolioId, id));
    await tx.insert(portfolioImages).values(images.map((url, sortOrder) => ({ portfolioId: id, url, sortOrder })));
    return entry;
  });
}

export async function deletePortfolio(id: number) {
  return db.delete(portfolio).where(eq(portfolio.id, id)).returning({ id: portfolio.id });
}
