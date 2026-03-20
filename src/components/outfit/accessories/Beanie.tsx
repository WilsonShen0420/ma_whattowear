import React from "react";

export default function Beanie({ color = "#4A5568" }: { color?: string }) {
  return (
    <g id="beanie">
      {/* 毛帽主體 */}
      <path
        d="M124 38 Q124 8 150 4 Q176 8 176 38Z"
        fill={color}
        stroke="#00000015"
        strokeWidth="1"
      />
      {/* 帽緣（翻邊） */}
      <path
        d="M122 38 Q122 44 150 46 Q178 44 178 38 Q178 32 150 34 Q122 32 122 38Z"
        fill={color}
        stroke="#00000020"
        strokeWidth="0.8"
      />
      {/* 毛球 */}
      <circle cx="150" cy="4" r="5" fill={color} stroke="#00000015" strokeWidth="0.5" />
      {/* 紋理 */}
      <line x1="132" y1="15" x2="132" y2="34" stroke="#ffffff12" strokeWidth="1" />
      <line x1="142" y1="10" x2="142" y2="34" stroke="#ffffff12" strokeWidth="1" />
      <line x1="150" y1="8" x2="150" y2="34" stroke="#ffffff12" strokeWidth="1" />
      <line x1="158" y1="10" x2="158" y2="34" stroke="#ffffff12" strokeWidth="1" />
      <line x1="168" y1="15" x2="168" y2="34" stroke="#ffffff12" strokeWidth="1" />
    </g>
  );
}
