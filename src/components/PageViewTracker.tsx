"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function getSessionKey(): string {
  const key = "sj_pv_session";
  let id = localStorage.getItem(key);
  if (!id) {
    id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `s${Date.now()}`;
    localStorage.setItem(key, id);
  }
  return id;
}

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    const storageKey = `pv:${pathname}`;
    if (sessionStorage.getItem(storageKey)) return;
    sessionStorage.setItem(storageKey, "1");

    fetch("/api/analytics/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        sessionKey: getSessionKey(),
      }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
