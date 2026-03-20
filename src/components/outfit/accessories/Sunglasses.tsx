import React from "react";

export default function Sunglasses({ color = "#1a1a1a" }: { color?: string }) {
  return (
    <g id="sunglasses">
      {/* 鏡橋 */}
      <line x1="143" y1="47" x2="157" y2="47" stroke={color} strokeWidth="1.5" />
      {/* 左鏡片 */}
      <ellipse cx="137" cy="48" rx="8" ry="6" fill={color} opacity="0.85" />
      {/* 右鏡片 */}
      <ellipse cx="163" cy="48" rx="8" ry="6" fill={color} opacity="0.85" />
      {/* 左鏡腳 */}
      <line x1="129" y1="47" x2="122" y2="45" stroke={color} strokeWidth="1.2" />
      {/* 右鏡腳 */}
      <line x1="171" y1="47" x2="178" y2="45" stroke={color} strokeWidth="1.2" />
    </g>
  );
}
