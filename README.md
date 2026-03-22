# 天氣穿搭建議 (What to Wear)

根據台灣各地天氣提供視覺化穿搭建議的 Web 應用程式。

本專案是一個**從零開始搭建完整系統的學習專案**，涵蓋從前端到後端的現代 Web 開發技術。

---

## 功能特色

- 自動定位，取得所在地天氣資訊
- 今天 / 明天天氣穿搭建議切換
- **AI 穿搭圖片生成**（OpenAI gpt-image-1），可點擊「換一張」即時重新生成
- 無 OpenAI API Key 時自動回退為 SVG 視覺化穿搭圖
- 根據體感溫度（8 個等級）與降雨機率智慧推薦衣著
- 兩層快取機制（伺服器端 + 客戶端），避免重複呼叫 API

---

## 開始使用

### 環境需求

- Node.js 18+
- npm

### 安裝與啟動

```bash
git clone https://github.com/WilsonShen0420/ma_whattowear.git
cd ma_whattowear
npm install
```

設定環境變數：

```bash
cp .env.local.example .env.local
# 編輯 .env.local，填入你的 API Key
```

或直接建立 `.env.local`：

```
CWA_API_KEY=你的中央氣象署授權碼
OPENAI_API_KEY=你的OpenAI_API_Key
```

> **兩個 API Key 皆為選填：** 無 CWA API Key 時使用 mock 天氣資料，無 OpenAI API Key 時回退為 SVG 穿搭圖。
>
> - CWA API Key 申請：https://opendata.cwa.gov.tw/
> - OpenAI API Key 申請：https://platform.openai.com/

啟動開發伺服器：

```bash
npm run dev
```

開啟 http://localhost:3000

### 建置正式版

```bash
npm run build
npm run start
```

---

## 技術棧

| 類別 | 技術 |
|------|------|
| 框架 | Next.js 15 (App Router) + React 19 |
| 語言 | TypeScript (strict mode) |
| 樣式 | Tailwind CSS v4 |
| 天氣資料 | 中央氣象署 (CWA) 開放資料 API |
| AI 生圖 | OpenAI API (gpt-image-1) |
| 部署 | Zeabur |

---

## 專案結構

```
src/
├── app/
│   ├── api/weather/route.ts       # 天氣 API 端點
│   ├── api/outfit-image/route.ts  # AI 穿搭圖片生成 API
│   ├── layout.tsx                 # Root Layout
│   ├── page.tsx                   # 首頁
│   └── globals.css                # 全域樣式
├── components/                    # UI 元件
│   ├── DateToggle.tsx
│   ├── WeatherCard.tsx
│   ├── OutfitDetails.tsx
│   ├── OutfitImage.tsx
│   └── outfit/                    # SVG 穿搭視覺化元件
└── lib/
    ├── weather/                   # 天氣 API 呼叫與型別
    └── outfit/                    # 穿搭推薦規則與型別
```

---

## 文件

| 文件 | 說明 |
|------|------|
| [docs/architecture.md](docs/architecture.md) | 系統架構、資料流、技術詳解、快取機制、穿搭邏輯 |
| [docs/deployment-zeabur.md](docs/deployment-zeabur.md) | Zeabur 部署步驟與問題排除 |

---

## 學習重點

1. **React 元件設計** — 元件拆分、props 傳遞、狀態管理
2. **TypeScript 型別系統** — interface、type、泛型的實際應用
3. **Next.js 全端開發** — App Router、API Routes、SSR
4. **CSS 框架實戰** — Tailwind CSS 工具類別、響應式設計
5. **第三方 API 整合** — RESTful API 呼叫、資料解析、錯誤處理
6. **AI 圖片生成** — OpenAI API 整合、prompt 設計、圖片快取策略
7. **SVG 程式化繪圖** — 以 React 元件方式繪製 SVG 圖形
8. **瀏覽器 API 運用** — Geolocation API 實作
9. **快取設計** — 伺服器端與客戶端兩層快取架構
10. **雲端部署** — Zeabur 平台部署、環境變數管理
