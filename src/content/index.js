/**
 * Content loader.
 *
 * Reads the YAML files in /content — the same files Decap CMS edits at /admin —
 * and hands plain objects to the React components. Content is bundled at build
 * time, so a CMS commit triggers a Netlify build and the new content ships with it.
 *
 * Components must never hardcode copy; they read it from here.
 */

import general from '../../content/general.yml'
import homepage from '../../content/homepage.yml'
import about from '../../content/about.yml'
import experience from '../../content/experience.yml'
import skills from '../../content/skills.yml'
import contact from '../../content/contact.yml'

const projectModules = import.meta.glob('../../content/projects/*.yml', { eager: true })

/** Filename (minus extension) is the project's URL slug. */
const slugFromPath = (path) => path.split('/').pop().replace(/\.ya?ml$/, '')

const byOrder = (a, b) => (a.order ?? 999) - (b.order ?? 999)

export const projects = Object.entries(projectModules)
  .map(([path, module]) => {
    const data = module.default ?? module
    return { ...data, slug: data.slug || slugFromPath(path) }
  })
  .sort(byOrder)

export const site = {
  name: general.siteName,
  tagline: general.tagline,
  /** The curated portfolio PDF behind the header's Download link. Empty hides it. */
  portfolioUrl: general.portfolioUrl,
  portfolioLabel: general.portfolioLabel
}

export const hero = homepage.hero ?? {}
export const stats = homepage.stats ?? []
export const projectsSection = homepage.projectsSection ?? {}
export const impact = homepage.impact ?? {}
export const aboutSection = about
export const disciplines = about.disciplines ?? []
export const experienceSection = experience
export const milestones = [...(experience.milestones ?? [])].sort(byOrder)
export const tools = skills.tools ?? {}
export const framework = skills.framework ?? {}
export const frameworkSteps = framework.steps ?? []
export const contactSection = contact

/**
 * Homepage carousel: the projects listed in homepage.yml, in that order.
 * Falls back to every project so the carousel is never empty if the list is
 * cleared or a slug is renamed in the CMS.
 */
export const featuredProjects = (() => {
  const selected = (homepage.featuredProjects ?? [])
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter(Boolean)
  return selected.length ? selected : projects
})()

export const getProject = (slug) => projects.find((p) => p.slug === slug) ?? null

export const getRelatedProjects = (slug) => projects.filter((p) => p.slug !== slug)
