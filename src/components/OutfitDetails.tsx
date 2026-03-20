"use client";

import React from "react";
import { OutfitRecommendation } from "@/lib/outfit/types";

interface Props {
  outfit: OutfitRecommendation;
}

const CATEGORY_ICON: Record<string, string> = {
  top: "👕",
  bottom: "👖",
  outerwear: "🧥",
  accessory: "🎒",
  rainGear: "☂️",
};

export default function OutfitDetails({ outfit }: Props) {
  const items = [
    outfit.top,
    outfit.bottom,
    ...(outfit.outerwear ? [outfit.outerwear] : []),
    ...outfit.accessories,
    ...(outfit.rainGear ? [outfit.rainGear] : []),
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 space-y-4">
      <h3 className="text-base font-semibold text-gray-800">建議穿搭</h3>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id + item.category}
            className="flex items-center gap-3 py-1.5"
          >
            <span className="text-lg">
              {CATEGORY_ICON[item.category] ?? "👔"}
            </span>
            <span className="text-sm text-gray-700">{item.name}</span>
            <span
              className="ml-auto w-4 h-4 rounded-full border border-gray-200"
              style={{ backgroundColor: item.color }}
            />
          </div>
        ))}
      </div>

      {/* 摘要 */}
      <div className="pt-3 border-t border-gray-100">
        <p className="text-sm text-gray-600 leading-relaxed">
          {outfit.summary}
        </p>
      </div>
    </div>
  );
}
