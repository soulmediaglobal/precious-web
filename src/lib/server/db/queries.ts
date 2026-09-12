import { db } from './index';
import { portfolio, portfolioImages, expertise, expertiseImages, team, settings, clients, projects, rabs } from './schema';
import { eq, asc, desc, ilike, or, count, and, sql } from 'drizzle-orm';

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

// Contact Inbox queries.
import { contactInquiries } from './schema';
import type { ContactValues, FollowUpMethod } from '../contact-cms';

export async function createContactInquiry(values: ContactValues) {
  return db.insert(contactInquiries).values({ ...values, lastName: values.lastName || null, email: values.email || null, phone: values.phone || null }).returning({ id: contactInquiries.id });
}

export async function getAllContactInquiries() {
  return db.select({ id: contactInquiries.id, firstName: contactInquiries.firstName, lastName: contactInquiries.lastName, email: contactInquiries.email, phone: contactInquiries.phone, createdAt: contactInquiries.createdAt, isFollowedUp: contactInquiries.isFollowedUp })
    .from(contactInquiries).orderBy(desc(contactInquiries.createdAt), desc(contactInquiries.id));
}

export async function getContactInquiryById(id: number) {
  const [row] = await db.select().from(contactInquiries).where(eq(contactInquiries.id, id));
  return row;
}

export async function updateContactInquiryFollowUp(id: number, nextState: { isFollowedUp: boolean; followUpMethod: FollowUpMethod | null }) {
  return db.update(contactInquiries).set({
    isFollowedUp: nextState.isFollowedUp,
    followUpMethod: nextState.isFollowedUp ? nextState.followUpMethod : null,
    followedUpAt: nextState.isFollowedUp
      ? sql`case when ${contactInquiries.isFollowedUp} then ${contactInquiries.followedUpAt} else clock_timestamp() end`
      : null
  }).where(eq(contactInquiries.id, id)).returning({ id: contactInquiries.id });
}

// Issue #15 allocation primitives. Call revision allocation INSIDE the same transaction
// that writes the full snapshot. This reserves identity only; it never clones content.
import { rabFamilies, rabFamilyCounters } from './schema';
type RabAllocationTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

export async function allocateRabRevisionIdentity(
 tx: RabAllocationTransaction, projectId: number, sourceRabId: number
) {
 const [source] = await tx.select().from(rabs)
  .where(and(eq(rabs.id, sourceRabId), eq(rabs.projectId, projectId))).for('update');
 if (!source) throw new Error('RAB source not found in Project');
 const [family] = await tx.update(rabFamilies)
  .set({ lastRevisionNumber: sql`greatest(${rabFamilies.lastRevisionNumber} + 1,
   (select coalesce(max(revision_number),0)+1 from rabs where family_id=${source.familyId}))` })
  .where(and(eq(rabFamilies.id, source.familyId), eq(rabFamilies.projectId, projectId)))
  .returning();
 if (!family) throw new Error('RAB family not found in Project');
 const [project] = await tx.select({ projectNumber: projects.projectNumber }).from(projects).where(eq(projects.id, projectId));
 return { familyId: family.id, revisionNumber: family.lastRevisionNumber,
  supersedesRabId: source.id,
  documentNumber: `${project.projectNumber}/RAB-${String(family.familyNumber).padStart(3,'0')}/R${String(family.lastRevisionNumber).padStart(2,'0')}` };
}

export async function createInitialRab(projectId: number, createdByUserId: string | null) {
 return db.transaction(async (tx) => {
  const [project] = await tx.select().from(projects).where(eq(projects.id, projectId)).for('update');
  if (!project) return null;
  const [counter] = await tx.insert(rabFamilyCounters).values({ projectId, lastNumber: 1 })
   .onConflictDoUpdate({ target: rabFamilyCounters.projectId,
    set: { lastNumber: sql`${rabFamilyCounters.lastNumber} + 1` } }).returning();
  const [family] = await tx.insert(rabFamilies).values({ projectId, familyNumber: counter.lastNumber }).returning();
  const [rab] = await tx.insert(rabs).values({ projectId, familyId: family.id, revisionNumber: 0,
   documentNumber: `${project.projectNumber}/RAB-${String(family.familyNumber).padStart(3,'0')}/R00`, createdByUserId }).returning({ id: rabs.id });
  return { id: rab.id, familyId: family.id, alreadyExists: false };
 });
}

// Database default allocates PRE by Asia/Jakarta transaction calendar year.
// Serialize the existing client-local project ordinal independently of the PRE year counter.
export async function createCanonicalProject(
 values: Omit<typeof projects.$inferInsert, 'id' | 'projectNumber' | 'clientProjectNumber' | 'createdAt' | 'updatedAt'>
) {
 return db.transaction(async (tx) => {
  const [client] = await tx.select({ id: clients.id }).from(clients).where(eq(clients.id, values.clientId)).for('update');
  if (!client) throw new Error('Client not found');
  const [latest] = await tx.select({ number: projects.clientProjectNumber }).from(projects)
   .where(eq(projects.clientId, values.clientId)).orderBy(desc(projects.clientProjectNumber)).limit(1);
  const [project] = await tx.insert(projects).values({ ...values, clientProjectNumber: (latest?.number ?? 0)+1 }).returning();
  return project;
 });
}
