'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { CanvasItem } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function Keyword({ item }: { item: CanvasItem }) {
    const { companies, updateCanvasItem, canvasItems, combineItems, selectItem, selectedItemId, updateCompanyName } = useStore();
    const company = companies.find((c) => c.id === item.companyId);
    const ref = useRef<HTMLDivElement>(null);
    const [isMerging, setIsMerging] = useState(false);

    if (!company) return null;

    const isSelected = selectedItemId === item.id;

    const handleDrag = () => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();

        let foundMatch = false;
        canvasItems.forEach((other) => {
            if (other.id === item.id) return;
            const otherEl = document.getElementById(`keyword-${other.id}`);
            if (!otherEl) return;
            const otherRect = otherEl.getBoundingClientRect();

            const overlap = !(
                rect.right < otherRect.left ||
                rect.left > otherRect.right ||
                rect.bottom < otherRect.top ||
                rect.top > otherRect.bottom
            );

            if (overlap) {
                foundMatch = true;
            }
        });
        setIsMerging(foundMatch);
    };

    const handleDragEnd = async (_: any, info: any) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();

        let targetItemId: string | null = null;
        canvasItems.forEach((other) => {
            if (other.id === item.id) return;
            const otherEl = document.getElementById(`keyword-${other.id}`);
            if (!otherEl) return;
            const otherRect = otherEl.getBoundingClientRect();

            const overlap = !(
                rect.right < otherRect.left ||
                rect.left > otherRect.right ||
                rect.bottom < otherRect.top ||
                rect.top > otherRect.bottom
            );

            if (overlap) {
                targetItemId = other.id;
            }
        });

        if (targetItemId) {
            await combineItems(item.id, targetItemId);
        } else {
            updateCanvasItem(item.id, item.x + info.offset.x, item.y + info.offset.y);
        }
        setIsMerging(false);
    };

    const handleNameSelect = (name: string) => {
        updateCompanyName(company.id, name);
    };

    return (
        <motion.div
            ref={ref}
            id={`keyword-${item.id}`}
            drag
            dragElastic={0.1}
            dragMomentum={false}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0, x: item.x, y: item.y }}
            animate={{
                scale: 1,
                x: item.x,
                y: item.y,
                boxShadow: isMerging ? '0 0 40px rgba(139, 92, 246, 0.6)' : '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
            }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.05 }}
            whileDrag={{ scale: 1.1, zIndex: 100 }}
            onClick={(e) => {
                e.stopPropagation();
                selectItem(item.id);
            }}
            className={cn(
                "absolute cursor-grab active:cursor-grabbing glass-card px-6 py-3 rounded-full border-2 transition-colors",
                isMerging ? "border-brand-primary border-dashed scale-110" : "border-white/10",
                isSelected && "ring-2 ring-brand-primary shadow-[0_0_20px_rgba(139,92,246,0.5)]"
            )}
        >
            <div className="flex flex-col items-center">
                <span className="font-bold whitespace-nowrap text-base">{company.name}</span>
                {company.isHybrid && (
                    <span className="text-[8px] text-brand-secondary font-bold uppercase -mt-0.5 tracking-widest">Hybrid</span>
                )}
            </div>
        </motion.div>
    );
}
