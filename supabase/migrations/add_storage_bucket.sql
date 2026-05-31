-- Bucket untuk upload cover image artikel (public read)

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'article-covers',
  'article-covers',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public dapat membaca (mengingat bucket public sudah mengizinkan akses URL)
drop policy if exists "Public read article covers" on storage.objects;
create policy "Public read article covers"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'article-covers');

-- Service role bypasses RLS otomatis, jadi upload via API admin tidak perlu policy tambahan.
