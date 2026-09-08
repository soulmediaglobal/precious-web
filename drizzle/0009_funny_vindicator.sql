CREATE TABLE "company_bank_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"bank_name" text NOT NULL,
	"account_number" text NOT NULL,
	"account_name" text NOT NULL,
	"branch" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"document_type" text DEFAULT 'other' NOT NULL,
	"name" text NOT NULL,
	"storage_path" text NOT NULL,
	"mime_type" text,
	"size_bytes" integer,
	"created_by_user_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rab_payment_terms" (
	"id" serial PRIMARY KEY NOT NULL,
	"rab_id" integer NOT NULL,
	"stage_id" integer NOT NULL,
	"name" text NOT NULL,
	"amount" numeric(18, 2) DEFAULT '0' NOT NULL,
	"payment_trigger" text,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rab_stages" (
	"id" serial PRIMARY KEY NOT NULL,
	"rab_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rab_subgroups" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" integer NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "rab_items" ADD COLUMN "subgroup_id" integer;--> statement-breakpoint
ALTER TABLE "rabs" ADD COLUMN "offer_date" date DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "rabs" ADD COLUMN "greeting" text;--> statement-breakpoint
ALTER TABLE "rabs" ADD COLUMN "bank_account_id" integer;--> statement-breakpoint
ALTER TABLE "rabs" ADD COLUMN "signatory_name" text;--> statement-breakpoint
ALTER TABLE "rabs" ADD COLUMN "signatory_title" text;--> statement-breakpoint
ALTER TABLE "project_documents" ADD CONSTRAINT "project_documents_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rab_payment_terms" ADD CONSTRAINT "rab_payment_terms_rab_id_rabs_id_fk" FOREIGN KEY ("rab_id") REFERENCES "public"."rabs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rab_payment_terms" ADD CONSTRAINT "rab_payment_terms_stage_id_rab_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."rab_stages"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rab_stages" ADD CONSTRAINT "rab_stages_rab_id_rabs_id_fk" FOREIGN KEY ("rab_id") REFERENCES "public"."rabs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rab_subgroups" ADD CONSTRAINT "rab_subgroups_group_id_rab_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."rab_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "company_bank_accounts_number_unique" ON "company_bank_accounts" USING btree ("bank_name","account_number");--> statement-breakpoint
CREATE INDEX "project_documents_project_id_idx" ON "project_documents" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "rab_payment_terms_rab_id_idx" ON "rab_payment_terms" USING btree ("rab_id");--> statement-breakpoint
CREATE INDEX "rab_payment_terms_stage_id_idx" ON "rab_payment_terms" USING btree ("stage_id");--> statement-breakpoint
CREATE INDEX "rab_stages_rab_id_idx" ON "rab_stages" USING btree ("rab_id");--> statement-breakpoint
CREATE INDEX "rab_subgroups_group_id_idx" ON "rab_subgroups" USING btree ("group_id");--> statement-breakpoint
ALTER TABLE "rab_items" ADD CONSTRAINT "rab_items_subgroup_id_rab_subgroups_id_fk" FOREIGN KEY ("subgroup_id") REFERENCES "public"."rab_subgroups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rabs" ADD CONSTRAINT "rabs_bank_account_id_company_bank_accounts_id_fk" FOREIGN KEY ("bank_account_id") REFERENCES "public"."company_bank_accounts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "rab_items_subgroup_id_idx" ON "rab_items" USING btree ("subgroup_id");--> statement-breakpoint
CREATE INDEX "rabs_bank_account_id_idx" ON "rabs" USING btree ("bank_account_id");