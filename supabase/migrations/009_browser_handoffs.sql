-- A pending browser proves possession with an HttpOnly cookie. Only hashes are
-- stored here; neither this table nor its approval grants access by itself.
BEGIN;
CREATE TABLE IF NOT EXISTS public.browser_handoffs (
    secret_hash TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    magic_token_hash TEXT UNIQUE,
    approved_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    approval_session_id TEXT REFERENCES public.session(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '24 hours'
);
CREATE INDEX IF NOT EXISTS browser_handoffs_expires_at ON public.browser_handoffs(expires_at);
ALTER TABLE public.browser_handoffs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.browser_handoffs FROM PUBLIC, anon, authenticated;
COMMIT;
