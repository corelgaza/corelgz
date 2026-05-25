import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { listArticlesAdmin } from "@/lib/articles";

export const dynamic = "force-dynamic";

type RecentMessage = {
  id: string;
  name: string | null;
  message: string;
  created_at: string;
};

async function getRecentMessages(): Promise<RecentMessage[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("contact_messages")
    .select("id, name, message, created_at")
    .order("created_at", { ascending: false })
    .limit(5);
  return data ?? [];
}

function formatDateShort(iso: string): string {
  try {
    return new Date(iso).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export default async function AdminDashboardPage() {
  const [articles, messages] = await Promise.all([
    listArticlesAdmin(),
    getRecentMessages(),
  ]);

  const published = articles.filter((a) => a.status === "published").length;
  const drafts = articles.length - published;
  const recentArticles = articles.slice(0, 5);

  return (
    <div>
      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-label">Total Artikel</div>
          <div className="admin-stat-value">{articles.length}</div>
          <div className="admin-stat-hint">Semua status</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Published</div>
          <div className="admin-stat-value">{published}</div>
          <div className="admin-stat-hint">Tampil ke pembaca publik</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Draft</div>
          <div className="admin-stat-value">{drafts}</div>
          <div className="admin-stat-hint">Masih disembunyikan</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Pesan Masuk</div>
          <div className="admin-stat-value">{messages.length}</div>
          <div className="admin-stat-hint">5 terbaru ditampilkan</div>
        </div>
      </div>

      <div className="admin-section-grid">
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Artikel Terbaru</h3>
            <Link href="/admin/articles" className="admin-link">
              Lihat semua
            </Link>
          </div>
          {recentArticles.length === 0 ? (
            <div className="admin-empty">
              <p>Belum ada artikel.</p>
              <Link
                href="/admin/articles/new"
                className="admin-btn admin-btn-primary admin-btn-sm"
              >
                + Bikin yang pertama
              </Link>
            </div>
          ) : (
            <div className="admin-list">
              {recentArticles.map((a) => (
                <div key={a.id} className="admin-list-item">
                  <div className="admin-list-item-time">
                    {formatDateShort(a.updated_at)} ·{" "}
                    <span
                      className={`admin-badge ${
                        a.status === "published"
                          ? "admin-badge-published"
                          : "admin-badge-draft"
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>
                  <Link
                    href={`/admin/articles/${a.id}/edit`}
                    className="admin-link"
                    style={{ fontSize: "0.95rem" }}
                  >
                    {a.title}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Pesan Terbaru</h3>
            <Link href="/admin/messages" className="admin-link">
              Lihat semua
            </Link>
          </div>
          {messages.length === 0 ? (
            <div className="admin-empty">
              <p>Belum ada pesan masuk dari pengunjung.</p>
            </div>
          ) : (
            <div className="admin-list">
              {messages.map((m) => (
                <div key={m.id} className="admin-list-item">
                  <div className="admin-list-item-time">
                    {formatDateShort(m.created_at)} ·{" "}
                    <strong>{m.name ?? "Anon"}</strong>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.9rem",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {m.message.length > 180
                      ? m.message.slice(0, 180) + "…"
                      : m.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
