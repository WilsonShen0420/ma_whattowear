import React from "react";

export default function TankTop({ color = "#ffffff" }: { color?: string }) {
  return (
    <g id="tank-top">
      <path
        d="M128 94 L128 175 Q140 180 150 180 Q160 180 172 175 L172 94 Q165 88 150 86 Q135 88 128 94Z"
        fill={color}
        stroke="#d1d5db"
        strokeWidth="1"
      />
      {/* 肩帶 */}
      <rect x="133" y="86" width="10" height="10" rx="2" fill={color} stroke="#d1d5db" strokeWidth="0.5" />
      <rect x="157" y="86" width="10" height="10" rx="2" fill={color} stroke="#d1d5db" strokeWidth="0.5" />
    </g>
  );
}
