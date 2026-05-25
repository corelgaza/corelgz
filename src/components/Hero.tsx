"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SITE_CONFIG } from "@/lib/config";
import Reveal from "./Reveal";

export default function Hero() {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const text = SITE_CONFIG.heroTypewriter;
    let i = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (i < text.length) {
        setTyped(text.slice(0, i + 1));
        i++;
        timeout = setTimeout(tick, 50);
      }
    };

    const start = setTimeout(tick, 1000);
    return () => {
      clearTimeout(start);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const container = document.getElementById("particles-container");
    if (!container || container.childElementCount > 0) return;

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement("div");
      particle.classList.add("particle");
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.animationDuration = `${Math.random() * 3 + 3}s`;
      particle.style.animationDelay = `${Math.random() * 2}s`;
      container.appendChild(particle);
    }
  }, []);

  return (
    <header id="home" className="hero">
      <div id="particles-container" />
      <div className="hero-overlay" />
      <Reveal className="hero-content">
        <h1>
          {SITE_CONFIG.name}: <span>{SITE_CONFIG.subtitle}</span>
        </h1>
        <p id="typewriter" className="typing-text">
          {typed}
        </p>
        <Link href="#tentang" className="btn-primary">
          Kuy, Kepoin!
        </Link>
      </Reveal>
    </header>
  );
}
