"use client";

import React, { useEffect, useState, useCallback } from "react";
import { WeatherData } from "@/lib/weather/types";
import { OutfitRecommendation } from "@/lib/outfit/types";
import { getOutfitRecommendation } from "@/lib/outfit/rules";
import DateToggle from "@/components/DateToggle";
import WeatherCard from "@/components/WeatherCard";
import OutfitDetails from "@/components/OutfitDetails";
import OutfitImage from "@/components/OutfitImage";

interface WeatherResponse {
  today: WeatherData;
  tomorrow: WeatherData;
  isMock: boolean;
}

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<"today" | "tomorrow">("today");
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
      if (!res.ok) throw new Error("無法取得天氣資料");
      const data: WeatherResponse = await res.json();
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生未知錯誤");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      // 無法定位，使用台北預設座標
      fetchWeather(25.033, 121.565);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeather(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        // 使用者拒絕定位，使用台北預設
        fetchWeather(25.033, 121.565);
      },
      { timeout: 5000 }
    );
  }, [fetchWeather]);

  const currentWeather: WeatherData | null =
    weatherData?.[selectedDate] ?? null;

  const outfit: OutfitRecommendation | null = currentWeather
    ? getOutfitRecommendation(currentWeather)
    : null;

  return (
    <main className="min-h-screen px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        {/* 標題 */}
        <header className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            天氣穿搭建議
          </h1>
          <p className="text-gray-500 text-sm">
            根據天氣狀況，為你推薦最合適的穿搭
          </p>
        </header>

        {/* 日期切換 */}
        <div className="flex justify-center mb-8">
          <DateToggle selected={selectedDate} onChange={setSelectedDate} />
        </div>

        {/* 載入中 */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-3 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-500">正在取得天氣資料...</p>
          </div>
        )}

        {/* 錯誤 */}
        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-red-500 mb-2">⚠️ {error}</p>
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                fetchWeather(25.033, 121.565);
              }}
              className="text-blue-500 underline text-sm"
            >
              使用預設資料重試
            </button>
          </div>
        )}

        {/* 主內容 */}
        {!loading && !error && currentWeather && outfit && (
          <>
            {/* Mock 提示 */}
            {weatherData?.isMock && (
              <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-lg px-4 py-2 mb-6 text-center">
                目前使用示範資料。請設定 CWA API Key 以取得即時天氣。
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* 左側：穿搭圖 */}
              <div className="flex flex-col items-center gap-4">
                <div className="bg-white rounded-2xl shadow-md p-6 w-full flex justify-center">
                  <OutfitImage outfit={outfit} weather={currentWeather} />
                </div>
              </div>

              {/* 右側：天氣 + 穿搭細節 */}
              <div className="space-y-4">
                <WeatherCard weather={currentWeather} />
                <OutfitDetails outfit={outfit} />
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
