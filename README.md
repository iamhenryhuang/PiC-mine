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
├── app/api/recommend/    # API route
├── components/
│   ├── ChatInterface.tsx
│   ├── ComponentCard.tsx
│   ├── BuildVisualizer.tsx
│   └── BuildSummary.tsx
└── lib/
    ├── compatibility.ts
    └── utils.ts
```

## Usage

Enter budget and usage. AI returns parts list with specs, prices, compatibility checks, and upgrade suggestions.

## Limits

5 requests/minute per IP. Max conversation length: 5000 characters.

## Scripts

```bash
npm run dev
npm run build
npm start
npm run lint
npm test
```
