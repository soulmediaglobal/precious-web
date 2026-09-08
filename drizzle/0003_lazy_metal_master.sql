CREATE TABLE "clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_name" text NOT NULL,
	"company_type" text,
	"address" text,
	"director_name" text,
	"phone" text,
	"email" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_work_types" (
	"project_id" integer NOT NULL,
	"work_type_id" integer NOT NULL,
	CONSTRAINT "project_work_types_project_id_work_type_id_pk" PRIMARY KEY("project_id","work_type_id")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_number" text NOT NULL,
	"client_id" integer NOT NULL,
	"project_name" text NOT NULL,
	"transaction_title" text,
	"location" text,
	"acquisition_type" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"description" text,
	"pic_user_id" uuid,
	"created_by_user_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "projects_project_number_unique" UNIQUE("project_number")
);
--> statement-breakpoint
CREATE TABLE "work_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "work_types_name_unique" UNIQUE("name"),
	CONSTRAINT "work_types_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "project_work_types" ADD CONSTRAINT "project_work_types_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_work_types" ADD CONSTRAINT "project_work_types_work_type_id_work_types_id_fk" FOREIGN KEY ("work_type_id") REFERENCES "public"."work_types"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "clients_company_name_idx" ON "clients" USING btree ("company_name");--> statement-breakpoint
CREATE INDEX "project_work_types_work_type_id_idx" ON "project_work_types" USING btree ("work_type_id");--> statement-breakpoint
CREATE INDEX "projects_client_id_idx" ON "projects" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "projects_status_idx" ON "projects" USING btree ("status");--> statement-breakpoint
INSERT INTO "work_types" ("name", "slug", "sort_order") VALUES
	('Struktur', 'struktur', 0),
	('Sipil', 'sipil', 1),
	('Arsitektur', 'arsitektur', 2),
	('Interior', 'interior', 3),
	('MEP', 'mep', 4)
ON CONFLICT ("slug") DO NOTHING;
