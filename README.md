# Panji Prakorso — Portfolio

A single-page personal portfolio positioning **Panji Prakorso** as a marketing professional working
across **Brand, Digital, Performance and Growth**, plus three dedicated case-study pages.

Built with **React + Vite + React Router**, deployable to **Netlify** as-is.

---

## Getting started

```bash
npm install
npm run dev      # local dev server
npm run build    # production build -> dist/
npm run preview  # preview the production build
```

## Deploying to Netlify

`netlify.toml` is already configured:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | 20 |

An SPA redirect (`/* -> /index.html 200`) is set in both `netlify.toml` and `public/_redirects`, so
deep links such as `/projects/99-group` resolve correctly.

---

## Structure

```
src/
  data/            # all site content — edit here, not in components
    site.js        # name, contact, nav, hero stats
    projects.js    # the three projects + full case-study content
    capabilities.js
    milestones.js
    framework.js   # the "How I think" four-step model
    tools.js
  components/      # reusable UI
    Navbar, Hero, AboutSection, CapabilityCards, CareerTimeline,
    ImpactMetrics, ProjectCarousel, ProjectCard, MarketingFramework,
    ToolsSection, ContactSection, Footer, Reveal, ScrollManager, Icons
    visuals/ProjectVisual.jsx   # abstract per-project artwork
  pages/
    Home.jsx       # composes every homepage section
    CaseStudy.jsx  # ONE reusable template for all case studies
    NotFound.jsx
  styles/
    tokens.css     # colour, type, spacing and motion tokens
    global.css     # base + layout primitives (12 / 8 / 4 column grid)
    components.css # section styles
```

### Adding or editing a project

Everything about a project lives in `src/data/projects.js`. Add an object to the `projects` array
and both the homepage carousel and its case-study page at `/projects/<slug>` appear automatically.

```js
{
  slug: 'new-project',        // becomes /projects/new-project
  number: '04',
  title: 'New Project',
  displayTitle: 'NEW PROJECT',
  category: 'Brand / Digital',
  categoryShort: 'Brand / Digital',
  shortDescription: '...',    // card copy
  heroDescription: '...',     // case-study hero copy
  visual: 'dashboard',        // 'dashboard' | 'automotive' | 'devices'
  tags: ['...'],
  cardMetrics: [{ value: '+20%', label: 'Conversion' }],
  chapters: [                 // named sections, rendered in order
    { id: 'context', label: 'Context', title: '...', body: ['...'],
      bullets: ['...'], columns: [{ title: '...', items: ['...'] }] }
  ],
  impact: {
    label: 'Measured Impact',
    attribution: 'Company name',
    note: 'How and when these were measured.',
    items: [{ value: '4X', label: 'Growth' }],
    qualitative: ['...']      // use INSTEAD of items when no verified metric exists
  },
  learning: '...'
}
```

**Content rule enforced throughout:** metrics are only shown where they are real. Perkasa Motors
uses `impact.qualitative` rather than invented numbers, and the Axioo figures carry an explicit
attribution and a note stating they are historical, not current results.

---

## Replacing the placeholder assets

| Asset | Path | Notes |
| --- | --- | --- |
| Portrait | `public/assets/portrait.svg` | Stylised placeholder. Drop in a real photo and update `site.portrait` in `src/data/site.js` (e.g. `/assets/portrait.jpg`). A 4:5 portrait crop works best. |
| CV | `public/assets/panji-prakorso-cv.pdf` | Referenced by the **Download CV** button via `site.cvUrl`. Add the file to enable the download. |
| Project artwork | `src/components/visuals/ProjectVisual.jsx` | Abstract SVGs. Swap any variant for an `<img src="/assets/…" />` to use real screenshots. |
| Favicon | `public/assets/favicon.svg` | |

---

## Design system

**Colour** — deep navy backgrounds, white text, a single blue accent family.

| Token | Value | Use |
| --- | --- | --- |
| `--navy-950` | `#040C16` | page background |
| `--navy-900` | `#06111F` | deep navy sections |
| `--navy-800` | `#0B1A2E` | surfaces |
| `--blue-600` | `#2563EB` | primary — buttons, markers |
| `--blue-500` | `#3B82F6` | highlights, metrics |
| `--blue-400` | `#60A5FA` | labels, icons, hairlines |
| `--white` | `#F8FAFC` | text |
| `--grey-400` | `#94A3B8` | secondary text |

**Type** — Sora (display) and Plus Jakarta Sans (body), loaded from Google Fonts with system
fallbacks.

**Responsive** — 12-column grid on desktop, 8 on tablet, 4 on mobile. The hero stacks, the career
timeline flips from horizontal to vertical, the project carousel becomes a swipe rail showing one
full card plus a peek of the next, and navigation collapses to a hamburger.

**Motion** — smooth scrolling, section reveal on scroll, card hover lift, image zoom. No autoplay,
no parallax. Everything respects `prefers-reduced-motion`.
