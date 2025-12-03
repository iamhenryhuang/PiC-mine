# PiC mine

AI 電腦組裝助手，根據預算跟用途推薦零件配置。

## 功能

- 對話式 AI 推薦（GPT-4o-mini）
- 預算充分利用（85-100%）
- 多用途配置平衡（遊戲+深度學習+剪片）
- 自動相容性檢查
- Markdown 格式回應
- 對話記錄保存

## 技術

Next.js 16、TypeScript、Tailwind CSS 4、OpenAI API、Framer Motion

## 安裝

```bash
npm install
```

設定 `.env.local`:
```
OPENAI_API_KEY=your_key_here
```

啟動:
```bash
npm run dev
```

開啟 http://localhost:3000

## 專案結構

```
src/
├── app/
│   ├── api/recommend/      # OpenAI API 路由
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ChatInterface.tsx   # 主聊天介面
└── lib/
    └── utils.ts
```

## 使用

輸入需求，例如：
- "預算 5 萬組遊戲電腦"
- "深度學習工作站，10 萬預算"
- "剪片+遊戲，預算 8 萬"

AI 會推薦完整零件清單：
- 零件規格與價格
- 設計思路與理由
- 相容性檢查
- 升降級建議

## Rate Limiting

每個 IP 每分鐘限制 5 次請求，對話長度上限 5000 字元。

## 指令

```bash
npm run dev      # 開發
npm run build    # 建置
npm start        # 生產
npm run lint     # 檢查
```