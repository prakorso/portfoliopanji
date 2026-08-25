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

/** Fallback identity for a project file with no explicit slug. */
const slugFromPath = (path) => path.split('/').pop().replace(/\.ya?ml$/, '')

const byOrder = (a, b) => (a.order ?? 999) - (b.order ?? 999)

/**
 * Orders by the `order` field, then by title, then by slug.
 *
 * The tie-breaks matter: two projects can easily share an `order` (the CMS
 * defaults every new one to 1), and without them the running order would fall
 * back to whatever sequence the bundler happened to hand us. That is not
 * something the editor can see or control, and it can change between builds.
 */
const byOrderThenName = (a, b) =>
  byOrder(a, b) ||
  String(a.title ?? '').localeCompare(String(b.title ?? '')) ||
  String(a.slug ?? '').localeCompare(String(b.slug ?? ''))

export const projects = Object.entries(projectModules)
  .map(([path, module]) => {
    const data = module.default ?? module
    return { ...data, slug: data.slug || slugFromPath(path) }
  })
  .sort(byOrderThenName)

export const site = {
  name: general.siteName,
  tagline: general.tagline
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
 * Homepage carousel.
 *
 * Each project decides for itself, through its own "Featured on Homepage"
 * toggle. There is deliberately no second list of slugs kept next to the
 * homepage: such a list has to be edited in step with every rename, deletion
 * and addition, and when it drifts out of step a project simply vanishes from
 * the homepage with nothing to indicate why. Reading the flag off the project
 * means a rename cannot break the link, because there is no link to break.
 *
 * A project counts as featured unless it says otherwise, matching the CMS
 * field's own default, so an entry saved before the toggle existed still shows.
 */
const isFeatured = (project) => project.featured !== false && project.featured !== 'false'

export const featuredProjects = projects.filter(isFeatured)

export const getProject = (slug) => projects.find((p) => p.slug === slug) ?? null

export const getRelatedProjects = (slug) => projects.filter((p) => p.slug !== slug)
