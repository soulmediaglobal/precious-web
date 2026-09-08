CREATE TABLE "rab_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"section_id" integer NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rab_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" integer NOT NULL,
	"description" text NOT NULL,
	"unit" text NOT NULL,
	"volume" numeric(14, 4) DEFAULT '0' NOT NULL,
	"unit_price" numeric(18, 2) DEFAULT '0' NOT NULL,
	"total" numeric(18, 2) DEFAULT '0' NOT NULL,
	"weight" numeric(9, 6) DEFAULT '0' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "rab_sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"rab_id" integer NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rabs" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"revision_number" integer DEFAULT 0 NOT NULL,
	"document_number" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"subtotal" numeric(18, 2) DEFAULT '0' NOT NULL,
	"tax_rate" numeric(5, 2) DEFAULT '11' NOT NULL,
	"tax_amount" numeric(18, 2) DEFAULT '0' NOT NULL,
	"grand_total" numeric(18, 2) DEFAULT '0' NOT NULL,
	"created_by_user_id" uuid,
	"internal_approved_by_user_id" uuid,
	"internal_approved_at" timestamp,
	"client_approved_at" timestamp,
	"client_approval_evidence" text,
	"supersedes_rab_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "rabs_document_number_unique" UNIQUE("document_number")
);
--> statement-breakpoint
ALTER TABLE "rab_groups" ADD CONSTRAINT "rab_groups_section_id_rab_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."rab_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rab_items" ADD CONSTRAINT "rab_items_group_id_rab_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."rab_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rab_sections" ADD CONSTRAINT "rab_sections_rab_id_rabs_id_fk" FOREIGN KEY ("rab_id") REFERENCES "public"."rabs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rabs" ADD CONSTRAINT "rabs_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "rab_groups_section_id_idx" ON "rab_groups" USING btree ("section_id");--> statement-breakpoint
CREATE INDEX "rab_items_group_id_idx" ON "rab_items" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "rab_sections_rab_id_idx" ON "rab_sections" USING btree ("rab_id");--> statement-breakpoint
CREATE UNIQUE INDEX "rabs_project_revision_unique" ON "rabs" USING btree ("project_id","revision_number");--> statement-breakpoint
CREATE INDEX "rabs_project_id_idx" ON "rabs" USING btree ("project_id");