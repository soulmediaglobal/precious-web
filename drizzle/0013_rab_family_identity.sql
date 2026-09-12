-- Issue #15. Forward-only; execute atomically using the Drizzle migrator.
-- Existing document strings, frozen content, revision PKs and child ownership are untouched.
LOCK TABLE projects, rabs IN ACCESS EXCLUSIVE MODE;
--> statement-breakpoint
CREATE TABLE project_number_counters (
 year integer PRIMARY KEY NOT NULL,
 last_number integer DEFAULT 0 NOT NULL,
 CONSTRAINT project_counter_bounds CHECK (year BETWEEN 1 AND 9999 AND last_number BETWEEN 0 AND 99999)
);
--> statement-breakpoint
-- Reserve pre-existing PRE values only, under the migration lock; never renumber them.
INSERT INTO project_number_counters (year, last_number)
SELECT substring(project_number from 5 for 4)::integer, max(right(project_number,5)::integer)
FROM projects WHERE project_number ~ '^PRE-[0-9]{4}-[0-9]{5}$'
GROUP BY substring(project_number from 5 for 4)::integer;
--> statement-breakpoint
CREATE FUNCTION next_project_number(allocation_year integer DEFAULT extract(year FROM CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta')::integer)
RETURNS text LANGUAGE plpgsql AS $$
DECLARE n integer;
BEGIN
 INSERT INTO project_number_counters(year,last_number) VALUES(allocation_year,1)
 ON CONFLICT (year) DO UPDATE SET last_number=project_number_counters.last_number+1
 RETURNING last_number INTO n;
 RETURN 'PRE-' || lpad(allocation_year::text,4,'0') || '-' || lpad(n::text,5,'0');
END $$;
--> statement-breakpoint
ALTER TABLE projects ALTER COLUMN project_number SET DEFAULT next_project_number();
--> statement-breakpoint
CREATE TABLE rab_families (
 id serial PRIMARY KEY NOT NULL,
 project_id integer NOT NULL CONSTRAINT rab_families_project_id_projects_id_fk REFERENCES projects(id) ON DELETE RESTRICT,
 family_number integer NOT NULL,
 last_revision_number integer DEFAULT 0 NOT NULL,
 CONSTRAINT rab_families_id_project_unique UNIQUE(id,project_id),
 CONSTRAINT rab_family_number_positive CHECK(family_number>0),
 CONSTRAINT rab_family_revision_nonnegative CHECK(last_revision_number>=0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX rab_families_project_number_unique ON rab_families(project_id,family_number);
--> statement-breakpoint
CREATE TABLE rab_family_counters (
 project_id integer PRIMARY KEY NOT NULL CONSTRAINT rab_family_counters_project_id_projects_id_fk REFERENCES projects(id) ON DELETE CASCADE,
 last_number integer DEFAULT 0 NOT NULL,
 CONSTRAINT rab_family_counter_nonnegative CHECK(last_number>=0)
);
--> statement-breakpoint
ALTER TABLE rabs ADD COLUMN family_id integer;
--> statement-breakpoint
-- Fail closed for invalid lineage before any mapping. Increasing revisions rule out cycles.
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM rabs r LEFT JOIN rabs s ON s.id=r.supersedes_rab_id
  WHERE r.supersedes_rab_id IS NOT NULL AND (s.id IS NULL OR s.project_id<>r.project_id OR s.revision_number>=r.revision_number))
 THEN RAISE EXCEPTION 'Issue15: invalid legacy source (orphan, cross-project, non-increasing/cyclic); manual review required'; END IF;
 IF EXISTS(SELECT 1 FROM rabs WHERE revision_number<0)
 THEN RAISE EXCEPTION 'Issue15: negative legacy revision; manual review required'; END IF;
END $$;
--> statement-breakpoint
-- Each explicit connected source lineage becomes a family. Unlinked roots each get their
-- own family, ordered by root PK per project; never guess links from strings or adjacency.
CREATE TEMP TABLE issue15_family_map ON COMMIT DROP AS
WITH RECURSIVE lineage AS (
 SELECT id, project_id, id AS root_id FROM rabs WHERE supersedes_rab_id IS NULL
 UNION ALL
 SELECT r.id,r.project_id,l.root_id FROM rabs r JOIN lineage l ON r.supersedes_rab_id=l.id
)
SELECT id,project_id,root_id,dense_rank() OVER(PARTITION BY project_id ORDER BY root_id)::integer AS family_number FROM lineage;
--> statement-breakpoint
INSERT INTO rab_families(project_id,family_number,last_revision_number)
SELECT m.project_id,m.family_number,max(r.revision_number) FROM issue15_family_map m JOIN rabs r ON r.id=m.id
GROUP BY m.project_id,m.family_number ORDER BY m.project_id,m.family_number;
--> statement-breakpoint
UPDATE rabs r SET family_id=f.id FROM issue15_family_map m JOIN rab_families f USING(project_id,family_number) WHERE r.id=m.id;
--> statement-breakpoint
INSERT INTO rab_family_counters(project_id,last_number) SELECT project_id,max(family_number) FROM rab_families GROUP BY project_id;
--> statement-breakpoint
ALTER TABLE rabs ALTER COLUMN family_id SET NOT NULL;
--> statement-breakpoint
DROP INDEX rabs_project_revision_unique;
--> statement-breakpoint
CREATE UNIQUE INDEX rabs_family_revision_unique ON rabs(family_id,revision_number);
--> statement-breakpoint
ALTER TABLE rabs ADD CONSTRAINT rabs_id_family_unique UNIQUE(id,family_id),
 ADD CONSTRAINT rabs_family_project_fk FOREIGN KEY(family_id,project_id) REFERENCES rab_families(id,project_id) ON DELETE RESTRICT,
 ADD CONSTRAINT rabs_source_family_fk FOREIGN KEY(supersedes_rab_id,family_id) REFERENCES rabs(id,family_id) ON DELETE RESTRICT,
 ADD CONSTRAINT rabs_revision_nonnegative CHECK(revision_number>=0),
 ADD CONSTRAINT rabs_source_not_self CHECK(supersedes_rab_id IS NULL OR supersedes_rab_id<>id);
