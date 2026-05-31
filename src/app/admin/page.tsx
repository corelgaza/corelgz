import Link from "next/link";
import { getPageViewStats, getTopArticleViews } from "@/lib/analytics";
import { listArticlesAdmin } from "@/lib/articles";
import { listContactMessages } from "@/lib/messages";

export const dynamic = "force-dynamic";

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
  const [articles, messages, viewStats] = await Promise.all([
    listArticlesAdmin(),
    listContactMessages(),
    getPageViewStats(),
  ]);

  const topArticles = await getTopArticleViews(articles, 5);
  const recentMessages = messages.slice(0, 5);

  const published = articles.filter((a) => a.status === "published").length;
  const drafts = articles.length - published;
  const recentArticles = articles.slice(0, 5);
  const unreadMessages = messages.filter((m) => !m.is_read).length;
  const maxDaily =
    viewStats?.dailyLast7.reduce((m, d) => Math.max(m, d.views), 0) ?? 1;

  return (
    <div>
      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-label">Kunjungan Hari Ini</div>
          <div className="admin-stat-value">
            {viewStats?.today.toLocaleString("id-ID") ?? "—"}
          </div>
          <div className="admin-stat-hint">Page view publik</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">7 Hari Terakhir</div>
          <div className="admin-stat-value">
            {viewStats?.last7Days.toLocaleString("id-ID") ?? "—"}
          </div>
          <div className="admin-stat-hint">Total minggu ini</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Total Kunjungan</div>
          <div className="admin-stat-value">
            {viewStats?.allTime.toLocaleString("id-ID") ?? "—"}
          </div>
          <div className="admin-stat-hint">Semua waktu</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Total Artikel</div>
          <div className="admin-stat-value">{articles.length}</div>
          <div className="admin-stat-hint">
            {published} publish · {drafts} draft
          </div>
        </div>
      </div>

      {viewStats && (
        <div className="admin-section-grid" style={{ marginBottom: "1.5rem" }}>
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Kunjungan 7 Hari Terakhir</h3>
            </div>
            {viewStats.dailyLast7.length === 0 ? (
              <div className="admin-empty">
                <p>Belum ada data kunjungan. Buka website publik dulu ya.</p>
              </div>
            ) : (
              <div className="admin-analytics-bars">
                {viewStats.dailyLast7.map((d) => (
                  <div key={d.day} className="admin-analytics-bar-row">
                    <span className="admin-analytics-bar-label">{d.day}</span>
                    <div className="admin-analytics-bar-track">
                      <div
                        className="admin-analytics-bar-fill"
                        style={{
                          width: `${Math.max(8, (d.views / maxDaily) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="admin-analytics-bar-value">{d.views}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Halaman Paling Dilihat</h3>
            </div>
            {viewStats.topPages.length === 0 ? (
              <div className="admin-empty">
                <p>Belum ada halaman yang tercatat.</p>
              </div>
            ) : (
              <div className="admin-list">
                {viewStats.topPages.map((p) => (
                  <div key={p.path} className="admin-list-item">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        alignItems: "center",
                      }}
                    >
                      <code style={{ fontSize: "0.85rem" }}>{p.path}</code>
                      <span className="admin-badge admin-badge-published">
                        {p.views} view
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {topArticles.some((a) => a.views > 0) && (
        <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
          <div className="admin-card-header">
            <h3 className="admin-card-title">Artikel Paling Dibaca</h3>
            <Link href="/admin/articles" className="admin-link">
              Lihat semua
            </Link>
          </div>
          <div className="admin-list">
            {topArticles
              .filter((a) => a.views > 0)
              .map((a) => (
                <div key={a.slug} className="admin-list-item">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: "0.95rem" }}>{a.title}</span>
                    <span className="admin-badge admin-badge-published">
                      {a.views} view
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

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
              {unreadMessages > 0 && (
                <span className="admin-unread-pill" style={{ marginLeft: 8 }}>
                  {unreadMessages} baru
                </span>
              )}
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <div className="admin-empty">
              <p>Belum ada pesan masuk dari pengunjung.</p>
            </div>
          ) : (
            <div className="admin-list">
              {recentMessages.map((m) => (
                <div
                  key={m.id}
                  className={`admin-list-item${m.is_read ? "" : " is-unread-item"}`}
                >
                  <div className="admin-list-item-time">
                    {formatDateShort(m.created_at)} ·{" "}
                    <strong>{m.name ?? "Anon"}</strong>
                    {!m.is_read && (
                      <span className="admin-unread-dot" aria-label="Belum dibaca" />
                    )}
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
