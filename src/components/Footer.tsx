import { getWhatsAppUrl, SITE_CONFIG } from "@/lib/config";

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="social-links">
          <h4>Kuy, Connect Bareng Gue! 🤙</h4>
          <div className="social-buttons">
            <a
              href={SITE_CONFIG.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn instagram"
            >
              📷 Instagram
            </a>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn whatsapp"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
        <p>&copy; 2026 {SITE_CONFIG.name}: {SITE_CONFIG.subtitle}. Dibuat dengan asik dan santai.</p>
      </div>
    </footer>
  );
}
