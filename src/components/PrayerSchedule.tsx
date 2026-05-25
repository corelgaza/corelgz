"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  formatCountdown,
  getNextPrayer,
  PRAYER_CITIES,
  PRAYER_CITY_STORAGE_KEY,
  type NextPrayerInfo,
  type PrayerScheduleResponse,
} from "@/lib/prayer";
import Reveal from "./Reveal";

type LoadMode = "gps" | "city";

function getSavedCity(): string {
  if (typeof window === "undefined") return "Bandung";
  const saved = localStorage.getItem(PRAYER_CITY_STORAGE_KEY);
  if (saved && PRAYER_CITIES.some((c) => c.city === saved)) return saved;
  return "Bandung";
}

export default function PrayerSchedule() {
  const [schedule, setSchedule] = useState<PrayerScheduleResponse | null>(null);
  const [nextPrayer, setNextPrayer] = useState<NextPrayerInfo | null>(null);
  const [countdown, setCountdown] = useState("00:00:00");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationNote, setLocationNote] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState(getSavedCity);
  const [loadMode, setLoadMode] = useState<LoadMode>("city");
  const initialized = useRef(false);

  const loadSchedule = useCallback(
    async (opts: {
      lat?: number;
      lng?: number;
      city?: string;
      country?: string;
    }): Promise<PrayerScheduleResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (opts.lat !== undefined && opts.lng !== undefined) {
          params.set("lat", String(opts.lat));
          params.set("lng", String(opts.lng));
        } else if (opts.city) {
          params.set("city", opts.city);
          if (opts.country) params.set("country", opts.country);
        }
        const qs = params.toString();
        const res = await fetch(`/api/prayer-times${qs ? `?${qs}` : ""}`);
        if (!res.ok) throw new Error("Gagal memuat jadwal");
        const data = (await res.json()) as PrayerScheduleResponse;
        setSchedule(data);
        setNextPrayer(getNextPrayer(new Date(), data.timings));
        return data;
      } catch {
        setError("Gagal mengambil jadwal shalat. Coba lagi ya.");
        setSchedule(null);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const loadByCity = useCallback(
    (cityName: string) => {
      const entry =
        PRAYER_CITIES.find((c) => c.city === cityName) ?? PRAYER_CITIES[0];
      setSelectedCity(entry.city);
      localStorage.setItem(PRAYER_CITY_STORAGE_KEY, entry.city);
      setLoadMode("city");
      loadSchedule({ city: entry.city, country: entry.country });
    },
    [loadSchedule]
  );

  const requestGps = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationNote("Browser tidak mendukung GPS — pilih kota di bawah.");
      loadByCity(selectedCity);
      return;
    }

    setLoading(true);
    setLocationNote("Mencari lokasi kamu...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLoadMode("gps");
        const { latitude, longitude } = pos.coords;
        const data = await loadSchedule({ lat: latitude, lng: longitude });
        if (data) {
          setLocationNote(`Lokasi terdeteksi dari GPS kamu.`);
          const matched = PRAYER_CITIES.find((c) =>
            data.location.toLowerCase().includes(c.city.toLowerCase())
          );
          if (matched) setSelectedCity(matched.city);
        }
      },
      () => {
        setLoadMode("city");
        setLocationNote(
          "GPS ditolak. Pilih Bandung (atau kota lain) di dropdown, atau izinkan lokasi di browser lalu klik \"Pakai lokasi saya\"."
        );
        loadByCity(selectedCity);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, [loadSchedule, loadByCity, selectedCity]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    requestGps();
  }, [requestGps]);

  useEffect(() => {
    if (!schedule) return;

    const tick = () => {
      const next = getNextPrayer(new Date(), schedule.timings);
      setNextPrayer(next);
      setCountdown(formatCountdown(next.remainingMs));
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [schedule]);

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocationNote(null);
    loadByCity(e.target.value);
  };

  return (
    <section id="jadwal-shalat" className="prayer-section">
      <div className="container">
        <h2 className="section-title reveal">Jadwal Shalat</h2>
        <p className="section-subtitle reveal">
          Waktu shalat hari ini (metode Kemenag RI). Pakai GPS atau pilih kota.
        </p>

        <div className="prayer-controls reveal">
          <label className="prayer-city-label" htmlFor="prayer-city-select">
            Kota:
          </label>
          <select
            id="prayer-city-select"
            className="prayer-city-select"
            value={selectedCity}
            onChange={handleCityChange}
            disabled={loading}
          >
            {PRAYER_CITIES.map((c) => (
              <option key={c.city} value={c.city}>
                {c.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn-primary prayer-gps-btn"
            onClick={requestGps}
            disabled={loading}
          >
            Pakai lokasi saya
          </button>
        </div>

        {loading && (
          <div className="prayer-status reveal">
            <div className="prayer-spinner" aria-hidden />
            <p>Mengambil jadwal shalat...</p>
          </div>
        )}

        {error && !loading && (
          <div className="prayer-status reveal">
            <p>{error}</p>
            <button
              type="button"
              className="btn-primary"
              onClick={() =>
                loadMode === "gps" ? requestGps() : loadByCity(selectedCity)
              }
            >
              Coba lagi
            </button>
          </div>
        )}

        {schedule && !loading && !error && (
          <Reveal>
            {locationNote && (
              <p className="prayer-location-note">{locationNote}</p>
            )}

            <div className="prayer-meta">
              <span className="prayer-meta-location">
                {loadMode === "gps" ? "📍 " : ""}
                {schedule.location}
              </span>
              <span className="prayer-meta-sep">·</span>
              <span>{schedule.date}</span>
              <span className="prayer-meta-sep">·</span>
              <span>{schedule.hijri}</span>
            </div>

            {nextPrayer && (
              <div className="prayer-countdown">
                <div className="prayer-countdown-label">
                  Shalat berikutnya: <strong>{nextPrayer.name}</strong> (
                  {nextPrayer.time})
                </div>
                <div className="prayer-countdown-timer" aria-live="polite">
                  {countdown}
                </div>
              </div>
            )}

            <div className="prayer-grid">
              {schedule.timings.map((t) => (
                <div
                  key={t.name}
                  className={`prayer-card${
                    nextPrayer?.name === t.name ? " prayer-card--active" : ""
                  }`}
                >
                  <span className="prayer-card-name">{t.name}</span>
                  <span className="prayer-card-time">{t.time}</span>
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
