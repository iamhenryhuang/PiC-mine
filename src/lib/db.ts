import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'products.json');

export interface Product {
    id: string;
    category: string;
    name: string;
    price: number;
    scraped_at: string;
}

export interface Database {
    products: Product[];
    last_updated: string;
}

function readDb(): Database {
    try {
        if (!fs.existsSync(DB_PATH)) {
            return { products: [], last_updated: '' };
        }
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return { products: [], last_updated: '' };
    }
}

function writeDb(db: Database): void {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

export function getAllProducts(): Product[] {
    return readDb().products;
}

export function getProductsByCategory(category: string): Product[] {
    return readDb().products.filter(p => p.category === category);
}

export function getProductsInBudget(maxPrice: number): Product[] {
    return readDb().products.filter(p => p.price <= maxPrice);
}

export function saveProducts(products: Product[]): void {
    writeDb({ products, last_updated: new Date().toISOString() });
}

export function getLastUpdated(): string {
    return readDb().last_updated;
}

export function getProductCount(): number {
    return readDb().products.length;
}

/**
 * 取得每個分類的產品列表（用於推薦時給 AI 參考）
 * 按照預算過濾，並每類最多回傳 top N 筆（降冪排序讓高價優先）
 */
export function getProductCatalogForBudget(
    totalBudget: number,
    topPerCategory = 20
): Record<string, Product[]> {
    const all = readDb().products;
    const catalog: Record<string, Product[]> = {};

    const categories = [...new Set(all.map(p => p.category))];
    for (const cat of categories) {
        catalog[cat] = all
            .filter(p => p.category === cat && p.price <= totalBudget)
            .sort((a, b) => b.price - a.price)
            .slice(0, topPerCategory);
    }
    return catalog;
}
