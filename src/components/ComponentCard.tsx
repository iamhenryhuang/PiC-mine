import React from 'react';
import { Cpu, CircuitBoard, HardDrive, MemoryStick, Wind, Box, Zap, MonitorPlay, HelpCircle } from 'lucide-react';

interface ComponentCardProps {
    type: string;
    name: string;
    price: number;
    reason: string;
}

const getIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('cpu') || t.includes('processor')) return <Cpu className="w-6 h-6 text-red-400" />;
    if (t.includes('gpu') || t.includes('graphics')) return <MonitorPlay className="w-6 h-6 text-cyan-400" />;
    if (t.includes('motherboard') || t.includes('mainboard')) return <CircuitBoard className="w-6 h-6 text-purple-400" />;
    if (t.includes('ram') || t.includes('memory')) return <MemoryStick className="w-6 h-6 text-green-400" />;
    if (t.includes('storage') || t.includes('ssd') || t.includes('hdd')) return <HardDrive className="w-6 h-6 text-yellow-400" />;
    if (t.includes('psu') || t.includes('power')) return <Zap className="w-6 h-6 text-orange-400" />;
    if (t.includes('case') || t.includes('chassis')) return <Box className="w-6 h-6 text-blue-300" />;
    if (t.includes('cooler') || t.includes('fan')) return <Wind className="w-6 h-6 text-sky-300" />;
    return <HelpCircle className="w-6 h-6 text-zinc-400" />;
};

const GeneratedId = () => {
    const [id, setId] = React.useState("");

    React.useEffect(() => {
        setId(`ID::${Math.random().toString(36).substr(2, 6).toUpperCase()} // SEQ_0${Math.floor(Math.random() * 9)}`);
    }, []);

    if (!id) return null;
    return <>{id}</>;
};

const ComponentCard: React.FC<ComponentCardProps> = ({ type, name, price, reason }) => {
    return (
        <div className="group relative p-5 rounded-sm bg-white/60 dark:bg-black/40 border border-primary/20 transition-all duration-300 overflow-hidden hover:border-primary/60 hover:shadow-[0_0_15px_rgba(0,180,255,0.15)] dark:hover:shadow-[0_0_15px_rgba(0,255,255,0.15)] flex flex-col h-full">
            {/* Tech Corners */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary/40 group-hover:border-neon-cyan transition-colors" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary/40 group-hover:border-neon-cyan transition-colors" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary/40 group-hover:border-neon-cyan transition-colors" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary/40 group-hover:border-neon-cyan transition-colors" />

            {/* Scanline overlay */}
            <div className="absolute inset-0 bg-cyber-grid opacity-[0.03] pointer-events-none" />

            {/* Background Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative flex items-start gap-4 z-10 flex-1">
                <div className="p-3 rounded-none bg-primary/5 dark:bg-primary/10 border border-primary/30 group-hover:bg-primary/10 dark:group-hover:bg-primary/20 transition-colors shrink-0">
                    {getIcon(type)}
                </div>

                <div className="flex-1 min-w-0 flex flex-col h-full">
                    <div className="flex justify-between items-start gap-2 mb-2">
                        <div>
                            <p className="text-[10px] font-mono text-primary/70 uppercase tracking-widest mb-1 flex items-center gap-1">
                                <span className="w-1 h-1 bg-primary rounded-full animate-pulse shadow-[0_0_5px_currentColor]" />
                                {type}
                            </p>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight font-mono group-hover:text-cyan-600 dark:group-hover:text-neon-cyan transition-colors line-clamp-2 uppercase">
                                {name}
                            </h3>
                        </div>
                        <div className="text-right shrink-0">
                            <div className="bg-gray-100/50 dark:bg-black/40 border border-primary/30 px-2 py-1">
                                <span className="block text-sm font-bold text-green-600 dark:text-neon-green font-mono tabular-nums tracking-tighter">
                                    ${price.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-3 border-t border-primary/20 border-dashed">
                        <p className="text-xs text-muted-foreground/80 leading-relaxed line-clamp-3 font-mono">
                            <span className="text-primary/50 mr-1 opacity-50">&gt;</span>
                            {reason}
                        </p>
                    </div>
                </div>
            </div>

            {/* Decorative footer data */}
            <div className="absolute bottom-1 right-2 text-[6px] font-mono text-primary/40 dark:text-primary/20 select-none tracking-widest group-hover:text-primary/60 dark:group-hover:text-primary/40 transition-colors">
                <GeneratedId />
            </div>
        </div>
    );
};

export default ComponentCard;
