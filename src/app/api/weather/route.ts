import { NextRequest, NextResponse } from "next/server";
import { fetchWeatherFromCWA, findNearestCity, getMockWeather } from "@/lib/weather/api";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") ?? "25.033");
  const lng = parseFloat(searchParams.get("lng") ?? "121.565");

  const city = findNearestCity(lat, lng);
  const apiKey = process.env.CWA_API_KEY;

  // 如果沒有設定 API Key，使用 mock 資料
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
    const mock = getMockWeather(city);
    return NextResponse.json({ ...mock, isMock: true });
  }

  try {
    const weather = await fetchWeatherFromCWA(apiKey, city);
    return NextResponse.json({ ...weather, isMock: false });
  } catch (error) {
    console.error("CWA API error, falling back to mock:", error);
    const mock = getMockWeather(city);
    return NextResponse.json({ ...mock, isMock: true });
  }
}
