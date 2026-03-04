import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getProductCatalogForBudget, getProductCount } from '@/lib/db';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/** 從使用者最後一則訊息中試著解析預算（TWD） */
function extractBudget(messages: { role: string; content: string }[]): number | null {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content || '';

    // 支援：20萬、200000、200,000、20w、NT$200000
    const patterns = [
        /(\d+(?:\.\d+)?)\s*萬/,   // 20萬 → 200000
        /(\d{5,6})/,               // 200000
        /(\d{3}),(\d{3})/,         // 200,000
    ];

    for (const pat of patterns) {
        const m = lastUserMsg.match(pat);
        if (m) {
            if (pat.source.includes('萬')) {
                return Math.round(parseFloat(m[1]) * 10000);
            }
            if (pat.source.includes(',')) {
                return parseInt(m[1] + m[2]);
            }
            return parseInt(m[1]);
        }
    }
    return null;
}

/** 將 DB 產品目錄格式化為 AI 可讀的文字 */
function formatCatalogForAI(catalog: Record<string, { name: string; price: number }[]>): string {
    const lines: string[] = ['以下是原價屋目前的可用產品（已按預算過濾，請從中選擇最合適的組合）：\n'];
    for (const [category, products] of Object.entries(catalog)) {
        if (products.length === 0) continue;
        lines.push(`### ${category}`);
        for (const p of products) {
            lines.push(`- ${p.name}：$${p.price.toLocaleString()}`);
        }
        lines.push('');
    }
    return lines.join('\n');
}

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
        }

        // 嘗試從 DB 取得真實產品資料
        const budget = extractBudget(messages);
        const hasRealData = getProductCount() > 0;

        let productContext = '';
        if (hasRealData && budget) {
            const catalog = getProductCatalogForBudget(budget);
            productContext = formatCatalogForAI(catalog);
        } else if (hasRealData && !budget) {
            // 有 DB 但沒有解析到預算，給一個預設範圍
            const catalog = getProductCatalogForBudget(300000, 10);
            productContext = formatCatalogForAI(catalog);
        }

        const systemPrompt = `你是 PiC mine，一位專業的 AI 電腦組裝顧問與架構工程師。
你的目標是根據「使用者的多種用途 + 預算 + 偏好」，在預算上限內找出「整體效能與性價比最佳」的電腦配置。

${productContext
                ? `【重要】你手上有來自原價屋的真實產品與即時價格資料。
請優先從下方產品清單中挑選零件，並直接使用真實的產品名稱與價格。
若某分類沒有合適產品，才可自行補充建議。

${productContext}`
                : `【注意】目前尚未爬取原價屋資料，請先呼叫 /api/scrape 更新產品資料庫。
暫時以一般知識給出建議，價格為估算值。`
            }

────────────────────
【核心任務】
────────────────────
1. 分析使用者的用途（深度學習、遊戲、剪輯、開發等）
2. 在預算上限內選出最佳零件組合（從上方產品清單選擇）
3. 總價必須落在預算的 85%～100% 之間
4. 確認硬體相容性（CPU 插槽、電源瓦數、散熱需求）

────────────────────
【用途優先順序】
────────────────────
- 深度學習/AI 訓練：GPU（VRAM≥16GB）> RAM（≥32GB）> CPU > PSU（≥850W）
- 遊戲：GPU > CPU > Cooler > Storage > RAM
- 剪輯/3D：CPU（≥12核）> RAM（≥32GB）> GPU > Storage
- 開發工程：RAM（≥16GB）> CPU > Storage > GPU

────────────────────
【回應格式（繁體中文，Markdown）】
────────────────────
## 🖥️ 推薦配置（用途：XXX）

### 🔧 零件清單
- **CPU**：產品名稱 — $價格
- **GPU**：產品名稱 — $價格
- **Motherboard**：產品名稱 — $價格
- **RAM**：產品名稱 — $價格
- **Storage**：產品名稱 — $價格
- **PSU**：產品名稱 — $價格
- **Case**：產品名稱 — $價格
- **Cooler**：產品名稱 — $價格（如需要）

### 💰 總價
| 零件 | 型號 | 價格 |
|------|------|------|
| ... | ... | $... |
| **合計** | | **$XXX** |

### 📈 選擇理由
### ⚠️ 相容性確認
### 🔄 升降級建議`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages,
            ],
            temperature: 0.7,
            max_tokens: 4000,
        });

        const reply = completion.choices[0].message.content;
        return NextResponse.json({ reply });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
