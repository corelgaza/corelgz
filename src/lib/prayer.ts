/** Metode perhitungan Kemenag RI (Aladhan method 20) */
export const PRAYER_METHOD = 20;

export const FALLBACK_CITY = "Tasikmalaya";
export const FALLBACK_COUNTRY = "Indonesia";

/** Kota untuk pilih manual jika GPS ditolak */
export const PRAYER_CITIES = [
  { city: "Bandung", country: "Indonesia", label: "Bandung" },
  { city: "Tasikmalaya", country: "Indonesia", label: "Tasikmalaya" },
  { city: "Jakarta", country: "Indonesia", label: "Jakarta" },
  { city: "Surabaya", country: "Indonesia", label: "Surabaya" },
  { city: "Yogyakarta", country: "Indonesia", label: "Yogyakarta" },
  { city: "Semarang", country: "Indonesia", label: "Semarang" },
] as const;

export const PRAYER_CITY_STORAGE_KEY = "prayer-city";

export const PRAYER_KEYS = [
  { key: "Fajr", name: "Subuh" },
  { key: "Dhuhr", name: "Dzuhur" },
  { key: "Asr", name: "Ashar" },
  { key: "Maghrib", name: "Maghrib" },
  { key: "Isha", name: "Isya" },
] as const;

export type PrayerTiming = {
  name: string;
  time: string;
  minutes: number;
};

export type PrayerScheduleResponse = {
  location: string;
  date: string;
  hijri: string;
  timings: PrayerTiming[];
};

export type NextPrayerInfo = {
  name: string;
  time: string;
  remainingMs: number;
};

/** "04:32 (WIB)" → { time: "04:32", minutes: 272 } */
export function parseTimeString(raw: string): { time: string; minutes: number } {
  const match = raw.match(/(\d{1,2}):(\d{2})/);
  if (!match) return { time: raw, minutes: 0 };
  const hours = parseInt(match[1], 10);
  const mins = parseInt(match[2], 10);
  return {
    time: `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`,
    minutes: hours * 60 + mins,
  };
}

export function buildTimings(
  timingsMap: Record<string, string>
): PrayerTiming[] {
  return PRAYER_KEYS.map(({ key, name }) => {
    const parsed = parseTimeString(timingsMap[key] ?? "00:00");
    return { name, time: parsed.time, minutes: parsed.minutes };
  });
}

export function getNextPrayer(
  now: Date,
  timings: PrayerTiming[]
): NextPrayerInfo {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const nowMs = now.getTime();

  for (let i = 0; i < timings.length; i++) {
    if (nowMinutes < timings[i].minutes) {
      const target = new Date(now);
      target.setHours(Math.floor(timings[i].minutes / 60));
      target.setMinutes(timings[i].minutes % 60);
      target.setSeconds(0);
      target.setMilliseconds(0);
      return {
        name: timings[i].name,
        time: timings[i].time,
        remainingMs: Math.max(0, target.getTime() - nowMs),
      };
    }
  }

  const tomorrowSubuh = new Date(now);
  tomorrowSubuh.setDate(tomorrowSubuh.getDate() + 1);
  tomorrowSubuh.setHours(Math.floor(timings[0].minutes / 60));
  tomorrowSubuh.setMinutes(timings[0].minutes % 60);
  tomorrowSubuh.setSeconds(0);
  tomorrowSubuh.setMilliseconds(0);

  return {
    name: timings[0].name,
    time: timings[0].time,
    remainingMs: Math.max(0, tomorrowSubuh.getTime() - nowMs),
  };
}

export function formatCountdown(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

type AladhanTimingsResponse = {
  data: {
    timings: Record<string, string>;
    date: {
      readable: string;
      hijri: { day: string; month: { en: string }; year: string };
    };
  };
};

export function parseAladhanResponse(
  json: AladhanTimingsResponse,
  locationLabel: string
): PrayerScheduleResponse {
  const { timings, date } = json.data;
  const hijri = `${date.hijri.day} ${date.hijri.month.en} ${date.hijri.year} H`;

  return {
    location: locationLabel,
    date: date.readable,
    hijri,
    timings: buildTimings(timings),
  };
}

type NominatimReverse = {
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state?: string;
    country?: string;
  };
};

/** Ubah koordinat GPS jadi nama kota/kabupaten yang terbaca */
export async function resolveLocationLabel(
  lat: number,
  lng: number
): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=id`,
      {
        headers: {
          "User-Agent": "SantriJourney/1.0 (pesantren portfolio)",
        },
        next: { revalidate: 86400 },
      }
    );
    if (!res.ok) throw new Error("reverse geocode failed");

    const data = (await res.json()) as NominatimReverse;
    const a = data.address ?? {};
    const locality =
      a.city ?? a.town ?? a.village ?? a.municipality ?? a.county;
    const region = a.state ?? "";
    const country = a.country ?? "Indonesia";

    if (locality && region && locality !== region) {
      return `${locality}, ${region}`;
    }
    if (locality) {
      return `${locality}, ${country}`;
    }
    if (region) {
      return `${region}, ${country}`;
    }
  } catch {
    /* fallback di bawah */
  }

  return `Lokasi GPS (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`;
}

export async function fetchPrayerTimesByCoords(
  lat: number,
  lng: number
): Promise<PrayerScheduleResponse> {
  const [timingsRes, locationLabel] = await Promise.all([
    fetch(
      `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=${PRAYER_METHOD}`,
      { next: { revalidate: 3600 } }
    ),
    resolveLocationLabel(lat, lng),
  ]);

  if (!timingsRes.ok) throw new Error("Gagal mengambil jadwal shalat");
  const json = (await timingsRes.json()) as AladhanTimingsResponse;
  return parseAladhanResponse(json, locationLabel);
}

export async function fetchPrayerTimesByCity(
  city = FALLBACK_CITY,
  country = FALLBACK_COUNTRY
): Promise<PrayerScheduleResponse> {
  const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${PRAYER_METHOD}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error("Gagal mengambil jadwal shalat");
  const json = (await res.json()) as AladhanTimingsResponse;
  return parseAladhanResponse(json, `${city}, ${country}`);
}
