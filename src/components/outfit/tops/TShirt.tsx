import React from "react";

export default function TShirt({ color = "#87CEEB" }: { color?: string }) {
  return (
    <g id="t-shirt">
      {/* 軀幹 */}
      <path
        d="M120 94 L120 178 Q135 184 150 184 Q165 184 180 178 L180 94 Q170 88 150 86 Q130 88 120 94Z"
        fill={color}
        stroke="#00000020"
        strokeWidth="1"
      />
      {/* 左袖 */}
      <path
        d="M120 94 L102 100 L98 130 L112 128 L120 118Z"
        fill={color}
        stroke="#00000020"
        strokeWidth="1"
      />
      {/* 右袖 */}
      <path
        d="M180 94 L198 100 L202 130 L188 128 L180 118Z"
        fill={color}
        stroke="#00000020"
        strokeWidth="1"
      />
      {/* 領口 */}
      <path
        d="M138 88 Q150 96 162 88"
        fill="none"
        stroke="#00000030"
        strokeWidth="1.5"
      />
    </g>
  );
}
