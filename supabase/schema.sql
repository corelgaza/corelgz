-- Jalankan di Supabase SQL Editor (Dashboard → SQL)

-- Pesan dari form kontak
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

drop policy if exists "Anyone can insert contact messages" on public.contact_messages;
drop policy if exists "Authenticated can read contact messages" on public.contact_messages;

-- Siapa pun boleh kirim pesan (insert) lewat anon key
create policy "Anyone can insert contact messages"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);

-- Hanya authenticated/admin yang boleh baca (sesuaikan nanti)
create policy "Authenticated can read contact messages"
  on public.contact_messages
  for select
  to authenticated
  using (true);

-- Galeri (opsional, untuk CMS nanti)
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  src text not null,
  alt text not null default '',
  caption text not null default '',
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.gallery_items enable row level security;

drop policy if exists "Public read published gallery" on public.gallery_items;

create policy "Public read published gallery"
  on public.gallery_items
  for select
  to anon, authenticated
  using (is_published = true);

create unique index if not exists gallery_items_src_key on public.gallery_items (src);

-- Seed galeri default (path dari folder public/images)
insert into public.gallery_items (src, alt, caption, sort_order) values
  ('/images/pondok1.webp', 'Serunya ngaji bareng temen-temen', 'Serunya ngaji bareng temen-temen 📖✨', 1),
  ('/images/pondok2.jpeg', 'Penampakan asrama', 'Penampakan asrama gue nih, hehe 🏠😎', 2),
  ('/images/pondok5.webp', 'Penampakan asrama lain', 'Penampakan asrama lain 🏰✨', 3),
  ('/images/pondok4.jpeg', 'Ngaji bareng di aula', 'Vibes santriwati ngaji bareng di aula', 4),
  ('/images/gedung.jpg', 'Halaman asrama yang luas', 'Vibes halaman asrama pas lagi sepi, adem banget 🕌✨', 5),
  ('/images/logo.png', 'Logo Pondok Pesantren Sukahideng', 'Logo kebanggaan kita! 💚💛', 6)
on conflict (src) do nothing;
