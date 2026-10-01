// Read-only verification of migration 007. Never downloads auth rows or tokens.
import { loadEnvFile } from 'node:process';
import assert from 'node:assert/strict';
import pg from 'pg';
import { createClient } from '@supabase/supabase-js';
loadEnvFile('.env.local');
const url = new URL(process.env.VERCELDB__POSTGRES_PRISMA_URL);
for (const key of ['sslmode', 'sslcert', 'sslkey', 'sslrootcert']) url.searchParams.delete(key);
const db = new pg.Client({ connectionString: url.toString(), ssl: { rejectUnauthorized: false }, options: '-c search_path=public', connectionTimeoutMillis: 10000 });
const tables = ['session', 'account', 'verification', 'user'];
await db.connect();
try {
  await db.query('BEGIN READ ONLY');
  const relations = (await db.query("SELECT relname,relrowsecurity,relforcerowsecurity,reloptions FROM pg_class WHERE relnamespace='public'::regnamespace AND relname=ANY($1::text[])", [tables])).rows;
  assert.equal(relations.length, 4);
  for (const relation of relations) {
    if (relation.relname === 'user') assert.ok(relation.reloptions?.includes('security_invoker=true'));
    else { assert.equal(relation.relrowsecurity, true); assert.equal(relation.relforcerowsecurity, false); }
  }
  for (const [roles, expected] of [[['anon', 'authenticated'], false], [['postgres', 'service_role'], true]]) {
    const permissions = (await db.query("SELECT role_name,table_name,privilege,has_table_privilege(role_name,format('public.%I',table_name),privilege) allowed FROM unnest($1::text[])role_name CROSS JOIN unnest($2::text[])table_name CROSS JOIN unnest($3::text[])privilege", [roles, tables, ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER']])).rows;
    assert.ok(permissions.every(permission => permission.allowed === expected), `Unexpected grants for ${roles.join(', ')}`);
  }
  const functions = (await db.query("SELECT proname,proconfig FROM pg_proc WHERE pronamespace='public'::regnamespace AND proname IN('is_admin','update_updated_at_column')")).rows;
  assert.equal(functions.length, 2);
  assert.ok(functions.every(fn => fn.proconfig?.includes('search_path=public, pg_temp')));
  await db.query('ROLLBACK');
  for (const [mode, key] of [['anonymous', process.env.VERCELDB__NEXT_PUBLIC_SUPABASE_ANON_KEY], ['server', process.env.VERCELDB__SUPABASE_SERVICE_ROLE_KEY]]) {
    const client = createClient(process.env.VERCELDB__NEXT_PUBLIC_SUPABASE_URL, key, { auth: { persistSession: false } });
    for (const table of tables) {
      const result = await client.from(table).select('id', { head: true, count: 'exact' });
      if (mode === 'anonymous') { assert.ok(result.error, `${table} must reject anonymous reads`); assert.ok([401, 403].includes(result.status), `${table}: expected access denial, received ${result.status}`); }
      else { assert.equal(result.error, null); assert.equal(result.status, 200); }
    }
  }
  console.log(JSON.stringify({ authTablesWithRLS: 3, invokerView: true, fixedFunctionSearchPaths: 2, publicAccessDenied: true, serverAccessPreserved: true, authRowsDownloaded: 0 }));
} finally {
  await db.query('ROLLBACK');
  await db.end();
}
