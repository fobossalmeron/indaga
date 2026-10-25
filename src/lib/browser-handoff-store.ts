import { createHash, randomBytes } from "node:crypto";
import type { Pool } from "pg";

export const HANDOFF_TTL_SECONDS = 24 * 60 * 60;
export const hashHandoffSecret = (value: string) => createHash("sha256").update(value).digest("hex");

export function handoffCookie(baseURL: string) {
  const secure = new URL(baseURL).protocol === "https:";
  return {
    name: secure ? "__Host-indaga.browser-handoff" : "indaga.browser-handoff",
    options: { httpOnly: true, secure, sameSite: "lax" as const, path: "/", maxAge: HANDOFF_TTL_SECONDS },
  };
}

export function browserHandoffStore(pool: Pool) {
  return {
    async start(email: string, previousSecret?: string | null) {
      const secret = randomBytes(32).toString("base64url");
      await pool.query("DELETE FROM browser_handoffs WHERE expires_at <= now() OR secret_hash = $1", [previousSecret ? hashHandoffSecret(previousSecret) : ""]);
      await pool.query("INSERT INTO browser_handoffs (secret_hash, email) VALUES ($1, $2)", [hashHandoffSecret(secret), email.trim().toLowerCase()]);
      return secret;
    },
    async bind(secret: string, email: string, token: string) {
      await pool.query(`UPDATE browser_handoffs SET magic_token_hash = $1
        WHERE secret_hash = $2 AND email = $3 AND expires_at > now() AND approved_user_id IS NULL`,
      [hashHandoffSecret(token), hashHandoffSecret(secret), email.trim().toLowerCase()]);
    },
    async approve(token: string, user: { id: string; email: string }, sessionId: string) {
      await pool.query(`UPDATE browser_handoffs SET approved_user_id = $1, approval_session_id = $2
        WHERE magic_token_hash = $3 AND email = $4 AND expires_at > now() AND approved_user_id IS NULL`,
      [user.id, sessionId, hashHandoffSecret(token), user.email.toLowerCase()]);
    },
    async consume(secret: string): Promise<string | null> {
      // Atomic consumption prevents two tabs from minting multiple sessions.
      // A revoked approving session, changed email or banned user cannot recover.
      const result = await pool.query(`DELETE FROM browser_handoffs h USING users u, session s
        WHERE h.secret_hash = $1 AND h.expires_at > now()
          AND u.id = h.approved_user_id AND lower(u.email) = h.email AND NOT coalesce(u.banned, false)
          AND s.id = h.approval_session_id AND s."userId" = u.id AND s."expiresAt" > now()
        RETURNING u.id`, [hashHandoffSecret(secret)]);
      return result.rows[0]?.id || null;
    },
    async cancel(secret: string) {
      await pool.query("DELETE FROM browser_handoffs WHERE secret_hash = $1", [hashHandoffSecret(secret)]);
    },
  };
}
