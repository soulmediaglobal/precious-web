ALTER TABLE "team" ADD COLUMN "group" text DEFAULT 'staff' NOT NULL;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "linkedin" text;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;
--> statement-breakpoint
UPDATE "team" SET "group" = CASE
	WHEN "sort_order" = 0 THEN 'board'
	WHEN "sort_order" IN (1, 2) THEN 'management'
	ELSE 'staff'
END;
--> statement-breakpoint
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('team', 'team', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
	public = EXCLUDED.public,
	file_size_limit = EXCLUDED.file_size_limit,
	allowed_mime_types = EXCLUDED.allowed_mime_types;
--> statement-breakpoint
DO $$ BEGIN
	CREATE POLICY "Authenticated users can upload team images"
	ON storage.objects FOR INSERT TO authenticated
	WITH CHECK (bucket_id = 'team');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN
	CREATE POLICY "Authenticated users can update team images"
	ON storage.objects FOR UPDATE TO authenticated
	USING (bucket_id = 'team') WITH CHECK (bucket_id = 'team');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN
	CREATE POLICY "Authenticated users can delete team images"
	ON storage.objects FOR DELETE TO authenticated
	USING (bucket_id = 'team');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
