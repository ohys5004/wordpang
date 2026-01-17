'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isMock } from '@/lib/supabase';
import { X, Mail, Lock, UserPlus, LogIn, Github, AlertCircle } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isMock) {
                // Simulate network latency
                await new Promise(resolve => setTimeout(resolve, 800));

                // Create a mock user object
                const mockUser = {
                    id: 'mock-user-id',
                    email: email,
                    user_metadata: { full_name: 'Test User' },
                    aud: 'authenticated',
                    role: 'authenticated'
                };

                // Update global store (via useStore, we need to call setUser)
                // Note: useStore is used inside the component to get setUser
                const { setUser } = (window as any).store;
                // Wait, better to use the hook inside the component. 
                // I will add the hook call above.

                if (isSignUp) {
                    alert(`Mock Mode: Registration successful for ${email}!`);
                }

                onMockLogin(mockUser);
                onClose();
                return;
            }

            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                alert('Verification email sent!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                onClose();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md glass-card p-8 rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
                    >
                        {/* Background blobs */}
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-primary/20 rounded-full blur-3xl" />
                        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-brand-secondary/20 rounded-full blur-3xl" />

                        <div className="relative">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold gradient-text">
                                    {isSignUp ? 'Join WordPang' : 'Welcome Back'}
                                </h2>
                                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                                    <X className="w-5 h-5 text-white/40" />
                                </button>
                            </div>

                            <p className="text-white/60 text-sm mb-8">
                                {isSignUp
                                    ? 'Start creating infinite business synergies today.'
                                    : 'Log in to save your idea boards and continue merging.'}
                            </p>

                            <form onSubmit={handleAuth} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
                                            placeholder="hello@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                {isMock && (
                                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-[10px] font-bold flex items-start gap-2 italic mb-4">
                                        <AlertCircle className="w-3 h-3 shrink-0" />
                                        <span>
                                            MOCK MODE: Supabase environment variables are missing.
                                            Authentication is simulated for demonstration purposes.
                                        </span>
                                    </div>
                                )}

                                {error && (
                                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary font-bold text-sm shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : (
                                        <>
                                            {isSignUp ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                                            {isSignUp ? 'Sign Up' : 'Sign In'}
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 pt-8 border-t border-white/10 text-center">
                                <p className="text-sm text-white/40">
                                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                                    <button
                                        onClick={() => setIsSignUp(!isSignUp)}
                                        className="ml-2 font-bold text-white hover:text-brand-primary transition-colors"
                                    >
                                        {isSignUp ? 'Sign In' : 'Sign Up Free'}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
