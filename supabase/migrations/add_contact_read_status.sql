-- Tandai pesan kontak sudah dibaca di admin

alter table public.contact_messages
  add column if not exists is_read boolean not null default false;

create index if not exists contact_messages_is_read_idx
  on public.contact_messages (is_read, created_at desc);
