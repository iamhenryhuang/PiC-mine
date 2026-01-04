import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../src/app/api/recommend/route';

// Mock OpenAI to avoid actual API calls and costs
vi.mock('openai', () => {
    return {
        default: class OpenAI {
            chat = {
                completions: {
                    create: vi.fn().mockResolvedValue({
                        choices: [
                            {
                                message: {
                                    content: 'Mocked response',
                                },
                            },
                        ],
                    }),
                },
            };
        },
    };
});

describe('Security & Rate Limiting API Tests', () => {
    beforeEach(() => {
        // Reset LRU cache if possible, or just mock it. 
        // Since LRU cache is a module-level constant in the route, 
        // we might need to rely on unique IPs or mock the module.
        // For simplicity in this "move" task, we'll use different IPs for different tests
        // or just accept that state persists across tests in the same file execution.
        vi.clearAllMocks();
    });

    it('should return 400 if messages array is missing', async () => {
        const req = new Request('http://localhost/api/recommend', {
            method: 'POST',
            body: JSON.stringify({}),
        });
        const res = await POST(req);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toBe('Messages array is required');
    });

    it('should return 400 if conversation is too long', async () => {
        const longMessage = 'a'.repeat(5001);
        const req = new Request('http://localhost/api/recommend', {
            method: 'POST',
            body: JSON.stringify({
                messages: [{ role: 'user', content: longMessage }],
            }),
        });
        const res = await POST(req);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toBe('Conversation is too long. Please start a new chat.');
    });

    it('should return 400 if message role is invalid', async () => {
        const req = new Request('http://localhost/api/recommend', {
            method: 'POST',
            body: JSON.stringify({
                messages: [{ role: 'hacker', content: 'hello' }],
            }),
        });
        const res = await POST(req);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toBe('Invalid message role');
    });

    it('should return 400 if message content is empty or invalid', async () => {
        const req = new Request('http://localhost/api/recommend', {
            method: 'POST',
            body: JSON.stringify({
                messages: [{ role: 'user', content: '' }],
            }),
        });
        const res = await POST(req);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toBe('Message content must be a non-empty string');
    });

    it('should enforce rate limiting', async () => {
        const ip = '127.0.0.1';
        // Mock headers to simulate IP
        const headers = new Headers();
        headers.set('x-forwarded-for', ip);

        // Make 5 allowed requests
        for (let i = 0; i < 5; i++) {
            const req = new Request('http://localhost/api/recommend', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    messages: [{ role: 'user', content: 'hello' }],
                }),
            });
            const res = await POST(req);
            expect(res.status).toBe(200);
        }

        // The 6th request should fail
        const req = new Request('http://localhost/api/recommend', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                messages: [{ role: 'user', content: 'hello' }],
            }),
        });
        const res = await POST(req);
        expect(res.status).toBe(429);
        const data = await res.json();
        expect(data.error).toBe('Too many requests. Please try again later.');
    });
});
