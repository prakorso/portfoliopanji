/**
 * Copies the pinned Decap CMS bundle from node_modules into public/admin/.
 * Runs before every build, so /admin never depends on a CDN and the version is
 * locked by package.json. To upgrade: bump decap-cms in package.json.
 */
import { copyFileSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const source = require.resolve('decap-cms/dist/decap-cms.js')
const targetDir = new URL('../public/admin/', import.meta.url)

mkdirSync(targetDir, { recursive: true })
copyFileSync(source, new URL('decap-cms.js', targetDir))

const { version } = require('decap-cms/package.json')
console.log(`Copied Decap CMS ${version} -> public/admin/decap-cms.js`)
