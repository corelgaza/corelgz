import { TESTIMONIALS } from "@/data/site";
import Reveal from "./Reveal";

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function Testimonials() {
  return (
    <section id="testimoni" className="testimoni bg-light">
      <div className="container">
        <h2 className="section-title reveal">Kata Temen-temen</h2>
        <Reveal className="testi-grid reveal">
          {TESTIMONIALS.map((t) => (
            <div className="testi-card" key={t.handle}>
              <p>&ldquo;{t.text}&rdquo;</p>
              <h5>- {t.author}</h5>
              <a
                href={t.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="testi-social-link"
              >
                <InstagramIcon />
                {t.handle}
              </a>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
