import React from "react";

export default function LongSleeve({ color = "#B8C9E1" }: { color?: string }) {
  return (
    <g id="long-sleeve">
      {/* 軀幹 */}
      <path
        d="M120 94 L120 178 Q135 184 150 184 Q165 184 180 178 L180 94 Q170 88 150 86 Q130 88 120 94Z"
        fill={color}
        stroke="#00000020"
        strokeWidth="1"
      />
      {/* 左長袖 */}
      <path
        d="M120 94 L102 100 Q96 140 92 180 L106 178 Q110 140 120 118Z"
        fill={color}
        stroke="#00000020"
        strokeWidth="1"
      />
      {/* 右長袖 */}
      <path
        d="M180 94 L198 100 Q204 140 208 180 L194 178 Q190 140 180 118Z"
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
