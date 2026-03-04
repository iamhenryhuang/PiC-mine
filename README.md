# PiC mine

PC building assistant that recommends parts based on budget and usage.

## Features

- Chat interface with GPT-4o-mini
- Budget optimization (85-100% utilization)
- Multi-purpose configuration support
- Compatibility checking
- Markdown responses
- Local conversation history

## Tech

Next.js 16, TypeScript, Tailwind CSS 4, OpenAI API, Framer Motion, React Markdown, Recharts

## Setup

```bash
npm install
```

Create `.env.local`:
```
OPENAI_API_KEY=your_key_here
```

```bash
npm run dev
```

## Structure

```
src/
├── app/api/          # API 路由 (Recommend, Scrape)
├── components/
│   ├── chat/         # 對話介面與監測組件
│   ├── pc-build/     # 零件呈現與分析組件
│   └── ui/           # 通用 UI (Theme, Layout)
└── lib/
    ├── db.ts         # 本地產品資料存取
    ├── scraper.ts    # 原價屋網頁爬蟲
    └── utils.ts      # 共用工具函式 (cn, etc.)
```

## Usage

Enter budget and usage. AI returns parts list with specs, prices, compatibility checks, and upgrade suggestions.

## Limits

5 requests/minute per IP. Max conversation length: 5000 characters.
