# PiC mine - AI 電腦組裝助手

PiC mine 是一個由 AI 驅動的智慧電腦零件挑選助理，協助您根據預算、用途和偏好，打造夢想中的電腦配置。

## 功能特色

- **AI 智慧推薦** - 使用 OpenAI GPT-4o-mini 模型，提供專業的電腦零件推薦
- **預算最佳化** - 充分利用預算，推薦最接近預算上限的高性能配置
- **相容性檢查** - 自動檢查零件之間的相容性
- **對話式介面** - 透過自然對話了解您的需求
- **響應式設計** - 完美支援桌面和行動裝置
- **對話記錄** - 自動儲存對話歷史，方便隨時查看

## 技術棧

- **框架**: [Next.js 16](https://nextjs.org) (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS 4
- **動畫**: Framer Motion
- **AI 模型**: OpenAI GPT-4o-mini
- **圖示**: Lucide React

## 開始使用

### 前置需求

- Node.js 18+ 
- npm, yarn, pnpm 或 bun

### 安裝步驟

1. 複製專案
```bash
git clone <your-repo-url>
cd amd_hackson
```

2. 安裝依賴套件
```bash
npm install
# 或
yarn install
# 或
pnpm install
```

3. 設定環境變數

在專案根目錄建立 `.env.local` 檔案：

```env
OPENAI_API_KEY=your_openai_api_key_here
```

4. 啟動開發伺服器

```bash
npm run dev

```

5. 開啟瀏覽器

訪問 [http://localhost:3000](http://localhost:3000) 查看結果。

## 專案結構

```
amd_hackson/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API 路由
│   │   │   └── recommend/ # 推薦 API
│   │   ├── layout.tsx    # 根佈局
│   │   ├── page.tsx      # 首頁
│   │   └── globals.css   # 全域樣式
│   ├── components/       # React 元件
│   │   └── ChatInterface.tsx # 聊天介面
│   └── lib/             # 工具函數
│       └── utils.ts
├── public/              # 靜態資源
├── .env.local          # 環境變數（不提交到 Git）
└── package.json
```

## 使用方式

1. 在聊天框中輸入您的需求，例如：
   - "我想組一台遊戲電腦，預算 5 萬"
   - "我需要一台工作用電腦，主要用於程式開發"
   - "我想組一台影音剪輯電腦，預算 8 萬"

2. AI 會根據您的需求推薦完整的零件清單，包含：
   - CPU（處理器）
   - GPU（顯示卡）
   - Motherboard（主機板）
   - RAM（記憶體）
   - Storage（儲存裝置）
   - Power Supply（電源供應器）
   - Case（機殼）
   - Cooler（散熱器）

3. 對話記錄會自動儲存在瀏覽器的 localStorage 中
## 部署

### Vercel 部署（推薦）

最簡單的方式是使用 [Vercel Platform](https://vercel.com/new)：

1. 將專案推送到 GitHub
2. 在 Vercel 中匯入專案
3. 設定環境變數 `OPENAI_API_KEY`
4. 部署完成！

詳細說明請參考 [Next.js 部署文件](https://nextjs.org/docs/app/building-your-application/deploying)。

## 開發指令

```bash
# 開發模式
npm run dev

# 建置生產版本
npm run build

# 啟動生產伺服器
npm start

# 執行 ESLint
npm run lint
```

## 安全性

- `.env.local` 檔案已加入 `.gitignore`，不會被提交到版本控制
- API 路由包含速率限制（每分鐘 5 次請求）
- 輸入驗證和錯誤處理