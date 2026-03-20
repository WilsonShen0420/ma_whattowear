import React from "react";

/** 基底人物 SVG — 皮膚、頭部、四肢輪廓 */
export default function BaseFigure() {
  return (
    <g id="base-figure">
      {/* 頭部 */}
      <ellipse cx="150" cy="52" rx="28" ry="32" fill="#FDDCB5" />
      {/* 頭髮 */}
      <path
        d="M122 45 Q122 20 150 18 Q178 20 178 45 Q175 30 150 28 Q125 30 122 45Z"
        fill="#3D2B1F"
      />
      {/* 眼睛 */}
      <ellipse cx="140" cy="50" rx="3" ry="3.5" fill="#3D2B1F" />
      <ellipse cx="160" cy="50" rx="3" ry="3.5" fill="#3D2B1F" />
      {/* 嘴巴 */}
      <path
        d="M143 62 Q150 68 157 62"
        fill="none"
        stroke="#C4886B"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* 脖子 */}
      <rect x="143" y="82" width="14" height="12" rx="3" fill="#FDDCB5" />
      {/* 左手臂 */}
      <path
        d="M105 110 Q95 140 90 185"
        fill="none"
        stroke="#FDDCB5"
        strokeWidth="14"
        strokeLinecap="round"
      />
      {/* 右手臂 */}
      <path
        d="M195 110 Q205 140 210 185"
        fill="none"
        stroke="#FDDCB5"
        strokeWidth="14"
        strokeLinecap="round"
      />
      {/* 左手掌 */}
      <ellipse cx="88" cy="190" rx="8" ry="9" fill="#FDDCB5" />
      {/* 右手掌 */}
      <ellipse cx="212" cy="190" rx="8" ry="9" fill="#FDDCB5" />
      {/* 左腳 */}
      <rect x="123" y="330" width="22" height="14" rx="7" fill="#8B7355" />
      {/* 右腳 */}
      <rect x="155" y="330" width="22" height="14" rx="7" fill="#8B7355" />
    </g>
  );
}
