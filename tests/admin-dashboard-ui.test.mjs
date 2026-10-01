import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ts from 'typescript'

const require = createRequire(import.meta.url)
const source = await readFile(new URL('../src/app/components/admin/stats-dashboard.tsx', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText
  .replaceAll('"react/jsx-runtime"', JSON.stringify(pathToFileURL(require.resolve('react/jsx-runtime')).href))
  .replaceAll('"react"', JSON.stringify(pathToFileURL(require.resolve('react')).href))
const { SimpleChart, default: StatsDashboard } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)

for (const [name, data] of [
  ['empty', []],
  ['one point', [{ date: '01/10', value: 3 }]],
  ['all zero', [{ date: '01/10', value: 0 }, { date: '02/10', value: 0 }]],
]) {
  test(`chart safely renders ${name} series`, () => {
    const html = renderToStaticMarkup(createElement(SimpleChart, { data, title: 'Activity' }))
    assert.doesNotMatch(html, /NaN|Infinity/)
    assert.match(html, /Activity/)
    if (!data.length) {
      assert.match(html, /Sin actividad/)
      assert.doesNotMatch(html, /<svg/)
    } else {
      assert.match(html, /viewBox="0 0 600 280"/)
      assert.doesNotMatch(html, /<svg[^>]* width="600"/)
      if (data.length === 1) assert.match(html, /cx="300"/)
    }
  })
}

test('edition statistics identify participants and saved content ownership', () => {
  const stats = { totalUsers: 0, verifiedUsers: 0, totalScans: 0, activeTreasureHunts: 1, totalSavedEvents: 0, totalSavedPlaces: 0, recentUsers: 0, verificationRate: 0 }
  const html = renderToStaticMarkup(createElement(StatsDashboard, { stats, userActivity: [], scanActivity: [], participantScope: true, scopeLabel: 'TREASURE HUNT 2026' }))
  assert.match(html, /Participantes únicos/)
  assert.match(html, /De participantes de esta edición/)
  assert.match(html, /cuentas creadas en los últimos 7 días/)
  assert.match(html, /TREASURE HUNT 2026/)
  assert.doesNotMatch(html, /NaN|Infinity/)
})
