import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { LRUCache } from 'lru-cache';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Rate limiting: 5 requests per minute per IP
const rateLimit = new LRUCache<string, number>({
    max: 500,
    ttl: 60 * 1000, // 1 minute
});

export async function POST(req: Request) {
    try {
        // 1. Rate Limiting
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        const currentUsage = rateLimit.get(ip) || 0;

        if (currentUsage >= 5) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }
        rateLimit.set(ip, currentUsage + 1);

        const { message } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // 2. Input Validation (Cost Control)
        if (message.length > 1000) {
            return NextResponse.json(
                { error: 'Message is too long. Please keep it under 1000 characters.' },
                { status: 400 }
            );
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // 3. Cost Control: Switch to cheaper model
            messages: [
                {
                    role: "system",
                    content: `你是 PiC mine，一位專業的 AI 電腦組裝代理人。
          你的目標是根據使用者的需求、預算和偏好，協助他們選擇電腦零件。
          
          指導方針：
          1. 態度要樂於助人、充滿熱情且專業。
          2. 如果使用者的需求模糊（例如「我想要一台電腦」），請詢問預算和用途。
          3. 提供推薦時，請清楚列出零件並附上預估價格（以台幣 TWD 為主，或註明幣別）。
          4. 解釋為什麼選擇這些零件（例如「我選擇 RTX 4070 是因為它能完美支援 1440p 遊戲」）。
          5. 使用 Markdown 格式化回應（粗體顯示零件名稱，使用清單）。
          6. 在推薦前，務必在腦中檢查相容性。
          
          如果使用者提供了預算和用途，請生成完整的零件清單，包含：
          - CPU
          - GPU (顯示卡)
          - Motherboard (主機板)
          - RAM (記憶體)
          - Storage (儲存裝置 SSD/HDD)
          - Power Supply (電源供應器)
          - Case (機殼)
          - Cooler (散熱器，如果需要)
          
          保持語氣高級且專業，並使用繁體中文回答。`
                },
                {
                    role: "user",
                    content: message
                }
            ],
            temperature: 0.7,
            max_tokens: 1000, // 4. Cost Control: Limit response size
        });

        const reply = completion.choices[0].message.content;

        return NextResponse.json({ reply });
    } catch (error) {
        console.error('OpenAI API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
