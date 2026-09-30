-- Issue #32
-- Harden RAB approval boundary against direct Supabase Data API mutation.
--
-- Application writes are server-side through the trusted backend DB connection.
-- anon/authenticated must not be able to mutate approval-sensitive tables directly.

REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER
ON TABLE
  public.rabs,
  public.rab_sections,
  public.rab_groups,
  public.rab_subgroups,
  public.rab_items,
  public.rab_stages,
  public.rab_payment_terms,
  public.rab_families,
  public.rab_family_counters,
  public.cms_users
FROM anon, authenticated;

-- Prevent future tables created by postgres from automatically inheriting
-- mutation privileges for Supabase API roles.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON TABLES
FROM anon, authenticated;
