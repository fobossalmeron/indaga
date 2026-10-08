import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'
import ts from 'typescript'

const source = await readFile(new URL('../src/lib/supabase.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText

function loadClient(env) {
  const calls = []
  const context = {
    exports: {}, process: { env }, console: { warn() {} },
    require: () => ({ createClient: (...args) => { calls.push(args); return {} } }),
  }
  vm.runInNewContext(compiled, context)
  return { calls, server: context.exports.createServerSupabaseClient }
}

const current = {
  NEXT_PUBLIC_VERCELDB_SUPABASE_URL: 'https://current.example',
  NEXT_PUBLIC_VERCELDB_SUPABASE_ANON_KEY: 'current-anon',
  VERCELDB_SUPABASE_SERVICE_ROLE_KEY: 'current-service',
}
const legacy = {
  VERCELDB__NEXT_PUBLIC_SUPABASE_URL: 'https://legacy.example',
  VERCELDB__NEXT_PUBLIC_SUPABASE_ANON_KEY: 'legacy-anon',
  VERCELDB__SUPABASE_SERVICE_ROLE_KEY: 'legacy-service',
}

for (const [name, env, prefix] of [
  ['restored Vercel integration', current, 'current'],
  ['legacy local connection', legacy, 'legacy'],
  ['current settings take precedence', { ...legacy, ...current }, 'current'],
]) {
  test(name, () => {
    const { calls, server } = loadClient(env)
    server()
    assert.equal(calls[0][0], `https://${prefix}.example`)
    assert.equal(calls[0][1], `${prefix}-anon`)
    assert.equal(calls[1][0], `https://${prefix}.example`)
    assert.equal(calls[1][1], `${prefix}-service`)
  })
}

test('missing server credentials fail without using the anonymous key', () => {
  assert.throws(loadClient({}).server, /Supabase URL is not configured/)
  assert.throws(loadClient({ NEXT_PUBLIC_VERCELDB_SUPABASE_URL: current.NEXT_PUBLIC_VERCELDB_SUPABASE_URL }).server, /service role key is not configured/)
})

for (const path of ['../src/lib/auth.ts', '../src/app/api/auth/test-connection/route.ts']) {
  const text = await readFile(new URL(path, import.meta.url), 'utf8')
  const ast = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true)
  let initializer
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(ast) === 'databaseUrl') initializer = node.initializer.getText(ast)
    ts.forEachChild(node, visit)
  }
  visit(ast)
  test(`${path} accepts restored and legacy PostgreSQL connections`, () => {
    const resolve = env => vm.runInNewContext(initializer, { process: { env } })
    assert.equal(resolve({ VERCELDB_POSTGRES_PRISMA_URL: 'current' }), 'current')
    assert.equal(resolve({ VERCELDB__POSTGRES_PRISMA_URL: 'legacy' }), 'legacy')
    assert.equal(resolve({ VERCELDB_POSTGRES_PRISMA_URL: 'current', VERCELDB__POSTGRES_PRISMA_URL: 'legacy' }), 'current')
  })
}
