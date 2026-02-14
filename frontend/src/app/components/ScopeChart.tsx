'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ScopeChartProps {
    data: Array<{ name: string; value: number }>;
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444']; // Emerald, Blue, Amber, Red

export default function ScopeChart({ data }: ScopeChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="h-80 flex flex-col items-center justify-center text-slate-500 glass-card rounded-2xl">
                <div className="w-16 h-16 rounded-full bg-slate-800 animate-pulse mb-4" />
                <p>No emission data to visualize</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-[400px] w-full glass-card p-6 rounded-2xl"
        >
            <h3 className="text-white font-semibold mb-6 flex items-center justify-between">
                <span>Emission Breakdown</span>
                <span className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded-md border border-white/5">
                    By Scope
                </span>
            </h3>

            <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                                className="hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            color: '#F3F4F6',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            backdropFilter: 'blur(4px)'
                        }}
                        itemStyle={{ color: '#fff', fontWeight: 600 }}
                        cursor={false}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value) => <span className="text-slate-300 text-sm font-medium ml-1">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
