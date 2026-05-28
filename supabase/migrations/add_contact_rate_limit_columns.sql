-- Tambah metadata pengirim untuk anti-spam/rate limit

alter table public.contact_messages
  add column if not exists visitor_id text,
  add column if not exists ip_address text;

create index if not exists contact_messages_visitor_id_created_at_idx
  on public.contact_messages (visitor_id, created_at desc);

create index if not exists contact_messages_ip_address_created_at_idx
  on public.contact_messages (ip_address, created_at desc);

