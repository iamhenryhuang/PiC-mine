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
        const forwardedFor = req.headers.get('x-forwarded-for');
        const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';
        const currentUsage = rateLimit.get(ip) || 0;

        if (currentUsage >= 5) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }
        rateLimit.set(ip, currentUsage + 1);

        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
        }

        // 2. Input Validation (Cost Control)
        // Check total length of all user messages roughly
        const totalLength = messages.reduce((acc: number, msg: any) => acc + (msg.content?.length || 0), 0);
        if (totalLength > 5000) { // Increased limit for history
            return NextResponse.json(
                { error: 'Conversation is too long. Please start a new chat.' },
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

            **重要預算原則：**
            - 當使用者提供預算時，你必須充分利用預算，推薦的總價應該達到預算的 85-100%
            - 例如：預算 10 萬，你應該推薦總價約 8.5-10 萬的配置，而不是 2-3 萬的入門配置
            - 在預算範圍內，選擇性能最佳、性價比最高的零件組合
            - 如果預算充足，優先選擇高階零件以獲得最佳性能
          
            指導方針：
            1. 態度要樂於助人、充滿熱情且專業。
            2. 如果使用者的需求模糊（例如「我想要一台電腦」），請詢問預算和用途。
            3. 提供推薦時，請清楚列出零件並附上預估價格（以台幣 TWD 為主，或註明幣別）。
            4. **必須計算並顯示總價，確保總價接近使用者提供的預算上限。**
            5. 解釋為什麼選擇這些零件（例如「我選擇 RTX 4070 是因為它能完美支援 1440p 遊戲」）。
            6. 使用 Markdown 格式化回應（粗體顯示零件名稱，使用清單）。
            7. 在推薦前，務必在腦中檢查相容性。
            8. **如果預算允許，優先推薦高階零件以獲得最佳使用體驗。**
            
            如果使用者提供了預算和用途，請生成完整的零件清單，包含：
            - CPU
            - GPU (顯示卡)
            - Motherboard (主機板)
            - RAM (記憶體)
            - Storage (儲存裝置 SSD/HDD)
            - Power Supply (電源供應器)
            - Case (機殼)
            - Cooler (散熱器，如果需要)
            - **總價（必須接近預算上限）**
          
            保持語氣高級且專業，並使用繁體中文回答。`
                },
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 4000, // 4. Cost Control: Limit response size (Increased for full builds)
        });

        const reply = completion.choices[0].message.content;

        return NextResponse.json({ reply });
    } catch (error: any) {
        console.error('OpenAI API Error:', error);
        const errorMessage = error.error?.message || error.message || 'Internal Server Error';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
