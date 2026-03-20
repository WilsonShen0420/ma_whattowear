import React from "react";

export default function Cardigan({ color = "#9CA3AF" }: { color?: string }) {
  return (
    <g id="cardigan" opacity="0.92">
      {/* 左前片 */}
      <path
        d="M116 94 L116 182 L147 182 L147 94 Q138 88 130 90Z"
        fill={color}
        stroke="#00000015"
        strokeWidth="1"
      />
      {/* 右前片 */}
      <path
        d="M153 94 L153 182 L184 182 L184 94 Q174 88 166 90Z"
        fill={color}
        stroke="#00000015"
        strokeWidth="1"
      />
      {/* 左袖 */}
      <path
        d="M116 94 L100 100 Q94 140 90 182 L106 180 Q108 140 116 116Z"
        fill={color}
        stroke="#00000015"
        strokeWidth="1"
      />
      {/* 右袖 */}
      <path
        d="M184 94 L200 100 Q206 140 210 182 L194 180 Q192 140 184 116Z"
        fill={color}
        stroke="#00000015"
        strokeWidth="1"
      />
      {/* 鈕扣 */}
      <circle cx="150" cy="110" r="2.5" fill="#6B7280" />
      <circle cx="150" cy="130" r="2.5" fill="#6B7280" />
      <circle cx="150" cy="150" r="2.5" fill="#6B7280" />
      {/* 紋理 */}
      <line x1="120" y1="120" x2="146" y2="120" stroke="#00000008" strokeWidth="1" />
      <line x1="154" y1="120" x2="180" y2="120" stroke="#00000008" strokeWidth="1" />
      <line x1="120" y1="140" x2="146" y2="140" stroke="#00000008" strokeWidth="1" />
      <line x1="154" y1="140" x2="180" y2="140" stroke="#00000008" strokeWidth="1" />
    </g>
  );
}
