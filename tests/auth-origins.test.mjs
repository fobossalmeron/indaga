import test from 'node:test'
import assert from 'node:assert/strict'
import { getAuthTrustedOrigins } from '../src/lib/auth-origins.ts'

test('loopback preview accepts both aliases on exactly the configured port', () => {
  for (const base of ['http://127.0.0.1:3026', 'http://localhost:3026']) {
    const origins = getAuthTrustedOrigins(base)
    assert.ok(origins.includes('http://localhost:3026'))
    assert.ok(origins.includes('http://127.0.0.1:3026'))
    assert.ok(!origins.includes('http://localhost:3000'))
    assert.ok(!origins.includes('http://127.0.0.1:3027'))
    assert.ok(!origins.includes('https://localhost:3026'))
    assert.ok(!origins.some(origin => origin.includes('*')))
  }
})

test('production configuration does not grant access to loopback origins', () => {
  assert.deepEqual(getAuthTrustedOrigins('https://indaga.site'), ['https://indaga.site', 'https://www.indaga.site'])
})

test('trusted origin strips URL paths and keeps local protocol intact', () => {
  const origins = getAuthTrustedOrigins('https://localhost:3026/api/auth')
  assert.ok(origins.includes('https://localhost:3026'))
  assert.ok(origins.includes('https://127.0.0.1:3026'))
  assert.ok(!origins.includes('http://localhost:3026'))
})

test('a hostname resembling localhost does not enable loopback aliases', () => {
  const origins = getAuthTrustedOrigins('https://localhost.example.com:3026')
  assert.ok(!origins.includes('https://localhost:3026'))
  assert.ok(!origins.includes('https://127.0.0.1:3026'))
})
