import React from "react";

export default function Hat({ color = "#F5DEB3" }: { color?: string }) {
  return (
    <g id="hat">
      {/* 帽簷 */}
      <ellipse cx="150" cy="28" rx="40" ry="6" fill={color} stroke="#00000015" strokeWidth="1" />
      {/* 帽冠 */}
      <path
        d="M126 28 Q126 8 150 5 Q174 8 174 28Z"
        fill={color}
        stroke="#00000015"
        strokeWidth="1"
      />
      {/* 帽帶 */}
      <rect x="126" y="22" width="48" height="4" rx="1" fill="#8B7355" opacity="0.6" />
    </g>
  );
}
