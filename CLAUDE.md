# CLAUDE.md

本專案的開發慣例與注意事項，供 Claude Code 參考。

## 專案概述

「天氣穿搭建議 (What to Wear)」— 根據台灣各地天氣資訊提供視覺化穿搭建議的 Web 應用程式。

## 技術棧

- **框架：** Next.js 15 (App Router) + React 19
- **語言：** TypeScript (strict mode)
- **樣式：** Tailwind CSS v4
- **天氣資料：** 中央氣象署 (CWA) 開放資料 API
- **AI 生圖：** OpenAI API (gpt-image-1) — 穿搭圖片生成
- **部署平台：** Zeabur

## 專案結構

```
src/
├── app/
│   ├── api/weather/route.ts       # 天氣 API Route (後端)
│   ├── api/outfit-image/route.ts  # OpenAI AI 生圖 API Route
│   ├── layout.tsx             # Root Layout
│   ├── page.tsx               # 首頁 (主要邏輯)
│   └── globals.css            # 全域樣式
├── components/
│   ├── DateToggle.tsx         # 今天/明天切換
│   ├── WeatherCard.tsx        # 天氣資訊卡片
│   ├── OutfitDetails.tsx      # 穿搭文字說明
│   ├── OutfitImage.tsx        # AI 生成穿搭圖片（含 SVG 回退、換一張功能）
│   └── outfit/                # SVG 穿搭視覺化元件
│       ├── BaseFigure.tsx
│       ├── OutfitFigure.tsx
│       ├── tops/
│       ├── bottoms/
│       ├── outerwear/
│       └── accessories/
└── lib/
    ├── weather/
    │   ├── api.ts             # CWA API 呼叫邏輯
    │   └── types.ts           # 天氣資料型別
    └── outfit/
        ├── rules.ts           # 穿搭推薦規則
        └── types.ts           # 穿搭資料型別
```

## 常用指令

```bash
npm run dev      # 啟動開發伺服器 (http://localhost:3000)
npm run build    # 建置正式版
npm run start    # 啟動正式版伺服器
npm run lint     # ESLint 檢查
```

## 開發注意事項

- 路徑別名使用 `@/*` 對應 `./src/*`
- 環境變數放在 `.env.local`，需設定 `CWA_API_KEY` 和 `OPENAI_API_KEY`
- 天氣 API 有 mock 資料回退機制，無 CWA API Key 時仍可開發
- 穿搭圖片使用 OpenAI gpt-image-1 生成，無 OPENAI_API_KEY 時自動回退為 SVG 穿搭圖
- AI 生成圖片下方有「換一張」按鈕，使用者可即時重新生成不同風格的穿搭圖
- 前端使用瀏覽器 Geolocation API 取得使用者位置，預設回退為台北 (25.033°N, 121.565°E)
- SVG 穿搭元件為純 React 元件，新增衣物樣式時請遵循現有的元件結構
- 穿搭推薦邏輯集中在 `src/lib/outfit/rules.ts`，有 7 個溫度等級
- 網站語系為繁體中文 (zh-Hant)
- 不使用資料庫，純 API 驅動 + 客戶端狀態
