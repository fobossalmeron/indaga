import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import ts from 'typescript'

const source = await readFile(new URL('../src/lib/admin-treasure-actions.ts', import.meta.url), 'utf8')
const configUrl = new URL('../src/lib/treasure-hunt-config.ts', import.meta.url).href
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022 } }).outputText
  .replace('import { headers } from "next/headers";', 'const headers = async () => new Headers();')
  .replace('import auth from "@/lib/auth";', 'const auth = { api: { getSession: async () => globalThis.__adminSession } };')
  .replace('import { createServerSupabaseClient } from "@/lib/supabase";', 'const createServerSupabaseClient = () => globalThis.__adminClient;')
  .replace('"@/lib/treasure-hunt-config"', JSON.stringify(configUrl))
const actions = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)

function client(responses) {
  const calls = []
  globalThis.__adminClient = {
    from(table) {
      const call = { table, filters: [] }
      calls.push(call)
      return {
        select() { return this },
        eq(...filter) { call.filters.push(filter); return this },
        single() { return this },
        order() { return this },
        update(value) { call.update = value; return this },
        insert(value) { call.insert = value; return this },
        then(resolve, reject) { return Promise.resolve(responses.shift()).then(resolve, reject) },
      }
    },
  }
  return calls
}

const callsByAction = [
  ['getAllTreasureHunts', []], ['getTreasureHuntById', ['hunt']],
  ['createTreasureHunt', [{ year: 2026 }]], ['updateTreasureHunt', ['hunt', { is_active: true }]],
  ['addTreasure', [{ hunt_id: 'hunt' }]], ['updateTreasure', ['treasure', {}]], ['deleteTreasure', ['treasure']],
]

test('every treasure admin action rejects anonymous and non-admin callers before any database access', async () => {
  for (const session of [null, { user: { email: 'participant@example.test' } }]) {
    globalThis.__adminSession = session
    const calls = client([])
    for (const [name, args] of callsByAction) await assert.rejects(actions[name](...args), /Acceso no autorizado/)
    assert.equal(calls.length, 0)
  }
})

test('editing links preserves hunt and printed QR identity, and blank links become null', async () => {
  process.env.ADMIN_EMAILS = 'test-admin@example.test'
  globalThis.__adminSession = { user: { email: 'test-admin@example.test' } }
  const calls = client([
    { data: { hunt_id: '2026-hunt', treasure_hunts: { year: 2026 } }, error: null },
    { data: { id: 'treasure' }, error: null },
  ])
  await actions.updateTreasure('treasure', { hunt_id: 'wrong-hunt', treasure_code: 'REPLACED', treasure_location_maps_url: '', treasure_website: 'https://example.test/place' })
  assert.equal(calls[1].update.treasure_location_maps_url, null)
  assert.equal(calls[1].update.treasure_website, 'https://example.test/place')
  assert.equal(calls[1].update.treasure_secret, 'ENCONTRADO')
  assert.equal(calls[1].update.hunt_id, undefined)
  assert.equal(calls[1].update.treasure_code, undefined)
  assert.deepEqual(calls[1].filters, [['id', 'treasure'], ['hunt_id', '2026-hunt']])
})

test('admin cannot edit history or save executable URLs', async () => {
  globalThis.__adminSession = { user: { email: 'test-admin@example.test' } }
  let calls = client([{ data: { hunt_id: '2025-hunt', treasure_hunts: { year: 2025 } }, error: null }])
  await assert.rejects(actions.updateTreasure('old', {}), /historial/)
  assert.equal(calls.length, 1)
  calls = client([{ data: { hunt_id: '2026-hunt', treasure_hunts: { year: 2026 } }, error: null }])
  await assert.rejects(actions.updateTreasure('new', { treasure_website: 'javascript:alert(1)' }), /https/)
  assert.equal(calls.some(call => call.update), false)
})
