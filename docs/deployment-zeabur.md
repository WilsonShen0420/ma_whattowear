# 部署到 Zeabur 指南

本文件記錄將 What to Wear 專案部署到 [Zeabur](https://zeabur.com/) 的完整步驟，包含實際遇到的問題與排除方法。

---

## 前置準備

- GitHub 帳號，且專案已推送至 GitHub Repository
- Zeabur 帳號（可用 GitHub 登入）
- 中央氣象署 (CWA) API Key（至 https://opendata.cwa.gov.tw/ 申請）

---

## 部署步驟

### 1. 建立 Zeabur 專案

1. 登入 [Zeabur Dashboard](https://dash.zeabur.com/)
2. 點選「**New Project**」建立新專案
3. 選擇部署區域（建議選擇離台灣較近的區域，如 `Asia - Tokyo` 或 `Asia - Hong Kong`）

### 2. 新增服務 (Service)

1. 在專案中點選「**Add Service**」
2. 選擇「**Git — Deploy your source code**」
3. 授權 Zeabur 存取你的 GitHub Repository
4. 選擇 `ma_whattowear` Repository
5. Zeabur 會自動偵測到這是 **Next.js** 專案並進行建置

### 3. 設定環境變數

1. 進入 Service 的「**Variables**」頁籤
2. 新增環境變數：
   - **Key:** `CWA_API_KEY`
   - **Value:** 你的中央氣象署 API 授權碼
3. 儲存後 Zeabur 會自動重新部署

### 4. 設定自訂網域

1. 進入 Service 的「**Networking**」頁籤
2. 可使用 Zeabur 提供的免費子網域（如 `whattowear.zeabur.app`）
3. 或設定自訂網域：
   - 輸入你的網域名稱
   - 到你的 DNS 管理介面設定 CNAME 記錄指向 Zeabur 提供的位址

### 5. 等待部署完成

1. 回到「**Deployments**」頁籤確認建置狀態
2. 建置成功後服務狀態會顯示為 **Running**
3. 點選網域連結即可訪問你的應用

---

## 遇到的問題與排除方法

### 問題一：SSL 憑證錯誤 — `NET::ERR_CERT_AUTHORITY_INVALID`

**現象：**

設定好網域後，瀏覽器出現安全警告頁面：

> 你的連線不是私人連線
>
> 攻擊者可能會嘗試從 whattowear.zeabur.app 竊取你的資訊（例如密碼、郵件或信用卡資訊）。
>
> NET::ERR_CERT_AUTHORITY_INVALID

瀏覽器網址列左方會顯示「不安全」標示。

**原因：**

Zeabur 在新增網域後會透過 **Let's Encrypt** 自動申請 SSL 憑證，但憑證核發需要一些時間。在憑證尚未準備好之前，瀏覽器會因為無法驗證憑證而顯示安全警告。

**解決方式：**

1. **等待 2～5 分鐘**，讓 Zeabur 完成 SSL 憑證的申請與部署
2. 等待後點選瀏覽器的「重新載入」按鈕
3. 如果仍然出現警告：
   - 清除瀏覽器快取（`Ctrl + Shift + Delete`）
   - 或開啟**無痕視窗**重新訪問
4. 若超過 10 分鐘仍有問題：
   - 至 Zeabur Dashboard → Service → Networking，確認 SSL 狀態是否為 **Active**
   - 若使用自訂網域，確認 DNS 的 CNAME 記錄是否正確指向 Zeabur
   - 嘗試移除網域後重新新增

---

## 自動部署

Zeabur 與 GitHub 整合後，每當你將程式碼推送到指定分支（預設為 `main`），Zeabur 會自動觸發重新建置與部署。

---

## OpenAI API Key 管理

本專案使用 OpenAI gpt-image-1 模型生成穿搭圖片，每次生圖皆會產生 API 費用。以下為 API Key 的管理要點：

### API Key 申請

前往 [OpenAI API Keys](https://platform.openai.com/api-keys) 建立新的 API Key：

1. 登入 OpenAI 帳號
2. 點選「**Create new secret key**」
3. 為 Key 命名（如 `whattowear-production`）
4. 複製產生的 Key（僅顯示一次）
5. 將 Key 設定至 Zeabur 環境變數 `OPENAI_API_KEY`

### 設定使用上限

前往 [Billing Overview](https://platform.openai.com/settings/organization/billing/overview) 設定每月花費上限，避免非預期的高額費用：

1. 進入「**Limits**」區段
2. 設定 **Monthly budget**（每月預算上限）
3. 建議同時設定 **Email alert threshold**（費用警示門檻），在接近上限時收到通知

> **建議：** 由於 gpt-image-1 每次生圖費用約 $0.02–$0.08 USD（視解析度而定），初期可先設定較低的月上限（如 $5–$10 USD）觀察實際用量再調整。

### 用量查詢

前往 [Usage Dashboard](https://platform.openai.com/usage) 查看即時與歷史用量：

- 可按日期範圍篩選
- 可查看各模型的呼叫次數與費用明細
- 建議定期檢視，確保用量在預期範圍內

### 無 API Key 時的行為

未設定 `OPENAI_API_KEY` 環境變數時，系統會自動回退為 SVG 穿搭圖，不會呼叫 OpenAI API，因此不會產生任何費用。這在開發環境中特別有用。

---

## 注意事項

- **環境變數安全性：** `CWA_API_KEY` 等機密資訊應透過 Zeabur 的 Variables 功能設定，切勿寫死在程式碼中
- **建置快取：** Zeabur 會快取 `node_modules`，加速後續部署
- **資源限制：** 免費方案有使用量限制，請留意 Zeabur 的計費方式
- **日誌查看：** 可在 Zeabur Dashboard 的「Logs」頁籤查看應用程式的即時日誌，方便除錯
