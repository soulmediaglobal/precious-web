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

// Phase 1 document navigation: explicit family ownership, no document-string inference.
export async function getRabWorkspaceProjects() {
  return db.select({ id: projects.id, projectNumber: projects.projectNumber,
    projectName: projects.projectName, location: projects.location }).from(projects)
    .orderBy(desc(projects.createdAt), desc(projects.id));
}

export async function getProjectRabWorkspace(projectId: number) {
  const [project] = await db.select({ id: projects.id, projectNumber: projects.projectNumber,
    projectName: projects.projectName, location: projects.location }).from(projects)
    .where(eq(projects.id, projectId));
  if (!project) return null;
  const families = await db.select().from(rabFamilies)
    .where(eq(rabFamilies.projectId, projectId)).orderBy(desc(rabFamilies.familyNumber));
  const revisions = await db.select({ id: rabs.id, familyId: rabs.familyId,
    documentNumber: rabs.documentNumber, revisionNumber: rabs.revisionNumber,
    status: rabs.status, grandTotal: rabs.grandTotal, createdAt: rabs.createdAt,
    updatedAt: rabs.updatedAt, supersedesRabId: rabs.supersedesRabId }).from(rabs)
    .innerJoin(rabFamilies, and(eq(rabs.familyId, rabFamilies.id), eq(rabs.projectId, rabFamilies.projectId)))
    .where(eq(rabFamilies.projectId, projectId)).orderBy(desc(rabs.revisionNumber), desc(rabs.id));
  return { project, families: families.map(family => ({ ...family,
    revisions: revisions.filter(revision => revision.familyId === family.id) })) };
}

// RAB Builder: each mutation holds the document lock through ownership checks and totals.
import {
	rabSections,
	rabGroups,
	rabSubgroups,
	rabItems,
	rabStages,
	rabPaymentTerms
} from './schema';
import {
	BuilderInputError,
	sumMoney,
	type BuilderMutation,
	type CommercialMutation
} from '$lib/rab-builder/values';

async function getBuilderRows(tx: RabAllocationTransaction, rabId: number) {
	const sections = await tx
		.select()
		.from(rabSections)
		.where(eq(rabSections.rabId, rabId))
		.orderBy(asc(rabSections.sortOrder), asc(rabSections.id));
	const groups = await tx
		.select({ row: rabGroups })
		.from(rabGroups)
		.innerJoin(rabSections, eq(rabGroups.sectionId, rabSections.id))
		.where(eq(rabSections.rabId, rabId))
		.orderBy(asc(rabGroups.sortOrder), asc(rabGroups.id));
	const subgroups = await tx
		.select({ row: rabSubgroups })
		.from(rabSubgroups)
		.innerJoin(rabGroups, eq(rabSubgroups.groupId, rabGroups.id))
		.innerJoin(rabSections, eq(rabGroups.sectionId, rabSections.id))
		.where(eq(rabSections.rabId, rabId))
		.orderBy(asc(rabSubgroups.sortOrder), asc(rabSubgroups.id));
	const items = await tx
		.select({
			row: rabItems,
			materialTotal: sql<
				string | null
			>`round(${rabItems.volume} * ${rabItems.materialUnitPrice}, 2)::text`,
			jasaTotal: sql<string | null>`round(${rabItems.volume} * ${rabItems.jasaUnitPrice}, 2)::text`
		})
		.from(rabItems)
		.innerJoin(rabGroups, eq(rabItems.groupId, rabGroups.id))
		.innerJoin(rabSections, eq(rabGroups.sectionId, rabSections.id))
		.where(eq(rabSections.rabId, rabId))
		.orderBy(asc(rabItems.sortOrder), asc(rabItems.id));
	return {
		sections,
		groups: groups.map((r) => r.row),
		subgroups: subgroups.map((r) => r.row),
		items: items.map(({ row, ...totals }) => ({ ...row, ...totals }))
	};
}

export async function getRabBuilder(projectId: number, rabId: number) {
	return db.transaction(
		async (tx) => {
			const [entry] = await tx
				.select({
					rab: rabs,
					project: {
						id: projects.id,
						projectNumber: projects.projectNumber,
						projectName: projects.projectName,
						location: projects.location,
						clientName: clients.companyName
					}
				})
				.from(rabs)
				.innerJoin(projects, eq(rabs.projectId, projects.id))
				.leftJoin(clients, eq(projects.clientId, clients.id))
				.where(and(eq(rabs.id, rabId), eq(rabs.projectId, projectId)));
			if (!entry) return null;
			const rows = await getBuilderRows(tx, rabId);
			const stages = await tx
				.select()
				.from(rabStages)
				.where(eq(rabStages.rabId, rabId))
				.orderBy(asc(rabStages.sortOrder), asc(rabStages.id));
			const paymentTerms = await tx
				.select()
				.from(rabPaymentTerms)
				.where(eq(rabPaymentTerms.rabId, rabId))
				.orderBy(asc(rabPaymentTerms.sortOrder), asc(rabPaymentTerms.id));
			return {
				...entry,
				stages,
				paymentTerms,
				sections: rows.sections.map((section) => {
					const groups = rows.groups
						.filter((group) => group.sectionId === section.id)
						.map((group) => {
							const items = rows.items.filter((item) => item.groupId === group.id);
							return {
								...group,
								subtotal: sumMoney(items.map((item) => item.total)),
								items: items.filter((item) => item.subgroupId === null),
								subgroups: rows.subgroups
									.filter((subgroup) => subgroup.groupId === group.id)
									.map((subgroup) => {
										const children = items.filter((item) => item.subgroupId === subgroup.id);
										return {
											...subgroup,
											items: children,
											subtotal: sumMoney(children.map((item) => item.total))
										};
									})
							};
						});
					return { ...section, groups, subtotal: sumMoney(groups.map((group) => group.subtotal)) };
				})
			};
		},
		{ isolationLevel: 'repeatable read', accessMode: 'read only' }
	);
}

async function refreshBuilderTotals(tx: RabAllocationTransaction, rabId: number) {
	// Legacy item totals remain unchanged until explicitly edited. New/edited items already
	// have exact rounded component totals; aggregate those persisted totals for all levels.
	await tx.execute(sql`with amount as (
    select coalesce(sum(i.total), 0) as subtotal from rab_items i
    join rab_groups g on g.id = i.group_id join rab_sections s on s.id = g.section_id
    where s.rab_id = ${rabId}
  ) update rabs r set subtotal = a.subtotal,
    tax_amount = round(a.subtotal * r.tax_rate / 100, 2),
    grand_total = a.subtotal + round(a.subtotal * r.tax_rate / 100, 2), updated_at = now()
    from amount a where r.id = ${rabId}`);
	await tx.execute(sql`update rab_items i set weight = case when r.subtotal = 0 then 0
    else round(i.total / r.subtotal * 100, 6) end
    from rab_groups g, rab_sections s, rabs r
    where i.group_id = g.id and g.section_id = s.id and s.rab_id = r.id and r.id = ${rabId}`);
	await tx.execute(sql`update rab_payment_terms pt
		set amount = round(r.grand_total * pt.percentage / 100, 2)
		from rabs r
		where pt.rab_id = r.id and r.id = ${rabId} and pt.percentage is not null`);
}

export async function mutateRabCommercial(
	projectId: number,
	rabId: number,
	input: CommercialMutation
) {
	return db.transaction(async (tx) => {
		const [rab] = await tx
			.select({ status: rabs.status, grandTotal: rabs.grandTotal })
			.from(rabs)
			.where(and(eq(rabs.id, rabId), eq(rabs.projectId, projectId)))
			.for('update');
		if (!rab) return { status: 'missing' as const };
		if (rab.status !== 'draft') return { status: 'locked' as const };

		const stages = await tx.select().from(rabStages).where(eq(rabStages.rabId, rabId));
		const terms = await tx.select().from(rabPaymentTerms).where(eq(rabPaymentTerms.rabId, rabId));
		const owned = input.kind === 'stage' ? stages : terms;
		if (input.id && !owned.some((row) => row.id === input.id))
			throw new BuilderInputError('Data Tahapan/Termin tidak ditemukan dalam RAB ini.');

		if (input.operation === 'delete') {
			if (input.kind === 'stage') {
				if (terms.some((term) => term.stageId === input.id))
					throw new BuilderInputError(
						'Tahapan masih digunakan oleh Termin. Lepaskan relasi Termin terlebih dahulu.'
					);
				await tx
					.delete(rabStages)
					.where(and(eq(rabStages.id, input.id!), eq(rabStages.rabId, rabId)));
			} else {
				await tx
					.delete(rabPaymentTerms)
					.where(and(eq(rabPaymentTerms.id, input.id!), eq(rabPaymentTerms.rabId, rabId)));
			}
			return { status: 'saved' as const };
		}

		if (input.kind === 'stage') {
			const values = {
				name: input.name,
				description: input.description || null,
				sortOrder: input.sortOrder
			};
			if (input.id)
				await tx
					.update(rabStages)
					.set(values)
					.where(and(eq(rabStages.id, input.id), eq(rabStages.rabId, rabId)));
			else await tx.insert(rabStages).values({ ...values, rabId });
		} else {
			if (input.stageId !== null && !stages.some((stage) => stage.id === input.stageId))
				throw new BuilderInputError('Tahapan tidak ditemukan dalam RAB ini.');
			const values = {
				name: input.name,
				percentage: input.percentage,
				amount: sql`round(${rab.grandTotal}::numeric * ${input.percentage}::numeric / 100, 2)`,
				stageId: input.stageId,
				paymentTrigger: input.paymentTrigger || null,
				sortOrder: input.sortOrder
			};
			if (input.id)
				await tx
					.update(rabPaymentTerms)
					.set(values)
					.where(and(eq(rabPaymentTerms.id, input.id), eq(rabPaymentTerms.rabId, rabId)));
			else await tx.insert(rabPaymentTerms).values({ ...values, rabId });
		}
		return { status: 'saved' as const };
	});
}

export async function mutateRabBuilder(projectId: number, rabId: number, input: BuilderMutation) {
	return db.transaction(async (tx) => {
		const [rab] = await tx
			.select({ status: rabs.status })
			.from(rabs)
			.where(and(eq(rabs.id, rabId), eq(rabs.projectId, projectId)))
			.for('update');
		if (!rab) return { status: 'missing' as const };
		if (rab.status !== 'draft') return { status: 'locked' as const };
		const rows = await getBuilderRows(tx, rabId);
		const { kind, id, parentId, subgroupId } = input;
		const owned =
			kind === 'section'
				? rows.sections
				: kind === 'group'
					? rows.groups
					: kind === 'subgroup'
						? rows.subgroups
						: rows.items;
		if (id && !owned.some((row) => row.id === id))
			throw new BuilderInputError('Baris tidak ditemukan dalam RAB ini.');
		if (kind === 'group' && !rows.sections.some((row) => row.id === parentId))
			throw new BuilderInputError('Area tidak ditemukan.');
		if ((kind === 'subgroup' || kind === 'item') && !rows.groups.some((row) => row.id === parentId))
			throw new BuilderInputError('Kelompok tidak ditemukan.');
		if (
			kind === 'item' &&
			subgroupId !== null &&
			!rows.subgroups.some((row) => row.id === subgroupId && row.groupId === parentId)
		)
			throw new BuilderInputError('Subkelompok bukan bagian dari kelompok ini.');
		// Hierarchy parents cannot be silently changed by tampered edit requests.
		if (
			id &&
			((kind === 'group' && !rows.groups.some((r) => r.id === id && r.sectionId === parentId)) ||
				(kind === 'subgroup' && !rows.subgroups.some((r) => r.id === id && r.groupId === parentId)))
		)
			throw new BuilderInputError('Induk baris tidak cocok.');
		if (input.operation === 'delete') {
			const table =
				kind === 'section'
					? rabSections
					: kind === 'group'
						? rabGroups
						: kind === 'subgroup'
							? rabSubgroups
							: rabItems;
			await tx.delete(table).where(eq(table.id, id!));
		} else if ('description' in input) {
			const unitPrice = sql`(${input.materialUnitPrice}::numeric + ${input.jasaUnitPrice}::numeric)`;
			const total = sql`(round(${input.volume}::numeric * ${input.materialUnitPrice}::numeric, 2) + round(${input.volume}::numeric * ${input.jasaUnitPrice}::numeric, 2))`;
			const values = {
				groupId: parentId!,
				subgroupId,
				description: input.description,
				unit: input.unit,
				volume: input.volume,
				materialUnitPrice: input.materialUnitPrice,
				jasaUnitPrice: input.jasaUnitPrice,
				unitPrice,
				total,
				sortOrder: input.sortOrder,
				notes: input.notes || null
			};
			if (id) await tx.update(rabItems).set(values).where(eq(rabItems.id, id));
			else await tx.insert(rabItems).values(values);
		} else {
			const values = { name: input.name, sortOrder: input.sortOrder };
			if (kind === 'section') {
				if (id) await tx.update(rabSections).set(values).where(eq(rabSections.id, id));
				else await tx.insert(rabSections).values({ ...values, rabId });
			} else if (kind === 'group') {
				if (id) await tx.update(rabGroups).set(values).where(eq(rabGroups.id, id));
				else await tx.insert(rabGroups).values({ ...values, sectionId: parentId! });
			} else {
				if (id) await tx.update(rabSubgroups).set(values).where(eq(rabSubgroups.id, id));
				else await tx.insert(rabSubgroups).values({ ...values, groupId: parentId! });
			}
		}
		await refreshBuilderTotals(tx, rabId);
		return { status: 'saved' as const };
	});
}

export async function getDashboardCounts() {
	const [[clientCount], [projectCount], [activeProjectCount], [portfolioCount]] = await Promise.all(
		[
			db.select({ value: count() }).from(clients),
			db.select({ value: count() }).from(projects),
			db.select({ value: count() }).from(projects).where(eq(projects.status, 'active')),
			db.select({ value: count() }).from(portfolio)
		]
	);
	return {
		clients: clientCount.value,
		projects: projectCount.value,
		activeProjects: activeProjectCount.value,
		portfolio: portfolioCount.value
	};
}

// Projects v2: canonical project identity and client ownership.
export async function getAdminProjects() {
  return db.select({ id: projects.id, projectNumber: projects.projectNumber,
    projectName: projects.projectName, status: projects.status, clientId: projects.clientId,
    clientName: clients.companyName, location: projects.location, createdAt: projects.createdAt })
    .from(projects).innerJoin(clients, eq(projects.clientId, clients.id))
    .orderBy(desc(projects.createdAt), desc(projects.id));
}

export async function getAdminProjectDetail(projectId: number) {
  const [row] = await db.select({ project: projects, clientName: clients.companyName })
    .from(projects).innerJoin(clients, eq(projects.clientId, clients.id))
    .where(eq(projects.id, projectId));
  return row ?? null;
}
