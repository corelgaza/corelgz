import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type ContactRow = {
  id: string;
  name: string | null;
  message: string;
  created_at: string;
};

async function getMessages(): Promise<ContactRow[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("contact_messages")
    .select("id, name, message, created_at")
    .order("created_at", { ascending: false });
  return data ?? [];
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export default async function AdminMessagesPage() {
  const messages = await getMessages();

  return (
    <div>
      <div className="admin-toolbar">
        <p className="admin-muted">
          {messages.length} pesan total dari pengunjung
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <p style={{ fontSize: "2rem" }}>💬</p>
            <p>Belum ada pesan dari pengunjung.</p>
            <p className="admin-muted">
              Pesan dari form di section #kontak akan muncul di sini.
            </p>
          </div>
        </div>
      ) : (
        <div className="admin-list">
          {messages.map((m) => (
            <div key={m.id} className="admin-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 12,
                  flexWrap: "wrap",
                  marginBottom: "0.5rem",
                }}
              >
                <strong>{m.name ?? "Pengunjung Anonim"}</strong>
                <span
                  className="admin-muted"
                  style={{ fontSize: "0.8rem" }}
                >
                  {formatDate(m.created_at)}
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.6,
                }}
              >
                {m.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
