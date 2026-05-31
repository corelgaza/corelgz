import Link from "next/link";
import { getCachedArticleViewCounts } from "@/lib/analytics";
import { listArticlesAdmin } from "@/lib/articles";
import ArticlesTable from "./ArticlesTable";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const [articles, viewCounts] = await Promise.all([
    listArticlesAdmin(),
    getCachedArticleViewCounts(),
  ]);

  return (
    <div>
      <div className="admin-toolbar">
        <div className="admin-toolbar-left">
          <p className="admin-muted">
            {articles.length} artikel total ·{" "}
            {articles.filter((a) => a.status === "published").length} published
            · {articles.filter((a) => a.status === "draft").length} draft
          </p>
        </div>
        <div className="admin-toolbar-right">
          <Link href="/admin/articles/new" className="admin-btn admin-btn-primary">
            + Artikel Baru
          </Link>
        </div>
      </div>

      <ArticlesTable initial={articles} viewCounts={viewCounts} />
    </div>
  );
}
