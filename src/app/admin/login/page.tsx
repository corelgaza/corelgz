import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login Admin · Santri Journey",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <span className="admin-login-icon">📚</span>
          <h1>Admin Santri Journey</h1>
          <p>Masuk untuk kelola artikel & pesan</p>
        </div>
        <LoginForm
          redirectTo={params.redirect || "/admin"}
          configError={params.error === "missing-config"}
        />
      </div>
    </div>
  );
}
