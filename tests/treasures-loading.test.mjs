import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ts from 'typescript'

const require = createRequire(import.meta.url)
const runtime = pathToFileURL(require.resolve('react/jsx-runtime')).href
const react = pathToFileURL(require.resolve('react')).href
async function compile(path, replacements = []) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8')
  let result = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText
    .replaceAll('"react/jsx-runtime"', JSON.stringify(runtime))
    .replaceAll('"react"', JSON.stringify(react))
  for (const [from, to] of replacements) result = result.replace(from, to)
  return `data:text/javascript;base64,${Buffer.from(result).toString('base64')}`
}
const authStub = 'const useAuth = () => globalThis.__treasuresLoadingSession;'
const skeletonUrl = await compile('../src/app/components/ui/skeleton.tsx', [[/import .* from "@\/utils\/cn";/, 'const cn = (...values) => values.filter(Boolean).join(" ");']])
const loadingUrl = await compile('../src/app/components/features/treasures-skeleton.tsx', [
  [/import Image from "next\/image";/, `import { createElement } from ${JSON.stringify(react)}; const Image = props => createElement('img', props);`],
  ['"@/app/components/ui/skeleton"', JSON.stringify(skeletonUrl)],
  [/import .* from "@\/hooks\/use-auth";/, authStub],
])
const { TreasuresPageSkeleton } = await import(loadingUrl)
const pageUrl = await compile('../src/app/(protected)/treasures/page.tsx', [
  [/import .* from "next\/navigation";/, 'const useRouter = () => ({ push() {} }); const useSearchParams = () => new URLSearchParams("year=2026");'],
  [/import ProgressTracker .*;/, 'const ProgressTracker = () => { throw new Error("Must not render stats before data arrives"); };'],
  [/import .* from "@\/hooks\/use-auth";/, authStub],
  ['"@/app/components/features/treasures-skeleton"', JSON.stringify(loadingUrl)],
  ['"@/lib/treasure-hunt-config"', JSON.stringify(new URL('../src/lib/treasure-hunt-config.ts', import.meta.url).href)],
  [/import .* from "@\/app\/components\/ui\/select";/, `import { createElement } from ${JSON.stringify(react)};
    const Select = ({ children, disabled }) => createElement('div', { 'data-disabled': disabled }, children);
    const SelectContent = ({ children }) => children;
    const SelectItem = SelectContent, SelectTrigger = SelectContent;
    const SelectValue = () => null;`],
])
const { default: TreasuresPage } = await import(pageUrl)

for (const [name, Component] of [['page while fetching treasures', TreasuresPage], ['route/session fallback', TreasuresPageSkeleton]]) {
  test(`${name} retains logo and signed-in user while showing accessible loading placeholders`, () => {
    globalThis.__treasuresLoadingSession = { data: { user: { id: 'user', email: 'explorador@example.test' } }, isPending: false }
    const html = renderToStaticMarkup(createElement(Component))
    assert.match(html, /festival_santa_lucia\.svg/)
    assert.match(html, /explorador@example.test/)
    assert.match(html, /aria-busy="true"/)
    assert.match(html, /role="status"/)
    assert.match(html, /data-slot="skeleton"/)
    assert.doesNotMatch(html, /animate-spin|Esta edición no está disponible|0%|0 de 40/)
  })
}

test('session pending retains the logo without inventing user data', () => {
  globalThis.__treasuresLoadingSession = { data: null, isPending: true }
  const html = renderToStaticMarkup(createElement(TreasuresPageSkeleton))
  assert.match(html, /festival_santa_lucia\.svg/)
  assert.match(html, /Cargando tus tesoros/)
  assert.doesNotMatch(html, /undefined|null|@example/)
})
