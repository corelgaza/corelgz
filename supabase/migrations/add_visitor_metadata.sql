-- Opsional: jalankan di Supabase SQL Editor jika ingin kolom terpisah
-- (tanpa ini pun sistem tetap jalan — ID disimpan di kolom name & message)

alter table public.contact_messages
  add column if not exists visitor_id text,
  add column if not exists ip_address text;
