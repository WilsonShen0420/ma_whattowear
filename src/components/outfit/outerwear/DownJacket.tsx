import React from "react";

export default function DownJacket({ color = "#1F2937" }: { color?: string }) {
  return (
    <g id="down-jacket" opacity="0.94">
      {/* 左前片（蓬鬆感） */}
      <path
        d="M108 86 L108 200 Q130 206 148 200 L148 86 Q136 80 126 82Z"
        fill={color}
        stroke="#00000020"
        strokeWidth="1"
      />
      {/* 右前片 */}
      <path
        d="M152 86 L152 200 Q170 206 192 200 L192 86 Q180 80 168 82Z"
        fill={color}
        stroke="#00000020"
        strokeWidth="1"
      />
      {/* 左袖（蓬鬆） */}
      <path
        d="M108 86 L88 94 Q80 138 76 186 L96 184 Q100 138 108 108Z"
        fill={color}
        stroke="#00000020"
        strokeWidth="1"
      />
      {/* 右袖 */}
      <path
        d="M192 86 L212 94 Q220 138 224 186 L204 184 Q200 138 192 108Z"
        fill={color}
        stroke="#00000020"
        strokeWidth="1"
      />
      {/* 羽絨分隔線（蓬鬆紋路） */}
      <path d="M110 108 Q150 112 190 108" fill="none" stroke="#ffffff15" strokeWidth="1.5" />
      <path d="M110 128 Q150 132 190 128" fill="none" stroke="#ffffff15" strokeWidth="1.5" />
      <path d="M110 148 Q150 152 190 148" fill="none" stroke="#ffffff15" strokeWidth="1.5" />
      <path d="M110 168 Q150 172 190 168" fill="none" stroke="#ffffff15" strokeWidth="1.5" />
      <path d="M110 188 Q150 192 190 188" fill="none" stroke="#ffffff15" strokeWidth="1.5" />
      {/* 立領（高） */}
      <path
        d="M126 82 Q140 72 150 76 Q160 72 174 82 L170 92 Q160 86 150 88 Q140 86 130 92Z"
        fill={color}
        stroke="#ffffff10"
        strokeWidth="1"
      />
      {/* 拉鏈 */}
      <line x1="150" y1="86" x2="150" y2="200" stroke="#4B5563" strokeWidth="2.5" />
    </g>
  );
}
