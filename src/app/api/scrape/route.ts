import { NextResponse } from 'next/server';
import { scrapeCoolPC } from '@/lib/scraper';
import { saveProducts, getLastUpdated, getProductCount } from '@/lib/db';

// GET：查看目前 DB 狀態
export async function GET() {
    return NextResponse.json({
        product_count: getProductCount(),
        last_updated: getLastUpdated() || '尚未爬取',
    });
}

// POST：觸發爬蟲，更新資料庫
export async function POST() {
    try {
        const products = await scrapeCoolPC();

        if (products.length === 0) {
            return NextResponse.json(
                { error: '爬取失敗：未找到任何產品，請檢查原價屋網站結構' },
                { status: 500 }
            );
        }

        saveProducts(products);

        // 統計各類別數量
        const stats: Record<string, number> = {};
        for (const p of products) {
            stats[p.category] = (stats[p.category] || 0) + 1;
        }

        return NextResponse.json({
            success: true,
            total: products.length,
            by_category: stats,
            last_updated: new Date().toISOString(),
        });
    } catch (error: any) {
        console.error('[scrape API]', error);
        return NextResponse.json(
            { error: error.message || '爬取失敗' },
            { status: 500 }
        );
    }
}
