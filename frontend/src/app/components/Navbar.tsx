'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Leaf, BarChart2, Upload } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    return (
        <motion.nav
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 w-full z-50 glass-panel border-b border-white/5 bg-slate-900/40 backdrop-blur-xl"
        >
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                        {/* Custom Serrated Birch Leaf Icon */}
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-6 h-6"
                        >
                            <path d="M12 2C12 2 13 4 14 5C15 6 16.5 6.5 16.5 6.5C16.5 6.5 16 8 17 9C18 10 19 10.5 19 10.5C19 10.5 18 12 18.5 13C19 14 20 14.5 20 14.5C20 14.5 17 17 15 19C13 21 12 23 12 24" />
                            <path d="M12 2C12 2 11 4 10 5C9 6 7.5 6.5 7.5 6.5C7.5 6.5 8 8 7 9C6 10 5 10.5 5 10.5C5 10.5 6 12 5.5 13C5 14 4 14.5 4 14.5C4 14.5 7 17 9 19C11 21 12 23 12 24" />
                            <path d="M12 2V24" />

                            <path d="M12 7.5 C 13.5 6.5, 15 6, 16.5 6.5" opacity="0.8" />
                            <path d="M12 12.5 C 14 11.5, 16 11, 19 10.5" opacity="0.8" />
                            <path d="M12 17.5 C 14 16.5, 16 16, 20 14.5" opacity="0.8" />

                            <path d="M12 7.5 C 10.5 6.5, 9 6, 7.5 6.5" opacity="0.8" />
                            <path d="M12 12.5 C 10 11.5, 8 11, 5 10.5" opacity="0.8" />
                            <path d="M12 17.5 C 10 16.5, 8 16, 4 14.5" opacity="0.8" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        C-Trace
                    </span>
                </Link>

                <div className="flex gap-1 bg-slate-800/50 p-1 rounded-full border border-white/5">
                    <NavLink href="/dashboard" active={pathname === '/dashboard'} icon={<BarChart2 size={18} />}>
                        Dashboard
                    </NavLink>
                    <NavLink href="/upload" active={pathname === '/upload'} icon={<Upload size={18} />}>
                        Upload
                    </NavLink>
                </div>
            </div>
        </motion.nav>
    );
}

function NavLink({ href, children, active, icon }: { href: string; children: React.ReactNode; active: boolean; icon: React.ReactNode }) {
    return (
        <Link href={href} className="relative px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 group">
            {active && (
                <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-emerald-500/20 border border-emerald-500/30 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
            )}
            <div className={`relative flex items-center gap-2 z-10 ${active ? 'text-emerald-400' : 'text-slate-400 group-hover:text-white'}`}>
                {icon}
                {children}
            </div>
        </Link>
    );
}
