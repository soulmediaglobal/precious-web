ALTER TABLE "rab_payment_terms" ALTER COLUMN "stage_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "rab_payment_terms" ADD COLUMN "percentage" numeric(7, 4) DEFAULT '0' NOT NULL;