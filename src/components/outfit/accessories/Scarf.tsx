import React from "react";

export default function Scarf({ color = "#C53030" }: { color?: string }) {
  return (
    <g id="scarf">
      {/* 圍巾繞脖子 */}
      <path
        d="M132 86 Q130 90 130 94 Q140 100 150 100 Q160 100 170 94 Q170 90 168 86"
        fill={color}
        stroke="#00000020"
        strokeWidth="0.8"
      />
      {/* 垂下的部分 */}
      <path
        d="M140 98 Q138 120 142 145 L148 145 Q146 120 146 100"
        fill={color}
        stroke="#00000015"
        strokeWidth="0.5"
      />
      {/* 流蘇 */}
      <line x1="142" y1="145" x2="140" y2="152" stroke={color} strokeWidth="1" />
      <line x1="144" y1="145" x2="143" y2="152" stroke={color} strokeWidth="1" />
      <line x1="146" y1="145" x2="145" y2="152" stroke={color} strokeWidth="1" />
      <line x1="148" y1="145" x2="148" y2="152" stroke={color} strokeWidth="1" />
    </g>
  );
}
