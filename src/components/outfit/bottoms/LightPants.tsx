import React from "react";

export default function LightPants({ color = "#A0B4C8" }: { color?: string }) {
  return (
    <g id="light-pants">
      {/* 左褲管 */}
      <path
        d="M122 178 L124 326 Q134 330 144 326 L148 178Z"
        fill={color}
        stroke="#00000015"
        strokeWidth="1"
      />
      {/* 右褲管 */}
      <path
        d="M152 178 L156 326 Q166 330 176 326 L178 178Z"
        fill={color}
        stroke="#00000015"
        strokeWidth="1"
      />
      {/* 腰帶 */}
      <rect x="120" y="176" width="60" height="6" rx="2" fill="#6B7280" />
    </g>
  );
}
