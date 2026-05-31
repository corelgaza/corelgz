"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminInboxOptional } from "./AdminInboxProvider";

type NavItem = {
  href: string;
  label: string;
  icon: string;
  exact?: boolean;
  badge?: number;
};

const NAV_ITEMS: ReadonlyArray<Omit<NavItem, "badge">> = [
  { href: "/admin", label: "Dashboard", icon: "📊", exact: true },
  { href: "/admin/articles", label: "Artikel", icon: "📝" },
  { href: "/admin/gallery", label: "Galeri", icon: "🖼️" },
  { href: "/admin/messages", label: "Pesan", icon: "💬" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const inbox = useAdminInboxOptional();
  const unreadCount = inbox?.unreadCount ?? 0;

  const items: NavItem[] = NAV_ITEMS.map((item) =>
    item.href === "/admin/messages" && unreadCount > 0
      ? { ...item, badge: unreadCount }
      : item
  );

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <span className="admin-sidebar-logo">📚</span>
        <div>
          <strong>Santri Journey</strong>
          <span>Admin Panel</span>
        </div>
      </div>

      <nav className="admin-sidebar-nav">
        {items.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-sidebar-link${active ? " is-active" : ""}`}
            >
              <span className="admin-sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge ? (
                <span className="admin-sidebar-badge">{item.badge}</span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <Link
          href="/"
          className="admin-sidebar-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="admin-sidebar-icon">🌐</span>
          <span>Lihat Situs</span>
        </Link>
      </div>
    </aside>
  );
}
