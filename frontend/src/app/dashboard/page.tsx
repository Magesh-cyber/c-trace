'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import StatCard from '../components/StatCard';
import ScopeChart from '../components/ScopeChart';
import HistoryChart from '../components/HistoryChart';
import { RefreshCcw, QrCode as QrIcon, X, Download } from 'lucide-react';
import QRCode from "react-qr-code";
import { getApiUrl } from '../../utils/api';

interface DashboardData {
    total_emission: number;
    by_scope: [string, number][];
    scope_ratios: { [key: string]: number };
    history: { date: string; value: number }[];
    insights: { title: string; desc: string; badge: string; color: string }[];
    comparison: { percent: string; trend: 'up' | 'down' | 'neutral'; period: string };
}

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [verifyUrl, setVerifyUrl] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(getApiUrl('/dashboard'));
            setData(res.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        } finally {
            setTimeout(() => setLoading(false), 500);
        }
    };

    const downloadReport = async () => {
        try {
            const response = await axios.get(getApiUrl('/report'), {
                responseType: 'blob', // Important for file download
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'C-Trace_Executive_Report.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Failed to download report', error);
            alert("Failed to download report");
        }
    };


    useEffect(() => {
        fetchData();
        if (typeof window !== 'undefined') {
            setVerifyUrl(`${window.location.origin}/verify`);
        }
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-400 animate-pulse font-medium">Loading Analytics...</p>
                </div>
            </div>
        );
    }

    const chartData = data?.by_scope.map(([name, value]) => ({ name, value })) || [];
    const totalEmissions = data?.total_emission ? data.total_emission.toFixed(2) : '0';
    const historyData = data?.history || [];
    const insights = data?.insights || [];
    const comparison = data?.comparison || { percent: '0', trend: 'neutral', period: 'from last month' };

    const resetData = async () => {
        if (!confirm("Are you sure you want to reset all data? This action cannot be undone.")) return;
        try {
            await axios.delete(getApiUrl('/reset'));
            fetchData();
        } catch (error) {
            console.error('Failed to reset data', error);
            alert("Failed to reset data");
        }
    };

    return (
        <div className="min-h-screen p-8 pt-24 bg-gradient-to-br from-slate-950 to-slate-900 relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
            >
                <div className="flex justify-between items-end mb-10 border-b border-white/5 pb-6">
                    <div>
                        <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent mb-2">
                            Executive Dashboard
                        </h1>
                        <p className="text-slate-400 font-light">
                            Real-time carbon footprint overview
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={resetData}
                            className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/20 transition-all active:scale-95 font-semibold"
                        >
                            Reset
                        </button>
                        <button
                            onClick={downloadReport}
                            className="flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl border border-white/10 transition-all active:scale-95"
                        >
                            <Download size={20} />
                            <span className="font-semibold hidden sm:inline">Report</span>
                        </button>
                        <button
                            onClick={() => setShowVerifyModal(true)}
                            className="flex items-center gap-2 px-4 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/20 transition-all active:scale-95"
                        >
                            <QrIcon size={20} />
                            <span className="font-semibold hidden sm:inline">Verify</span>
                        </button>
                        <button
                            onClick={fetchData}
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all hover:rotate-180 active:scale-95 text-emerald-400"
                        >
                            <RefreshCcw size={20} />
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Emissions"
                        value={totalEmissions}
                        unit="kg CO2e"
                        delay={0.1}
                    />
                    <StatCard
                        title="Scope 1 Emissions"
                        value={(chartData.find(d => d.name === 'Scope 1')?.value || 0).toFixed(2)}
                        unit="kg"
                        delay={0.2}
                        percent={data?.scope_ratios?.['Scope 1'] ? `${data.scope_ratios['Scope 1'].toFixed(1)}% of total` : undefined}
                    />
                    <StatCard
                        title="Scope 2 Emissions"
                        value={(chartData.find(d => d.name === 'Scope 2')?.value || 0).toFixed(2)}
                        unit="kg"
                        delay={0.3}
                        percent={data?.scope_ratios?.['Scope 2'] ? `${data.scope_ratios['Scope 2'].toFixed(1)}% of total` : undefined}
                    />
                    <StatCard
                        title="Scope 3 Emissions"
                        value={(chartData.find(d => d.name === 'Scope 3')?.value || 0).toFixed(2)}
                        unit="kg"
                        delay={0.4}
                        percent={data?.scope_ratios?.['Scope 3'] ? `${data.scope_ratios['Scope 3'].toFixed(1)}% of total` : undefined}
                    />
                </div>

                {/* Main Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-2">
                        <HistoryChart data={historyData} />
                    </div>
                    <div>
                        <ScopeChart data={chartData} />
                    </div>
                </div>

                {/* AI Insights Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-8 rounded-2xl border border-white/10 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
                    <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                        <span className="w-2 h-8 rounded-full bg-emerald-500" />
                        AI Insights
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {insights.length > 0 ? (
                            insights.map((insight, index) => (
                                <InsightItem
                                    key={index}
                                    title={insight.title}
                                    desc={insight.desc}
                                    badge={insight.badge}
                                    color={insight.color}
                                />
                            ))
                        ) : (
                            <p className="text-slate-500 italic col-span-2 text-center">No insights available yet.</p>
                        )}
                    </div>
                </motion.div>
            </motion.div>

            {/* Verification Modal */}
            <AnimatePresence>
                {showVerifyModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowVerifyModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-slate-900 border border-white/10 p-8 rounded-3xl max-w-sm w-full relative shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowVerifyModal(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex flex-col items-center text-center">
                                <h3 className="text-2xl font-bold text-white mb-2">Verify Impact</h3>
                                <p className="text-slate-400 text-sm mb-6">Scan to view the official verification certificate for this dashboard.</p>

                                <div className="p-4 bg-white rounded-xl mb-6">
                                    <QRCode
                                        value={verifyUrl || "http://localhost:3000/verify"}
                                        size={200}
                                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                        viewBox={`0 0 256 256`}
                                    />
                                </div>

                                <div className="text-xs text-slate-500 font-mono bg-slate-950 p-2 rounded-lg w-full overflow-hidden text-ellipsis whitespace-nowrap">
                                    {verifyUrl}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function InsightItem({ title, desc, badge, color = "text-emerald-400" }: { title: string, desc: string, badge: string, color?: string }) {
    return (
        <div className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border-l-2 border-emerald-500/50">
            <div className="flex justify-between items-start mb-2">
                <h4 className={`font-bold ${color}`}>{title}</h4>
                <span className="text-[10px] uppercase font-bold px-2 py-1 bg-white/10 rounded-md text-slate-300">
                    {badge}
                </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
        </div>
    );
}
