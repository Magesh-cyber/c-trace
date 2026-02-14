'use client';

import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { getApiUrl } from '../../utils/api';

export default function UploadPage() {
    const [text, setText] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleUpload = async () => {
        if (!text) return;
        setLoading(true);
        setError('');
        setResult(null);

        // Simulate longer load for effect
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            const res = await axios.post(getApiUrl('/upload'), { text });
            setResult(res.data);
        } catch (err: any) {
            console.error(err);
            setError('Failed to process invoice. Please check the format.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 bg-gradient-to-br from-slate-950 to-slate-900 flex justify-center">
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Input Section */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl font-black text-white mb-6 leading-tight">
                        Analyze your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                            Emission Data
                        </span>
                    </h1>
                    <p className="text-slate-400 mb-8 max-w-md leading-relaxed">
                        Paste your invoice details, fuel logs, or material usage below. Our AI will automatically categorize and calculate the carbon footprint.
                    </p>

                    <div className="glass-card p-1 rounded-2xl border border-white/10 shadow-2xl bg-slate-900/50">
                        <textarea
                            className="w-full h-64 bg-slate-900/80 text-white p-6 rounded-xl border-none focus:ring-2 focus:ring-emerald-500/50 outline-none resize-none placeholder-slate-600 font-mono text-sm leading-relaxed transition-all"
                            placeholder="Example: Purchased 500 liters of diesel fuel for the backup generator..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">Supports natural language processing</span>
                        <button
                            onClick={handleUpload}
                            disabled={loading || !text}
                            className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all shadow-lg ${loading || !text
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20 hover:scale-105 active:scale-95'
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing
                                </span>
                            ) : (
                                <>
                                    Calculate Impact <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 flex items-center gap-3"
                        >
                            <AlertTriangle size={20} className="text-red-500" />
                            {error}
                        </motion.div>
                    )}
                </motion.div>

                {/* Result Section */}
                <div className="relative">
                    <AnimatePresence mode='wait'>
                        {result ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ type: "spring", bounce: 0.4 }}
                                className="glass-card p-8 rounded-3xl border border-emerald-500/30 shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)]"
                            >
                                <div className="absolute -top-6 -right-6 bg-emerald-500 text-white p-4 rounded-2xl shadow-xl transform rotate-12">
                                    <CheckCircle size={32} />
                                </div>

                                <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-8">Analysis Complete</h3>

                                <div className="space-y-8">
                                    <div className="flex justify-between items-baseline border-b border-white/5 pb-4">
                                        <span className="text-white font-medium text-lg">Category</span>
                                        <span className="text-emerald-400 font-mono text-xl capitalize">{result.category}</span>
                                    </div>

                                    <div className="flex justify-between items-baseline border-b border-white/5 pb-4">
                                        <span className="text-white font-medium text-lg">Scope</span>
                                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-bold border border-blue-500/20">
                                            {result.scope}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-baseline border-b border-white/5 pb-4">
                                        <span className="text-white font-medium text-lg">Factor</span>
                                        <span className="text-slate-400 font-mono">{result.emission_factor} <span className="text-xs">kgCO2e/{result.unit}</span></span>
                                    </div>

                                    <div className="bg-gradient-to-r from-emerald-500/10 to-transparent p-6 rounded-2xl border border-emerald-500/20">
                                        <p className="text-emerald-400 text-sm font-bold uppercase mb-1">Total Carbon Footprint</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl font-black text-white tracking-tighter">
                                                {result.total_emission.toFixed(2)}
                                            </span>
                                            <span className="text-lg text-slate-400 font-medium">kg CO2e</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/30"
                            >
                                <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                                    <FileText size={40} className="text-slate-600" />
                                </div>
                                <h3 className="text-slate-300 font-bold text-xl mb-2">Waiting for Input</h3>
                                <p className="text-slate-500 max-w-xs">Data will appear here instantly after analysis.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
