-- Jalankan di Supabase SQL Editor (Dashboard → SQL)
-- Tabel artikel untuk fitur blog / admin dashboard

do $$ begin
  create type public.article_status as enum ('draft', 'published');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content text not null default '',
  cover_image text,
  tags text[] not null default '{}',
  status public.article_status not null default 'draft',
  author_name text not null default 'Corel',
  meta_title text,
  meta_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_status_idx on public.articles (status);
create index if not exists articles_published_at_idx on public.articles (published_at desc);

alter table public.articles enable row level security;

drop policy if exists "Public read published articles" on public.articles;
create policy "Public read published articles"
  on public.articles
  for select
  to anon, authenticated
  using (status = 'published');

-- Auto-update updated_at
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists articles_touch_updated_at on public.articles;
create trigger articles_touch_updated_at
  before update on public.articles
  for each row execute function public.touch_updated_at();
