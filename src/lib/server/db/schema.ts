import { pgTable, serial, text, integer, timestamp, primaryKey, boolean, index, uuid, uniqueIndex, date, numeric } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

export const portfolio = pgTable('portfolio', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  projectName: text('project_name').notNull(),
  client: text('client').notNull(),
  shortDescription: text('short_description').notNull(),
  longDescriptionP1: text('long_description_p1'),
  longDescriptionP2: text('long_description_p2'),
  location: text('location').notNull(),
  category: text('category').notNull(),
  status: text('status').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const portfolioImages = pgTable('portfolio_images', {
  id: serial('id').primaryKey(),
  portfolioId: integer('portfolio_id').notNull().references(() => portfolio.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  sortOrder: integer('sort_order').notNull().default(0)
});

export const expertise = pgTable('expertise', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  how: text('how').notNull(),
  why: text('why').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const expertiseImages = pgTable('expertise_images', {
  id: serial('id').primaryKey(),
  expertiseId: integer('expertise_id').notNull().references(() => expertise.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  sortOrder: integer('sort_order').notNull().default(0)
});

export const expertisePortfolio = pgTable('expertise_portfolio', {
  expertiseId: integer('expertise_id').notNull().references(() => expertise.id, { onDelete: 'cascade' }),
  portfolioId: integer('portfolio_id').notNull().references(() => portfolio.id, { onDelete: 'cascade' })
}, (t) => ({
  pk: primaryKey({ columns: [t.expertiseId, t.portfolioId] })
}));

export const team = pgTable('team', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  title: text('title').notNull(),
  image: text('image').notNull(),
  group: text('group').notNull().default('staff'),
  description: text('description'),
  email: text('email'),
  linkedin: text('linkedin'),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const settings = pgTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull()
});

// Relations
export const portfolioRelations = relations(portfolio, ({ many }) => ({
  images: many(portfolioImages),
  expertise: many(expertisePortfolio)
}));

export const portfolioImagesRelations = relations(portfolioImages, ({ one }) => ({
  portfolio: one(portfolio, { fields: [portfolioImages.portfolioId], references: [portfolio.id] })
}));

export const expertiseRelations = relations(expertise, ({ many }) => ({
  images: many(expertiseImages),
  portfolio: many(expertisePortfolio)
}));

export const expertiseImagesRelations = relations(expertiseImages, ({ one }) => ({
  expertise: one(expertise, { fields: [expertiseImages.expertiseId], references: [expertise.id] })
}));

export const expertisePortfolioRelations = relations(expertisePortfolio, ({ one }) => ({
  expertise: one(expertise, { fields: [expertisePortfolio.expertiseId], references: [expertise.id] }),
  portfolio: one(portfolio, { fields: [expertisePortfolio.portfolioId], references: [portfolio.id] })
}));

export const clients = pgTable(
	'clients',
	{
		id: serial('id').primaryKey(),
		companyName: text('company_name').notNull(),
		companyType: text('company_type'),
		address: text('address'),
		directorName: text('director_name'),
		directorPhone: text('phone'),
		directorEmail: text('email'),
		picName: text('pic_name'),
		picPhone: text('pic_phone'),
		picEmail: text('pic_email'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(t) => [index('clients_company_name_idx').on(t.companyName)]
);

export const projects = pgTable(
	'projects',
	{
		id: serial('id').primaryKey(),
		projectNumber: text('project_number')
			.notNull()
			.unique()
			.default(
				sql`'PC-' || to_char(CURRENT_DATE, 'YYYY') || '-' || lpad(nextval('project_number_seq')::text, 5, '0')`
			),
		clientId: integer('client_id')
			.notNull()
			.references(() => clients.id, { onDelete: 'restrict' }),
		clientProjectNumber: integer('client_project_number').notNull(),
		projectName: text('project_name').notNull(),
		transactionTitle: text('transaction_title'),
		location: text('location'),
		acquisitionType: text('acquisition_type'),
		status: text('status').notNull().default('draft'),
		description: text('description'),
		picUserId: uuid('pic_user_id'),
		createdByUserId: uuid('created_by_user_id'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(t) => [
		index('projects_client_id_idx').on(t.clientId),
		index('projects_status_idx').on(t.status),
		uniqueIndex('projects_client_number_unique').on(t.clientId, t.clientProjectNumber)
	]
);

export const companyBankAccounts = pgTable(
	'company_bank_accounts',
	{
		id: serial('id').primaryKey(),
		bankName: text('bank_name').notNull(),
		accountNumber: text('account_number').notNull(),
		accountName: text('account_name').notNull(),
		branch: text('branch'),
		isActive: boolean('is_active').notNull().default(true),
		sortOrder: integer('sort_order').notNull().default(0),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(t) => [uniqueIndex('company_bank_accounts_number_unique').on(t.bankName, t.accountNumber)]
);

export const rabs = pgTable(
	'rabs',
	{
		id: serial('id').primaryKey(),
		projectId: integer('project_id')
			.notNull()
			.references(() => projects.id, { onDelete: 'restrict' }),
		revisionNumber: integer('revision_number').notNull().default(0),
		documentNumber: text('document_number').notNull().unique(),
		status: text('status').notNull().default('draft'),
		frozenDocument: text('frozen_document'),
		inheritedMasters: text('inherited_masters'),
		offerDate: date('offer_date').notNull().defaultNow(),
		greeting: text('greeting'),
		subtotal: numeric('subtotal', { precision: 18, scale: 2 }).notNull().default('0'),
		taxRate: numeric('tax_rate', { precision: 5, scale: 2 }).notNull().default('11'),
		taxAmount: numeric('tax_amount', { precision: 18, scale: 2 }).notNull().default('0'),
		grandTotal: numeric('grand_total', { precision: 18, scale: 2 }).notNull().default('0'),
		createdByUserId: uuid('created_by_user_id'),
		internalApprovedByUserId: uuid('internal_approved_by_user_id'),
		internalApprovedAt: timestamp('internal_approved_at'),
		clientApprovedAt: timestamp('client_approved_at'),
		clientApprovalEvidence: text('client_approval_evidence'),
		bankAccountId: integer('bank_account_id').references(() => companyBankAccounts.id, {
			onDelete: 'set null'
		}),
		signatoryName: text('signatory_name'),
		signatoryTitle: text('signatory_title'),
		supersedesRabId: integer('supersedes_rab_id'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(t) => [
		uniqueIndex('rabs_project_revision_unique').on(t.projectId, t.revisionNumber),
		index('rabs_project_id_idx').on(t.projectId),
		index('rabs_bank_account_id_idx').on(t.bankAccountId)
	]
);

// Contact Inbox — independent of Clients, Projects and RAB.
export const contactInquiries = pgTable('contact_inquiries', {
  id: serial('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name'),
  email: text('email'),
  phone: text('phone'),
  message: text('message').notNull(),
  consentAccepted: boolean('consent_accepted').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  isFollowedUp: boolean('is_followed_up').notNull().default(false),
  followUpMethod: text('follow_up_method'),
  followedUpAt: timestamp('followed_up_at', { withTimezone: true })
}).enableRLS();

// Canonical tables from migrations 0005–0011; RAB application work remains parked.
export const workTypes = pgTable('work_types', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique(),
	slug: text('slug').notNull().unique(),
	sortOrder: integer('sort_order').notNull().default(0),
	isActive: boolean('is_active').notNull().default(true),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const projectWorkTypes = pgTable(
	'project_work_types',
	{
		projectId: integer('project_id')
			.notNull()
			.references(() => projects.id, { onDelete: 'cascade' }),
		workTypeId: integer('work_type_id')
			.notNull()
			.references(() => workTypes.id, { onDelete: 'restrict' })
	},
	(t) => ({
		pk: primaryKey({ columns: [t.projectId, t.workTypeId] }),
		workTypeIdx: index('project_work_types_work_type_id_idx').on(t.workTypeId)
	})
);

export const projectDocuments = pgTable(
	'project_documents',
	{
		id: serial('id').primaryKey(),
		projectId: integer('project_id')
			.notNull()
			.references(() => projects.id, { onDelete: 'cascade' }),
		documentType: text('document_type').notNull().default('other'),
		name: text('name').notNull(),
		storagePath: text('storage_path').notNull(),
		mimeType: text('mime_type'),
		sizeBytes: integer('size_bytes'),
		createdByUserId: uuid('created_by_user_id'),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(t) => [index('project_documents_project_id_idx').on(t.projectId)]
);

export const rabNumberCounters = pgTable('rab_number_counters', {
	year: integer('year').primaryKey(),
	lastNumber: integer('last_number').notNull().default(0),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const rabSections = pgTable(
	'rab_sections',
	{
		id: serial('id').primaryKey(),
		rabId: integer('rab_id')
			.notNull()
			.references(() => rabs.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		sortOrder: integer('sort_order').notNull().default(0)
	},
	(t) => [index('rab_sections_rab_id_idx').on(t.rabId)]
);

export const rabGroups = pgTable(
	'rab_groups',
	{
		id: serial('id').primaryKey(),
		sectionId: integer('section_id')
			.notNull()
			.references(() => rabSections.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		sortOrder: integer('sort_order').notNull().default(0)
	},
	(t) => [index('rab_groups_section_id_idx').on(t.sectionId)]
);

export const rabSubgroups = pgTable(
	'rab_subgroups',
	{
		id: serial('id').primaryKey(),
		groupId: integer('group_id')
			.notNull()
			.references(() => rabGroups.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		sortOrder: integer('sort_order').notNull().default(0)
	},
	(t) => [index('rab_subgroups_group_id_idx').on(t.groupId)]
);

export const rabItems = pgTable(
	'rab_items',
	{
		id: serial('id').primaryKey(),
		groupId: integer('group_id')
			.notNull()
			.references(() => rabGroups.id, { onDelete: 'cascade' }),
		subgroupId: integer('subgroup_id').references(() => rabSubgroups.id, {
			onDelete: 'cascade'
		}),
		description: text('description').notNull(),
		unit: text('unit').notNull(),
		volume: numeric('volume', { precision: 14, scale: 4 }).notNull().default('0'),
		unitPrice: numeric('unit_price', { precision: 18, scale: 2 }).notNull().default('0'),
		total: numeric('total', { precision: 18, scale: 2 }).notNull().default('0'),
		weight: numeric('weight', { precision: 9, scale: 6 }).notNull().default('0'),
		sortOrder: integer('sort_order').notNull().default(0),
		notes: text('notes')
	},
	(t) => [
		index('rab_items_group_id_idx').on(t.groupId),
		index('rab_items_subgroup_id_idx').on(t.subgroupId)
	]
);

export const rabStages = pgTable(
	'rab_stages',
	{
		id: serial('id').primaryKey(),
		rabId: integer('rab_id')
			.notNull()
			.references(() => rabs.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		description: text('description'),
		sortOrder: integer('sort_order').notNull().default(0)
	},
	(t) => [index('rab_stages_rab_id_idx').on(t.rabId)]
);

export const rabPaymentTerms = pgTable(
	'rab_payment_terms',
	{
		id: serial('id').primaryKey(),
		rabId: integer('rab_id')
			.notNull()
			.references(() => rabs.id, { onDelete: 'cascade' }),
		stageId: integer('stage_id')
			.notNull()
			.references(() => rabStages.id, { onDelete: 'restrict' }),
		name: text('name').notNull(),
		amount: numeric('amount', { precision: 18, scale: 2 }).notNull().default('0'),
		paymentTrigger: text('payment_trigger'),
		sortOrder: integer('sort_order').notNull().default(0)
	},
	(t) => [
		index('rab_payment_terms_rab_id_idx').on(t.rabId),
		index('rab_payment_terms_stage_id_idx').on(t.stageId)
	]
);

// Relations
