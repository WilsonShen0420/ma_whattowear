"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { OutfitRecommendation } from "@/lib/outfit/types";
import { WeatherData } from "@/lib/weather/types";
import OutfitFigure from "@/components/outfit/OutfitFigure";

interface Props {
  outfit: OutfitRecommendation;
  weather: WeatherData;
}

export default function OutfitImage({ outfit, weather }: Props) {
  const [imageData, setImageData] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("image/png");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  // Track the last request to avoid duplicate calls
  const lastRequestKey = useRef<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const generateImage = useCallback(async () => {
    // Abort any in-flight request
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(false);
    setImageData(null);

    try {
      const res = await fetch("/api/outfit-image", {
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
        throw new Error("Image generation failed");
      }

      const data = await res.json();
      setImageData(data.image);
      setMimeType(data.mimeType || "image/png");
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  }, [weather, outfit]);

  // Auto-generate when weather/outfit changes
  useEffect(() => {
    const requestKey = `${weather.location}-${weather.temperature}-${weather.weatherDesc}-${outfit.temperatureLevel}`;
    if (requestKey === lastRequestKey.current) return;
    lastRequestKey.current = requestKey;

    generateImage();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [weather, outfit, generateImage]);

  const handleRegenerate = () => {
    generateImage();
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

  // Error or no API key → fallback to SVG
  if (error || !imageData) {
    return <OutfitFigure outfit={outfit} />;
  }

  // Show AI-generated image
  return (
    <div className="w-full flex flex-col items-center gap-2">
      <img
        src={`data:${mimeType};base64,${imageData}`}
        alt="AI 生成穿搭建議圖"
        className="w-full max-w-[320px] h-auto rounded-xl shadow-sm"
      />
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">由 Gemini AI 生成</span>
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
