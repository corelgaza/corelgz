"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const TITLE_MAP: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/articles": "Daftar Artikel",
  "/admin/articles/new": "Artikel Baru",
  "/admin/messages": "Pesan Pengunjung",
  "/admin/gallery": "Kelola Galeri",
};

function getTitle(pathname: string | null): string {
  if (!pathname) return "Admin";
  if (TITLE_MAP[pathname]) return TITLE_MAP[pathname];
  if (pathname.startsWith("/admin/articles/") && pathname.endsWith("/edit")) {
    return "Edit Artikel";
  }
  if (pathname.startsWith("/admin/articles")) return "Daftar Artikel";
  if (pathname.startsWith("/admin/messages")) return "Pesan Pengunjung";
  if (pathname.startsWith("/admin/gallery")) return "Kelola Galeri";
  return "Admin";
}

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  return (
    <header className="admin-header">
      <h1 className="admin-header-title">{getTitle(pathname)}</h1>
      <div className="admin-header-actions">
        <span className="admin-header-user">
          <span className="admin-header-avatar">C</span>
          <span>Corel</span>
        </span>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="admin-btn admin-btn-ghost"
        >
          {loggingOut ? "Keluar..." : "Logout"}
        </button>
      </div>
    </header>
  );
}
