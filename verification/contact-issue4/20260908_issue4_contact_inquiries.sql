-- Standalone Issue #4 migration. Apply this file only, inside a transaction.
-- Intentionally outside the dirty Drizzle journal; see README.md.
SET LOCAL search_path = public;
CREATE TABLE "contact_inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text,
	"email" text,
	"phone" text,
	"message" text NOT NULL,
	"consent_accepted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_followed_up" boolean DEFAULT false NOT NULL,
	"follow_up_method" text,
	"followed_up_at" timestamp with time zone
);

-- Server-only access: Supabase default grants must not expose the inbox.
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.contact_inquiries FROM anon, authenticated;
REVOKE ALL ON SEQUENCE public.contact_inquiries_id_seq FROM anon, authenticated;
