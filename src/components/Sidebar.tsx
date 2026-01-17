'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useStore } from '@/store/useStore';
import { Search, Plus, History, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SP500_COMPANIES } from '@/data/companies';
import { Company } from '@/types';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SidebarProps {
    fullScreen?: boolean;
}

export default function Sidebar({ fullScreen }: SidebarProps) {
    const t = useTranslations('Index');
    const { companies, addToCanvas, addCompanyByUrl, addCompany } = useStore();
    const [search, setSearch] = useState('');
    const [url, setUrl] = useState('');

    // Filter existing companies
    const filteredCompanies = companies
        .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => (b.lastUsed || 0) - (a.lastUsed || 0));

    // Search S&P 500 database for companies not yet added
    const dbResults = search.length > 0
        ? SP500_COMPANIES.filter(dbCompany =>
            dbCompany.name?.toLowerCase().includes(search.toLowerCase()) &&
            !companies.some(c => c.name?.toLowerCase() === dbCompany.name?.toLowerCase())
        ).slice(0, 5) // Limit to 5 suggestions
        : [];

    const handleAddCompany = (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;
        addCompanyByUrl(url);
        setUrl('');
    };

    const handleAddFromDatabase = (dbCompany: Partial<Company>) => {
        const newCompany: Company = {
            id: Math.random().toString(36).substr(2, 9),
            ...dbCompany,
            lastUsed: Date.now(),
        } as Company;
        addCompany(newCompany);
        setSearch(''); // Clear search after adding
    };

    return (
        <aside className={cn(
            "fixed top-16 right-0 bottom-0 glass border-l border-white/10 flex flex-col z-40 transition-all duration-300",
            fullScreen ? "left-0 w-full" : "w-80"
        )}>
            <div className="p-4 space-y-4">
                <form onSubmit={handleAddCompany} className="space-y-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={t('placeholder')}
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all pr-10 font-medium"
                        />
                        <button type="submit" className="absolute right-2 top-1.5 p-1 rounded-lg bg-brand-primary hover:bg-brand-primary/80 transition-colors shadow-lg shadow-brand-primary/20">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </form>

                <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/40" />
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none transition-all font-medium"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
                {dbResults.length > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-brand-primary uppercase tracking-[0.2em] px-1">
                            <Database className="w-3 h-3" />
                            {t('sp500Database')}
                        </div>
                        <div className="space-y-2">
                            {dbResults.map((dbCompany, idx) => (
                                <motion.button
                                    key={idx}
                                    onClick={() => handleAddFromDatabase(dbCompany)}
                                    whileHover={{ scale: 1.02, x: 4 }}
                                    className="w-full text-left glass-card p-3 rounded-xl hover:border-brand-primary/40 transition-all border border-white/5 shadow-sm"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm tracking-tight">{dbCompany.name}</span>
                                            <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest mt-0.5">{dbCompany.headquarter}</span>
                                        </div>
                                        <Plus className="w-4 h-4 text-brand-primary" />
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-2 mb-4 text-xs font-bold text-white/30 uppercase tracking-[0.2em] px-1">
                    <History className="w-3 h-3" />
                    {t('recentlyUsed')}
                </div>

                <div className="space-y-3">
                    {filteredCompanies.map((company) => (
                        <motion.div
                            key={company.id}
                            drag
                            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                            dragElastic={0.5}
                            onDragEnd={(_, info) => {
                                const canvasWidth = window.innerWidth - 320;
                                if (info.point.x < canvasWidth) {
                                    addToCanvas(company.id, info.point.x - 40, info.point.y - 32);
                                }
                            }}
                            whileDrag={{ scale: 1.1, zIndex: 100, rotate: -2 }}
                            whileHover={{ scale: 1.02, x: 4 }}
                            className="group glass-card p-4 rounded-2xl cursor-grab active:cursor-grabbing hover:border-brand-primary/40 transition-all flex items-center justify-between border border-white/5 shadow-lg shadow-black/20"
                        >
                            <div className="flex flex-col">
                                <span className="font-bold text-sm tracking-tight">{company.name}</span>
                                {company.isHybrid ? (
                                    <span className="text-[9px] text-brand-secondary font-black uppercase tracking-widest mt-0.5">{t('hybridStartup')}</span>
                                ) : (
                                    <span className="text-[9px] text-white/20 font-bold uppercase tracking-widest mt-0.5 truncate max-w-[120px]">{company.url}</span>
                                )}
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addToCanvas(company.id, Math.random() * 400 + 100, Math.random() * 300 + 100);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                            >
                                <Plus className="w-3 h-3" />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
