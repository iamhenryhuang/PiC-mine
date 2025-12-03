import React from 'react';
import { Zap, DollarSign, TrendingUp } from 'lucide-react';

interface BuildSummaryProps {
    totalPrice: number;
    totalBudget: number;
    powerUsage: number;
}

const BuildSummary: React.FC<BuildSummaryProps> = ({ totalPrice, totalBudget, powerUsage }) => {
    const budgetUsage = totalBudget > 0 ? (totalPrice / totalBudget) * 100 : 0;
    const isOverBudget = budgetUsage > 100;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-50">
            <div className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_50px_rgba(0,0,0,0.5)]">

                {/* Price Section */}
                <div className="flex items-center gap-4 flex-1 w-full">
                    <div className="p-3 rounded-full bg-cyber-blue/10 border border-cyber-blue/20">
                        <DollarSign className="w-6 h-6 text-cyber-blue" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-end mb-1">
                            <span className="text-xs text-gray-400 uppercase tracking-wider">Estimated Cost</span>
                            <span className={`text-lg font-bold tabular-nums ${isOverBudget ? 'text-neon-red' : 'text-white'}`}>
                                ${totalPrice.toLocaleString()}
                                <span className="text-xs text-gray-500 font-normal ml-1">/ ${totalBudget.toLocaleString()}</span>
                            </span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-neon-red glow-red' : 'bg-cyber-blue glow-blue'}`}
                                style={{ width: `${Math.min(budgetUsage, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Divider (Desktop) */}
                <div className="hidden md:block w-px h-12 bg-white/10" />

                {/* Power Section */}
                <div className="flex items-center gap-4 flex-1 w-full">
                    <div className="p-3 rounded-full bg-neon-red/10 border border-neon-red/20">
                        <Zap className="w-6 h-6 text-neon-red" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-end mb-1">
                            <span className="text-xs text-gray-400 uppercase tracking-wider">Power Draw</span>
                            <span className="text-lg font-bold text-white tabular-nums">
                                {powerUsage}W
                            </span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            {/* Assuming max PSU capacity isn't known here, just showing a visual bar relative to a common max like 1000W for visual feedback */}
                            <div
                                className="h-full bg-neon-red glow-red rounded-full transition-all duration-500"
                                style={{ width: `${Math.min((powerUsage / 1000) * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Action Button (Optional placeholder for future "Buy" or "Save" feature) */}
                <div className="hidden md:block">
                    <button className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyber-blue/50 transition-all text-sm font-bold text-white flex items-center gap-2 group">
                        <TrendingUp className="w-4 h-4 text-cyber-blue group-hover:scale-110 transition-transform" />
                        Analyze
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BuildSummary;
