// Tests only disposable tables in a uniquely named schema; never inserts public scans.
import { loadEnvFile } from 'node:process';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import assert from 'node:assert/strict';
import pg from 'pg';
try {loadEnvFile('.env.local');} catch(error) {if(error.code!=='ENOENT')throw error;}
const url = new URL(process.env.VERCELDB__POSTGRES_PRISMA_URL);
for (const k of ['sslmode','sslcert','sslkey','sslrootcert']) url.searchParams.delete(k);
const cfg = {connectionString:url.toString(),ssl:{rejectUnauthorized:false}};
const clients = [new pg.Client(cfg),new pg.Client(cfg),new pg.Client(cfg)];
const [c,a,b] = clients;
const schema = `indaga_test_${randomUUID().replaceAll('-','')}`;
const user = randomUUID();
try {
  await Promise.all(clients.map(c=>c.connect()));
  await c.query(`CREATE SCHEMA ${schema}`);
  for (const t of ['treasure_hunts','treasure_hunt_2025_treasures','treasure_hunt_2025_scans','treasure_hunt_2025_progress']) {
    await c.query(`CREATE TABLE ${schema}.${t} (LIKE public.${t} INCLUDING ALL)`);
  }
  const sql = (await readFile('supabase/migrations/006_treasure_hunt_progress_integrity.sql','utf8')).replaceAll('public.',`${schema}.`).replaceAll('search_path = public',`search_path = ${schema}, public`);
  await c.query(sql);
  await c.query(`CREATE TRIGGER trigger_update_treasure_hunt_progress AFTER INSERT ON ${schema}.treasure_hunt_2025_scans FOR EACH ROW EXECUTE FUNCTION ${schema}.update_treasure_hunt_progress()`);
  const h1 = (await c.query(`INSERT INTO ${schema}.treasure_hunts (name,year,total_treasures) VALUES ('TEST',2026,2) RETURNING id`)).rows[0].id;
  const h2 = (await c.query(`INSERT INTO ${schema}.treasure_hunts (name,year,total_treasures) VALUES ('OTHER',2025,1) RETURNING id`)).rows[0].id;
  const ts = (await c.query(`INSERT INTO ${schema}.treasure_hunt_2025_treasures (hunt_id,treasure_code,treasure_name) VALUES ($1,'A','A'),($1,'B','B') RETURNING id`,[h1])).rows;
  const insert = `INSERT INTO ${schema}.treasure_hunt_2025_scans (user_id,hunt_id,treasure_id) VALUES ($1,$2,$3)`;
  await a.query('BEGIN'); await b.query('BEGIN');
  await a.query(insert,[user,h1,ts[0].id]);
  let secondFinished = false;
  const second = b.query(insert,[user,h1,ts[1].id]).then(()=>{secondFinished=true;});
  await new Promise(resolve=>setTimeout(resolve,150));
  assert.equal(secondFinished,false,'Second insert must wait for the same participant/hunt');
  await a.query('COMMIT'); await second; await b.query('COMMIT');
  const progress = (await c.query(`SELECT * FROM ${schema}.treasure_hunt_2025_progress WHERE user_id=$1 AND hunt_id=$2`,[user,h1])).rows[0];
  assert.equal(progress.treasures_found,2); assert.equal(Number(progress.completion_percentage),100); assert.ok(progress.completed_at);
  await assert.rejects(c.query(insert,[user,h1,ts[0].id]), e=>e.code==='23505');
  await assert.rejects(c.query(insert,[user,h2,ts[0].id]), e=>e.code==='23514');
  const single = (await c.query(`INSERT INTO ${schema}.treasure_hunt_2025_treasures (hunt_id,treasure_code,treasure_name) VALUES ($1,'C','C') RETURNING id`,[h2])).rows[0].id;
  await c.query(insert,[user,h2,single]);
  const firstCompletion = (await c.query(`SELECT * FROM ${schema}.treasure_hunt_2025_progress WHERE user_id=$1 AND hunt_id=$2`,[user,h2])).rows[0];
  assert.equal(firstCompletion.treasures_found,1); assert.ok(firstCompletion.completed_at);
  console.log(JSON.stringify({concurrentScans:2,progress:2,percentage:100,duplicateRejected:true,crossCampaignRejected:true,firstScanCompletion:true,publicScansWritten:0}));
} finally {
  await Promise.all(clients.map(c=>c.query('ROLLBACK').catch(()=>{})));
  await c.query(`DROP SCHEMA IF EXISTS ${schema} CASCADE`);
  await Promise.all(clients.map(c=>c.end()));
}
