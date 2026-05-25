"use client";

import { useEffect, useState } from "react";

export default function Loader() {
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setHidden(true), 500);
    const t2 = setTimeout(() => setRemoved(true), 1000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (removed) return null;

  return (
    <div
      id="loader"
      style={{
        opacity: hidden ? 0 : 1,
        transition: "opacity 0.5s ease",
        pointerEvents: hidden ? "none" : "auto",
      }}
    >
      <div className="spinner" />
    </div>
  );
}
