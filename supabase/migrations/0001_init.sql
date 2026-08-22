-- =============================================================
-- Portfolio CMS — Phase 1 schema
-- Run this once in the Supabase SQL editor (or via the CLI).
-- =============================================================

-- -------------------------------------------------------------
-- Tables
-- -------------------------------------------------------------

-- One row per editable section of the site (hero, about, contact, …).
create table if not exists public.site_content (
  key         text primary key,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users (id) on delete set null
);

-- One row per project / case study.
create table if not exists public.projects (
  slug        text primary key,
  position    integer not null default 0,
  featured    boolean not null default true,
  data        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists projects_position_idx on public.projects (position);

-- Allowlist: only these users may write. Being logged in is not enough.
create table if not exists public.admin_users (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  email       text,
  created_at  timestamptz not null default now()
);

-- -------------------------------------------------------------
-- Helpers
-- -------------------------------------------------------------

-- SECURITY DEFINER so the check itself is not subject to RLS on admin_users.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_content_touch on public.site_content;
create trigger site_content_touch
  before update on public.site_content
  for each row execute function public.touch_updated_at();

drop trigger if exists projects_touch on public.projects;
create trigger projects_touch
  before update on public.projects
  for each row execute function public.touch_updated_at();

-- -------------------------------------------------------------
-- Row level security
--   read  : anyone (the public portfolio is anonymous)
--   write : allowlisted admins only
-- -------------------------------------------------------------

alter table public.site_content enable row level security;
alter table public.projects     enable row level security;
alter table public.admin_users  enable row level security;

drop policy if exists site_content_public_read on public.site_content;
create policy site_content_public_read
  on public.site_content for select
  to anon, authenticated
  using (true);

drop policy if exists site_content_admin_write on public.site_content;
create policy site_content_admin_write
  on public.site_content for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists projects_public_read on public.projects;
create policy projects_public_read
  on public.projects for select
  to anon, authenticated
  using (true);

drop policy if exists projects_admin_write on public.projects;
create policy projects_admin_write
  on public.projects for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- A signed-in user may check whether they are an admin, nothing more.
drop policy if exists admin_users_self_read on public.admin_users;
create policy admin_users_self_read
  on public.admin_users for select
  to authenticated
  using (user_id = auth.uid());

-- -------------------------------------------------------------
-- Storage: the media bucket used by the admin media library
-- -------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists media_public_read on storage.objects;
create policy media_public_read
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

drop policy if exists media_admin_insert on storage.objects;
create policy media_admin_insert
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists media_admin_update on storage.objects;
create policy media_admin_update
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists media_admin_delete on storage.objects;
create policy media_admin_delete
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media' and public.is_admin());
