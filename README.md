# 天氣穿搭建議 (What to Wear)

根據當天天氣（氣溫、降雨機率）提供視覺化穿搭建議的 Web 應用程式。

## 功能

- 自動定位，取得所在地天氣資訊
- 今天 / 明天天氣穿搭建議切換
- SVG 視覺化人物穿搭圖
- 根據氣溫與降雨機率智慧推薦衣著

## 開始使用

1. 申請中央氣象署 API Key：https://opendata.cwa.gov.tw/
2. 將 API Key 填入 `.env.local`：
   ```
   CWA_API_KEY=你的授權碼
   ```
3. 安裝依賴並啟動：
   ```bash
   npm install
   npm run dev
   ```
4. 開啟 http://localhost:3000
