"use client";

import { useEffect } from "react";

/** Mengaktifkan animasi .reveal di seluruh halaman (judul section, dll.) */
export default function RevealObserver() {
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal:not(.active)");
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
