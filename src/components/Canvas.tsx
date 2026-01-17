'use client';

import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import Keyword from './Keyword';

export default function Canvas() {
    const { canvasItems } = useStore();

    return (
        <main
            id="canvas-root"
            className="relative w-full h-screen bg-black bg-grid overflow-hidden pt-16 pr-80"
        >
            <AnimatePresence>
                {canvasItems.map((item) => (
                    <Keyword key={item.id} item={item} />
                ))}
            </AnimatePresence>

            <div className="absolute bottom-8 left-8 text-white/20 text-sm font-medium">
                Drag keywords together to combine them
            </div>
        </main>
    );
}
