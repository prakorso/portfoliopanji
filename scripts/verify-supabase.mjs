/**
 * Checks that a Supabase project is wired up correctly for this site.
 * Run after applying the migration:  npm run supabase:verify
 *
 * Reads VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY from the environment,
 * falling back to a local .env file.
 */
import { readFileSync, existsSync } from 'node:fs'

function loadEnv() {
  const env = { ...process.env }
  if (existsSync('.env')) {
    for (const line of readFileSync('.env', 'utf8').split('\n')) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (match && !env[match[1]]) env[match[1]] = match[2].replace(/^['"]|['"]$/g, '')
    }
  }
  return env
}

const env = loadEnv()
const url = env.VITE_SUPABASE_URL
const key = env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('✗ VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set (env or .env).')
  process.exit(1)
}

const headers = { apikey: key, Authorization: `Bearer ${key}` }
let failures = 0

const check = async (label, fn) => {
  try {
    const detail = await fn()
    console.log(`✓ ${label}${detail ? ` — ${detail}` : ''}`)
  } catch (err) {
    failures++
    console.error(`✗ ${label} — ${err.message}`)
  }
}

const select = async (path) => {
  const res = await fetch(`${url}/rest/v1/${path}`, { headers })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`)
  return res.json()
}

console.log(`Checking ${url}\n`)

await check('site_content readable anonymously', async () => {
  const rows = await select('site_content?select=key')
  return `${rows.length} section${rows.length === 1 ? '' : 's'}${rows.length ? '' : ' (run seed.sql)'}`
})

await check('projects readable anonymously', async () => {
  const rows = await select('projects?select=slug&order=position.asc')
  return rows.length ? rows.map((r) => r.slug).join(', ') : 'none yet (run seed.sql)'
})

await check('anonymous writes are blocked', async () => {
  const res = await fetch(`${url}/rest/v1/site_content`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: '__rls_probe__', data: {} })
  })
  if (res.ok) throw new Error('anonymous insert SUCCEEDED — RLS is not protecting your content')
  return `rejected with ${res.status}`
})

await check('media bucket is public', async () => {
  const res = await fetch(`${url}/storage/v1/object/public/media/`, { headers })
  // 400/404 means the bucket exists but the path is empty; 404 "Bucket not found" does not.
  const body = await res.text()
  if (/bucket not found/i.test(body)) throw new Error('bucket "media" does not exist')
  return 'present'
})

console.log(
  failures === 0
    ? '\nAll checks passed. Add the same two variables to Netlify and deploy.'
    : `\n${failures} check(s) failed — see supabase/migrations/0001_init.sql.`
)
process.exit(failures === 0 ? 0 : 1)
