"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm({
  redirectTo,
  configError,
}: {
  redirectTo: string;
  configError: boolean;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    configError
      ? "Konfigurasi server belum lengkap (ADMIN_SESSION_SECRET hilang)"
      : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        setError(data.error || "Login gagal");
        setLoading(false);
        return;
      }
      router.replace(redirectTo);
      router.refresh();
    } catch {
      setError("Tidak bisa menghubungi server");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-login-form">
      <label className="admin-login-label">
        Password
        <input
          type="password"
          className="admin-login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoFocus
          required
          autoComplete="current-password"
        />
      </label>
      {error && <p className="admin-login-error">{error}</p>}
      <button
        type="submit"
        className="admin-btn admin-btn-primary admin-btn-block"
        disabled={loading || !password}
      >
        {loading ? "Memverifikasi..." : "Masuk"}
      </button>
      <p className="admin-login-hint">
        Lupa password? Edit nilai <code>ADMIN_PASSWORD</code> di{" "}
        <code>.env.local</code> lalu restart server.
      </p>
    </form>
  );
}
