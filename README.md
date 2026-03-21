# 天氣穿搭建議 (What to Wear)

根據台灣各地天氣（氣溫、降雨機率）提供視覺化穿搭建議的 Web 應用程式。

本專案是一個**從零開始搭建完整系統的學習專案**，涵蓋從前端到後端的現代 Web 開發技術。

---

## 功能特色

- 自動定位，取得所在地天氣資訊
- 今天 / 明天天氣穿搭建議切換
- **AI 穿搭圖片生成**（OpenAI gpt-image-1），可點擊「換一張」即時重新生成不同風格
- 無 OpenAI API Key 時自動回退為 SVG 視覺化人物穿搭圖
- 根據氣溫與降雨機率智慧推薦衣著
- 兩層快取機制（伺服器端 + 客戶端），切換今天/明天時瞬間顯示已生成圖片

---

## 系統架構

```
┌─────────────────────────────────────────────────────────────┐
│                        使用者瀏覽器                          │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │  Geolocation  │  │  React 19    │  │  Tailwind CSS v4  │  │
│  │  API (定位)   │  │  (UI 渲染)   │  │  (樣式)           │  │
│  └──────┬───────┘  └──────┬───────┘  └───────────────────┘  │
│         │                 │                                  │
│         │    ┌────────────┴────────────┐                     │
│         │    │     Next.js 15 頁面      │                     │
│         │    │   (App Router / SSR)     │                     │
│         │    └────────────┬────────────┘                     │
└─────────│────────────────│──────────────────────────────────┘
          │                │ fetch('/api/weather')
          │                │ fetch('/api/outfit-image')
          ▼                ▼
┌─────────────────────────────────────────────────────────────┐
│                   Next.js API Routes (後端)                   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  /api/weather (route.ts)                             │     │
│  │  1. 接收經緯度參數                                    │     │
│  │  2. 比對最近的台灣城市（22 個縣市）                    │     │
│  │  3. 呼叫 CWA API 取得天氣資料                         │     │
│  │  4. 解析並回傳今天/明天天氣預報                        │     │
│  └──────────────────────────────────────────────────────┘     │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  /api/outfit-image (route.ts)                        │     │
│  │  1. 接收天氣與穿搭資訊                                │     │
│  │  2. 檢查伺服器端快取（24h TTL, 上限 50 筆）           │     │
│  │  3. 呼叫 OpenAI API (gpt-image-1) 生成穿搭圖片       │     │
│  │  4. 快取並回傳 base64 圖片                           │     │
│  └──────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                             │ HTTPS Request
                             ▼
         ┌──────────────────────────────────────────┐
         │  中央氣象署 (CWA) 開放資料 API             │
         │  F-C0032-001 (36小時天氣預報)              │
         └──────────────────────────────────────────┘
         ┌──────────────────────────────────────────┐
         │  OpenAI API (gpt-image-1)                │
         │  AI 穿搭圖片生成                          │
         └──────────────────────────────────────────┘
```

### 資料流

```
使用者開啟網頁
  → 瀏覽器 Geolocation API 取得經緯度（失敗時預設台北）
    → 前端呼叫 /api/weather?lat=xx&lng=xx
      → 後端比對最近城市 → 呼叫 CWA API → 回傳天氣資料
        → 前端根據溫度與降雨機率 → 套用穿搭推薦規則
          → 前端呼叫 /api/outfit-image → 後端呼叫 OpenAI API → 回傳 AI 穿搭圖片
            → 渲染天氣卡片 + AI 穿搭圖片（無 API Key 時回退為 SVG 穿搭人物圖）
```

---

## 技術棧詳解

### 前端 (Frontend)

| 技術 | 版本 | 用途 |
|------|------|------|
| **Next.js** | v15.1.0 | React 元框架，提供 SSR、API Route、檔案路由等功能 |
| **React** | v19.0.0 | UI 元件庫，負責畫面渲染與狀態管理 |
| **TypeScript** | v5.7.0 | 靜態型別檢查，提升程式碼品質與開發體驗 |
| **Tailwind CSS** | v4.0.0 | 工具優先的 CSS 框架，用於快速建構響應式 UI |
| **ESLint** | v9 | 程式碼品質檢查工具 |

**前端重點技術說明：**

- **Next.js App Router：** 使用 Next.js 15 的 App Router 架構，以檔案系統為基礎的路由機制。`src/app/` 下的每個資料夾對應一個路由。
- **React Server Components：** Layout 使用 Server Component，頁面使用 `'use client'` 標示為 Client Component 以支援互動功能。
- **Geolocation API：** 使用瀏覽器原生的 `navigator.geolocation.getCurrentPosition()` 取得使用者位置。
- **SVG 元件化：** 所有衣物（上衣、褲子、外套、配件）都是獨立的 React SVG 元件，可組合成完整穿搭人物圖。作為無 OpenAI API Key 時的回退方案。
- **Tailwind CSS v4：** 使用 PostCSS plugin 整合，支援響應式設計與 `md:` 斷點佈局。

### 後端 (Backend)

| 技術 | 用途 |
|------|------|
| **Next.js API Routes** | 無伺服器函式 (Serverless Function)，處理天氣資料與圖片生成請求 |
| **CWA 開放資料 API** | 中央氣象署天氣資料來源 |
| **OpenAI API (gpt-image-1)** | AI 穿搭圖片生成 |
| **ISR 快取** | 30 分鐘回應快取，減少天氣 API 呼叫次數 |

**後端重點技術說明：**

- **API Route (`route.ts`)：** Next.js App Router 的 API 端點，使用 `export async function GET()` 定義 GET 請求處理器。這是全端開發中「後端」的部分，跑在 Node.js 環境。
- **城市座標比對：** 後端內建台灣 22 個縣市的經緯度座標，使用歐幾里得距離計算找出最近的城市。
- **Mock 資料回退：** 未設定 CWA API Key 時自動使用模擬資料，確保開發時不受 API 限制影響。
- **AI 圖片生成：** 透過 OpenAI gpt-image-1 模型，根據天氣與穿搭資訊生成視覺化穿搭圖片。未設定 OpenAI API Key 時，前端自動回退為 SVG 穿搭圖。
- **兩層快取機制：**
  - **伺服器端快取（module-level Map）：** 所有使用者共享，以 `日期-地點-溫度-天氣描述-溫度等級` 為 cache key，24 小時 TTL，上限 50 筆，含並發去重（cache stampede prevention）
  - **客戶端快取（OutfitImage.tsx module-level Map）：** 單一分頁內有效，切換今天/明天時瞬間顯示已生成的圖片
  - **「換一張」按鈕：** 帶 `?skipCache=1` 參數，同時跳過兩層快取強制重新生成
  - **侷限：** 伺服器端快取為 in-memory，process 重啟或重新部署後會清空；不適用於 serverless 或多機部署場景
- **錯誤處理：** API 呼叫失敗時回傳 mock 資料而非錯誤頁面，維持使用者體驗。

### 部署 (Deployment)

| 技術 | 用途 |
|------|------|
| **Zeabur** | 雲端部署平台，支援自動偵測 Next.js 並部署 |
| **Let's Encrypt** | 由 Zeabur 自動申請的 SSL 憑證 |
| **GitHub 整合** | 推送程式碼後自動觸發重新部署 |

詳細部署步驟請參考 [docs/deployment-zeabur.md](docs/deployment-zeabur.md)

---

## 專案結構

```
ma_whattowear/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/
│   │   │   ├── weather/route.ts      # 天氣 API 端點（後端）
│   │   │   └── outfit-image/route.ts # AI 穿搭圖片生成 API（含伺服器端快取）
│   │   ├── layout.tsx                # 根佈局（metadata、字型）
│   │   ├── page.tsx                  # 首頁（定位、狀態管理、主要邏輯）
│   │   └── globals.css               # 全域 CSS（Tailwind 引入）
│   ├── components/                   # React 元件
│   │   ├── DateToggle.tsx            # 今天/明天切換按鈕
│   │   ├── WeatherCard.tsx           # 天氣資訊展示卡片
│   │   ├── OutfitDetails.tsx         # 穿搭建議文字說明
│   │   ├── OutfitImage.tsx           # AI 生成穿搭圖片（含客戶端快取、SVG 回退、換一張功能）
│   │   └── outfit/                   # SVG 穿搭視覺化元件（回退方案）
│   │       ├── BaseFigure.tsx        # 基礎人物輪廓
│   │       ├── OutfitFigure.tsx      # 穿搭組合容器
│   │       ├── tops/                 # 上衣（背心、T恤、長袖、毛衣）
│   │       ├── bottoms/              # 下著（短褲、薄長褲、厚長褲）
│   │       ├── outerwear/            # 外套（薄外套、針織衫、夾克、大衣、羽絨衣）
│   │       └── accessories/          # 配件（帽子、墨鏡、圍巾、毛帽、手套、雨傘）
│   └── lib/                          # 共用邏輯
│       ├── weather/
│       │   ├── api.ts                # CWA API 呼叫與資料解析
│       │   └── types.ts              # 天氣資料 TypeScript 型別
│       └── outfit/
│           ├── rules.ts              # 穿搭推薦規則引擎（7 溫度等級）
│           └── types.ts              # 穿搭資料 TypeScript 型別
├── docs/
│   └── deployment-zeabur.md          # Zeabur 部署指南
├── CLAUDE.md                         # Claude Code 開發慣例
├── package.json                      # 依賴管理
├── tsconfig.json                     # TypeScript 設定
├── next.config.ts                    # Next.js 設定
├── postcss.config.mjs                # PostCSS / Tailwind 設定
└── .env.local                        # 環境變數（CWA_API_KEY, OPENAI_API_KEY）
```

---

## 穿搭推薦邏輯

系統根據溫度分為 7 個等級，並搭配降雨機率決定推薦衣著：

| 溫度等級 | 溫度範圍 | 上衣 | 下著 | 外套 | 配件 |
|---------|---------|------|------|------|------|
| 酷熱 | ≥ 33°C | 背心 | 短褲 | — | 帽子、墨鏡 |
| 炎熱 | 28–32°C | T恤 | 短褲 | — | 帽子、墨鏡 |
| 溫暖 | 23–27°C | T恤 | 薄長褲 | — | — |
| 舒適 | 18–22°C | 長袖 | 薄長褲 | 薄外套 | — |
| 涼爽 | 13–17°C | 長袖 | 厚長褲 | 夾克 | — |
| 寒冷 | 8–12°C | 毛衣 | 厚長褲 | 大衣 | 圍巾 |
| 極寒 | < 8°C | 毛衣 | 厚長褲 | 羽絨衣 | 圍巾、毛帽、手套 |

- 降雨機率 ≥ 40%：建議攜帶雨傘
- 降雨機率 ≥ 70%：強烈建議攜帶雨傘

---

## 開始使用

### 環境需求

- Node.js 18+
- npm

### 安裝與啟動

1. 複製專案：
   ```bash
   git clone https://github.com/WilsonShen0420/ma_whattowear.git
   cd ma_whattowear
   ```

2. 安裝依賴：
   ```bash
   npm install
   ```

3. 設定環境變數：
   ```bash
   cp .env.local.example .env.local
   # 編輯 .env.local，填入你的 API Key
   ```
   或直接建立 `.env.local`：
   ```
   CWA_API_KEY=你的中央氣象署授權碼
   OPENAI_API_KEY=你的OpenAI_API_Key
   ```
   > - CWA API Key 申請：https://opendata.cwa.gov.tw/
   > - OpenAI API Key 申請：https://platform.openai.com/
   > - 兩個 API Key 皆為選填：無 CWA API Key 時使用 mock 天氣資料，無 OpenAI API Key 時回退為 SVG 穿搭圖

4. 啟動開發伺服器：
   ```bash
   npm run dev
   ```

5. 開啟 http://localhost:3000

### 建置正式版

```bash
npm run build
npm run start
```

---

## 學習重點

本專案涵蓋以下從前端到後端的完整開發技能：

1. **React 元件設計** — 元件拆分、props 傳遞、狀態管理
2. **TypeScript 型別系統** — interface、type、泛型的實際應用
3. **Next.js 全端開發** — App Router、API Routes、SSR
4. **CSS 框架實戰** — Tailwind CSS 工具類別、響應式設計
5. **第三方 API 整合** — RESTful API 呼叫、資料解析、錯誤處理
6. **AI 圖片生成** — OpenAI API 整合、prompt 設計、圖片快取策略
7. **SVG 程式化繪圖** — 以 React 元件方式繪製 SVG 圖形
8. **瀏覽器 API 運用** — Geolocation API 實作
9. **快取設計** — 伺服器端與客戶端兩層快取架構、cache stampede prevention
10. **雲端部署** — Zeabur 平台部署、環境變數管理、SSL 憑證
11. **版本控制** — Git / GitHub 工作流程
