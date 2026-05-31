-- Statistik kunjungan halaman (page views)

create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  viewed_at timestamptz not null default now(),
  session_key text
);

create index if not exists page_views_viewed_at_idx
  on public.page_views (viewed_at desc);

create index if not exists page_views_path_idx
  on public.page_views (path);

alter table public.page_views enable row level security;

-- Hanya service role (API server) yang insert/select — tidak ada policy publik.
