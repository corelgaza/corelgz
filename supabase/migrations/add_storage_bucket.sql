-- Bucket untuk upload cover image artikel (public read)

insert into storage.buckets (id, name, public)
values ('article-covers', 'article-covers', true)
on conflict (id) do nothing;

-- Public dapat membaca (mengingat bucket public sudah mengizinkan akses URL)
drop policy if exists "Public read article covers" on storage.objects;
create policy "Public read article covers"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'article-covers');

-- Service role bypasses RLS otomatis, jadi upload via API admin tidak perlu policy tambahan.
