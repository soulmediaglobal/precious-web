ALTER TABLE "rabs" DROP CONSTRAINT "rabs_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "rabs" ADD COLUMN "frozen_document" text;--> statement-breakpoint
ALTER TABLE "rabs" ADD COLUMN "inherited_masters" text;--> statement-breakpoint
ALTER TABLE "rabs" ADD CONSTRAINT "rabs_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE restrict ON UPDATE no action;