/**
 * Guards against the CMS pointing at a branch Netlify isn't building.
 *
 * Decap commits to the branch named in public/admin/config.yml. If that branch
 * is not the one Netlify deploys, saving either fails outright ("Branch not
 * found") or succeeds silently while the live site never changes. Both are
 * confusing after the fact, so catch it at build time instead.
 *
 * Netlify sets BRANCH and CONTEXT on every build. Only production builds are
 * checked — deploy previews legitimately build other branches.
 */
import { readFileSync } from 'node:fs'

const config = readFileSync(new URL('../public/admin/config.yml', import.meta.url), 'utf8')
const configured = config.match(/^\s*branch:\s*(\S+)/m)?.[1]

if (!configured) {
  console.error('✗ No `branch:` found in public/admin/config.yml')
  process.exit(1)
}

const { BRANCH, CONTEXT } = process.env

if (!BRANCH) {
  console.log(`• CMS branch: ${configured} (local build — not checked against Netlify)`)
} else if (CONTEXT !== 'production') {
  console.log(`• CMS branch: ${configured}; building ${BRANCH} in ${CONTEXT} context — skipped`)
} else if (BRANCH !== configured) {
  console.error(
    `\n✗ CMS branch mismatch.\n` +
      `  Netlify is deploying:            ${BRANCH}\n` +
      `  public/admin/config.yml commits: ${configured}\n\n` +
      `  Saving in /admin would not update this site.\n` +
      `  Fix by either setting "branch: ${BRANCH}" in public/admin/config.yml,\n` +
      `  or pointing Netlify's production branch at "${configured}"\n` +
      `  (Site configuration -> Build & deploy -> Branches and deploy contexts).\n`
  )
  process.exit(1)
} else {
  console.log(`✓ CMS branch matches the deployed branch: ${configured}`)
}
