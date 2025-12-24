# PiC mine

PC building assistant that recommends parts based on budget and usage.

## Features

- Chat-based recommendations using GPT-4o-mini
- Budget optimization (85-100% utilization)
- Multi-purpose configuration balancing
- Compatibility checking
- Markdown formatted responses
- Conversation history saved locally

## Tech Stack

Next.js 16, TypeScript, Tailwind CSS 4, OpenAI API, Framer Motion

## Setup

Install dependencies:
```bash
npm install
```

Create `.env.local`:
```
OPENAI_API_KEY=your_key_here
```

Run dev server:
```bash
npm run dev
```

Open http://localhost:3000

## Project Structure

```
src/
├── app/
│   ├── api/recommend/      # API route
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ChatInterface.tsx
└── lib/
    └── utils.ts
```

## Usage

Enter your requirements, for example:
- "Gaming PC with 50k budget"
- "Deep learning workstation, 100k budget"
- "Video editing + gaming, 80k budget"

The AI will recommend a complete parts list with specs, prices, compatibility checks, and upgrade suggestions.

## Rate Limiting

5 requests per minute per IP. Conversation length limit: 5000 characters.

## Commands

```bash
npm run dev      # Development
npm run build    # Build
npm start        # Production
npm run lint     # Lint
```
