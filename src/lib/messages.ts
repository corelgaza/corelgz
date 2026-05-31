import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";

export type ContactMessageRow =
  Database["public"]["Tables"]["contact_messages"]["Row"];

export async function listContactMessages(): Promise<ContactMessageRow[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getUnreadMessageCount(): Promise<number> {
  const supabase = createAdminClient();
  if (!supabase) return 0;
  const { count } = await supabase
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("is_read", false);
  return count ?? 0;
}

export function buildAdminReplyTemplate(
  message: ContactMessageRow
): string {
  const name = message.name ?? "kak";
  const snippet =
    message.message.length > 120
      ? `${message.message.slice(0, 120)}…`
      : message.message;

  return [
    `Halo ${name}! 👋`,
    "",
    "Makasih ya udah kirim pesan lewat Santri Journey.",
    `Aku baca pesannya: "${snippet}"`,
    "",
    "Kalau masih ada yang mau ditanyain, balas aja di sini ya.",
    "",
    "— Corel · Santri Journey",
  ].join("\n");
}
