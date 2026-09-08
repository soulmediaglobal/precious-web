CREATE TABLE "rab_number_counters" (
	"year" integer PRIMARY KEY NOT NULL,
	"last_number" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "client_project_number" integer;--> statement-breakpoint
WITH ranked_projects AS (
	SELECT "id", row_number() OVER (
		PARTITION BY "client_id"
		ORDER BY "created_at", "id"
	) AS client_number
	FROM "projects"
)
UPDATE "projects"
SET "client_project_number" = ranked_projects.client_number
FROM ranked_projects
WHERE "projects"."id" = ranked_projects."id";--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "client_project_number" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "projects_client_number_unique" ON "projects" USING btree ("client_id","client_project_number");--> statement-breakpoint
WITH numbered_rabs AS (
	SELECT
		r."id",
		extract(year FROM r."offer_date")::integer AS rab_year,
		p."client_project_number",
		row_number() OVER (
			PARTITION BY extract(year FROM r."offer_date")
			ORDER BY r."created_at", r."id"
		) AS annual_number
	FROM "rabs" r
	JOIN "projects" p ON p."id" = r."project_id"
)
UPDATE "rabs"
SET "document_number" = 'PRE/RAB/' || numbered_rabs.rab_year::text || '-' ||
	lpad(numbered_rabs.client_project_number::text, 3, '0') || '-' ||
	lpad(numbered_rabs.annual_number::text, 3, '0')
FROM numbered_rabs
WHERE "rabs"."id" = numbered_rabs."id";--> statement-breakpoint
INSERT INTO "rab_number_counters" ("year", "last_number")
SELECT extract(year FROM "offer_date")::integer, count(*)::integer
FROM "rabs"
GROUP BY extract(year FROM "offer_date")
ON CONFLICT ("year") DO UPDATE SET
	"last_number" = EXCLUDED."last_number",
	"updated_at" = now();
