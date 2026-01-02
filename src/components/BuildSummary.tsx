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
            <div className="glass-panel p-4 md:p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border border-white/10 backdrop-blur-xl">

                {/* Price Section */}
                <div className="flex items-center gap-4 flex-1 w-full">
                    <div className="p-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                        <DollarSign className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs text-blue-200/60 uppercase tracking-wider font-semibold">預算評估</span>
                            <span className={`text-lg font-bold tabular-nums ${isOverBudget ? 'text-red-400' : 'text-white'}`}>
                                ${totalPrice.toLocaleString()}
                                <span className="text-xs text-zinc-500 font-normal ml-1">/ ${totalBudget.toLocaleString()}</span>
                            </span>
                        </div>
                        <div className="h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]'}`}
                                style={{ width: `${Math.min(budgetUsage, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Divider (Desktop) */}
                <div className="hidden md:block w-px h-12 bg-white/10" />

                {/* Power Section */}
                <div className="flex items-center gap-4 flex-1 w-full">
                    <div className="p-3 rounded-full bg-yellow-500/10 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.15)]">
                        <Zap className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs text-blue-200/60 uppercase tracking-wider font-semibold">功耗預估</span>
                            <span className="text-lg font-bold text-white tabular-nums">
                                {powerUsage}W
                            </span>
                        </div>
                        <div className="h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                            {/* Assuming max PSU capacity isn't known here, just showing a visual bar relative to a common max like 1000W for visual feedback */}
                            <div
                                className="h-full bg-yellow-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                                style={{ width: `${Math.min((powerUsage / 1000) * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="hidden md:block">
                    <button className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 transition-all text-sm font-bold text-white flex items-center gap-2 group shadow-lg hover:shadow-primary/25">
                        <TrendingUp className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                        詳細分析
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BuildSummary;
