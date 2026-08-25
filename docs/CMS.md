# Editing the site

Your portfolio content lives in plain YAML files in this repository, edited through
**Decap CMS** at `/admin`. There is no database. Saving in the CMS commits to GitHub,
Netlify sees the commit and rebuilds, and the site updates a minute or two later.

```
Edit at /admin  →  commit to GitHub  →  Netlify builds  →  site updated
```

---

## Branches

There is one branch, and saving publishes.

```
/admin  →  save  →  commit to main  →  Netlify builds  →  live site updated
```

| Branch | Role | Who writes to it |
| --- | --- | --- |
| `main` | Production — the live site | Decap CMS on every save, and you |

Nothing is copied between branches and nothing runs on a schedule. A save is a
commit to `main`; Netlify rebuilds from `main`; the site changes a minute or two
later. If you want to see a change before it goes live, use the CMS preview pane
next to the form — that is what it is for.

### Why the branch is named in two places

`public/admin/config.yml` names the branch, and `public/admin/index.html` names it
again and passes it to the CMS at start-up.

That is deliberate. Decap reads `config.yml` once when the page loads, so a browser
or CDN holding an old copy would keep saving to whatever branch that old copy named
— which is how a CMS edit once landed on the wrong branch. The value passed at
start-up wins over the file, `/admin/*` is served with `Cache-Control: no-cache` so
the file is always revalidated, and if the two ever disagree the CMS refuses to start
and says so rather than writing somewhere unexpected. The build checks them too.

Two settings need to agree:

| Where | Setting | Value |
| --- | --- | --- |
| Netlify | Site configuration → Build & deploy → Branches → Production branch | `main` |
| This repo | `public/admin/config.yml` → `backend.branch` | `main` |

The repository also still contains `claude/panji-portfolio-design-4u1hvb`, the branch
the site was originally built on, and `staging`, left over from an earlier workflow.
Neither is referenced by anything; both can be deleted once you have confirmed the
live site is fine.

GitHub's own default branch (Settings → General → Default branch) doesn't affect the
CMS, but setting it to `main` keeps things tidy.

---

## One-time setup

You only do this once. Until it is done, `/admin` will load but sign-in will fail.

### 1. Create a GitHub OAuth App

GitHub requires a server-side secret to issue a login token, so the site includes two
small functions (`netlify/functions/`) that perform the handshake. They need an OAuth App.

Go to **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**:

| Field | Value |
| --- | --- |
| Application name | `Panji Portfolio CMS` |
| Homepage URL | `https://YOUR-SITE.netlify.app` |
| Authorization callback URL | `https://YOUR-SITE.netlify.app/api/callback` |

Create it, then **Generate a new client secret**. Copy both the **Client ID** and the
**Client secret** — the secret is shown only once.

> Replace `YOUR-SITE.netlify.app` with your real Netlify domain (or your custom domain
> if you have one). The callback URL must match exactly, including `/api/callback`.

### 2. Add the credentials to Netlify

**Netlify → Site configuration → Environment variables → Add a variable:**

| Key | Value |
| --- | --- |
| `GITHUB_CLIENT_ID` | the Client ID from step 1 |
| `GITHUB_CLIENT_SECRET` | the Client secret from step 1 |

These stay on the server. They are never sent to the browser.

### 3. The branch must match Netlify

`public/admin/config.yml` starts with:

```yaml
backend:
  name: github
  repo: prakorso/portfoliopanji
  branch: main
```

**This branch has to be the same branch Netlify deploys**, and it has to exist on
GitHub. It is the single most common way this setup breaks:

- If the branch does not exist, saving fails with **"Branch not found"**, and image
  uploads fail too — an upload is just another commit.
- If the branch exists but Netlify deploys a different one, saving appears to work
  but the live site never changes.

Netlify's production branch is under **Site configuration → Build & deploy →
Branches and deploy contexts → Production branch**.

A build-time check (`scripts/check-cms-branch.mjs`) compares the two on every
production deploy and prints a loud warning in the deploy log if they disagree, so
a mismatch can't go unnoticed.

### 4. Deploy

Push to `main` (or hit **Trigger deploy** in Netlify). Then open
`https://YOUR-SITE.netlify.app/admin`, click **Login with GitHub**, and authorize the app.

Only GitHub accounts with **push access to this repository** can save anything. There are
no CMS passwords to manage — GitHub does the authentication.

---

## Using the CMS

Open `/admin` on your site. The sidebar has two sections:

**Pages**

| Screen | What it controls |
| --- | --- |
| **Homepage** | Hero (eyebrow, heading lines, description, both CTAs, hero image), statistics, the featured-projects heading and selection, and the impact metrics |
| **About** | Section text, About image, CV file, and the four marketing disciplines |
| **Experience** | The career timeline — year, position, company, description, achievements, order |
| **Skills** | Tools & technologies, and the "How I think" four-step framework |
| **Contact** | Email, phone, location, LinkedIn, Instagram, CTA text |
| **Site & footer** | Your name and tagline, used in the navigation and footer |

**Projects** — one entry per case study. Add, edit, reorder, delete.

### The live preview

Every editing screen shows the page beside the fields. It uses the real site
stylesheet, so what you see is what gets published, and it updates as you type —
no saving or waiting for a deploy.

- A small blue chip on each section names it, so it is obvious which fields
  control which part of the page.
- Sections a screen does not own — About and Contact inside the Homepage
  preview, for example — are shown from the last saved content and their chip
  says where to edit them.
- Pick a photo and it appears in the preview immediately, before it is saved.
- **Desktop / Mobile** at the bottom right of the preview switches the width so
  you can check how a change looks on a phone.

The preview is a picture of the finished page — it is not an editor. Layout is
controlled by the site's code; the CMS controls the words and pictures.

### Publishing

The **Publish** button in the top right saves. It commits to `main` and Netlify
rebuilds the live site a minute or two later. There is no separate promotion step —
publishing is the save.

### Choosing which projects appear on the homepage

Each project decides for itself. Open the project and set **Featured on Homepage**:

| Toggle | Result |
| --- | --- |
| ON | the project is in the homepage carousel |
| OFF | it is not — but its own `/projects/…` page still works |

There is no list on the Homepage page to keep in step, and nothing to update when you
rename a project or change its web address. **Position in the project list** sets the
running order (1 first); projects sharing a number fall back to alphabetical order.

The downloadable PDF shows the same set, so switching a project off removes it from both.

### Images

Upload in any image field, or through the **Media** button in the top bar. Files are
committed to the repository under `public/uploads/`:

| Folder | Used for |
| --- | --- |
| `uploads/profile/` | Hero portrait, About image |
| `uploads/projects/` | Project hero images and logos |
| `uploads/general/` | Everything else, including your CV PDF |

**To change your portrait:** Homepage → ① Hero → Hero photo → *Choose different image*
→ upload → Publish. A tall portrait crop (about 4 wide by 5 tall) fits best.

Use **JPG or PNG**. Photos straight from an iPhone are often `.heic`, which browsers
cannot display — the file will upload but the page will show a gap where the photo
should be. Export or convert to JPG first.

**To add your CV:** About → CV download file → upload the PDF → Publish. The *Download CV*
button on the site is hidden while this is empty, and appears once you upload one.

**Project images:** each project has an optional *Hero image*. Leave it empty and the site
uses the built-in abstract graphic (chosen under *Built-in graphic*). Upload one and it
replaces that graphic on both the project card and the case study page — and it is the
image that appears beside that project in the downloadable PDF.

### The Download menu item

**There is no portfolio PDF to upload or keep up to date.** *Download* in the top menu
builds one in the visitor's browser at the moment they click it, reading the same content
these collections hold — hero, about, experience, projects, how I think, tools and
contact. Publish a change here, wait for the Netlify build, and the next download carries
it. The file is always named `Panji-Prakorsowibowo-Portfolio.pdf`.

It is drawn as real text rather than a screenshot of the page, so the result is a
searchable A4 document of about 40 KB with working email, WhatsApp, LinkedIn and
case-study links — not a picture of the website. Its typography is the PDF's own; the
layout is per-section rather than a pixel copy of the site.

### Adding a project

**Projects → New Project.** Fill in at least the name, slug, number, category and the two
descriptions, then Publish. The slug becomes the address: `/projects/your-slug`.

Add the case study content under **Case study sections** — each section has a label
(Context, Challenge, Strategy, Execution…), a title, paragraphs, bullet points and
optional columns. **Measured impact** takes either metrics or qualitative points: use the
qualitative list where you have no verified number, rather than inventing one.

Related projects at the bottom of each case study are generated automatically.

Finally, add the new project to **Homepage → Featured projects** if you want it in the
carousel.

---

## Editing locally

```bash
npm install
npm run cms:proxy   # in one terminal — lets the CMS write to local files
npm run dev         # in another — site on :5173, admin on :5173/admin
```

With both running, `/admin` skips the GitHub login and edits the files on your machine
directly. Commit the changes yourself when you're happy.

---

## Troubleshooting

| Symptom | Cause |
| --- | --- |
| Login popup opens then closes, still signed out | Callback URL in the GitHub OAuth App doesn't exactly match `https://your-site/api/callback` |
| "GITHUB_CLIENT_ID is not set" | Environment variables missing in Netlify, or the site hasn't been redeployed since adding them |
| Saved, but the site looks unchanged | The Netlify build is still running — check **Deploys**. Builds take a minute or two |
| Saving fails with "Branch not found" | `branch:` in `public/admin/config.yml` names a branch that doesn't exist on GitHub |
| Saving works but the live site never changes | Netlify's production branch isn't the branch the CMS saves to — the deploy log warns about this and names both |
| The CMS shows "The content manager did not start" | `config.yml` and `index.html` name different branches. Hard-refresh first; if it persists, make the two match |
| The Netlify build fails on the branch check | `config.yml` and `index.html` disagree, or `config.yml` has no `branch:` at all. The error names both values |
| Image upload fails | Uploads are commits, so they fail for the same reasons as saving — check the two rows above |
| Login works but saving fails | That GitHub account lacks push access to the repository |
| A project vanished from the homepage | It was removed from **Homepage → Featured projects** (its own page still works) |

---

## How it fits together

```
content/*.yml            ← what Decap CMS edits, and what you read in the repo
      ↓
src/content/index.js     ← loads the YAML at build time
      ↓
src/components/*         ← existing components, unchanged
      ↓
the approved design
```

Content never goes back into the components. To change wording or images, edit at
`/admin` (or the YAML directly) — never the JSX.
