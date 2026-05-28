"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { ToastProvider } from "./Toast";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <ToastProvider>
      <div className="admin-root">
        <AdminSidebar />
        <div className="admin-main">
          <AdminHeader />
          <main className="admin-content">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
