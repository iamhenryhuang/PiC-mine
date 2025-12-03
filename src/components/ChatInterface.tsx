'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Cpu, Bot, User, Loader2, RefreshCw, Trash2, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Load messages from localStorage on mount
    useEffect(() => {
        const savedMessages = localStorage.getItem('pic_mine_history');
        if (savedMessages) {
            try {
                setMessages(JSON.parse(savedMessages));
            } catch (e) {
                console.error('Failed to parse history', e);
            }
        } else {
            // Initial welcome message
            setMessages([
                {
                    id: 'welcome',
                    role: 'assistant',
                    content: "你好！我是 PiC mine。我可以協助你打造夢想中的電腦。請告訴我你的預算、用途（例如遊戲、工作等），以及任何特殊偏好！",
                    timestamp: Date.now(),
                },
            ]);
        }
    }, []);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('pic_mine_history', JSON.stringify(messages));
        }
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const clearHistory = () => {
        if (confirm('確定要清除所有對話紀錄嗎？')) {
            const initialMessage: Message = {
                id: 'welcome',
                role: 'assistant',
                content: "你好！我是 PiC mine。我可以協助你打造夢想中的電腦。請告訴我你的預算、用途（例如遊戲、工作等），以及任何特殊偏好！",
                timestamp: Date.now(),
            };
            setMessages([initialMessage]);
            localStorage.removeItem('pic_mine_history');
            setError(null);
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: Date.now(),
        };

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            // Prepare messages for API (exclude id and timestamp)
            const apiMessages = newMessages.map(({ role, content }) => ({ role, content }));

            const response = await fetch('/api/recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: apiMessages }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get response');
            }

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.reply,
                timestamp: Date.now(),
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error: any) {
            console.error('Error:', error);
            setError(error.message || "抱歉，處理您的請求時發生錯誤。");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRetry = async () => {
        if (isLoading || messages.length === 0) return;

        setIsLoading(true);
        setError(null);

        try {
            const apiMessages = messages.map(({ role, content }) => ({ role, content }));

            const response = await fetch('/api/recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: apiMessages }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get response');
            }

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.reply,
                timestamp: Date.now(),
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error: any) {
            console.error('Error:', error);
            setError(error.message || "重試失敗，請稍後再試。");
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="flex flex-col h-[80vh] w-full max-w-4xl mx-auto glass-card rounded-2xl overflow-hidden relative">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/20">
                        <Cpu className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg text-white">PiC mine Agent</h2>
                        <p className="text-xs text-zinc-400">AI 電腦組裝助理</p>
                    </div>
                </div>
                <button
                    onClick={clearHistory}
                    className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                    title="清除對話紀錄"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                <AnimatePresence initial={false}>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "flex flex-col gap-2 max-w-[90%] md:max-w-[80%]",
                                message.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                            )}
                        >
                            <div className={cn(
                                "flex gap-3",
                                message.role === 'user' ? "flex-row-reverse" : ""
                            )}>
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                    message.role === 'user' ? "bg-blue-500/20 text-blue-400" : "bg-primary/20 text-primary"
                                )}>
                                    {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                </div>

                                <div className={cn(
                                    "p-4 rounded-2xl text-sm leading-relaxed overflow-hidden",
                                    message.role === 'user'
                                        ? "bg-blue-600/20 border border-blue-500/20 text-blue-50 rounded-tr-none"
                                        : "bg-zinc-800/50 border border-white/5 text-zinc-100 rounded-tl-none"
                                )}>
                                    {message.role === 'user' ? (
                                        <div className="whitespace-pre-wrap">{message.content}</div>
                                    ) : (
                                        <div className="markdown-body">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    table: ({ node, ...props }) => <div className="overflow-x-auto my-2"><table className="w-full border-collapse border border-zinc-700" {...props} /></div>,
                                                    th: ({ node, ...props }) => <th className="border border-zinc-700 bg-zinc-800/50 p-2 text-left" {...props} />,
                                                    td: ({ node, ...props }) => <td className="border border-zinc-700 p-2" {...props} />,
                                                    ul: ({ node, ...props }) => <ul className="list-disc list-inside my-2" {...props} />,
                                                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside my-2" {...props} />,
                                                    li: ({ node, ...props }) => <li className="my-1" {...props} />,
                                                    p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                    strong: ({ node, ...props }) => <strong className="text-primary font-bold" {...props} />,
                                                }}
                                            >
                                                {message.content}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 mr-auto"
                    >
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                            <Bot size={16} className="text-primary" />
                        </div>
                        <div className="bg-zinc-800/50 border border-white/5 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            <span className="text-xs text-zinc-400">思考中...</span>
                        </div>
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center gap-2 p-4"
                    >
                        <p className="text-red-400 text-sm">{error}</p>
                        <button
                            onClick={handleRetry}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors text-sm"
                        >
                            <RefreshCw size={14} />
                            重試
                        </button>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black/20 border-t border-white/10">
                <form onSubmit={handleSubmit} className="flex gap-2 relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="我想組一台玩 2077 的電腦，預算 4 萬..."
                        className="flex-1 bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-primary hover:bg-primary/90 text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        <Send size={18} />
                    </button>
                </form>
                <p className="text-center text-[10px] text-zinc-600 mt-2">
                    按 Enter 發送
                </p>
            </div>

        </div>
    );
}
