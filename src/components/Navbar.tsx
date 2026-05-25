"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/data/site";
import { SITE_CONFIG } from "@/lib/config";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    if (saved) {
      document.documentElement.setAttribute("data-theme", saved);
      setTheme(saved);
    }
  }, []);

  useEffect(() => {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;

    const onScroll = () => {
      if (window.scrollY > 50) navbar.classList.add("scrolled");
      else navbar.classList.remove("scrolled");
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav id="navbar">
      <div className="nav-container">
        <Link href="#home" className="logo" onClick={closeMenu}>
          <Image
            src="/favicon.svg"
            alt=""
            className="logo-icon"
            width={28}
            height={28}
            unoptimized
          />
          <span>{SITE_CONFIG.name}</span>
        </Link>
        <ul className={`nav-links${menuOpen ? " active" : ""}`}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} onClick={closeMenu}>
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <button
              type="button"
              id="theme-toggle"
              className="theme-btn"
              aria-label="Toggle Dark Mode"
              onClick={toggleTheme}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </li>
        </ul>
        <button
          type="button"
          className={`hamburger${menuOpen ? " active" : ""}`}
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
      </div>
    </nav>
  );
}
