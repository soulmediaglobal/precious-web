import { pgTable, serial, text, integer, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

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
  sortOrder: integer('sort_order').notNull().default(0)
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
