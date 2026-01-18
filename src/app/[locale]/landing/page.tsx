'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap, Target, Database, Rocket, GitMerge } from 'lucide-react';
import { Outfit } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'] });

export default function LandingPage() {
    return (
        <div className={`min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden ${outfit.className}`}>
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px] animate-pulse delay-700" />
            </div>

            {/* Navbar */}
            <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <span className="font-black text-lg italic">W</span>
                    </div>
                    <span className="font-bold text-xl tracking-tight">WordPang</span>
                </div>
                <Link
                    href="/en"
                    className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm font-semibold backdrop-blur-md"
                >
                    Launch App
                </Link>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 pt-20 pb-32 px-6">
                <div className="max-w-5xl mx-auto text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-4"
                    >
                        <Zap className="w-3 h-3" />
                        Powered by OpenAI & Supabase
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1]"
                    >
                        Merge Companies.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                            Ignite Synergies.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed"
                    >
                        What happens if <b>Tesla</b> acquires <b>NVIDIA</b>? <br />
                        Explore infinite business possibilities with our AI-powered strategy generator.
                        Real-time S&P 500 data, instant analysis.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
                    >
                        <Link
                            href="/en"
                            className="group relative px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
                        >
                            Start Merging Now
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a
                            href="https://github.com/ohys5004/wordpang"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 font-medium text-white transition-all backdrop-blur-md"
                        >
                            View on GitHub
                        </a>
                    </motion.div>
                </div>

                {/* Visual Demo Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-24 max-w-4xl mx-auto relative group"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                    <div className="relative aspect-video rounded-2xl bg-[#0F0F13] border border-white/10 shadow-2xl overflow-hidden flex flex-col items-center justify-center p-8">
                        {/* Mock UI */}
                        <div className="flex items-center gap-8 mb-8 scale-75 md:scale-100 transition-transform">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center shadow-2xl z-10">
                                <span className="font-bold text-xl">Apple</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-1 bg-white/10 rounded-full mb-1" />
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50">
                                    <GitMerge className="w-4 h-4" />
                                </div>
                                <div className="w-12 h-1 bg-white/10 rounded-full mt-1" />
                            </div>
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-900/50 to-black border border-white/10 flex items-center justify-center shadow-2xl z-10">
                                <span className="font-bold text-xl">Tesla</span>
                            </div>
                        </div>

                        <div className="space-y-3 text-center max-w-lg">
                            <div className="inline-block px-3 py-1 rounded-full bg-brand-primary/20 text-brand-primary text-xs font-bold animate-pulse">
                                AI Analysis Complete
                            </div>
                            <h3 className="text-2xl font-bold text-white">iCar Autonomous Ecosystem</h3>
                            <p className="text-white/50 text-sm">
                                "Combining Apple's ecosystem stickiness with Tesla's FSD technology to create the ultimate living room on wheels."
                            </p>
                        </div>

                        {/* Floating Particles */}
                        <div className="absolute top-10 left-10 w-2 h-2 bg-purple-500 rounded-full animate-ping" />
                        <div className="absolute bottom-10 right-10 w-2 h-2 bg-blue-500 rounded-full animate-ping delay-500" />
                    </div>
                </motion.div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-32">
                    {[
                        {
                            icon: Database,
                            title: "S&P 500 Data",
                            desc: "Access real-time data from 500+ top companies maintained in Supabase."
                        },
                        {
                            icon: Rocket,
                            title: "AI Strategy",
                            desc: "Generate detailed business roadmaps, product ideas, and M&A synergies instantly."
                        },
                        {
                            icon: Target,
                            title: "Investment Insights",
                            desc: "Analyze market caps, funding stages, and potential market dominance."
                        }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-colors"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 text-white/80">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-white/50 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 py-12 text-center text-white/30 text-sm relative z-10 bg-black">
                <p>&copy; 2024 WordPang. Built with Next.js, OpenAI, Supabase.</p>
            </footer>
        </div>
    );
}
