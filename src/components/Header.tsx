'use client';

import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Globe, LogIn, User as UserIcon, LogOut } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface HeaderProps {
    user: User | null;
    onLoginClick: () => void;
}

export default function Header({ user, onLoginClick }: HeaderProps) {
    const t = useTranslations('Index');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const toggleLocale = () => {
        const nextLocale = locale === 'ko' ? 'en' : 'ko';
        router.replace(pathname, { locale: nextLocale });
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-16 glass border-b border-white/10 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center font-bold text-lg shadow-lg shadow-brand-primary/20">
                    W
                </div>
                <h1 className="text-xl font-black tracking-tight gradient-text">WordPang</h1>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleLocale}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors text-sm font-semibold border border-white/10"
                >
                    <Globe className="w-4 h-4 text-brand-secondary" />
                    {locale === 'ko' ? 'English' : '한국어'}
                </button>

                {user ? (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                            <UserIcon className="w-4 h-4 text-brand-primary" />
                            <span className="text-xs font-bold text-white/80">{user.email?.split('@')[0]}</span>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-red-400 transition-colors" title={t('logout')}
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={onLoginClick}
                        className="flex items-center gap-2 px-5 py-1.5 rounded-full bg-white text-black hover:bg-white/90 transition-all text-sm font-black active:scale-95 shadow-lg"
                    >
                        <LogIn className="w-4 h-4" />
                        {t('login')}
                    </button>
                )}
            </div>
        </header>
    );
}
