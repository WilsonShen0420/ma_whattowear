"use client";

import React from "react";

interface Props {
  selected: "today" | "tomorrow";
  onChange: (value: "today" | "tomorrow") => void;
}

export default function DateToggle({ selected, onChange }: Props) {
  return (
    <div className="inline-flex rounded-xl bg-gray-100 p-1">
      <button
        onClick={() => onChange("today")}
        className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
          selected === "today"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        今天
      </button>
      <button
        onClick={() => onChange("tomorrow")}
        className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
          selected === "tomorrow"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        明天
      </button>
    </div>
  );
}
