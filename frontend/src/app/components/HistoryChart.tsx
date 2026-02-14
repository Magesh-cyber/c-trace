'use client';

import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

interface HistoryChartProps {
    data: Array<{ date: string; value: number }>;
}

export default function HistoryChart({ data }: HistoryChartProps) {
    const [filter, setFilter] = useState<'day' | 'week' | 'month'>('day');

    // Basic filtering/sorting logic (in a real app, backend might handle this)
    const processedData = data.slice(filter === 'day' ? -7 : filter === 'week' ? -30 : -90);

    if (!data || data.length === 0) {
        return (
            <div className="h-80 flex items-center justify-center text-slate-500 glass-card rounded-2xl">
                <p>No historical data available</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card p-6 rounded-2xl w-full h-[400px]"
        >
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-semibold">Emission Trends</h3>
                <div className="flex bg-slate-800/50 rounded-lg p-1 border border-white/5">
                    {['day', 'week', 'month'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${filter === f
                                    ? 'bg-emerald-500 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={processedData}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="#64748b"
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#64748b"
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            color: '#F3F4F6'
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#10b981"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
