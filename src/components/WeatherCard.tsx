"use client";

import React from "react";
import { WeatherData } from "@/lib/weather/types";

interface Props {
  weather: WeatherData;
}

/** 天氣圖示（根據天氣描述） */
function getWeatherIcon(desc: string): string {
  if (desc.includes("雨")) return "🌧️";
  if (desc.includes("陰")) return "☁️";
  if (desc.includes("雲")) return "⛅";
  if (desc.includes("晴")) return "☀️";
  if (desc.includes("雷")) return "⛈️";
  if (desc.includes("霧")) return "🌫️";
  return "🌤️";
}

export default function WeatherCard({ weather }: Props) {
  const icon = getWeatherIcon(weather.weatherDesc);

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 space-y-3">
      {/* 天氣圖示 + 描述 */}
      <div className="flex items-center gap-3">
        <span className="text-4xl">{icon}</span>
        <div>
          <p className="text-lg font-semibold text-gray-800">
            {weather.weatherDesc}
          </p>
          <p className="text-sm text-gray-500">{weather.location}</p>
        </div>
      </div>

      {/* 溫度 */}
      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-bold text-gray-900">
          {weather.temperature}°
        </span>
        <span className="text-gray-500 text-sm">
          {weather.minTemp}° – {weather.maxTemp}°
        </span>
      </div>

      {/* 詳細資訊 */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
        <div className="text-sm">
          <span className="text-gray-500">體感溫度</span>
          <p className="font-medium text-gray-800">{weather.feelsLike}°C</p>
        </div>
        <div className="text-sm">
          <span className="text-gray-500">降雨機率</span>
          <p className="font-medium text-gray-800">
            {weather.rainProbability}%
            {weather.rainProbability >= 70 && " 💧"}
          </p>
        </div>
      </div>
    </div>
  );
}
