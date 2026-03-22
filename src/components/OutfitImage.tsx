"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { OutfitRecommendation } from "@/lib/outfit/types";
import { WeatherData } from "@/lib/weather/types";
import OutfitFigure from "@/components/outfit/OutfitFigure";

interface Props {
  outfit: OutfitRecommendation;
  weather: WeatherData;
}

// Cache generated images so switching today/tomorrow doesn't re-generate
const imageCache = new Map<string, { image: string; mimeType: string }>();

function getCacheKey(weather: WeatherData, outfit: OutfitRecommendation): string {
  const today = new Date().toISOString().slice(0, 10); // invalidate daily
  return `${today}-${weather.location}-${outfit.temperatureLevel}-${weather.weatherDesc}`;
}

export default function OutfitImage({ outfit, weather }: Props) {
  const [imageData, setImageData] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("image/png");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const lastRequestKey = useRef<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const generateImage = useCallback(async (skipCache = false) => {
    const cacheKey = getCacheKey(weather, outfit);

    // Use client-side cached image if available
    if (!skipCache) {
      const cached = imageCache.get(cacheKey);
      if (cached) {
        setImageData(cached.image);
        setMimeType(cached.mimeType);
        setErrorMessage(null);
        return;
      }
    }

    // Abort any in-flight request
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setErrorMessage(null);

    try {
      const url = skipCache ? "/api/outfit-image?skipCache=1" : "/api/outfit-image";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          weather: {
            location: weather.location,
            temperature: weather.temperature,
            feelsLike: weather.feelsLike,
            minTemp: weather.minTemp,
            maxTemp: weather.maxTemp,
            rainProbability: weather.rainProbability,
            weatherDesc: weather.weatherDesc,
          },
          outfit: {
            topName: outfit.top.name,
            bottomName: outfit.bottom.name,
            outerwearName: outfit.outerwear?.name,
            accessories: outfit.accessories.map((a) => a.name),
            rainGearName: outfit.rainGear?.name,
            temperatureLevel: outfit.temperatureLevel,
            summary: outfit.summary,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "圖片生成失敗");
      }

      const data = await res.json();
      setImageData(data.image);
      setMimeType(data.mimeType || "image/png");
      setErrorMessage(null);

      // Store in cache
      imageCache.set(cacheKey, { image: data.image, mimeType: data.mimeType || "image/png" });
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setErrorMessage((err as Error).message || "圖片生成失敗");
      }
    } finally {
      setLoading(false);
    }
  }, [weather, outfit]);

  // Auto-generate when weather/outfit changes
  useEffect(() => {
    const requestKey = getCacheKey(weather, outfit);
    if (requestKey === lastRequestKey.current) return;
    lastRequestKey.current = requestKey;

    generateImage();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [weather, outfit, generateImage]);

  const handleRegenerate = () => {
    generateImage(true); // skip cache, force new image
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full aspect-[3/4] flex flex-col items-center justify-center gap-3 bg-gray-50 rounded-xl">
        <div className="w-10 h-10 border-3 border-blue-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">AI 穿搭圖片生成中...</p>
      </div>
    );
  }

  // AI image loaded successfully
  if (imageData) {
    return (
      <div className="w-full flex flex-col items-center gap-2">
        <img
          src={`data:${mimeType};base64,${imageData}`}
          alt="AI 生成穿搭建議圖"
          className="w-full h-auto rounded-xl shadow-sm"
        />
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">由 AI 生成</span>
          <button
            onClick={handleRegenerate}
            className="text-xs text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
          >
            換一張
          </button>
        </div>
      </div>
    );
  }

  // Error / fallback → show SVG + error hint + retry button
  return (
    <div className="w-full flex flex-col items-center gap-3">
      <OutfitFigure outfit={outfit} />
      {errorMessage && (
        <p className="text-xs text-amber-600 text-center">
          AI 圖片生成失敗：{errorMessage}
        </p>
      )}
      <button
        onClick={handleRegenerate}
        className="text-xs text-blue-500 hover:text-blue-700 border border-blue-200 rounded-full px-4 py-1.5 transition-colors cursor-pointer"
      >
        使用 AI 生成穿搭圖
      </button>
    </div>
  );
}
