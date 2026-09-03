import { db } from './index';
import { portfolio, portfolioImages, expertise, expertiseImages, team, settings } from './schema';
import { eq, asc } from 'drizzle-orm';

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
