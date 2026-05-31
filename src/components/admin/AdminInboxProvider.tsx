"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ContactMessageRow } from "@/lib/messages";
import { useToast } from "./Toast";

const POLL_MS = 12_000;

type AdminInboxContextValue = {
  messages: ContactMessageRow[];
  unreadCount: number;
  loading: boolean;
  seed: (messages: ContactMessageRow[]) => void;
  refresh: () => Promise<void>;
  setRead: (id: string, is_read: boolean) => Promise<boolean>;
  markAllRead: () => Promise<void>;
  patchMessage: (message: ContactMessageRow) => void;
};

const AdminInboxContext = createContext<AdminInboxContextValue | null>(null);

export function AdminInboxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const toast = useToast();
  const [messages, setMessages] = useState<ContactMessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const knownIdsRef = useRef<Set<string>>(new Set());
  const fetchingRef = useRef(false);

  const unreadCount = useMemo(
    () => messages.filter((m) => !m.is_read).length,
    [messages]
  );

  const applyMessages = useCallback(
    (next: ContactMessageRow[], notifyNew = false) => {
      if (notifyNew) {
        const newcomers = next.filter((m) => !knownIdsRef.current.has(m.id));
        if (newcomers.length > 0 && knownIdsRef.current.size > 0) {
          const latest = newcomers[0];
          toast.push({
            type: "info",
            title: "Pesan baru masuk",
            description:
              latest.message.length > 80
                ? `${latest.message.slice(0, 80)}…`
                : latest.message,
          });
        }
      }

      knownIdsRef.current = new Set(next.map((m) => m.id));
      setMessages(next);
    },
    [toast]
  );

  const refresh = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    try {
      const res = await fetch("/api/admin/messages", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as {
        messages?: ContactMessageRow[];
      };
      if (Array.isArray(data.messages)) {
        applyMessages(data.messages, true);
      }
    } finally {
      fetchingRef.current = false;
      setLoading(false);
    }
  }, [applyMessages]);

  const seed = useCallback(
    (initial: ContactMessageRow[]) => {
      applyMessages(initial, false);
      setLoading(false);
    },
    [applyMessages]
  );

  const patchMessage = useCallback((message: ContactMessageRow) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === message.id ? message : m))
    );
  }, []);

  const setRead = useCallback(
    async (id: string, is_read: boolean) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_read } : m))
      );

      try {
        const res = await fetch(`/api/admin/messages/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_read }),
        });
        const data = (await res.json().catch(() => ({}))) as {
          message?: ContactMessageRow;
        };
        if (!res.ok || !data.message) {
          await refresh();
          return false;
        }
        patchMessage(data.message);
        return true;
      } catch {
        await refresh();
        return false;
      }
    },
    [patchMessage, refresh]
  );

  const markAllRead = useCallback(async () => {
    setMessages((prev) => prev.map((m) => ({ ...m, is_read: true })));
    try {
      const res = await fetch("/api/admin/messages/mark-all", {
        method: "PATCH",
      });
      if (!res.ok) await refresh();
    } catch {
      await refresh();
    }
  }, [refresh]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, POLL_MS);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.clearInterval(timer);
    };
  }, [refresh]);

  const value = useMemo(
    () => ({
      messages,
      unreadCount,
      loading,
      seed,
      refresh,
      setRead,
      markAllRead,
      patchMessage,
    }),
    [
      messages,
      unreadCount,
      loading,
      seed,
      refresh,
      setRead,
      markAllRead,
      patchMessage,
    ]
  );

  return (
    <AdminInboxContext.Provider value={value}>
      {children}
    </AdminInboxContext.Provider>
  );
}

export function useAdminInbox() {
  const ctx = useContext(AdminInboxContext);
  if (!ctx) {
    throw new Error("useAdminInbox must be used within AdminInboxProvider");
  }
  return ctx;
}

/** Safe hook for components that may render outside provider (e.g. login). */
export function useAdminInboxOptional() {
  return useContext(AdminInboxContext);
}
