'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

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

const DecoratedDataBlock = () => {
    const [data, setData] = useState<string[]>([]);

    useEffect(() => {
        const newData = Array.from({ length: 20 }).map(() =>
            `${Math.random().toString(16).slice(2)} :: ${Math.random().toString(36).slice(2)}`
        );
        setData(newData);
    }, []);

    if (data.length === 0) return null;

    return (
        <>
            {data.map((text, i) => (
                <div key={i}>{text}</div>
            ))}
        </>
    );
};

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
        } catch (error: unknown) {
            console.error('Error:', error);
            const errorMessage = error instanceof Error ? error.message : "SYSTEM ERROR: EXECUTION FAILED.";
            setError(errorMessage);
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
        } catch (error: unknown) {
            console.error('Error:', error);
            const errorMessage = error instanceof Error ? error.message : "RETRY FAILED.";
            setError(errorMessage);
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
        <div className="flex h-full w-full max-w-6xl mx-auto liquid-glass rounded-lg overflow-hidden relative shadow-2xl font-mono text-sm md:text-base tech-border prismatic-border bg-white/60 dark:bg-cyber-grid animate-flicker border border-primary/20">

            {/* HUD Corners */}
            <div className="hud-corner hud-corner-tl" />
            <div className="hud-corner hud-corner-tr" />
            <div className="hud-corner hud-corner-bl" />
            <div className="hud-corner hud-corner-br" />

            {/* Scanline Effect */}
            <div className="scanline z-50 pointer-events-none"></div>

            {/* Left System Sidebar (Desktop Only) */}
            <div className="hidden md:flex flex-col w-64 border-r border-primary/20 bg-gray-50/80 dark:bg-black/40 backdrop-blur-md p-4 gap-6 select-none font-mono text-xs z-20">
                <div className="border-b border-primary/20 pb-4">
                    <h3 className="text-cyan-600 dark:text-neon-cyan font-bold tracking-widest mb-1 flex items-center gap-2">
                        <Activity size={14} className="animate-pulse" />
                        SYSTEM_MONITOR
                    </h3>
                    <div className="text-[10px] text-muted-foreground">v2.4.9 CONNECTION_ESTABLISHED</div>
                </div>

                {/* Metrics */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <div className="flex justify-between text-muted-foreground">
                            <span>CPU_CORE_0</span>
                            <span className="text-neon-green">42%</span>
                        </div>
                        <div className="h-1 w-full bg-black/50 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: "30%" }}
                                animate={{ width: ["30%", "45%", "35%", "50%"] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="h-full bg-green-500/80 dark:bg-neon-green/80"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-muted-foreground">
                            <span>MEMORY_ALLOC</span>
                            <span className="text-neon-purple">12.4GB</span>
                        </div>
                        <div className="h-1 w-full bg-black/50 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: "60%" }}
                                animate={{ width: ["60%", "62%", "60%"] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                                className="h-full bg-purple-500/80 dark:bg-neon-purple/80"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-muted-foreground">
                            <span>NETWORK_IO</span>
                            <span className="text-neon-cyan">800Mbps</span>
                        </div>
                        <div className="h-1 w-full bg-black/50 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500/80 dark:bg-neon-cyan/80 w-full animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Decorative Data Block */}
                <div className="flex-1 overflow-hidden relative opacity-50">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10" />
                    <div className="text-[10px] leading-3 text-green-500/50 break-all whitespace-pre-wrap font-mono data-scroll-container">
                        <DecoratedDataBlock />
                    </div>
                </div>

                <div className="border-t border-primary/20 pt-4 text-[10px] text-center text-muted-foreground">
                    AMD_HACKATHON_PROJECT<br />Authorized Access Only
                </div>
            </div>

            {/* Main Interface Content */}
            <div className="flex-1 flex flex-col relative z-10 w-full min-w-0">
                {/* System Status Bar */}
                <div className="flex items-center justify-between px-4 py-2 bg-gray-100/80 dark:bg-black/40 border-b border-primary/20 text-xs text-muted-foreground tracking-widest uppercase select-none backdrop-blur-sm z-30">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-none animate-pulse"></span>
                            SYS_ONLINE
                        </span>
                        <span>TARGET: USER_TERMINAL</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-cyan-600 dark:text-neon-cyan animate-pulse">Encryption: 1024-bit</span>
                        <button onClick={clearHistory} className="hover:text-destructive transition-colors group">
                            [<span className="group-hover:inline hidden">CONFIRM_</span>PURGE]
                        </button>
                    </div>
                </div>

                {/* Terminal Output Stream */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 font-mono text-muted-foreground scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-black/20">

                    {/* Boot Sequence / Init Message */}
                    <AnimatePresence initial={false}>
                        {messages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col gap-1 py-1 group/msg"
                            >
                                <div className="flex gap-3 text-sm font-mono p-2 rounded border border-transparent hover:border-primary/10 hover:bg-white/5 transition-all">
                                    <div className="shrink-0 flex flex-col items-end text-[10px] text-muted-foreground/50 select-none border-r border-primary/10 pr-2 mr-1">
                                        <span>{new Date(message.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}</span>
                                        <span>{message.id.slice(-4)}</span>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={cn(
                                                "text-xs font-bold px-1.5 py-0.5 rounded-sm select-none",
                                                message.role === 'user'
                                                    ? "bg-green-100 text-green-700 border border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
                                                    : "bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-800"
                                            )}>
                                                {message.role === 'user' ? "USR_INPUT" : "AI_CORE"}
                                            </span>
                                        </div>

                                        <div className={cn(
                                            "prose prose-invert max-w-none text-sm leading-relaxed break-words",
                                            message.role === 'user' ? "text-green-800 dark:text-green-100" : "text-purple-800 dark:text-purple-100"
                                        )}>
                                            {message.role === 'user' ? (
                                                <span className="whitespace-pre-wrap">{message.content}</span>
                                            ) : (
                                                <div className="markdown-body">
                                                    <ReactMarkdown
                                                        urlTransform={(url) => {
                                                            if (url.startsWith('http://') || url.startsWith('https://')) {
                                                                return url;
                                                            }
                                                            return '';
                                                        }}
                                                        remarkPlugins={[remarkGfm]}
                                                        components={{
                                                            table: ({ node: _node, ...props }) => <div className="my-4 border border-primary/30 rounded-sm overflow-hidden"><table className="w-full text-xs" {...props} /></div>,
                                                            thead: ({ node: _node, ...props }) => <thead className="bg-primary/10 text-primary" {...props} />,
                                                            th: ({ node: _node, ...props }) => <th className="p-3 text-left border-b border-primary/30 font-bold uppercase tracking-wider" {...props} />,
                                                            td: ({ node: _node, ...props }) => <td className="p-3 border-b border-primary/10 border-r border-primary/10 last:border-r-0" {...props} />,
                                                            a: ({ node: _node, ...props }) => <a className="text-neon-cyan hover:text-white underline underline-offset-4 decoration-1 decoration-neon-cyan/50 hover:decoration-neon-cyan transition-all" {...props} />,
                                                            ul: ({ node: _node, ...props }) => <ul className="pl-0 my-2 space-y-1" {...props} />,
                                                            li: ({ node: _node, ...props }) => <li className="pl-5 relative before:content-['>'] before:absolute before:left-0 before:text-primary before:font-bold" {...props} />,
                                                            code: ({ node: _node, ...props }) => <code className="text-cyan-700 dark:text-neon-cyan bg-gray-200/50 dark:bg-black/40 border border-primary/20 px-1.5 py-0.5 rounded-sm font-mono text-xs" {...props} />,
                                                            pre: ({ node: _node, ...props }) => <pre className="bg-gray-100 dark:bg-black/50 border border-primary/20 rounded-lg p-3 my-2 overflow-x-auto" {...props} />,
                                                            strong: ({ node: _node, ...props }) => <strong className="text-foreground dark:text-white font-bold" {...props} />,
                                                            h1: ({ node: _node, ...props }) => <h1 className="text-xl font-bold text-foreground dark:text-white mt-6 mb-3 border-b border-primary/50 pb-2 flex items-center gap-2 before:content-['#'] before:text-primary" {...props} />,
                                                            h2: ({ node: _node, ...props }) => <h2 className="text-lg font-bold text-foreground dark:text-white mt-5 mb-2 flex items-center gap-2 before:content-['##'] before:text-primary/70" {...props} />,
                                                            h3: ({ node: _node, ...props }) => <h3 className="text-md font-bold text-foreground dark:text-white mt-4 mb-2" {...props} />,
                                                        }}
                                                    >
                                                        {message.content}
                                                    </ReactMarkdown>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-3 px-4 py-2 border-l-2 border-primary/50 bg-primary/5"
                        >
                            <span className="text-primary shrink-0 select-none animate-spin"><RefreshCw size={16} /></span>
                            <span className="text-primary font-mono text-xs tracking-wider">
                                SYSTEM_PROCESSING<span className="animate-pulse">_</span>
                            </span>
                        </motion.div>
                    )}

                    {error && (
                        <div className="flex gap-3 px-4 py-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg">
                            <AlertCircle size={18} />
                            <div className="flex flex-col gap-1">
                                <span className="font-bold text-xs">SYSTEM_ERROR_ENCOUNTERED</span>
                                <span className="text-sm">{error}</span>
                                <button onClick={handleRetry} className="text-xs underline hover:text-white w-fit mt-1">[INITIATE_RETRY_SEQUENCE]</button>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Terminal Input Line */}
                <div className="p-4 bg-gray-50/90 dark:bg-black/60 border-t border-primary/20 backdrop-blur-md z-30">
                    <div className="flex items-center gap-3 bg-white/80 dark:bg-black/40 border border-primary/30 p-2 rounded-md focus-within:border-primary/80 focus-within:bg-white dark:focus-within:bg-black/60 transition-all shadow-sm dark:shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                        <span className="text-neon-green font-bold shrink-0 select-none flex items-center gap-1 text-sm">
                            <ChevronRight size={14} />
                            CMD
                        </span>
                        <form onSubmit={handleSubmit} className="flex-1 flex relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full bg-transparent border-none outline-none text-foreground font-mono text-sm placeholder:text-muted-foreground/30 h-6 p-0 focus:ring-0"
                                placeholder="ENTER_INSTRUCTION..."
                                autoFocus
                                autoComplete="off"
                                disabled={isLoading}
                            />
                        </form>
                        <button
                            type="submit"
                            onClick={(e) => handleSubmit(e)}
                            disabled={isLoading || !input.trim()}
                            className="text-primary hover:text-neon-cyan transition-colors disabled:opacity-20"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                    <div className="flex justify-between mt-2 px-1">
                        <div className="flex gap-4 text-[10px] text-muted-foreground/60 font-mono">
                            <span>MODE: INTERACTIVE</span>
                            <span>LATENCY: 12ms</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground/60 font-mono">
                            SHIFT+ENTER: NEWLINE
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
