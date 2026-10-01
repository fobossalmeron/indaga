import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import ts from 'typescript'
import { CURRENT_HUNT_YEAR, parseHuntYear, toStoredTreasureCode, toPublicTreasureCode, treasurePath, getHuntAvailability } from '../src/lib/treasure-hunt-config.ts'

// Load the actual server logic with a fake Supabase transport; never contact production.
const source = await readFile(new URL('../src/lib/treasure-hunt-2025.ts', import.meta.url), 'utf8')
const configUrl = new URL('../src/lib/treasure-hunt-config.ts', import.meta.url).href
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022 } }).outputText
  .replace("import { createServerSupabaseClient } from './supabase';", 'const createServerSupabaseClient = () => globalThis.__treasureTestClient;')
  .replace("'./treasure-hunt-config'", JSON.stringify(configUrl))
const { processTreasureScan, getTreasureByCode, getAvailableTreasureHunts } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)

function client(responses) {
  const calls = []
  globalThis.__treasureTestClient = {
    from(table) {
      const call = { table, filters: [], operation: 'select' }
      calls.push(call)
      const query = {
        select() { return this },
        eq(...filter) { call.filters.push(filter); return this },
        in(...filter) { call.filters.push(filter); return this },
        order() { return this },
        maybeSingle() { return this },
        insert(row) { call.operation = 'insert'; call.row = row; return this },
        then(resolve, reject) {
          const response = responses.shift()
          if (!response) return Promise.reject(new Error('Unexpected database query')).then(resolve, reject)
          return Promise.resolve(response).then(resolve, reject)
        },
      }
      return query
    },
  }
  return calls
}
const ok = data => ({ data, error: null })
const hunt = { id: 'hunt-2026', year: 2026, is_active: true, start_date: null, end_date: null, total_treasures: 49 }
const treasure = { id: 'treasure-2026', hunt_id: hunt.id, treasure_code: '2026-CAFE-LIMON' }

test('edition parsing rejects malformed and unsupported years', () => {
  assert.equal(CURRENT_HUNT_YEAR, 2026)
  assert.equal(parseHuntYear(null), 2026)
  assert.equal(parseHuntYear('2025'), 2025)
  assert.equal(parseHuntYear(undefined, null), null)
  assert.equal(parseHuntYear(null, null), null)
  for (const value of ['', '2026junk', 2027, {}, true]) assert.equal(parseHuntYear(value), null)
})

test('public QR codes retain route identity and storage separates years', () => {
  assert.equal(toStoredTreasureCode(2025, 'CAFE-LIMON'), 'CAFE-LIMON')
  assert.equal(toStoredTreasureCode(2026, 'CAFE-LIMON'), '2026-CAFE-LIMON')
  assert.equal(toPublicTreasureCode(2026, '2026-CAFE-LIMON'), 'CAFE-LIMON')
  assert.equal(treasurePath(2026, '2026-CAFE-LIMON'), '/2026/t/CAFE-LIMON')
  assert.throws(() => toStoredTreasureCode(2026, '2026-CAFE-LIMON'))
  assert.throws(() => toStoredTreasureCode(2026, '2025-CAFE-LIMON'))
})

test('Monterrey campaign dates have an inclusive start and exclusive end', () => {
  const timed = { ...hunt, start_date: '2026-10-01T06:00:00Z', end_date: '2026-12-02T06:00:00Z' }
  assert.equal(getHuntAvailability(timed, new Date('2026-10-01T05:59:59.999Z')), 'upcoming')
  assert.equal(getHuntAvailability(timed, new Date(timed.start_date)), 'open')
  assert.equal(getHuntAvailability(timed, new Date('2026-12-02T05:59:59.999Z')), 'open')
  assert.equal(getHuntAvailability(timed, new Date(timed.end_date)), 'ended')
  assert.equal(getHuntAvailability({ ...hunt, is_active: false }), 'inactive')
})

test('lookup scopes public codes to their campaign and returns public code', async () => {
  const calls = client([ok(hunt), ok(treasure)])
  assert.equal((await getTreasureByCode('CAFE-LIMON', 2026)).treasure_code, 'CAFE-LIMON')
  assert.deepEqual(calls[1].filters, [['hunt_id', 'hunt-2026'], ['treasure_code', '2026-CAFE-LIMON']])
})

test('malformed QR and closed campaigns never write visits', async () => {
  const calls = client([])
  assert.equal((await processTreasureScan('2025-CAFE-LIMON', 'user', 2026)).success, false)
  assert.equal(calls.length, 0)
  client([ok({ ...hunt, year: 2025, end_date: '2025-12-01T00:00:00Z' })])
  const result = await processTreasureScan('CAFE-LIMON', 'user', 2025)
  assert.equal(result.success, false)
  assert.match(result.message, /terminado/)
})

test('even a mismatched lookup result cannot write to another campaign', async () => {
  const calls = client([ok(hunt), ok(hunt), ok({ ...treasure, hunt_id: 'hunt-2025' })])
  assert.equal((await processTreasureScan('CAFE-LIMON', 'user', 2026)).success, false)
  assert.ok(calls.every(call => call.operation !== 'insert'))
})

test('successful scan reads trigger progress without application increments', async () => {
  const progress = { treasures_found: 2, hunt_id: hunt.id, user_id: 'user' }
  const calls = client([ok(hunt), ok(hunt), ok(treasure), ok(null), ok(progress)])
  const result = await processTreasureScan('CAFE-LIMON', 'user', 2026)
  assert.equal(result.success, true)
  assert.equal(result.alreadyScanned, false)
  assert.equal(result.progress.treasures_found, 2)
  assert.deepEqual(calls.filter(call => call.operation === 'insert').map(call => call.row), [
    { user_id: 'user', hunt_id: hunt.id, treasure_id: treasure.id },
  ])
  assert.ok(calls.filter(call => call.table.endsWith('_progress')).every(call => call.operation === 'select'))
})

test('duplicate concurrent scan is already found and returns database progress', async () => {
  client([ok(hunt), ok(hunt), ok(treasure), { error: { code: '23505' } }, ok({ treasures_found: 1 })])
  const result = await processTreasureScan('CAFE-LIMON', 'user', 2026)
  assert.equal(result.success, true)
  assert.equal(result.alreadyScanned, true)
  assert.equal(result.progress.treasures_found, 1)
})

test('edition selector includes the current edition and only participated history', async () => {
  const historic = { ...hunt, id: 'hunt-2025', year: 2025 }
  client([ok([hunt, historic]), ok([]), ok([])])
  assert.deepEqual((await getAvailableTreasureHunts('new-user')).map(hunt => hunt.year), [2026])
  client([ok([hunt, historic]), ok([{ hunt_id: historic.id }]), ok([])])
  assert.deepEqual((await getAvailableTreasureHunts('returning-user')).map(hunt => hunt.year), [2026, 2025])
})

const routeSource = await readFile(new URL('../src/app/api/treasure-scan/route.ts', import.meta.url), 'utf8')
const compiledRoute = ts.transpileModule(routeSource, { compilerOptions: { module: ts.ModuleKind.ES2022 } }).outputText
  .replace(/import .* from 'next\/server';/, 'const NextResponse = { json: (body, init = {}) => ({ body, status: init.status || 200 }) };')
  .replace(/import .* from '@\/lib\/auth-utils';/, 'const getCurrentUserId = async () => globalThis.__treasureTestUser;')
  .replace(/import .* from '@\/lib\/treasure-hunt-2025';/, 'const processTreasureScan = async (...args) => globalThis.__treasureTestScan(...args);')
  .replace("'@/lib/treasure-hunt-config'", JSON.stringify(configUrl))
const { POST } = await import(`data:text/javascript;base64,${Buffer.from(compiledRoute).toString('base64')}`)

test('scan endpoint rejects cached 2025 clients that omit year', async () => {
  globalThis.__treasureTestUser = 'user'
  globalThis.__treasureTestScan = () => assert.fail('must not write a scan')
  const response = await POST({ json: async () => ({ code: 'CAFE-LIMON' }) })
  assert.equal(response.status, 400)
  assert.equal(response.body.success, false)
})

test('scan endpoint refuses unauthenticated requests', async () => {
  globalThis.__treasureTestUser = null
  globalThis.__treasureTestScan = () => assert.fail('must not write a scan')
  assert.equal((await POST({ json: async () => ({ code: 'CAFE-LIMON', year: 2026 }) })).status, 401)
})

test('scan endpoint forwards explicit edition and carries failure reason to that edition', async () => {
  globalThis.__treasureTestUser = 'user'
  globalThis.__treasureTestScan = (code, user, year) => {
    assert.deepEqual([code, user, year], ['CAFE-LIMON', 'user', 2025])
    return { success: false, message: 'La búsqueda del tesoro ha terminado.' }
  }
  const response = await POST({ json: async () => ({ code: 'CAFE-LIMON', year: 2025 }) })
  const redirect = new URL(response.body.redirect, 'https://example.test')
  assert.equal(redirect.searchParams.get('year'), '2025')
  assert.equal(redirect.searchParams.get('message'), 'La búsqueda del tesoro ha terminado.')
  assert.equal(redirect.searchParams.get('scanned'), 'CAFE-LIMON')
})
