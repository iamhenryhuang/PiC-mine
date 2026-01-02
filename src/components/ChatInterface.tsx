'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Terminal, Activity, ChevronRight, AlertCircle, Command, RefreshCw } from 'lucide-react';
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
            // Initial SYSTEM message
            setMessages([
                {
                    id: 'init',
                    role: 'assistant',
                    content: "> SYSTEM INITIALIZED.\n> AWAITING CONFIGURATION PARAMETERS.\n> PLEASE INPUT BUDGET AND USAGE SCENARIO.",
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
        if (confirm('PURGE SYSTEM LOGS?')) {
            const initialMessage: Message = {
                id: 'init',
                role: 'assistant',
                content: "> SYSTEM LOGS PURGED.\n> READY FOR NEW SESSION.",
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
                throw new Error(data.error || 'Connection Failed');
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
            setError(error.message || "SYSTEM ERROR: EXECUTION FAILED.");
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
                throw new Error(data.error || 'Connection Failed');
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
            setError(error.message || "RETRY FAILED.");
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
        <div className="flex flex-col h-full w-full max-w-5xl mx-auto liquid-glass rounded-sm overflow-hidden relative shadow-2xl ring-1 ring-white/10 font-mono text-sm md:text-base border-x border-white/5">

            {/* Scanline Effect */}
            <div className="scanline"></div>

            {/* System Status Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-white/10 text-xs text-primary/60 tracking-widest uppercase select-none">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        SYS_ONLINE
                    </span>
                    <span>MEM: 64TB</span>
                    <span>CPU: ODYSSEY_X</span>
                </div>
                <div className="flex items-center gap-4">
                    <span>NET: SECURE</span>
                    <button onClick={clearHistory} className="hover:text-red-400 transition-colors">[PURGE_LOGS]</button>
                </div>
            </div>

            {/* Terminal Output Stream */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-1 font-mono text-zinc-300 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">

                {/* Boot Sequence / Init Message */}
                <div className="mb-6 text-zinc-500 text-xs">
                    <p>&gt; BOOT_SEQUENCE_INITIATED...</p>
                    <p>&gt; LOADING_MODULES: [CORE] [PC_BUILDER] [MARKET_ANALYSIS]... OK</p>
                    <p>&gt; ESTABLISHING_UPLINK... CONNECTED</p>
                </div>

                <AnimatePresence initial={false}>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col gap-1 py-1"
                        >
                            <div className="flex gap-3">
                                <span className={cn(
                                    "shrink-0 font-bold select-none",
                                    message.role === 'user' ? "text-green-400" : "text-purple-400"
                                )}>
                                    {message.role === 'user' ? "root@user:~$" : "[SYSTEM_CORE]:"}
                                </span>

                                <div className={cn(
                                    "flex-1 whitespace-pre-wrap leading-relaxed",
                                    message.role === 'user' ? "text-white font-bold" : "text-zinc-300"
                                )}>
                                    {message.role === 'user' ? (
                                        message.content
                                    ) : (
                                        <div className="markdown-body">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    table: ({ node, ...props }) => <div className="my-2 border border-white/10"><table className="w-full text-xs" {...props} /></div>,
                                                    thead: ({ node, ...props }) => <thead className="bg-white/5 text-primary/80" {...props} />,
                                                    th: ({ node, ...props }) => <th className="p-2 text-left border-b border-white/10" {...props} />,
                                                    td: ({ node, ...props }) => <td className="p-2 border-b border-white/5 border-r last:border-r-0 border-white/5" {...props} />,
                                                    a: ({ node, ...props }) => <a className="text-cyan-400 underline underline-offset-4 decoration-1 decoration-cyan-400/50 hover:decoration-cyan-400" {...props} />,
                                                    ul: ({ node, ...props }) => <ul className="pl-0 my-1 space-y-0.5" {...props} />,
                                                    li: ({ node, ...props }) => <li className="pl-4 relative before:content-['>'] before:absolute before:left-0 before:text-zinc-600" {...props} />,
                                                    code: ({ node, ...props }) => <code className="text-yellow-500 bg-transparent px-1" {...props} />,
                                                    strong: ({ node, ...props }) => <strong className="text-white font-bold" {...props} />,
                                                    h1: ({ node, ...props }) => <span className="block text-lg font-bold text-white mt-4 mb-2 border-b border-white/10 pb-1" {...props} />,
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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-3 text-zinc-400 animate-pulse"
                    >
                        <span className="text-purple-400 shrink-0 select-none">[SYSTEM_CORE]:</span>
                        <span>PROCESSING_DATA... <span className="inline-block w-2 h-4 bg-purple-400/50 align-middle"></span></span>
                    </motion.div>
                )}

                {error && (
                    <div className="text-red-400 flex gap-3">
                        <span className="shrink-0">[ERROR]:</span>
                        <span>{error}</span>
                        <button onClick={handleRetry} className="underline hover:text-white">[RETRY_COMMAND]</button>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Terminal Input Line */}
            <div className="p-3 bg-black/60 border-t border-white/10 backdrop-blur-md sticky bottom-0 z-20 flex items-center gap-2">
                <span className="text-green-400 font-bold shrink-0 select-none">root@user:~$</span>
                <form onSubmit={handleSubmit} className="flex-1 flex relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-transparent border-none outline-none text-white font-mono placeholder:text-zinc-700 h-6 p-0 focus:ring-0"
                        placeholder="INPUT_COMMAND..."
                        autoFocus
                        autoComplete="off"
                        disabled={isLoading}
                    />
                    {/* Blinking Cursor Block */}
                    {!input && !isLoading && <span className="absolute left-0 top-0 h-full w-2.5 bg-green-500/50 animate-pulse pointer-events-none"></span>}
                </form>
                <button
                    type="submit"
                    onClick={(e) => handleSubmit(e)}
                    disabled={isLoading || !input.trim()}
                    className="text-white/20 hover:text-green-400 transition-colors disabled:opacity-0"
                >
                    <Send size={16} />
                </button>
            </div>
        </div>
    );
}
