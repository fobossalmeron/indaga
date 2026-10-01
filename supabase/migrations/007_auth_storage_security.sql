-- Better Auth accesses public.users/session/account/verification through the
-- server PostgreSQL connection. Browser Supabase roles must not read auth tokens.
-- Keep the owner/service-role bypass intact; do not FORCE ROW LEVEL SECURITY.
BEGIN;

ALTER TABLE public.session ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification ENABLE ROW LEVEL SECURITY;

-- No anon/authenticated policies: Better Auth's server connection is the only
-- application path for these records. PUBLIC is included to remove inherited grants.
REVOKE ALL PRIVILEGES ON TABLE public.session, public.account, public.verification
    FROM PUBLIC, anon, authenticated;

-- Retain the legacy view and its rules, but remove public access and ensure any
-- future callers are subject to the permissions and RLS of the underlying table.
ALTER VIEW public."user" SET (security_invoker = true);
REVOKE ALL PRIVILEGES ON TABLE public."user" FROM PUBLIC, anon, authenticated;

-- is_admin() reads users without a schema qualifier; put the trusted schema
-- before pg_temp so a caller cannot substitute a temporary users table.
-- Preserve function bodies, signatures, owners and SECURITY DEFINER/INVOKER mode.
ALTER FUNCTION public.is_admin() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public, pg_temp;

COMMIT;
