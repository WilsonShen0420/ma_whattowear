import React from "react";

export default function Sweater({ color = "#8B7355" }: { color?: string }) {
  return (
    <g id="sweater">
      {/* 軀幹（較厚） */}
      <path
        d="M118 92 L118 180 Q135 186 150 186 Q165 186 182 180 L182 92 Q170 86 150 84 Q130 86 118 92Z"
        fill={color}
        stroke="#00000020"
        strokeWidth="1"
      />
      {/* 左長袖 */}
      <path
        d="M118 92 L100 98 Q93 140 88 182 L104 180 Q108 140 118 116Z"
        fill={color}
        stroke="#00000020"
        strokeWidth="1"
      />
      {/* 右長袖 */}
      <path
        d="M182 92 L200 98 Q207 140 212 182 L196 180 Q192 140 182 116Z"
        fill={color}
        stroke="#00000020"
        strokeWidth="1"
      />
      {/* 高領 */}
      <path
        d="M136 86 Q150 80 164 86 Q164 92 150 94 Q136 92 136 86Z"
        fill={color}
        stroke="#00000015"
        strokeWidth="1"
      />
      {/* 毛衣紋理 */}
      <line x1="125" y1="120" x2="175" y2="120" stroke="#00000012" strokeWidth="1.5" />
      <line x1="125" y1="135" x2="175" y2="135" stroke="#00000012" strokeWidth="1.5" />
      <line x1="125" y1="150" x2="175" y2="150" stroke="#00000012" strokeWidth="1.5" />
      <line x1="125" y1="165" x2="175" y2="165" stroke="#00000012" strokeWidth="1.5" />
    </g>
  );
}
