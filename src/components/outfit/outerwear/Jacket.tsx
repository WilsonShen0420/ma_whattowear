import React from "react";

export default function Jacket({ color = "#6B7280" }: { color?: string }) {
  return (
    <g id="jacket" opacity="0.93">
      {/* 左前片 */}
      <path
        d="M114 90 L114 184 L148 184 L148 90 Q138 84 128 86Z"
        fill={color}
        stroke="#00000020"
        strokeWidth="1"
      />
      {/* 右前片 */}
      <path
        d="M152 90 L152 184 L186 184 L186 90 Q176 84 166 86Z"
        fill={color}
        stroke="#00000020"
        strokeWidth="1"
      />
      {/* 左袖 */}
      <path
        d="M114 90 L96 96 Q90 138 86 184 L102 182 Q106 138 114 112Z"
        fill={color}
        stroke="#00000020"
        strokeWidth="1"
      />
      {/* 右袖 */}
      <path
        d="M186 90 L204 96 Q210 138 214 184 L198 182 Q194 138 186 112Z"
        fill={color}
        stroke="#00000020"
        strokeWidth="1"
      />
      {/* 拉鏈 */}
      <line x1="150" y1="90" x2="150" y2="184" stroke="#4B5563" strokeWidth="2" />
      {/* 領子（立領） */}
      <path
        d="M128 86 Q140 78 150 82 Q160 78 172 86 L168 94 Q158 88 150 90 Q142 88 132 94Z"
        fill={color}
        stroke="#00000025"
        strokeWidth="0.8"
      />
      {/* 口袋 */}
      <rect x="120" y="140" width="22" height="16" rx="2" fill="none" stroke="#00000020" strokeWidth="1" />
      <rect x="158" y="140" width="22" height="16" rx="2" fill="none" stroke="#00000020" strokeWidth="1" />
    </g>
  );
}
