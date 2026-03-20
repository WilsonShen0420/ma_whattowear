import React from "react";

export default function Gloves({ color = "#2D3748" }: { color?: string }) {
  return (
    <g id="gloves">
      {/* 左手套 */}
      <ellipse cx="88" cy="190" rx="10" ry="11" fill={color} />
      {/* 右手套 */}
      <ellipse cx="212" cy="190" rx="10" ry="11" fill={color} />
    </g>
  );
}
