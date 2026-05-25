"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryImage } from "@/lib/gallery";
import Reveal from "./Reveal";

type GalleryProps = {
  images: GalleryImage[];
};

export default function Gallery({ images }: GalleryProps) {
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  return (
    <>
      <section id="galeri" className="gallery">
        <div className="container">
          <h2 className="section-title reveal">Galeri Foto</h2>
          <p className="section-subtitle reveal">
            Kumpulan momen estetik dan seru selama di pesantren.
          </p>
          <Reveal className="gallery-grid reveal">
            {images.map((img) => (
              <button
                type="button"
                key={img.src}
                className="gallery-item"
                onClick={() => setLightbox(img)}
                aria-label={img.alt}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={600}
                  height={400}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ width: "100%", height: "auto", objectFit: "cover" }}
                />
                <div className="gallery-overlay">
                  <span>{img.caption}</span>
                </div>
              </button>
            ))}
          </Reveal>
        </div>
      </section>

      {lightbox && (
        <div
          id="lightbox"
          className="lightbox"
          style={{ display: "block" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setLightbox(null);
          }}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="close"
            onClick={() => setLightbox(null)}
            aria-label="Tutup"
          >
            &times;
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="lightbox-content"
            id="lightbox-img"
            src={lightbox.src}
            alt={lightbox.alt}
          />
          <div id="caption">{lightbox.caption}</div>
        </div>
      )}
    </>
  );
}
