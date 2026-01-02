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

const ComponentCard: React.FC<ComponentCardProps> = ({ type, name, price, reason }) => {
    return (
        <div className="group relative p-5 rounded-2xl liquid-card transition-all duration-300 overflow-hidden">
            {/* Background Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors shadow-inner">
                    {getIcon(type)}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                        <div>
                            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                {type}
                            </p>
                            <h3 className="text-sm font-bold text-white leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                {name}
                            </h3>
                        </div>
                        <div className="text-right shrink-0">
                            <div className="bg-black/30 px-2 py-1 rounded-lg border border-white/5">
                                <span className="block text-sm font-bold text-cyan-300 tabular-nums">
                                    ${price.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/5">
                        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 group-hover:text-zinc-300 transition-colors">
                            {reason}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComponentCard;
