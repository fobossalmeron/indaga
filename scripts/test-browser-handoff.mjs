// Real Better Auth handlers + PostgreSQL, isolated from production users/mail.
import { registerHooks } from 'node:module';
import { loadEnvFile } from 'node:process';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import assert from 'node:assert/strict';
import pg from 'pg';
import { betterAuth } from 'better-auth';
import { magicLink, admin } from 'better-auth/plugins';
import { parseCookies } from 'better-auth/cookies';

registerHooks({ resolve(specifier, context, nextResolve) {
  return nextResolve(specifier === './browser-handoff-store' ? `${specifier}.ts` : specifier, context);
} });
const { browserHandoff } = await import('../src/lib/browser-handoff.ts');
const { browserHandoffStore, handoffCookie, hashHandoffSecret } = await import('../src/lib/browser-handoff-store.ts');
try { loadEnvFile('.env.local'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const url = new URL(process.env.VERCELDB_POSTGRES_PRISMA_URL || process.env.VERCELDB__POSTGRES_PRISMA_URL);
for (const key of ['sslmode', 'sslcert', 'sslkey', 'sslrootcert']) url.searchParams.delete(key);
const schema = `indaga_handoff_test_${randomUUID().replaceAll('-', '')}`;
const pool = new pg.Pool({ connectionString: url.toString(), ssl: { rejectUnauthorized: false }, options: `-c search_path=${schema}`, max: 4 });
const origin = 'http://localhost:3999';
const cookie = handoffCookie(origin);
const store = browserHandoffStore(pool);
const emails = [];
const checks = [];

class Browser {
  cookies = new Map();
  async request(path, body, requestOrigin = origin) {
    const response = await auth.handler(new Request(new URL(path, origin), {
      method: body ? 'POST' : 'GET',
      headers: { origin: requestOrigin, 'content-type': 'application/json', cookie: [...this.cookies].map(([key, value]) => `${key}=${value}`).join('; ') },
      ...(body ? { body: JSON.stringify(body) } : {}),
    }));
    for (const value of response.headers.getSetCookie()) {
      const [pair] = value.split(';');
      const separator = pair.indexOf('=');
      const name = pair.slice(0, separator);
      if (/max-age=0/i.test(value)) this.cookies.delete(name);
      else this.cookies.set(name, pair.slice(separator + 1));
    }
    return response;
  }
  async session() {
    const response = await this.request('/api/auth/get-session');
    assert.equal(response.status, 200);
    return response.json();
  }
}

const auth = betterAuth({
  baseURL: origin,
  secret: randomUUID() + randomUUID(),
  database: pool,
  rateLimit: { enabled: false },
  user: { modelName: 'users', fields: { name: 'full_name', emailVerified: 'email_verified', image: 'avatar_url', createdAt: 'created_at', updatedAt: 'updated_at' } },
  advanced: { database: { generateId: () => randomUUID() } },
  plugins: [browserHandoff(store, origin), admin(), magicLink({ expiresIn: 600, sendMagicLink: async ({ email, url, token }, request) => {
    const secret = parseCookies(request?.headers.get('cookie') || '').get(cookie.name);
    if (secret) await store.bind(secret, email, token);
    emails.push({ email, url, token });
  } })],
});

async function requestLogin(browser, email) {
  const response = await browser.request('/api/auth/browser-handoff/start', { email });
  assert.equal(response.status, 200, await response.clone().text());
  assert.match(response.headers.get('set-cookie'), /HttpOnly/i);
  assert.match(response.headers.get('set-cookie'), /Max-Age=86400/i);
  const sent = await browser.request('/api/auth/sign-in/magic-link', { email, callbackURL: '/2026/t/BAR-1900?confetti=seen' });
  assert.equal(sent.status, 200, await sent.clone().text());
  return emails.at(-1);
}

try {
  await pool.query(`CREATE SCHEMA ${schema}`);
  for (const table of ['users', 'session', 'account', 'verification']) {
    await pool.query(`CREATE TABLE ${schema}."${table}" (LIKE public."${table}" INCLUDING ALL)`);
  }
  const migration = (await readFile('supabase/migrations/009_browser_handoffs.sql', 'utf8')).replaceAll('public.', `${schema}.`);
  await pool.query(migration);

  const safari = new Browser();
  const chrome = new Browser();
  const mail = await requestLogin(safari, 'handoff@example.test');
  const pendingSecret = safari.cookies.get(cookie.name);
  const ttl = await pool.query('SELECT extract(epoch FROM expires_at - created_at)::int AS seconds FROM browser_handoffs WHERE secret_hash = $1', [hashHandoffSecret(pendingSecret)]);
  assert.equal(ttl.rows[0].seconds, 86400);
  assert.equal(await safari.session(), null, 'No session before email verification');
  assert.equal(await new Browser().session(), null, 'Another browser has no recovery capability');
  const verify = await chrome.request(mail.url);
  assert.equal(verify.status, 302);
  assert.match(verify.headers.get('location'), /BAR-1900\?confetti=seen/);
  const chromeSession = await chrome.session();
  assert.equal(chromeSession.user.email, mail.email);
  // Server-side checks cannot consume recovery without sending Set-Cookie.
  assert.equal(await auth.api.getSession({ headers: new Headers({ cookie: `${cookie.name}=${pendingSecret}` }) }), null);
  const recovered = await safari.session();
  assert.equal(recovered.user.id, chromeSession.user.id);
  assert.notEqual(recovered.session.token, chromeSession.session.token);
  assert.equal(safari.cookies.has(cookie.name), false);
  assert.equal((await safari.session()).user.id, chromeSession.user.id);
  assert.equal((await chrome.session()).user.id, chromeSession.user.id);
  checks.push('two browsers retain independent sessions; callback preserved; server checks do not consume');

  const replay = new Browser();
  replay.cookies.set(cookie.name, pendingSecret);
  assert.equal(await replay.session(), null, 'Consumed proof cannot mint another session');
  checks.push('single-use proof');

  const expired = new Browser();
  const expiredMail = await requestLogin(expired, mail.email);
  await new Browser().request(expiredMail.url);
  await pool.query('UPDATE browser_handoffs SET expires_at = now() WHERE secret_hash = $1', [hashHandoffSecret(expired.cookies.get(cookie.name))]);
  assert.equal(await expired.session(), null);
  checks.push('24-hour expiry rejects verified pending request');

  const wrong = new Browser();
  const wrongMail = await requestLogin(wrong, 'other@example.test');
  await store.approve(wrongMail.token, chromeSession.user, chromeSession.session.id);
  assert.equal(await wrong.session(), null, 'A different verified email cannot approve this attempt');
  checks.push('email binding');

  const revoked = new Browser();
  const revokedMail = await requestLogin(revoked, mail.email);
  const approver = new Browser();
  await approver.request(revokedMail.url);
  await approver.request('/api/auth/sign-out', {});
  assert.equal(await revoked.session(), null);
  checks.push('revoked approval session cannot recover');

  const signedOut = new Browser();
  const signedOutMail = await requestLogin(signedOut, mail.email);
  await new Browser().request(signedOutMail.url);
  await signedOut.request('/api/auth/sign-out', {});
  assert.equal(await signedOut.session(), null);
  checks.push('explicit sign-out cancels pending recovery');

  const same = new Browser();
  const sameMail = await requestLogin(same, mail.email);
  await same.request(sameMail.url);
  const sameSession = await same.session();
  assert.equal(sameSession.user.email, mail.email);
  assert.equal(same.cookies.has(cookie.name), false);
  checks.push('same-browser login stays normal');

  const pending = new Browser();
  const first = await requestLogin(pending, mail.email);
  const second = await requestLogin(pending, mail.email);
  await new Browser().request(first.url);
  assert.equal(await pending.session(), null, 'Older email cannot approve a replacement request');
  await new Browser().request(second.url);
  const [a, b] = await Promise.all([pending.session(), pending.session()]);
  assert.equal([a, b].filter(Boolean).length, 1, 'Concurrent recovery consumes once');
  checks.push('resend replaces old proof; concurrent claims consume once');

  const csrf = await new Browser().request('/api/auth/browser-handoff/start', { email: mail.email }, 'https://evil.example');
  assert.equal(csrf.status, 403);
  checks.push('cross-origin requests rejected');

  const banned = new Browser();
  const bannedMail = await requestLogin(banned, mail.email);
  await new Browser().request(bannedMail.url);
  await pool.query('UPDATE users SET banned = true WHERE email = $1', [mail.email]);
  assert.equal(await banned.session(), null);
  checks.push('banned accounts cannot recover');

  const secure = handoffCookie('https://www.indaga.site');
  assert.ok(secure.name.startsWith('__Host-') && secure.options.secure && secure.options.httpOnly);
  checks.push('production cookie is Secure, HttpOnly and host-bound');
  if (process.env.HANDOFF_UI === '1') {
    const { testHandoffUI } = await import('./test-browser-handoff-ui.mjs');
    await testHandoffUI(auth, emails, origin);
  }
  console.log(JSON.stringify({ passed: checks, productionUsersTouched: 0, emailsSent: 0 }, null, 2));
} finally {
  await pool.query('ROLLBACK');
  await pool.query(`DROP SCHEMA IF EXISTS ${schema} CASCADE`);
  await pool.end();
}
