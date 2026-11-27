'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import { triggerHaptic } from '@/utils/haptics';

type FontScale = 'normal' | 'large' | 'xlarge';

const STORAGE_KEY = 'giapha_font_scale';

const SCALE_LEVELS: FontScale[] = ['normal', 'large', 'xlarge'];

const SCALE_CONFIG: Record<FontScale, { rootPx: string; label: string; percent: string }> = {
    normal: { rootPx: '16px', label: 'Chuẩn', percent: '100%' },
    large: { rootPx: '19px', label: 'Lớn', percent: '119%' },
    xlarge: { rootPx: '22px', label: 'Rất lớn', percent: '138%' },
};

function applyFontScale(scale: FontScale) {
    if (typeof document === 'undefined') return;
    const html = document.documentElement;
    if (scale === 'normal') {
        html.removeAttribute('data-font-scale');
        html.style.fontSize = '';
    } else {
        html.setAttribute('data-font-scale', scale);
        html.style.fontSize = SCALE_CONFIG[scale].rootPx;
    }
}

interface FontSizeToggleProps {
    compact?: boolean;
    className?: string;
}

/**
 * Thanh chỉnh cỡ chữ trực quan (A- / A / A+) cho người cao tuổi.
 * Điều chỉnh trực tiếp root font-size (16px / 19px / 22px) giúp phóng to toàn bộ chữ, nút và khoảng cách.
 */
export function FontSizeToggle({ compact = false, className }: FontSizeToggleProps) {
    const [scale, setScale] = useState<FontScale>('normal');

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY) as FontScale | null;
            if (saved && SCALE_LEVELS.includes(saved)) {
                setScale(saved);
                applyFontScale(saved);
            }
        } catch {
            // ignore
        }

        const handleSync = (e: Event) => {
            const detail = (e as CustomEvent<FontScale>).detail;
            if (detail && SCALE_LEVELS.includes(detail)) {
                setScale(detail);
                applyFontScale(detail);
            }
        };
        window.addEventListener('giapha-font-scale-change', handleSync);
        return () => window.removeEventListener('giapha-font-scale-change', handleSync);
    }, []);

    const updateScale = (next: FontScale) => {
        triggerHaptic('selection');
        setScale(next);
        applyFontScale(next);
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // ignore
        }
        window.dispatchEvent(new CustomEvent('giapha-font-scale-change', { detail: next }));
    };

    const currentIdx = SCALE_LEVELS.indexOf(scale);

    return (
        <div
            role="group"
            aria-label="Điều chỉnh cỡ chữ"
            className={cn(
                'inline-flex items-center rounded-xl bg-surface-container-low p-1 gap-0.5 shrink-0 select-none',
                className
            )}
        >
            <button
                type="button"
                onClick={() => updateScale(SCALE_LEVELS[Math.max(0, currentIdx - 1)])}
                disabled={currentIdx === 0}
                aria-label="Giảm cỡ chữ"
                title="Thu nhỏ cỡ chữ"
                className="inline-flex items-center justify-center min-h-8 min-w-8 px-2 rounded-lg text-xs font-bold text-on-surface hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer"
            >
                A-
            </button>

            <button
                type="button"
                onClick={() => updateScale('normal')}
                aria-label="Đưa về cỡ chữ chuẩn"
                title={`Cỡ chữ hiện tại: ${SCALE_CONFIG[scale].label} (${SCALE_CONFIG[scale].percent})`}
                className={cn(
                    'inline-flex items-center justify-center min-h-8 px-2 rounded-lg text-xs font-bold transition-colors duration-150 cursor-pointer tabular-nums',
                    scale === 'normal'
                        ? 'bg-surface-container-lowest text-primary'
                        : 'text-on-surface-variant hover:bg-surface-container'
                )}
            >
                {compact ? 'A' : SCALE_CONFIG[scale].label}
            </button>

            <button
                type="button"
                onClick={() => updateScale(SCALE_LEVELS[Math.min(SCALE_LEVELS.length - 1, currentIdx + 1)])}
                disabled={currentIdx === SCALE_LEVELS.length - 1}
                aria-label="Tăng cỡ chữ"
                title="Phóng to cỡ chữ"
                className={cn(
                    'inline-flex items-center justify-center min-h-8 min-w-8 px-2 rounded-lg text-sm font-bold transition-colors duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed',
                    scale !== 'normal'
                        ? 'bg-primary text-on-primary hover:bg-primary-container'
                        : 'text-primary hover:bg-surface-container'
                )}
            >
                A+
            </button>
        </div>
    );
}
