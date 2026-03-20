import React from "react";

export default function Umbrella({ color = "#3B82F6" }: { color?: string }) {
  return (
    <g id="umbrella" transform="translate(215, 120)">
      {/* 傘柄 */}
      <line x1="0" y1="-10" x2="0" y2="60" stroke="#6B4226" strokeWidth="2.5" strokeLinecap="round" />
      {/* 傘頂 */}
      <path
        d="M-28 -8 Q-24 -35 0 -38 Q24 -35 28 -8Z"
        fill={color}
        stroke="#00000020"
        strokeWidth="1"
      />
      {/* 傘面分隔 */}
      <line x1="0" y1="-38" x2="-14" y2="-8" stroke="#00000015" strokeWidth="0.8" />
      <line x1="0" y1="-38" x2="14" y2="-8" stroke="#00000015" strokeWidth="0.8" />
      {/* 傘柄彎勾 */}
      <path
        d="M0 60 Q0 68 -6 68 Q-12 68 -12 62"
        fill="none"
        stroke="#6B4226"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </g>
  );
}
