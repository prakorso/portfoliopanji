# Portfolio CMS — setup

One-time setup to make `/admin` work. Takes about ten minutes.

---

## 1. Create the Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**.
2. Pick a name (e.g. `panji-portfolio`) and a region close to your visitors
   (`ap-southeast-1` / Singapore for Indonesia).
3. Save the database password somewhere safe — you will not need it for this site,
   but you will for direct database access.

## 2. Create the tables, policies and storage bucket

In the dashboard: **SQL Editor → New query**.

1. Paste the whole of [`supabase/migrations/0001_init.sql`](../supabase/migrations/0001_init.sql) and run it.
2. Paste the whole of [`supabase/seed.sql`](../supabase/seed.sql) and run it.
   This loads the content the site currently ships with. It is safe to re-run —
   it never overwrites anything you have edited in `/admin`.

## 3. Create your admin account

**Authentication → Users → Add user → Create new user.**
Use your email and a strong password, and tick *Auto Confirm User*.

Then grant that account write access — being signed in is deliberately **not** enough:

```sql
insert into public.admin_users (user_id, email)
select id, email from auth.users where email = 'panji.prakorso@gmail.com';
```

Verify it worked:

```sql
select * from public.admin_users;
```

> **Also turn off public sign-ups** (Authentication → Providers → Email → disable
> *Allow new users to sign up*). The allowlist already blocks strangers from
> editing, but there is no reason to let anyone create an account at all.

## 4. Get your API credentials

**Project Settings → API**:

| Field | Goes into |
| --- | --- |
| Project URL | `VITE_SUPABASE_URL` |
| `anon` / `public` key | `VITE_SUPABASE_ANON_KEY` |

Both are safe in the browser — the anon key can only do what the RLS policies allow
(read everything, write nothing).

Never put the `service_role` key in this project.

## 5. Local development

```bash
cp .env.example .env    # then paste your two values in
npm run supabase:verify # checks tables, RLS and the storage bucket
npm run dev             # site on / , admin on /admin
```

`supabase:verify` should print four ticks. If *"anonymous writes are blocked"* fails,
the migration did not apply correctly — re-run step 2.

## 6. Netlify

**Site configuration → Environment variables** → add the same two variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Then **Deploys → Trigger deploy → Clear cache and deploy site**. Vite inlines these
at build time, so a redeploy is required after adding or changing them.

---

## Using the admin

Open `/admin`, sign in, and edit. Screens:

| Screen | Edits |
| --- | --- |
| **Homepage** | Every homepage section in page order: hero, statistics, about, disciplines, featured projects, impact, tools, contact |
| **About** | Site name/tagline, the About section, the four marketing disciplines |
| **Experience** | Career milestones and the impact metrics band |
| **Projects** | All case studies — card fields, chapters, impact, featured state and order |
| **Skills** | Tools & technologies, and the "How I think" framework |
| **Contact** | Email, phone, location, LinkedIn, Instagram, CTA text |
| **Media** | Upload, replace, delete and copy paths for images and your CV PDF |

The same content appears on more than one screen where it belongs to more than one
section (contact, for example, is on both Homepage and Contact). There is one stored
copy, so editing it anywhere updates it everywhere.

**Save** writes to the database and the change is live immediately — Phase 1
deliberately has no separate draft/publish state. **Preview** opens the public site
in a new tab so you can check the result.

### Images

Upload in **Media**, or use *Choose image* on any image field. Stored images are
referenced by path (`uploads/photo.jpg`); the site turns that into a public URL.
Paths starting with `/` (like `/assets/portrait.svg`) still point at files bundled
with the site, so the original placeholder keeps working until you replace it.

To enable the **Download CV** button, upload the PDF in Media, copy its path, and
paste it into *About → CV download link*.

---

## How it holds together

```
Supabase                    React                          Admin
────────                    ─────                          ─────
site_content ──┐
               ├── ContentProvider ── useSection('hero') ── HeroFields
projects ──────┘        │                                       │
                        └─ falls back to src/content/defaults.js │
storage/media ─────────── mediaPublicUrl() ─────────────── MediaPicker
```

- The public site reads with plain `fetch` (two anonymous `GET`s) so visitors never
  download the Supabase SDK.
- If Supabase is unset, unreachable or empty, the site renders
  `src/content/defaults.js` instead. It cannot go blank because the CMS is down.
- The admin area is a lazily-loaded chunk; it is only fetched when someone opens `/admin`.

## Troubleshooting

| Symptom | Cause |
| --- | --- |
| Login says *"Invalid login credentials"* | Wrong password, or the user was never created in step 3 |
| Signed in, but Save fails with a permissions error | Your user id is not in `admin_users` — re-run the insert in step 3 |
| Site shows old content after saving | Netlify env vars missing, or the deploy predates them — redeploy |
| Uploads fail | The `media` bucket or its storage policies were not created — re-run the migration |
| Admin works locally but not on Netlify | Environment variables not set on the site, or no redeploy since adding them |
