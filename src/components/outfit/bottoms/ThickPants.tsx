import React from "react";

export default function ThickPants({ color = "#4A5568" }: { color?: string }) {
  return (
    <g id="thick-pants">
      {/* 左褲管（較寬） */}
      <path
        d="M120 178 L122 326 Q134 332 146 326 L148 178Z"
        fill={color}
        stroke="#00000015"
        strokeWidth="1"
      />
      {/* 右褲管 */}
      <path
        d="M152 178 L154 326 Q166 332 178 326 L180 178Z"
        fill={color}
        stroke="#00000015"
        strokeWidth="1"
      />
      {/* 腰帶 */}
      <rect x="118" y="176" width="64" height="6" rx="2" fill="#2D3748" />
      {/* 口袋線 */}
      <line x1="126" y1="190" x2="126" y2="210" stroke="#00000015" strokeWidth="1" />
      <line x1="174" y1="190" x2="174" y2="210" stroke="#00000015" strokeWidth="1" />
    </g>
  );
}
