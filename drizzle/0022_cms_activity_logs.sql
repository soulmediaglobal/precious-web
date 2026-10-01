CREATE TABLE "cms_activity_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"actor_user_id" uuid,
	"actor_name" text,
	"actor_role" text,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"outcome" text NOT NULL,
	"summary" text NOT NULL,
	"correlation_id" uuid NOT NULL,
	CONSTRAINT "cms_activity_logs_role_valid" CHECK ("cms_activity_logs"."actor_role" in ('admin', 'director', 'manager', 'staff')),
	CONSTRAINT "cms_activity_logs_outcome_valid" CHECK ("cms_activity_logs"."outcome" in ('success', 'failure', 'denied', 'pending', 'uncertain')),
	CONSTRAINT "cms_activity_logs_summary_length" CHECK (char_length("cms_activity_logs"."summary") between 1 and 240)
);
--> statement-breakpoint
ALTER TABLE "cms_activity_logs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "cms_activity_logs_occurred_at_idx" ON "cms_activity_logs" USING btree ("occurred_at","id");--> statement-breakpoint
CREATE INDEX "cms_activity_logs_actor_time_idx" ON "cms_activity_logs" USING btree ("actor_user_id","occurred_at");--> statement-breakpoint
CREATE INDEX "cms_activity_logs_action_time_idx" ON "cms_activity_logs" USING btree ("action","occurred_at");--> statement-breakpoint
CREATE INDEX "cms_activity_logs_correlation_idx" ON "cms_activity_logs" USING btree ("correlation_id");
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE public.cms_activity_logs
FROM PUBLIC, anon, authenticated;
--> statement-breakpoint
CREATE FUNCTION public.reject_cms_activity_log_mutation()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $audit_guard$
BEGIN
  RAISE EXCEPTION 'CMS activity logs are append-only'
    USING ERRCODE = '42501';
END;
$audit_guard$;
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON FUNCTION public.reject_cms_activity_log_mutation()
FROM PUBLIC, anon, authenticated;
--> statement-breakpoint
CREATE TRIGGER cms_activity_logs_no_update_delete
BEFORE UPDATE OR DELETE ON public.cms_activity_logs
FOR EACH STATEMENT
EXECUTE FUNCTION public.reject_cms_activity_log_mutation();
--> statement-breakpoint
CREATE TRIGGER cms_activity_logs_no_truncate
BEFORE TRUNCATE ON public.cms_activity_logs
FOR EACH STATEMENT
EXECUTE FUNCTION public.reject_cms_activity_log_mutation();
