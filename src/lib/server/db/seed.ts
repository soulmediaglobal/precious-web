import 'dotenv/config';
import { db } from './index';
import { portfolio, portfolioImages, expertise, expertiseImages, expertisePortfolio, team, settings } from './schema';
import { portofolio, expertises, teams, preciousemail, preciousPhone } from '../../index';

async function seed() {
  console.log('Seeding portfolio...');
  const portfolioSlugToId: Record<string, number> = {};

  for (const p of portofolio) {
    const [inserted] = await db.insert(portfolio).values({
      slug: p.slug,
      projectName: p.project_name,
      client: p.client,
      shortDescription: p.short_description,
      longDescriptionP1: p.long_description_p1,
      longDescriptionP2: p.long_description_p2,
      location: p.location,
      category: p.category,
      status: p.status
    }).returning({ id: portfolio.id });

    portfolioSlugToId[p.slug] = inserted.id;

    if (p.images?.length) {
      await db.insert(portfolioImages).values(
        p.images.map((url, i) => ({ portfolioId: inserted.id, url, sortOrder: i }))
      );
    }
  }
  console.log(`  -> ${portofolio.length} portfolio items inserted`);

  console.log('Seeding expertise...');
  for (const e of expertises) {
    const [inserted] = await db.insert(expertise).values({
      slug: e.slug,
      title: e.title,
      description: e.description,
      how: e.how,
      why: e.why
    }).returning({ id: expertise.id });

    if (e.images?.length) {
      await db.insert(expertiseImages).values(
        e.images.map((url, i) => ({ expertiseId: inserted.id, url, sortOrder: i }))
      );
    }

    if (e.portofolio?.length) {
      const links = e.portofolio
        .filter((slug) => portfolioSlugToId[slug] !== undefined)
        .map((slug) => ({ expertiseId: inserted.id, portfolioId: portfolioSlugToId[slug] }));
      if (links.length) {
        await db.insert(expertisePortfolio).values(links);
      }
    }
  }
  console.log(`  -> ${expertises.length} expertise items inserted`);

  console.log('Seeding team...');
  await db.insert(team).values(
    teams.map((t, i) => ({ name: t.name, title: t.title, image: t.image, sortOrder: i }))
  );
  console.log(`  -> ${teams.length} team members inserted`);

  console.log('Seeding settings...');
  await db.insert(settings).values([
    { key: 'email', value: preciousemail },
    { key: 'phone', value: preciousPhone }
  ]);
  console.log('  -> settings inserted');

  console.log('Done!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
