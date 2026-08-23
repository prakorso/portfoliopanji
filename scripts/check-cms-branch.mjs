/**
 * Reports, at build time, where the CMS saves relative to what Netlify deploys.
 *
 * Decap commits to the branch named in public/admin/config.yml, and Netlify
 * publishes the live site from its production branch. In this setup those are
 * the same branch: saving in /admin is the publish step, there is no staging
 * branch and nothing to promote.
 *
 * The failure this catches is the two drifting apart — the CMS writing to a
 * branch Netlify does not deploy, so saving appears to work but the live site
 * never changes. Netlify sets BRANCH and CONTEXT on every build, which is
 * enough to see it.
 *
 * A mismatch is a Netlify setting, not broken code, so it warns loudly and lets
 * the build through. Only a config.yml with no branch at all — which Decap
 * cannot run against — fails the build.
 */
import { readFileSync } from 'node:fs'

const config = readFileSync(new URL('../public/admin/config.yml', import.meta.url), 'utf8')
const cmsBranch = config.match(/^\s*branch:\s*(\S+)/m)?.[1]

if (!cmsBranch) {
  console.error('✗ No `branch:` found in public/admin/config.yml')
  process.exit(1)
}

// The branch is named twice — config.yml, and again in index.html where it is
// passed to CMS.init so a cached config.yml cannot decide where saves go. The
// two must agree, or the CMS refuses to start in the browser.
const adminHtml = readFileSync(new URL('../public/admin/index.html', import.meta.url), 'utf8')
const pinnedBranch = adminHtml.match(/CMS_CONTENT_BRANCH\s*=\s*['"]([^'"]+)['"]/)?.[1]

if (pinnedBranch !== cmsBranch) {
  console.error(
    `\n✗ The CMS branch is named twice and the two disagree.\n` +
      `  public/admin/config.yml says "${cmsBranch}"\n` +
      `  public/admin/index.html says "${pinnedBranch ?? '(not found)'}"\n\n` +
      `  The CMS will refuse to start until they match.\n`
  )
  process.exit(1)
}

const { BRANCH, CONTEXT } = process.env

if (!BRANCH) {
  console.log(`• CMS commits to "${cmsBranch}" (local build — nothing to check against)`)
} else if (CONTEXT !== 'production') {
  console.log(`✓ Preview build of "${BRANCH}"; the CMS commits to "${cmsBranch}"`)
} else if (BRANCH === cmsBranch) {
  console.log(`✓ Production branch and CMS branch are both "${cmsBranch}" — saves publish live`)
} else {
  console.warn(
    `\n⚠ The CMS saves to a branch this site does not publish from.\n` +
      `  Netlify is deploying "${BRANCH}" as production, but public/admin/config.yml\n` +
      `  commits to "${cmsBranch}", so edits made in /admin will never reach the live\n` +
      `  site.\n\n` +
      `  Set the production branch to "${cmsBranch}" in Netlify (Site configuration ->\n` +
      `  Build & deploy -> Branches and deploy contexts), or change backend.branch in\n` +
      `  public/admin/config.yml to "${BRANCH}".\n`
  )
}
