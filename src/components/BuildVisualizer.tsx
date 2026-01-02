'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
} from 'recharts';

interface BuildVisualizerProps {
    budget: number;
    totalPrice: number;
    performanceScore: {
        gaming: number;
        productivity: number;
        ai: number;
    };
    powerUsage: number;
    maxPower: number;
}

export function BuildVisualizer({
    budget,
    totalPrice,
    performanceScore,
    powerUsage,
    maxPower,
}: BuildVisualizerProps) {
    const budgetData = [
        {
            name: '預算分析',
            Budget: budget,
            Cost: totalPrice,
        },
    ];

    const performanceData = [
        { subject: '遊戲效能', A: performanceScore.gaming, fullMark: 100 },
        { subject: '生產力', A: performanceScore.productivity, fullMark: 100 },
        { subject: 'AI/運算', A: performanceScore.ai, fullMark: 100 },
        { subject: '能耗效率', A: Math.max(0, 100 - (powerUsage / maxPower) * 100), fullMark: 100 },
        { subject: '擴充性', A: 80, fullMark: 100 }, // Placeholder
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 glass-panel rounded-2xl border border-white/10">
            <div className="h-72">
                <h3 className="text-sm font-bold mb-6 text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1 h-4 bg-cyan-400 rounded-full"></span>
                    成本分析
                </h3>
                <ResponsiveContainer width="100%" height="85%">
                    <BarChart data={budgetData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                        <XAxis dataKey="name" stroke="#9CA3AF" tick={false} axisLine={false} />
                        <YAxis stroke="#9CA3AF" tickFormatter={(val) => `$${val / 1000}k`} axisLine={false} tickLine={false} />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                            itemStyle={{ color: '#E5E7EB' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar name="預算上限" dataKey="Budget" fill="#22d3ee" radius={[4, 4, 0, 0]} maxBarSize={60} />
                        <Bar name="預估花費" dataKey="Cost" fill={totalPrice > budget ? "#ef4444" : "#a855f7"} radius={[4, 4, 0, 0]} maxBarSize={60} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="h-72">
                <h3 className="text-sm font-bold mb-6 text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                    效能雷達
                </h3>
                <ResponsiveContainer width="100%" height="90%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={performanceData}>
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="transparent" />
                        <Radar
                            name="綜合評分"
                            dataKey="A"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            fill="#8b5cf6"
                            fillOpacity={0.4}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                            itemStyle={{ color: '#a78bfa' }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <div className="col-span-1 md:col-span-2 mt-2 pt-6 border-t border-white/5">
                <div className="flex items-center justify-between text-sm text-zinc-400 mb-2 font-medium">
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                        電源負載
                    </span>
                    <span className="text-white bg-white/5 px-3 py-1 rounded-md border border-white/5">{powerUsage}W / {maxPower}W</span>
                </div>
                <div className="w-full bg-black/40 rounded-full h-3 border border-white/5 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${powerUsage > maxPower * 0.8 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-gradient-to-r from-blue-500 to-cyan-400'}`}
                        style={{ width: `${Math.min((powerUsage / maxPower) * 100, 100)}%` }}
                    ></div>
                </div>
                {powerUsage > maxPower * 0.8 && (
                    <p className="text-red-400 text-xs mt-3 flex items-center gap-2 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                        ⚠️ 警告：預估功耗接近電源供應器上限，建議升級電源。
                    </p>
                )}
            </div>
        </div>
    );
}
