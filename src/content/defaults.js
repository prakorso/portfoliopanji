/**
 * Default site content.
 *
 * These are the values the portfolio shipped with. They serve three purposes:
 *   1. what the public site renders before/without Supabase (never a blank page),
 *   2. the fallback for any section row missing from the database,
 *   3. the source for supabase/seed.sql.
 *
 * Editing content is done in /admin — not here.
 */

import { site, heroStats } from '../data/site.js'
import { capabilities } from '../data/capabilities.js'
import { milestones } from '../data/milestones.js'
import { framework } from '../data/framework.js'
import { toolGroups } from '../data/tools.js'
import { projects as staticProjects } from '../data/projects.js'

export const SECTION_KEYS = [
  'general',
  'hero',
  'stats',
  'about',
  'disciplines',
  'projectsSection',
  'impact',
  'milestones',
  'framework',
  'tools',
  'contact'
]

export const defaultContent = {
  general: {
    name: site.name,
    tagline: site.tagline,
    role: site.role
  },

  hero: {
    eyebrow: 'Marketing Professional',
    headingLines: [
      { text: 'Marketing', accent: false },
      { text: 'Digital', accent: false },
      { text: 'Performance', accent: true },
      { text: 'Growth', accent: true }
    ],
    description: site.heroParagraph,
    primaryCtaLabel: 'View selected work',
    primaryCtaHref: '#projects',
    secondaryCtaLabel: 'Get in touch',
    secondaryCtaHref: '#contact',
    image: site.portrait,
    imageAlt: `${site.name}, marketing professional`,
    badge: 'Brand · Digital · Performance · Growth'
  },

  stats: {
    items: heroStats.map((s) => ({ value: s.value, label: s.label }))
  },

  about: {
    label: 'About me',
    heading: 'Marketing at the intersection of',
    headingAccent: 'Brand, Digital, Performance & Growth.',
    description:
      'Combining marketing strategy, digital execution, performance marketing and customer acquisition to build measurable growth.',
    note:
      'Eight years across consumer technology, marketplace and entrepreneurial businesses — the through-line is the same: understand the customer, build the funnel, and prove the impact with data.',
    image: '',
    cvLabel: 'Download CV',
    cvUrl: site.cvUrl
  },

  disciplines: {
    items: capabilities.map((c) => ({
      number: c.number,
      title: c.title,
      // Optional one-line summary. Empty by default so the approved card design
      // (icon, number, title, points) is unchanged unless it is filled in.
      description: '',
      icon: c.icon,
      items: [...c.items]
    }))
  },

  projectsSection: {
    label: 'Featured Projects',
    title: 'Selected Work',
    lead: 'Three businesses. Three different challenges. One marketing mindset.'
  },

  impact: {
    label: 'Selected Historical Impact',
    title: 'Impact That Matters',
    items: [
      { value: '4X', label: 'YoY Sales Growth' },
      { value: '+727%', label: 'Total Users' },
      { value: '-77%', label: 'CPC' },
      { value: '+276%', label: 'CTR' },
      { value: '13.24X', label: 'Website Engaged Sessions' }
    ],
    attribution: 'Axioo Indonesia',
    note:
      'Selected historical impact achieved at Axioo Indonesia. These describe past performance in that role and period, not current 2026 results.'
  },

  milestones: {
    label: 'Experience',
    title: 'Career Milestones',
    lead:
      'Eight years of compounding scope — from commercial foundation to manager-level marketing across brand, digital, performance and growth.',
    items: milestones.map((m) => ({ ...m }))
  },

  framework: {
    label: 'How I think',
    title: 'A four-step way of working,',
    titleAccent: 'applied to every brief.',
    lead:
      'Strategy before channel, execution before opinion, data before the next budget. The same loop runs whether the goal is brand, acquisition or efficiency.',
    items: framework.map((f) => ({ ...f, items: [...f.items] }))
  },

  tools: {
    label: 'Tools & Technologies',
    title: 'What I work with',
    groups: toolGroups.map((g) => ({ group: g.group, tools: [...g.tools] }))
  },

  contact: {
    label: 'Contact',
    title: "Let's build",
    titleAccent: "what's next.",
    lead: 'Open to Marketing, Digital, Performance and Growth opportunities.',
    ctaLabel: 'Get in touch',
    email: site.email,
    phone: '',
    location: site.location,
    linkedinLabel: site.linkedin.label,
    linkedinUrl: site.linkedin.url,
    instagramLabel: site.instagram.label,
    instagramUrl: site.instagram.url
  }
}

/** Projects in the shape stored in the `projects` table. */
export const defaultProjects = staticProjects.map((project, index) => {
  const { slug, ...rest } = project
  return { slug, position: index, featured: true, data: rest }
})

/** Flatten a stored project row back into the shape components consume. */
export const flattenProject = (row) => ({ slug: row.slug, ...row.data })

export const defaultProjectList = defaultProjects.map(flattenProject)
