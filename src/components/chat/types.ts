export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export interface Product {
    id: string;
    category: string;
    name: string;
    price: number;
    scraped_at: string;
}
