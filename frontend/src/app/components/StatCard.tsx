'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

interface StatProps {
    title: string;
    value: string | number;
    unit: string;
    trend?: 'up' | 'down' | 'neutral';
    percent?: string;
    delay?: number;
}

export default function StatCard({ title, value, unit, trend = 'neutral', percent, delay = 0 }: StatProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="glass-card p-6 rounded-2xl relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Activity size={80} />
            </div>

            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {title}
            </h3>

            <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-extrabold text-white tracking-tighter bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    {value}
                </span>
                <span className="text-emerald-400 font-medium text-sm bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                    {unit}
                </span>
            </div>

            {percent && (
                <div className={`flex items-center text-xs font-semibold ${trend === 'up' ? 'text-rose-400' : trend === 'down' ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {trend === 'up' && <ArrowUpRight size={14} className="mr-1" />}
                    {trend === 'down' && <ArrowDownRight size={14} className="mr-1" />}
                    {percent.includes('%') ? percent : `${percent}%`}
                </div>
            )}
        </motion.div>
    );
}
