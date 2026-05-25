import ArticleEditor from "@/components/admin/ArticleEditor";

export const dynamic = "force-dynamic";

export default function AdminNewArticlePage() {
  return <ArticleEditor mode="create" />;
}
