import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import ts from 'typescript'

async function compiled(path, replacements = []) {
  let code = ts.transpileModule(await readFile(new URL(path, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText
  for (const [pattern, value] of replacements) code = code.replace(pattern, value)
  return `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
}
const accessUrl = await compiled('../src/lib/admin-access.ts', [
  ["import 'server-only';", ''],
  [/import .* from 'next\/headers';/, 'const headers = async () => new Headers();'],
  [/import .* from '.\/auth';/, 'const auth = {api:{getSession:async()=>globalThis.__adminSession}};'],
  [/import .* from '.\/supabase';/, 'const createServerSupabaseClient = () => { globalThis.__clientCreated++; return globalThis.__adminClient };'],
])
const replacements = [
  ["'./admin-access'", JSON.stringify(accessUrl)],
  ["'./treasure-hunt-config'", JSON.stringify(new URL('../src/lib/treasure-hunt-config.ts', import.meta.url).href)],
]
const stats = await import(await compiled('../src/lib/admin-stats-actions.ts', replacements))
const users = await import(await compiled('../src/lib/admin-user-actions.ts', replacements))
const access = await import(accessUrl)
const h25 = '11111111-1111-4111-8111-111111111111'
const h26 = '22222222-2222-4222-8222-222222222222'
const recent = new Date().toISOString()
const fixture = {
  users: [
    {id:'a',email_verified:true,created_at:recent},
    {id:'b',email_verified:false,created_at:recent},
    {id:'c',email_verified:true,created_at:'2025-01-01T00:00:00Z'},
  ],
  treasure_hunts: [
    {id:h25,is_active:true,start_date:'2025-01-01T00:00:00Z',end_date:'2025-12-01T00:00:00Z'},
    {id:h26,is_active:true,start_date:null,end_date:null},
  ],
  treasure_hunt_2025_scans: [
    {id:'1',hunt_id:h25,user_id:'a',scanned_at:recent},
    {id:'2',hunt_id:h25,user_id:'a',scanned_at:recent},
    {id:'3',hunt_id:h25,user_id:'b',scanned_at:recent},
  ],
  saved_events:[{id:'e1',user_id:'a'},{id:'e2',user_id:'c'}],
  saved_places:[{id:'p1',user_id:'b'}],
  treasure_hunt_2025_progress:[],
}
function setup(data = fixture) {
  process.env.ADMIN_EMAILS = ' Admin@Example.com '
  globalThis.__adminSession = { user:{email:'admin@example.com'} }
  globalThis.__clientCreated = 0
  const calls = []
  globalThis.__adminClient = {from(table) {
    const call = { table, filters:[], options:undefined, columns:'' }
    calls.push(call)
    let records = [...data[table]]
    let singleton = false
    let offset = 0, end = Infinity
    return {
      select(columns, options){call.columns=columns;call.options=options;return this},
      eq(k,v){call.filters.push([k,v]);records=records.filter(row=>row[k]===v);return this},
      in(k,values){assert.ok(values.length>0,'No empty IN query');call.filters.push([k,values]);records=records.filter(row=>values.includes(row[k]));return this},
      gte(k,v){records=records.filter(row=>row[k]>=v);return this},
      lt(k,v){records=records.filter(row=>row[k]<v);return this},
      order(){return this},range(from,to){offset=from;end=to;return this},
      maybeSingle(){singleton=true;return this},or(){return this},
      then(resolve,reject){
        const rows=records.slice(offset,end+1)
        return Promise.resolve({data: singleton ? rows[0] || null : rows, count:call.options?.count==='exact'?records.length:null,error:null}).then(resolve,reject)
      },
    }
  }}
  return calls
}

test('every server action rejects anonymous and non-admin before creating privileged client', async () => {
  setup()
  for (const session of [null,{user:{email:'member@example.com'}}]) {
    globalThis.__adminSession=session
    for (const invoke of [
      ()=>stats.getDashboardStats(),()=>stats.getUserActivityStats(),()=>stats.getTreasureScanStats(),()=>stats.getTreasureHuntStats(),
      ()=>users.getAllUsers(),()=>users.getUserSummary(),()=>users.getUserById('x'),()=>users.updateUser('x',{}),()=>users.deleteUser('x'),
    ]) await assert.rejects(invoke(), /Acceso no autorizado/)
  }
  assert.equal(globalThis.__clientCreated,0)
})

test('global dashboard counts everyone but only campaigns inside date window as active', async () => {
  setup()
  const result=await stats.getDashboardStats()
  assert.equal(result.totalUsers,3)
  assert.equal(result.verifiedUsers,2)
  assert.equal(result.totalScans,3)
  assert.equal(result.activeTreasureHunts,1)
  assert.equal(result.totalSavedEvents,2)
})

test('campaign dashboard deduplicates participants and scopes favorites and registrations to cohort', async () => {
  const calls=setup()
  const result=await stats.getDashboardStats(h25)
  assert.equal(result.totalUsers,2)
  assert.equal(result.verifiedUsers,1)
  assert.equal(result.totalScans,3)
  assert.equal(result.recentUsers,2)
  assert.equal(result.totalSavedEvents,1)
  assert.equal(result.totalSavedPlaces,1)
  assert.equal(result.activeTreasureHunts,0)
  assert.equal(result.verificationRate,50)
  assert.ok(calls.some(call=>call.table==='users' && call.filters.some(([key,value])=>key==='id' && JSON.stringify(value)==='["a","b"]')))
})

test('empty campaign returns real zeros without querying an empty cohort', async () => {
  const calls=setup()
  const result=await stats.getDashboardStats(h26)
  assert.equal(result.totalUsers,0)
  assert.equal(result.totalScans,0)
  assert.equal(result.totalSavedEvents,0)
  assert.equal(result.verificationRate,0)
  assert.equal(result.activeTreasureHunts,1)
  assert.ok(!calls.some(call=>call.table==='users'))
})

test('invalid or nonexistent campaign fails instead of showing global data', async () => {
  setup()
  await assert.rejects(stats.getDashboardStats('bad'),/Edición inválida/)
  await assert.rejects(stats.getDashboardStats('33333333-3333-4333-8333-333333333333'),/No se encontró/)
})

test('daily series has 30 calendar days with zeros and scoped unique registrations', async () => {
  setup()
  const activity=await stats.getUserActivityStats(30,h25)
  assert.equal(activity.length,30)
  assert.equal(activity.reduce((sum,row)=>sum+row.users,0),2)
  assert.equal(activity.filter(row=>row.users===0).length,29)
  assert.equal((await stats.getTreasureScanStats(30,h25)).reduce((sum,row)=>sum+row.scans,0),3)
  assert.equal((await stats.getTreasureScanStats(30,h26)).reduce((sum,row)=>sum+row.scans,0),0)
  await assert.rejects(stats.getUserActivityStats(0),/Periodo inválido/)
})

test('user list requests exact total and progress relationships across pages', async () => {
  const calls=setup()
  const result=await users.getAllUsers({page:2,limit:2})
  assert.equal(result.total,3)
  assert.equal(result.totalPages,2)
  assert.equal(result.users.length,1)
  assert.equal(calls[0].options.count,'exact')
  assert.match(calls[0].columns,/treasure_hunt_2025_progress/)
  assert.equal((await users.getUserSummary()).activeTreasureUsers,2)
})

test('database errors and missing counts surface instead of false zero', async () => {
  await assert.rejects(access.exactCount(Promise.resolve({count:null,error:{message:'DB unavailable'}})),/DB unavailable/)
  await assert.rejects(access.exactCount(Promise.resolve({count:null,error:null})),/conteo/)
})

test('participant pagination includes rows beyond PostgREST page size', async () => {
  const many=Array.from({length:510},(_,i)=>({id:String(i),hunt_id:h25,user_id:`u${i}`}))
  setup({...fixture,treasure_hunt_2025_scans:many})
  assert.equal((await access.participantIds(globalThis.__adminClient,h25)).length,510)
})
