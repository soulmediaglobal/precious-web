-- Fail closed unless the complete pre-0016 Termin boundary still matches the
-- post-0015 fingerprint verified before this migration was generated.
DO $$
DECLARE
	legacy_count bigint;
	legacy_digest text;
BEGIN
	SELECT count(*), md5(coalesce(string_agg(row_data, E'\n' ORDER BY row_data), ''))
	INTO legacy_count, legacy_digest
	FROM (
		SELECT (to_jsonb(term_row) - 'percentage')::text AS row_data
		FROM public.rab_payment_terms AS term_row
	) AS fingerprint_rows;

	IF legacy_count <> 5 OR legacy_digest <> 'a751988de0c6c6b87fab4c7bae53b01b' THEN
		RAISE EXCEPTION 'rab_payment_terms legacy boundary changed; aborting compatibility migration';
	END IF;

	IF EXISTS (
		SELECT 1 FROM public.rab_payment_terms WHERE percentage IS DISTINCT FROM 0
	) THEN
		RAISE EXCEPTION 'rab_payment_terms contains post-0015 percentage data; aborting compatibility migration';
	END IF;
END $$;--> statement-breakpoint
ALTER TABLE "rab_payment_terms" ALTER COLUMN "percentage" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "rab_payment_terms" ALTER COLUMN "percentage" DROP NOT NULL;--> statement-breakpoint
UPDATE "rab_payment_terms" SET "percentage" = NULL WHERE "percentage" = 0;
