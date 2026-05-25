import { NextResponse } from "next/server";
import {
  fetchPrayerTimesByCity,
  fetchPrayerTimesByCoords,
} from "@/lib/prayer";

export const revalidate = 3600;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      if (
        Number.isFinite(latitude) &&
        Number.isFinite(longitude) &&
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180
      ) {
        const data = await fetchPrayerTimesByCoords(latitude, longitude);
        return NextResponse.json(data);
      }
    }

    const city = searchParams.get("city")?.trim() || undefined;
    const country = searchParams.get("country")?.trim() || undefined;
    const data = await fetchPrayerTimesByCity(city, country);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil jadwal shalat" },
      { status: 500 }
    );
  }
}
