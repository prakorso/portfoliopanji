/**
 * Flattens the production build into one self-contained preview.html: CSS and
 * JS inlined, Latin font subsets embedded as data URIs, zero network requests.
 * Handy for sharing the prototype without hosting it.
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const DIST = path.join(ROOT, 'dist')
const A = path.join(DIST, 'assets')
const files = fs.readdirSync(A)
const cssFile = files.find((f) => f.endsWith('.css'))
const jsFile = files.find((f) => f.endsWith('.js'))

let css = fs.readFileSync(path.join(A, cssFile), 'utf8')
const js = fs.readFileSync(path.join(A, jsFile), 'utf8')

const KEEP = /-latin-(wght-normal|400-normal|500-normal)-[^.]+\.woff2$/
let kept = 0
css = css.replace(/@font-face\{[^}]*\}/g, (block) => {
  const urls = [...block.matchAll(/url\(([^)]+)\)/g)].map((m) => m[1])
  const woff2 = urls.find((u) => KEEP.test(u))
  if (!woff2) return ''
  const name = woff2.replace('/assets/', '')
  const b64 = fs.readFileSync(path.join(A, name)).toString('base64')
  kept++
  return block
    .replace(/src:[^;}]+/, `src:url(data:font/woff2;base64,${b64}) format('woff2')`)
})

const remaining = [...css.matchAll(/url\((\/assets\/[^)]+)\)/g)].map((m) => m[1])
if (remaining.length) throw new Error('unresolved asset refs: ' + remaining.join(', '))

const html = `<title>My Hyundai Cars</title>
<style>${css}</style>
<div id="root"></div>
<script type="module">${js.replace(/<\/script/gi, '<\\/script')}</script>
`
const out = path.join(ROOT, 'preview.html')
fs.writeFileSync(out, html)
console.log('font faces kept:', kept, '| size:', (html.length / 1024 / 1024).toFixed(2), 'MB')
