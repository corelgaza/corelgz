"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type ToastType = "success" | "error" | "info";

type ToastItem = {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
};

type ToastContextValue = {
  push: (t: Omit<ToastItem, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((t: Omit<ToastItem, "id">) => {
    const id = uid();
    const item: ToastItem = { id, ...t };
    setItems((prev) => [item, ...prev].slice(0, 4));
    window.setTimeout(() => {
      setItems((prev) => prev.filter((x) => x.id !== id));
    }, 3500);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="admin-toast-stack" aria-live="polite" aria-relevant="additions">
        {items.map((t) => (
          <div key={t.id} className={`admin-toast admin-toast-${t.type}`}>
            <div className="admin-toast-title">{t.title}</div>
            {t.description && (
              <div className="admin-toast-desc">{t.description}</div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

