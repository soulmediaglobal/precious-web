CREATE TABLE "cms_users" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"role" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cms_users_role_valid" CHECK ("cms_users"."role" in ('staff', 'director'))
);
--> statement-breakpoint
ALTER TABLE "cms_users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "rabs" ADD COLUMN "internal_approval_requested_by_user_id" uuid;--> statement-breakpoint
ALTER TABLE "rabs" ADD COLUMN "internal_approval_requested_at" timestamp;