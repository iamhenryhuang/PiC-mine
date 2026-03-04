'use client';

import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { useState, useEffect } from 'react';

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

export function SystemSidebar() {
    return (
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
    );
}
