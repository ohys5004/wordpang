'use client';

import { useTranslations } from 'next-intl';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Zap, Target, Briefcase, Rocket, Globe, Users, Calendar, Linkedin, Link as LinkIcon, MapPin } from 'lucide-react';
import { IdeaProposal } from '@/types';

const TYPE_ICONS = {
    stable: TrendingUp,
    disruptive: Zap,
    niche: Target,
    b2b: Briefcase,
    future: Rocket
};

export default function DetailPanel() {
    const t = useTranslations('Index');
    const { selectedItemId, canvasItems, companies, selectItem, updateCompanyName } = useStore();

    const selectedItem = canvasItems.find(i => i.id === selectedItemId);
    const company = selectedItem ? companies.find(c => c.id === selectedItem.companyId) : null;

    if (!company) return null;

    return (
        <AnimatePresence>
            {selectedItemId && (
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed top-16 right-80 bottom-0 w-[400px] bg-[#0d0d12] border-l border-white/10 z-30 overflow-y-auto custom-scrollbar shadow-2xl"
                >
                    <div className="p-6 space-y-8 pb-20">
                        <div className="flex items-start justify-between">
                            <div className="max-w-[85%]">
                                <h2 className="text-3xl font-bold gradient-text break-words leading-tight">{company.name}</h2>
                                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
                                    {company.isHybrid ? t('hybridStartup') : t('existingCompany')}
                                </p>
                            </div>
                            <button
                                onClick={() => selectItem(null)}
                                className="p-2 rounded-xl hover:bg-white/5 transition-colors shrink-0"
                            >
                                <X className="w-5 h-5 text-white/40" />
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {company.url && (
                                <a
                                    href={company.url.startsWith('http') ? company.url : `https://${company.url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 hover:border-brand-primary/50 text-white/60 hover:text-brand-primary transition-all text-[11px] font-bold shadow-inner"
                                >
                                    <LinkIcon className="w-3 h-3" />
                                    {t('website')}
                                </a>
                            )}
                            {company.linkedinUrl && (
                                <a
                                    href={company.linkedinUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0077B5]/10 border border-[#0077B5]/20 hover:border-[#0077B5] text-[#0077B5] transition-all text-[11px] font-bold shadow-inner"
                                >
                                    <Linkedin className="w-3 h-3 fill-current" />
                                    {t('linkedin')}
                                </a>
                            )}
                            {company.headquarter && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-white/40 text-[11px] font-bold">
                                    <MapPin className="w-3 h-3" />
                                    {company.headquarter}
                                </div>
                            )}
                        </div>

                        {company.isHybrid && company.suggestedNames && (
                            <div className="space-y-3">
                                <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                    <Zap className="w-3 h-3 text-brand-secondary" />
                                    {t('brandRecommendations')}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {company.suggestedNames.map((name) => (
                                        <button
                                            key={name}
                                            onClick={() => updateCompanyName(company.id, name)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border active:scale-95 ${company.name === name
                                                ? 'bg-brand-primary/20 border-brand-primary text-brand-primary'
                                                : 'bg-white/5 border-white/5 hover:border-white/20 text-white/70 shadow-sm'
                                                }`}
                                        >
                                            {name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-all group">
                                <Users className="w-4 h-4 text-brand-primary mb-3 group-hover:scale-110 transition-transform" />
                                <p className="text-[10px] text-white/40 uppercase font-black tracking-tighter">{t('employees')}</p>
                                <p className="text-base font-bold mt-0.5">{company.employees || 'N/A'}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-all group">
                                <Calendar className="w-4 h-4 text-brand-secondary mb-3 group-hover:scale-110 transition-transform" />
                                <p className="text-[10px] text-white/40 uppercase font-black tracking-tighter">{t('founded')}</p>
                                <p className="text-base font-bold mt-0.5">{company.founded || 'N/A'}</p>
                            </div>
                        </div>

                        {company.isEstimated && (
                            <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-[10px] font-bold flex items-center gap-2 italic">
                                <Globe className="w-3 h-3" />
                                {t('estimatedData')}
                            </div>
                        )}

                        {company.productOverview && (
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold border-b border-white/10 pb-2 flex items-center gap-2 uppercase tracking-tighter">
                                    {t('productOverview')}
                                </h3>
                                <p className="text-sm text-white/70 leading-relaxed font-medium">
                                    {company.productOverview}
                                </p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                <h3 className="text-sm font-bold flex items-center gap-2">
                                    {t('businessStrategy')}
                                </h3>
                                {company.isGenerating && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                                        <span className="text-[10px] text-brand-primary font-bold animate-pulse">AI 분석 중...</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 relative">
                                {company.isGenerating && (!company.proposals || company.proposals.length === 0) ? (
                                    // Skeleton UI
                                    [1, 2, 3].map(i => (
                                        <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 animate-pulse space-y-2">
                                            <div className="w-20 h-3 bg-white/10 rounded" />
                                            <div className="w-full h-4 bg-white/10 rounded" />
                                            <div className="w-2/3 h-3 bg-white/10 rounded" />
                                        </div>
                                    ))
                                ) : (
                                    company.proposals?.map((proposal: IdeaProposal, idx) => {
                                        const Icon = TYPE_ICONS[proposal.type as keyof typeof TYPE_ICONS] || Target;
                                        return (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="group p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-primary/30 transition-all hover:bg-white/[0.02]"
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="p-1.5 rounded-lg bg-brand-primary/10 text-brand-primary">
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">
                                                        {t(proposal.type as any) || proposal.type}
                                                    </span>
                                                </div>
                                                <h4 className="font-bold text-sm mb-1 group-hover:text-brand-primary transition-colors">{proposal.title}</h4>
                                                <p className="text-xs text-white/60 leading-relaxed">{proposal.content}</p>
                                            </motion.div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold border-b border-white/10 pb-2">{t('coreProducts')}</h3>
                            <div className="flex flex-wrap gap-2">
                                {company.products?.map(p => (
                                    <span key={p} className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-medium border border-white/5 hover:border-white/20 transition-colors">
                                        {p}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
