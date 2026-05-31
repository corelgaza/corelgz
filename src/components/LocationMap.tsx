import { PONDOK_LOCATION } from "@/data/site";
import Reveal from "./Reveal";

export default function LocationMap() {
  return (
    <section id="lokasi" className="location-map">
      <div className="container">
        <h2 className="section-title reveal">Lokasi Pesantren</h2>
        <p className="section-subtitle reveal">
          Mau datang atau cuma penasaran letak pondok? Cek peta di bawah ya.
        </p>
        <Reveal>
          <div className="location-map-grid">
            <div className="location-map-frame">
              <iframe
                title={`Peta ${PONDOK_LOCATION.name}`}
                src={PONDOK_LOCATION.embedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div className="location-map-info">
              <h3>{PONDOK_LOCATION.name}</h3>
              <p className="location-map-address">{PONDOK_LOCATION.address}</p>
              <ul className="location-map-details">
                <li>
                  <strong>Telepon:</strong>{" "}
                  <a href={`tel:${PONDOK_LOCATION.phone.replace(/\D/g, "")}`}>
                    {PONDOK_LOCATION.phone}
                  </a>
                </li>
                <li>
                  <strong>Website:</strong>{" "}
                  <a
                    href="https://ponpes-sukahideng.or.id"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ponpes-sukahideng.or.id
                  </a>
                </li>
              </ul>
              <a
                href={PONDOK_LOCATION.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary location-map-btn"
              >
                Buka di Google Maps ↗
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
