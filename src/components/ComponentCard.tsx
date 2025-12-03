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
    if (t.includes('cpu') || t.includes('processor')) return <Cpu className="w-6 h-6 text-neon-red" />;
    if (t.includes('gpu') || t.includes('graphics')) return <MonitorPlay className="w-6 h-6 text-cyber-blue" />;
    if (t.includes('motherboard') || t.includes('mainboard')) return <CircuitBoard className="w-6 h-6 text-purple-400" />;
    if (t.includes('ram') || t.includes('memory')) return <MemoryStick className="w-6 h-6 text-green-400" />;
    if (t.includes('storage') || t.includes('ssd') || t.includes('hdd')) return <HardDrive className="w-6 h-6 text-yellow-400" />;
    if (t.includes('psu') || t.includes('power')) return <Zap className="w-6 h-6 text-orange-400" />;
    if (t.includes('case') || t.includes('chassis')) return <Box className="w-6 h-6 text-gray-400" />;
    if (t.includes('cooler') || t.includes('fan')) return <Wind className="w-6 h-6 text-cyan-400" />;
    return <HelpCircle className="w-6 h-6 text-gray-500" />;
};

const ComponentCard: React.FC<ComponentCardProps> = ({ type, name, price, reason }) => {
    return (
        <div className="group relative p-4 rounded-xl bg-card/50 border border-white/10 hover:border-neon-red/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,50,50,0.15)] overflow-hidden">
            {/* Background Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon-red/5 to-cyber-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative flex items-start gap-4">
                <div className="p-3 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                    {getIcon(type)}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                        <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{type}</p>
                            <h3 className="text-sm font-bold text-white leading-tight group-hover:text-neon-red transition-colors line-clamp-2">
                                {name}
                            </h3>
                        </div>
                        <div className="text-right shrink-0">
                            <span className="block text-lg font-bold text-cyber-blue tabular-nums">
                                ${price.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/5">
                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                            {reason}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComponentCard;
