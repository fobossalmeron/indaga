// Exercise actual magic-link verification without sending mail. All fixture data is removed.
import { loadEnvFile } from 'node:process';
import { randomUUID } from 'node:crypto';
import assert from 'node:assert/strict';
import pg from 'pg';
loadEnvFile('.env.local');
const base = process.argv[2] || 'http://127.0.0.1:3026';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname), 'Only a local app may be tested');
const url = new URL(process.env.VERCELDB__POSTGRES_PRISMA_URL);
for (const key of ['sslmode', 'sslcert', 'sslkey', 'sslrootcert']) url.searchParams.delete(key);
const db = new pg.Client({ connectionString: url.toString(), ssl: { rejectUnauthorized: false }, options: '-c search_path=public', connectionTimeoutMillis: 10000 });
const emails = [];
const verificationIds = [];
await db.connect();
try {
  for (const scenario of ['unverified', 'new', 'verified']) {
    const email = `magic-link-${randomUUID()}@example.invalid`;
    emails.push(email);
    if (scenario !== 'new') {
      await db.query('INSERT INTO public.users(id,email,full_name,email_verified,role) VALUES($1,$2,$3,$4,$5)', [randomUUID(), email, 'Temporary login test', scenario === 'verified', 'user']);
    }
    const token = randomUUID();
    const verificationId = randomUUID();
    verificationIds.push(verificationId);
    await db.query('INSERT INTO public.verification(id,identifier,value,"expiresAt") VALUES($1,$2,$3,NOW()+INTERVAL \'5 minutes\')', [verificationId, token, JSON.stringify({ email, name: 'Temporary login test' })]);
    const verify = new URL('/api/auth/magic-link/verify', base);
    verify.searchParams.set('token', token);
    verify.searchParams.set('callbackURL', '/treasures');
    const result = await fetch(verify, { redirect: 'manual' });
    assert.ok([302,303,307].includes(result.status), `${scenario}: expected redirect, received ${result.status}`);
    const destination = new URL(result.headers.get('location'), base);
    assert.equal(destination.pathname, '/treasures');
    assert.equal(destination.search, '', `${scenario}: unexpected verification error`);
    const cookie = result.headers.getSetCookie().map(value => value.split(';')[0]).join('; ');
    assert.ok(cookie.includes('session_token='), `${scenario}: no session cookie`);
    const sessionResponse = await fetch(`${base}/api/auth/get-session`, { headers: { cookie } });
    assert.equal(sessionResponse.status, 200);
    const session = await sessionResponse.json();
    assert.equal(session.user.email, email);
    assert.equal(session.user.name, 'Temporary login test');
    const account = (await db.query('SELECT email_verified,role FROM public.users WHERE email=$1', [email])).rows[0];
    assert.equal(account.email_verified, true);
    assert.equal(account.role, 'user');
    const consumed = await db.query('SELECT count(*)::int AS count FROM public.verification WHERE id=$1', [verificationId]);
    assert.equal(consumed.rows[0].count, 0);
    // One replay keeps the suite below the plugin's five requests per minute.
    if (scenario === 'unverified') {
      const reuse = await fetch(verify, { redirect: 'manual' });
      assert.ok([302,303,307].includes(reuse.status));
      assert.ok(new URL(reuse.headers.get('location'), base).searchParams.has('error'), 'Consumed links must be rejected');
    }
    console.log(JSON.stringify({ scenario, verified: true, sessionCreated: true, tokenConsumed: true, ...(scenario === 'unverified' ? { replayRejected: true } : {}) }));
  }
} finally {
  if (emails.length) {
    await db.query('DELETE FROM public.session WHERE "userId" IN (SELECT id FROM public.users WHERE email=ANY($1::text[]))', [emails]);
    await db.query('DELETE FROM public.account WHERE "userId" IN (SELECT id FROM public.users WHERE email=ANY($1::text[]))', [emails]);
    await db.query('DELETE FROM public.users WHERE email=ANY($1::text[])', [emails]);
  }
  if (verificationIds.length) await db.query('DELETE FROM public.verification WHERE id=ANY($1::text[])', [verificationIds]);
  const remaining = await db.query('SELECT (SELECT count(*) FROM public.users WHERE email=ANY($1::text[])) + (SELECT count(*) FROM public.verification WHERE id=ANY($2::text[])) AS count', [emails, verificationIds]);
  await db.end();
  assert.equal(Number(remaining.rows[0].count), 0);
  console.log('Temporary accounts, sessions and verification records removed. No email sent.');
}
