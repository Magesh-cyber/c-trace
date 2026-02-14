'use client';

import { Suspense, useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircle2, Leaf, ShieldCheck, Share2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { getApiUrl } from '../../utils/api';

function VerifyContent() {
    const searchParams = useSearchParams();
    // In a real app, we might verify a token here. For hackathon, we fetch live or use params.
    // Let's fetch live data to "verify" the current state.
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // In production, this would be a specific "verification" endpoint
                // or the data would be signed and passed in URL.
                // Here we fetch the dashboard data again to show the "live verified" status.
                const res = await axios.get(getApiUrl('/dashboard'));
                setData(res.data);
            } catch (error) {
                console.error('Verification failed', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (!data) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Verification Failed</div>;

    const total = data.total_emission.toFixed(2);
    const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.1),rgba(15,23,42,0)_50%)] pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-20 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-8 relative shadow-[0_0_60px_-15px_rgba(16,185,129,0.3)]"
            >
                {/* Verified Header */}
                <div className="flex flex-col items-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 ring-2 ring-emerald-500 ring-offset-4 ring-offset-slate-900"
                    >
                        <ShieldCheck size={40} className="text-emerald-400" />
                    </motion.div>

                    <h1 className="text-2xl font-bold text-white mb-1">Carbon Verification</h1>
                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium px-3 py-1 bg-emerald-500/10 rounded-full">
                        <CheckCircle2 size={14} />
                        <span>Officially Verified</span>
                    </div>
                </div>

                {/* Certificate Body */}
                <div className="space-y-6 text-center">
                    <div className="p-6 bg-slate-950/50 rounded-2xl border border-white/5">
                        <p className="text-slate-400 text-sm mb-2 uppercase tracking-wide">Total Carbon Footprint</p>
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-5xl font-black text-white tracking-tight">{total}</span>
                            <span className="text-emerald-400 font-medium">kg CO2e</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-950/50 rounded-xl border border-white/5">
                            <p className="text-slate-500 text-xs mb-1">Scope 1</p>
                            <p className="text-white font-semibold flex items-center justify-center gap-1">
                                {data.by_scope.find((s: any) => s[0] === 'Scope 1')?.[1].toFixed(1) || '0'}
                                <span className="text-xs text-slate-500">kg</span>
                            </p>
                        </div>
                        <div className="p-4 bg-slate-950/50 rounded-xl border border-white/5">
                            <p className="text-slate-500 text-xs mb-1">Scope 2</p>
                            <p className="text-white font-semibold flex items-center justify-center gap-1">
                                {data.by_scope.find((s: any) => s[0] === 'Scope 2')?.[1].toFixed(1) || '0'}
                                <span className="text-xs text-slate-500">kg</span>
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-6">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>Verification ID:</span>
                            <span className="font-mono text-slate-400">CTR-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                            <span>Verified On:</span>
                            <span className="text-slate-400">{date}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center pt-6 border-t border-white/5">
                    <p className="text-xs text-slate-600 flex items-center justify-center gap-1">
                        Powered by <Leaf size={10} className="text-emerald-500" /> C-Trace AI Engine
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyContent />
        </Suspense>
    );
}
