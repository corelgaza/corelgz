import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import { getUnreadMessageCount } from "@/lib/messages";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin · Santri Journey",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const unreadCount = await getUnreadMessageCount();

  return <AdminShell unreadCount={unreadCount}>{children}</AdminShell>;
}
