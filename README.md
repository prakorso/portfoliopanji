# Panji Prakorso — Portfolio

A single-page personal portfolio positioning **Panji Prakorso** as a marketing professional working
across **Brand, Digital, Performance and Growth**, plus three dedicated case-study pages.

Built with **React + Vite + React Router**, deployable to **Netlify** as-is, with content edited
through a small built-in CMS at `/admin` backed by **Supabase**.

> **Editing the site:** open `/admin` and sign in. See [docs/CMS-SETUP.md](docs/CMS-SETUP.md) for
> the one-time Supabase setup. Until that is done the site renders its built-in default content,
> so it always works.

---

## Getting started

```bash
npm install
cp .env.example .env     # optional: Supabase credentials for /admin
npm run dev              # site on / , admin on /admin
npm run build            # production build -> dist/
npm run preview          # preview the production build
npm run supabase:verify  # check the Supabase project is wired up correctly
npm run seed:generate    # rebuild supabase/seed.sql from src/content/defaults.js
```

## Deploying to Netlify

`netlify.toml` is already configured:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | 20 |

Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under **Site configuration → Environment
variables** to enable `/admin`. Vite inlines them at build time, so redeploy after changing them.

An SPA redirect (`/* -> /index.html 200`) is set in both `netlify.toml` and `public/_redirects`, so
deep links such as `/projects/99-group` resolve correctly.

---

## Structure

```
src/
  data/            # DEFAULT content — the fallback and the seed source, not the live copy.
    site.js        # name, contact, nav, hero stats
    projects.js    # the three projects + full case-study content
    capabilities.js
    milestones.js
    framework.js   # the "How I think" four-step model
    tools.js
  content/
    defaults.js         # assembles src/data into the section shape stored in the DB
    ContentProvider.jsx # loads content from Supabase, falls back to defaults
  lib/
    supabase.js         # config + anonymous REST reads (no SDK — keeps the public bundle small)
    supabaseClient.js   # full SDK client, imported only by the admin area
  admin/           # the /admin CMS (lazily loaded, never in the public bundle)
    AdminApp.jsx AuthProvider.jsx RequireAuth.jsx AdminLayout.jsx Login.jsx
    useEditor.js useMedia.js admin.css
    sections/SectionFields.jsx    # the field groups for every content section
    components/                   # Fields, Repeater, ImageField, MediaPicker, SaveBar, EditorPage
    pages/                        # Homepage, About, Experience, Projects, Skills, Contact, Media
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

Day to day, do this in **/admin → Projects** — add, edit, reorder, feature or delete, no code.

`src/data/projects.js` holds the *default* project content: what a fresh database is seeded with
and what renders if Supabase is unavailable. Its shape is the same as the `data` column of the
`projects` table:

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

After editing `src/data/*`, run `npm run seed:generate` to refresh `supabase/seed.sql`.

**Content rule enforced throughout:** metrics are only shown where they are real. Perkasa Motors
uses `impact.qualitative` rather than invented numbers, and the Axioo figures carry an explicit
attribution and a note stating they are historical, not current results. The admin keeps both
options — metrics *and* qualitative points — so this stays possible when you edit.

---

## Replacing the placeholder assets

| Asset | Path | Notes |
| --- | --- | --- |
| Portrait | `public/assets/portrait.svg` | Stylised placeholder. Replace it in **/admin → Homepage → Hero → Hero image** (upload a 4:5 crop), no code needed. |
| CV | — | Upload the PDF in **/admin → Media**, then paste its path into **About → CV download link**. |
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
