// Integration check against a running local app. Creates one disposable user/session,
// sends no emails, records no visits, and deletes the fixture in finally.
import { loadEnvFile } from 'node:process';
import { randomUUID, createHmac } from 'node:crypto';
import assert from 'node:assert/strict';
import pg from 'pg';
loadEnvFile('.env.local');
const base = process.argv[2] || 'http://localhost:3026';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname), 'Only a local application may be tested');
const url = new URL(process.env.VERCELDB__POSTGRES_PRISMA_URL);
for (const key of ['sslmode','sslcert','sslkey','sslrootcert']) url.searchParams.delete(key);
const db = new pg.Client({ connectionString: url.toString(), ssl: { rejectUnauthorized: false } });
const user = randomUUID();
const token = randomUUID();
const signature = createHmac('sha256', process.env.BETTER_AUTH_SECRET).update(token).digest('base64');
const value = encodeURIComponent(`${token}.${signature}`);
const cookie = `better-auth.session_token=${value}; __Secure-better-auth.session_token=${value}`;
async function request(path, body, authenticated = true) {
  const response = await fetch(`${base}${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { ...(authenticated ? { cookie } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return { status: response.status, data: await response.json() };
}
await db.connect();
try {
  await db.query('INSERT INTO public.users (id,email,full_name,email_verified) VALUES ($1,$2,$3,true)', [user, `treasure-api-${user}@example.invalid`, 'Temporary API test']);
  await db.query('INSERT INTO public.session (id,"expiresAt",token,"userId") VALUES ($1,NOW()+INTERVAL \'10 minutes\',$2,$3)', [randomUUID(), token, user]);
  const unauthenticated = await request('/api/treasure-data?year=2026', null, false);
  assert.equal(unauthenticated.status, 401);
  const current = await request('/api/treasure-data?year=2026');
  assert.equal(current.status, 200);
  assert.equal(current.data.hunt.year, 2026);
  assert.equal(current.data.allTreasures.length, 49);
  assert.equal(current.data.scannedTreasures.length, 0);
  assert.deepEqual(current.data.availableHunts.map(hunt => hunt.year), [2026]);
  assert.ok(current.data.allTreasures.every(treasure => !treasure.treasure_code.startsWith('2026-')));
  assert.ok(current.data.allTreasures.every(treasure => !treasure.treasure_secret));
  const historic = await request('/api/treasure-data?year=2025');
  assert.equal(historic.status, 200);
  assert.equal(historic.data.hunt.year, 2025);
  assert.equal(historic.data.allTreasures.length, 21);
  assert.ok(historic.data.allTreasures.every(treasure => !treasure.treasure_secret));
  const missingYear = await request('/api/treasure-scan', { code: 'CAFE-LIMON' });
  assert.equal(missingYear.status, 400);
  assert.equal((await request('/api/treasure-data?year=2027')).status, 400);
  const historicalScan = await request('/api/treasure-scan', { code: 'CAFE-LIMON', year: 2025 });
  assert.equal(historicalScan.data.success, false);
  assert.match(historicalScan.data.message, /terminado/);
  assert.match(historicalScan.data.redirect, /year=2025/);
  // Exercise rejection only when inactive; never register a visit in an active campaign.
  const inactive2026Rejected = current.data.hunt.is_active === false;
  if (inactive2026Rejected) {
    const currentScan = await request('/api/treasure-scan', { code: 'CAFE-LIMON', year: 2026 });
    assert.equal(currentScan.data.success, false);
  }
  const progress = await request('/api/treasure-progress?year=2026');
  assert.equal(progress.data.totalTreasures, 49);
  assert.equal(progress.data.treasuresFound, 0);
  const scans = await db.query('SELECT count(*)::int AS count FROM public.treasure_hunt_2025_scans WHERE user_id=$1', [user]);
  assert.equal(scans.rows[0].count, 0);
  console.log(JSON.stringify({ authenticatedCatalog2026:49, historicCatalog2025:21, unauthorized401:true, missingYear400:true, unsupportedYear400:true, closed2025Rejected:true, inactive2026Rejected, active2026ScanSkipped: !inactive2026Rejected, visitsWritten:0 }));
} finally {
  await db.query('DELETE FROM public.session WHERE "userId"=$1', [user]);
  await db.query('DELETE FROM public.users WHERE id=$1', [user]);
  const remaining = await db.query('SELECT (SELECT count(*) FROM public.users WHERE id=$1) + (SELECT count(*) FROM public.session WHERE "userId"=$1) AS count', [user]);
  await db.end();
  assert.equal(Number(remaining.rows[0].count), 0, 'Temporary user and session must be removed');
  console.log('Temporary user/session cleanup verified.');
}
