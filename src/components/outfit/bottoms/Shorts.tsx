import React from "react";

export default function Shorts({ color = "#D4C5A9" }: { color?: string }) {
  return (
    <g id="shorts">
      {/* 左褲管 */}
      <path
        d="M122 178 L122 230 Q134 232 142 230 L148 178Z"
        fill={color}
        stroke="#00000015"
        strokeWidth="1"
      />
      {/* 右褲管 */}
      <path
        d="M152 178 L158 230 Q166 232 178 230 L178 178Z"
        fill={color}
        stroke="#00000015"
        strokeWidth="1"
      />
      {/* 腰帶 */}
      <rect x="120" y="176" width="60" height="6" rx="2" fill="#8B7355" />
      {/* 左腿（露出） */}
      <path
        d="M124 232 Q128 270 130 332"
        fill="none"
        stroke="#FDDCB5"
        strokeWidth="16"
        strokeLinecap="round"
      />
      {/* 右腿（露出） */}
      <path
        d="M176 232 Q172 270 170 332"
        fill="none"
        stroke="#FDDCB5"
        strokeWidth="16"
        strokeLinecap="round"
      />
    </g>
  );
}
