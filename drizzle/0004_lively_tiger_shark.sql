CREATE SEQUENCE "project_number_seq" START WITH 1 INCREMENT BY 1;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "project_number" SET DEFAULT ('PC-' || to_char(CURRENT_DATE, 'YYYY') || '-' || lpad(nextval('project_number_seq')::text, 5, '0'));
