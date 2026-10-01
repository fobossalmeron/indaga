import { loadEnvFile } from 'node:process';
import { readFile, writeFile, mkdir, chmod } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const root = fileURLToPath(new URL('../', import.meta.url));
try { loadEnvFile(`${root}.env.local`); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const config = JSON.parse(await readFile(`${root}data/treasure-hunt-2026.json`, 'utf8'));
const apply = process.argv.includes('--apply');
const activate = process.argv.includes('--activate');
if (activate && !apply) throw new Error('--activate requires --apply.');
if (config.venues.length !== 49 || new Set(config.venues.map(v => v.code)).size !== 49) throw new Error('Expected 49 unique venues.');
for (const v of config.venues) {
  if (!/^[A-Z0-9]+(?:-[A-Z0-9]+)*$/.test(v.code)) throw new Error('Invalid public code.');
  for (const value of [v.maps_url, v.website]) if (value !== null && !value.startsWith('https://')) throw new Error('Use null placeholders or HTTPS links.');
}
const url = new URL(process.env.VERCELDB__POSTGRES_PRISMA_URL);
for (const key of ['sslmode', 'sslcert', 'sslkey', 'sslrootcert']) url.searchParams.delete(key);
const client = new pg.Client({connectionString:url.toString(), ssl:{rejectUnauthorized:false}});
const tables = ['treasure_hunts', 'treasure_hunt_2025_treasures', 'treasure_hunt_2025_scans', 'treasure_hunt_2025_progress'];
const digest = (data) => createHash('sha256').update(JSON.stringify(data)).digest('hex');
async function snapshot() {
  const data = {};
  for (const table of tables) data[table] = (await client.query(`SELECT * FROM public.${table} ORDER BY id`)).rows;
  return data;
}
function historical(data) {
  const ids = new Set(data.treasure_hunts.filter(h => h.year !== 2026).map(h => h.id));
  return Object.fromEntries(tables.map(t => [t, data[t].filter(r => t === 'treasure_hunts' ? r.year !== 2026 : ids.has(r.hunt_id))]));
}
try {
  await client.connect();
  await client.query('BEGIN');
  await client.query(`SELECT pg_advisory_xact_lock(hashtextextended('indaga-seed-2026', 0))`);
  const existing = (await client.query('SELECT * FROM public.treasure_hunts WHERE year = $1 OR name = $2', [config.year, config.name])).rows;
  if (existing.length > 1 || existing.some(h => h.year !== config.year)) throw new Error('Ambiguous 2026 campaign; no data changed.');
  const before = await snapshot();
  if (!apply) {
    console.log(JSON.stringify({mode:'dry-run', campaign:existing.length ? 'update' : 'create', venues:49, missingMaps:config.venues.filter(v=>!v.maps_url).length, missingWebsite:config.venues.filter(v=>!v.website).length, active:activate || existing[0]?.is_active || false}));
    await client.query('ROLLBACK');
  } else {
    const backupDir = `${root}.local-backups/indaga-backup-${new Date().toISOString().replaceAll(':','-')}`;
    await mkdir(backupDir, {mode:0o700, recursive:true});
    await chmod(`${root}.local-backups`,0o700);
    // Catalog definitions retain table columns/defaults, constraints, indexes, policies,
    // grants, triggers and complete public function definitions alongside affected rows.
    const schema = {};
    const queries = {
      columns:"SELECT * FROM information_schema.columns WHERE table_schema='public' AND table_name = ANY($1) ORDER BY table_name,ordinal_position",
      constraints:"SELECT conrelid::regclass::text AS table_name,conname,pg_get_constraintdef(oid) AS definition FROM pg_constraint WHERE conrelid IN (SELECT oid FROM pg_class WHERE relnamespace='public'::regnamespace AND relname=ANY($1))",
      indexes:"SELECT * FROM pg_indexes WHERE schemaname='public' AND tablename=ANY($1)",
      triggers:"SELECT tgrelid::regclass::text AS table_name,tgname,pg_get_triggerdef(oid) AS definition FROM pg_trigger WHERE NOT tgisinternal AND tgrelid IN (SELECT oid FROM pg_class WHERE relnamespace='public'::regnamespace AND relname=ANY($1))",
      policies:"SELECT * FROM pg_policies WHERE schemaname='public' AND tablename=ANY($1)",
      grants:"SELECT * FROM information_schema.role_table_grants WHERE table_schema='public' AND table_name=ANY($1)",
      functions:"SELECT p.proname,pg_get_functiondef(p.oid) AS definition FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.prokind='f' AND $1::text[] IS NOT NULL",
      tables:"SELECT relname,relrowsecurity,relforcerowsecurity,pg_get_userbyid(relowner) AS owner FROM pg_class WHERE relnamespace='public'::regnamespace AND relname=ANY($1)"
    };
    for (const [name, query] of Object.entries(queries)) schema[name] = (await client.query(query, [tables])).rows;
    await writeFile(`${backupDir}/affected-data-and-schema.json`, JSON.stringify({created_at:new Date().toISOString(),schema,data:before},null,2), {mode:0o600});
    await chmod(`${backupDir}/affected-data-and-schema.json`,0o600);
    await client.query(await readFile(`${root}supabase/migrations/006_treasure_hunt_progress_integrity.sql`, 'utf8'));
    const values = [config.name, config.description, config.start_date, config.end_date, config.venues.length];
    let huntId = existing[0]?.id;
    if (huntId) {
      await client.query('UPDATE public.treasure_hunts SET name=$1,description=$2,start_date=$3,end_date=$4,total_treasures=$5 WHERE id=$6', [...values,huntId]);
    } else {
      huntId = (await client.query('INSERT INTO public.treasure_hunts (name,description,start_date,end_date,total_treasures,year,is_active) VALUES ($1,$2,$3,$4,$5,2026,false) RETURNING id', values)).rows[0].id;
    }
    for (const v of config.venues) {
      const code = `2026-${v.code}`;
      const owner = (await client.query('SELECT hunt_id FROM public.treasure_hunt_2025_treasures WHERE treasure_code=$1', [code])).rows[0];
      if (owner && owner.hunt_id !== huntId) throw new Error('Code belongs to another campaign; transaction cancelled.');
      await client.query(`INSERT INTO public.treasure_hunt_2025_treasures
        (hunt_id,treasure_code,treasure_name,treasure_secret,treasure_category,treasure_website,treasure_location_maps_url)
        VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (treasure_code) DO UPDATE SET
        treasure_name=EXCLUDED.treasure_name,treasure_secret=EXCLUDED.treasure_secret,treasure_category=EXCLUDED.treasure_category,
        treasure_website=COALESCE(EXCLUDED.treasure_website,treasure_hunt_2025_treasures.treasure_website),
        treasure_location_maps_url=COALESCE(EXCLUDED.treasure_location_maps_url,treasure_hunt_2025_treasures.treasure_location_maps_url)`,
        [huntId,code,v.name,config.treasure_secret,v.category,v.website,v.maps_url]);
    }
    if (activate) await client.query('UPDATE public.treasure_hunts SET is_active=true WHERE id=$1',[huntId]);
    const after = await snapshot();
    if (digest(historical(before)) !== digest(historical(after))) throw new Error('Historical data changed; transaction cancelled.');
    const count = after.treasure_hunt_2025_treasures.filter(t=>t.hunt_id===huntId).length;
    if (count !== 49) throw new Error('Unexpected 2026 catalog size; transaction cancelled.');
    await client.query('COMMIT');
    console.log(JSON.stringify({mode:'applied',huntId,venues:count,active:after.treasure_hunts.find(h=>h.id===huntId).is_active,historyUnchanged:true,backupDir}));
  }
} catch (error) {
  await client.query('ROLLBACK').catch(()=>{});
  console.error('2026 seed failed:', error.code || error.message);
  process.exitCode=1;
} finally { await client.end(); }
