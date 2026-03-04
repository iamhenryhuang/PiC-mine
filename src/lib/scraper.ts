import * as cheerio from 'cheerio';
import type { Product } from './db';

const COOLPC_URL = 'https://www.coolpc.com.tw/evaluate.php';

// 從 select 附近的文字或 name 屬性判斷零件類別
const CATEGORY_KEYWORDS: { keywords: string[]; category: string }[] = [
    { keywords: ['cpu', '處理器', 'processor'], category: 'CPU' },
    { keywords: ['主機板', 'mb', 'motherboard', '主板'], category: 'Motherboard' },
    { keywords: ['記憶體', 'ram', 'memory', 'ddr'], category: 'RAM' },
    { keywords: ['顯示卡', 'vga', 'gpu', '顯卡', 'video card'], category: 'GPU' },
    { keywords: ['硬碟', 'ssd', 'nvme', 'hdd', '固態', '儲存'], category: 'Storage' },
    { keywords: ['電源', 'psu', 'power supply', '供應器'], category: 'PSU' },
    { keywords: ['機殼', 'case', 'chassis', '機箱'], category: 'Case' },
    { keywords: ['散熱', 'cooler', 'cooling', 'aio', '水冷', '風冷'], category: 'Cooler' },
    { keywords: ['風扇', 'fan'], category: 'Fan' },
];

function detectCategory(text: string): string | null {
    const t = text.toLowerCase();
    for (const { keywords, category } of CATEGORY_KEYWORDS) {
        if (keywords.some(k => t.includes(k))) return category;
    }
    return null;
}

/**
 * 從 option 文字解析產品名稱與價格
 * 原價屋格式範例：
 *   "Intel Core i9-14900K (24核心)......20,900"
 *   "ASUS ROG STRIX X670E-F ...$18,500"
 *   "Kingston 32GB DDR5-6000 16,900"
 */
function parseOptionText(text: string): { name: string; price: number } | null {
    // 先清除首尾空白
    text = text.trim();

    // 跳過選擇提示
    if (!text || text.includes('請選擇') || text.startsWith('--') || text === '') return null;

    // 嘗試從結尾提取價格（支援逗號分隔的數字）
    // 格式：...XXXX 或 ...$XXXX 或 ....XXXX
    const priceMatch = text.match(/[.。\s,，]+\$?\s*([1-9]\d{2,5}(?:,\d{3})*)\s*$/);
    if (priceMatch) {
        const price = parseInt(priceMatch[1].replace(/,/g, ''));
        const name = text.slice(0, text.length - priceMatch[0].length).replace(/[.。]+$/, '').trim();
        if (price >= 500 && price <= 300000 && name.length > 2) {
            return { name, price };
        }
    }

    // 備用：直接取最後一段純數字（≥ 4 位）
    const fallbackMatch = text.match(/\s+([1-9]\d{3,5})\s*$/);
    if (fallbackMatch) {
        const price = parseInt(fallbackMatch[1]);
        const name = text.slice(0, text.length - fallbackMatch[0].length).trim();
        if (price >= 500 && price <= 300000 && name.length > 2) {
            return { name, price };
        }
    }

    return null;
}

function generateId(category: string, name: string): string {
    return `${category}-${name.slice(0, 20).replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\u4e00-\u9fff-]/g, '')}`;
}

export async function scrapeCoolPC(): Promise<Product[]> {
    console.log('[scraper] 開始爬取原價屋資料...');

    const response = await fetch(COOLPC_URL, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'zh-TW,zh;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
        },
        // 10 秒 timeout
        signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: 無法連線至原價屋`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const products: Product[] = [];
    const now = new Date().toISOString();

    // 方法一：找每個 <select>，從周邊文字判斷類別
    $('select').each((_, selectEl) => {
        const $select = $(selectEl);
        const selectName = ($select.attr('name') || $select.attr('id') || '').toLowerCase();

        // 從 select 的 name/id 或周邊 <td>/<th>/<label> 取得類別
        const nearbyLabel =
            $select.closest('tr').find('td, th').first().text() ||
            $select.prev('label').text() ||
            $select.parent().prev('td, th').text() ||
            selectName;

        const category = detectCategory(nearbyLabel) || detectCategory(selectName);
        if (!category) return;

        $select.find('option').each((_, optEl) => {
            const text = $(optEl).text();
            const parsed = parseOptionText(text);
            if (!parsed) return;

            products.push({
                id: generateId(category, parsed.name),
                category,
                name: parsed.name,
                price: parsed.price,
                scraped_at: now,
            });
        });
    });

    // 方法二（備援）：如果方法一沒抓到什麼，改用列表/表格掃描
    if (products.length < 10) {
        console.log('[scraper] 方法一結果不足，嘗試方法二...');
        $('option').each((_, optEl) => {
            const $opt = $(optEl);
            const $select = $opt.closest('select');

            // 從 select 周邊找類別
            const context =
                $select.closest('tr').text() ||
                $select.parent().text();
            const category = detectCategory(context);
            if (!category) return;

            const text = $opt.text();
            const parsed = parseOptionText(text);
            if (!parsed) return;

            // 避免重複
            if (products.some(p => p.id === generateId(category, parsed.name))) return;

            products.push({
                id: generateId(category, parsed.name),
                category,
                name: parsed.name,
                price: parsed.price,
                scraped_at: now,
            });
        });
    }

    console.log(`[scraper] 爬取完成，共 ${products.length} 筆產品`);
    return products;
}
