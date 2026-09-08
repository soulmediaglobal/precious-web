ALTER TABLE "projects" ADD COLUMN "contract_value" numeric(18, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "payment_status" text DEFAULT 'unpaid' NOT NULL;