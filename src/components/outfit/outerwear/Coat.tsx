import React from "react";

export default function Coat({ color = "#4B5563" }: { color?: string }) {
  return (
    <g id="coat" opacity="0.93">
      {/* 左前片（加長） */}
      <path
        d="M112 88 L112 210 Q130 215 148 210 L148 88 Q138 82 128 84Z"
        fill={color}
        stroke="#00000020"
        strokeWidth="1"
      />
      {/* 右前片 */}
      <path
        d="M152 88 L152 210 Q170 215 188 210 L188 88 Q178 82 166 84Z"
        fill={color}
        stroke="#00000020"
        strokeWidth="1"
      />
      {/* 左袖 */}
      <path
        d="M112 88 L94 94 Q88 138 84 184 L100 182 Q104 138 112 110Z"
        fill={color}
        stroke="#00000020"
        strokeWidth="1"
      />
      {/* 右袖 */}
      <path
        d="M188 88 L206 94 Q212 138 216 184 L200 182 Q196 138 188 110Z"
        fill={color}
        stroke="#00000020"
        strokeWidth="1"
      />
      {/* 翻領 */}
      <path
        d="M128 84 L120 100 L140 96 L150 88 L160 96 L180 100 L172 84 Q162 78 150 80 Q138 78 128 84Z"
        fill={color}
        stroke="#00000025"
        strokeWidth="0.8"
      />
      {/* 鈕扣 */}
      <circle cx="150" cy="115" r="3" fill="#374151" stroke="#00000030" strokeWidth="0.5" />
      <circle cx="150" cy="140" r="3" fill="#374151" stroke="#00000030" strokeWidth="0.5" />
      <circle cx="150" cy="165" r="3" fill="#374151" stroke="#00000030" strokeWidth="0.5" />
    </g>
  );
}
