# Panji Prakorso — Portfolio

A single-page personal portfolio positioning **Panji Prakorso** as a marketing professional working
across **Brand, Digital, Performance and Growth**, plus three dedicated case-study pages.

Built with **React + Vite + React Router**, deployed on **Netlify**, with content edited
through **Decap CMS** at `/admin` and stored as YAML files in this repository.

> **Editing the site:** open `/admin` and sign in with GitHub. See [docs/CMS.md](docs/CMS.md)
> for the one-time GitHub OAuth setup and a walkthrough of every screen.

---

## Getting started

```bash
npm install
npm run dev          # site on :5173, admin on :5173/admin
npm run build        # production build -> dist/
npm run preview      # preview the production build
npm run cms:proxy    # local CMS backend — edits write to local files
```

## Deploying to Netlify

`netlify.toml` is already configured:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | 20 |

Set `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` under **Site configuration → Environment
variables** so the CMS login works — see [docs/CMS.md](docs/CMS.md).

An SPA redirect (`/* -> /index.html 200`) is set in both `netlify.toml` and `public/_redirects`, so
deep links such as `/projects/99-group` resolve correctly.

---

## Structure

```
content/             # ALL editable content — this is what /admin writes to
  homepage.yml       # hero, statistics, featured selection, impact
  about.yml          # about section + the four marketing disciplines
  experience.yml     # career timeline
  skills.yml         # tools & technologies + the "How I think" framework
  contact.yml        # email, phone, location, social
  general.yml        # name and tagline
  projects/*.yml     # one file per case study, filename = URL slug

public/
  admin/             # Decap CMS — index.html + config.yml (the field definitions)
  uploads/           # CMS-uploaded images and files (profile / projects / general)

netlify/functions/   # GitHub OAuth handshake for the CMS login
  auth.mjs           # step 1: hand off to GitHub
  callback.mjs       # step 2: exchange the code for a token

src/
  content/
    index.js         # loads content/*.yml and hands plain objects to components
    navigation.js    # nav structure (code, not content — anchors must match section ids)
  components/        # reusable UI — Navbar, Hero, AboutSection, CapabilityCards,
                     # CareerTimeline, ImpactMetrics, ProjectCarousel, ProjectCard,
                     # MarketingFramework, ToolsSection, ContactSection, Footer
    visuals/ProjectVisual.jsx   # built-in abstract artwork, used when no image is uploaded
  pages/
    Home.jsx         # composes every homepage section
    CaseStudy.jsx    # ONE reusable template for all case studies
    NotFound.jsx
  styles/
    tokens.css       # colour, type, spacing and motion tokens
    global.css       # base + layout primitives (12 / 8 / 4 column grid)
    components.css   # section styles
```

### Adding or editing a project

Do this in **/admin → Projects** — add, edit, reorder, feature or delete, no code. Each
project is one file in `content/projects/`, named after its URL slug, and the case study
page is generated from it by `src/pages/CaseStudy.jsx`.

**Content rule enforced throughout:** metrics are only shown where they are real. Perkasa Motors
uses `impact.qualitative` rather than invented numbers, and the Axioo figures carry an explicit
attribution and a note stating they are historical, not current results. The admin keeps both
options — metrics *and* qualitative points — so this stays possible when you edit.

---

## Replacing the placeholder assets

| Asset | Path | Notes |
| --- | --- | --- |
| Portrait | `/admin` → Homepage → Hero → Hero image | A 4:5 crop works best. Falls back to the built-in `public/assets/portrait.svg` placeholder. |
| CV | `/admin` → About → CV download file | The *Download CV* button appears once a file is uploaded. |
| Project artwork | `/admin` → Projects → Hero image | Uploading one replaces the built-in abstract SVG on the card and case study. |
| Favicon | `public/assets/favicon.svg` | Edit in the repo. |

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
