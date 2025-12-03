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
            name: 'Budget vs Cost',
            Budget: budget,
            Cost: totalPrice,
        },
    ];

    const performanceData = [
        { subject: 'Gaming', A: performanceScore.gaming, fullMark: 100 },
        { subject: 'Productivity', A: performanceScore.productivity, fullMark: 100 },
        { subject: 'AI/ML', A: performanceScore.ai, fullMark: 100 },
        { subject: 'Power Efficiency', A: Math.max(0, 100 - (powerUsage / maxPower) * 100), fullMark: 100 },
        { subject: 'Future Proofing', A: 80, fullMark: 100 }, // Placeholder
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-900/50 rounded-xl border border-gray-800">
            <div className="h-64">
                <h3 className="text-lg font-semibold mb-4 text-gray-200">Price Analysis</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={budgetData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                            itemStyle={{ color: '#E5E7EB' }}
                        />
                        <Legend />
                        <Bar dataKey="Budget" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Cost" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="h-64">
                <h3 className="text-lg font-semibold mb-4 text-gray-200">Performance Profile</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData}>
                        <PolarGrid stroke="#374151" />
                        <PolarAngleAxis dataKey="subject" stroke="#9CA3AF" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#4B5563" />
                        <Radar
                            name="Build Score"
                            dataKey="A"
                            stroke="#8B5CF6"
                            fill="#8B5CF6"
                            fillOpacity={0.6}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                            itemStyle={{ color: '#E5E7EB' }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <div className="col-span-1 md:col-span-2 mt-4">
                <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                    <span>Power Usage</span>
                    <span>{powerUsage}W / {maxPower}W</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div
                        className={`h-2.5 rounded-full ${powerUsage > maxPower * 0.8 ? 'bg-red-500' : 'bg-blue-500'}`}
                        style={{ width: `${Math.min((powerUsage / maxPower) * 100, 100)}%` }}
                    ></div>
                </div>
                {powerUsage > maxPower * 0.8 && (
                    <p className="text-red-400 text-xs mt-1">Warning: Power usage is high relative to PSU capacity.</p>
                )}
            </div>
        </div>
    );
}
