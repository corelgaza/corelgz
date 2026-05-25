const VISITOR_STORAGE_KEY = "santri-visitor-id";

/** ID unik per browser — dipakai untuk mengenali pengunjung tanpa form nama */
export function getVisitorId(): string {
  if (typeof window === "undefined") return "unknown";

  const existing = localStorage.getItem(VISITOR_STORAGE_KEY);
  if (existing) return existing;

  const id = `v-${crypto.randomUUID().slice(0, 8)}`;
  localStorage.setItem(VISITOR_STORAGE_KEY, id);
  return id;
}

export function getVisitorLabel(visitorId: string): string {
  return `Pengunjung ${visitorId}`;
}

export function formatContactForWhatsApp(
  visitorId: string,
  userMessage: string
): string {
  const waktu = new Date().toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    dateStyle: "medium",
    timeStyle: "short",
  });

  return [
    "*Pesan dari Santri Journey*",
    `ID pengunjung: ${visitorId}`,
    `Waktu: ${waktu}`,
    "",
    userMessage,
  ].join("\n");
}
