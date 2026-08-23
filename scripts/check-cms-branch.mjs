/**
 * Guards the staging → production workflow at build time.
 *
 * Decap commits to the branch named in public/admin/config.yml. That branch is
 * deliberately NOT the production branch: edits land on staging, get reviewed on
 * the staging deploy, and only reach production through a merge.
 *
 * Two things can silently break that:
 *   1. the CMS pointed at the production branch, so every edit publishes live —
 *      the exact problem this workflow exists to prevent;
 *   2. the CMS pointed at a branch Netlify does not build, so saving appears to
 *      work but nothing is ever deployed to review.
 *
 * Netlify sets BRANCH and CONTEXT on every build, which is enough to catch (1)
 * with certainty and to confirm the staging deploy is the CMS's own branch.
 */
import { readFileSync } from 'node:fs'

const config = readFileSync(new URL('../public/admin/config.yml', import.meta.url), 'utf8')
const cmsBranch = config.match(/^\s*branch:\s*(\S+)/m)?.[1]

if (!cmsBranch) {
  console.error('✗ No `branch:` found in public/admin/config.yml')
  process.exit(1)
}

const { BRANCH, CONTEXT } = process.env

if (!BRANCH) {
  console.log(`• CMS commits to "${cmsBranch}" (local build — nothing to check against)`)
} else if (CONTEXT === 'production' && BRANCH === cmsBranch) {
  console.error(
    `\n✗ The CMS is pointed at the production branch.\n` +
      `  Netlify is deploying "${BRANCH}" as production, and public/admin/config.yml\n` +
      `  commits to the same branch, so every save would publish straight to the\n` +
      `  live site.\n\n` +
      `  Set "branch: staging" in public/admin/config.yml, and give staging a\n` +
      `  branch deploy in Netlify (Site configuration -> Build & deploy ->\n` +
      `  Branches and deploy contexts).\n`
  )
  process.exit(1)
} else if (BRANCH === cmsBranch) {
  console.log(`✓ This is the CMS branch ("${cmsBranch}") — saves land on this deploy for review`)
} else {
  console.log(`✓ Deploying "${BRANCH}"; the CMS commits to "${cmsBranch}", not here`)
}
