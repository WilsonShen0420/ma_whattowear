import React from "react";

export default function LightJacket({ color = "#D1D5DB" }: { color?: string }) {
  return (
    <g id="light-jacket" opacity="0.92">
      {/* 左前片 */}
      <path
        d="M116 92 L116 180 L148 180 L148 92 Q138 86 130 88Z"
        fill={color}
        stroke="#00000018"
        strokeWidth="1"
      />
      {/* 右前片 */}
      <path
        d="M152 92 L152 180 L184 180 L184 92 Q174 86 166 88Z"
        fill={color}
        stroke="#00000018"
        strokeWidth="1"
      />
      {/* 左袖 */}
      <path
        d="M116 92 L98 98 Q92 138 88 180 L104 178 Q108 138 116 114Z"
        fill={color}
        stroke="#00000018"
        strokeWidth="1"
      />
      {/* 右袖 */}
      <path
        d="M184 92 L202 98 Q208 138 212 180 L196 178 Q192 138 184 114Z"
        fill={color}
        stroke="#00000018"
        strokeWidth="1"
      />
      {/* 拉鏈 */}
      <line x1="150" y1="92" x2="150" y2="180" stroke="#9CA3AF" strokeWidth="1.5" strokeDasharray="3,3" />
      {/* 領子 */}
      <path
        d="M130 88 Q140 82 150 86 Q160 82 170 88 L166 94 Q158 90 150 92 Q142 90 134 94Z"
        fill={color}
        stroke="#00000020"
        strokeWidth="0.8"
      />
    </g>
  );
}
