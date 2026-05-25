import { notFound } from "next/navigation";
import ArticleEditor from "@/components/admin/ArticleEditor";
import { getArticleByIdAdmin } from "@/lib/articles";

export const dynamic = "force-dynamic";

export default async function AdminEditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleByIdAdmin(id);
  if (!article) {
    notFound();
  }
  return <ArticleEditor mode="edit" initial={article} />;
}
