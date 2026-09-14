-- Nullable component prices preserve legacy combined prices until explicitly split in Builder.
ALTER TABLE "rab_items" ADD COLUMN "material_unit_price" numeric(18, 2);--> statement-breakpoint
ALTER TABLE "rab_items" ADD COLUMN "jasa_unit_price" numeric(18, 2);
