'use client';

import React, { useEffect, useState } from 'react';
import { CLAN_CONFIG } from '@/config/clanConfig';

interface SplashScreenProps {
    minDisplayTimeMs?: number;
}

export const SplashScreen = ({ minDisplayTimeMs = 900 }: SplashScreenProps) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        const hasShown = sessionStorage.getItem('coinguon_splash_shown');
        if (hasShown) {
            setIsVisible(false);
            return;
        }

        const fadeTimer = setTimeout(() => {
            setIsFading(true);
        }, minDisplayTimeMs);

        const removeTimer = setTimeout(() => {
            setIsVisible(false);
            sessionStorage.setItem('coinguon_splash_shown', 'true');
        }, minDisplayTimeMs + 250);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
        };
    }, [minDisplayTimeMs]);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 z-50 h-dvh flex flex-col items-center justify-center bg-primary text-on-primary select-none transition-opacity duration-200 ease-out ${
                isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            onClick={() => {
                setIsFading(true);
                setTimeout(() => setIsVisible(false), 180);
            }}
        >
            <div className="flex flex-col items-center gap-4 px-6 max-w-sm text-center">
                <div className="size-20 rounded-2xl bg-primary-container flex items-center justify-center">
                    <span className="font-serif text-4xl text-secondary-fixed font-bold">
                        {CLAN_CONFIG.hanNomName}
                    </span>
                </div>

                <div className="flex flex-col items-center gap-1.5">
                    <span className="text-secondary-fixed text-xs font-semibold uppercase">
                        Nhà Thờ Tổ • {CLAN_CONFIG.branchTitle}
                    </span>
                    <h1 className="font-serif text-2xl font-bold text-on-primary text-balance">
                        {CLAN_CONFIG.name.toUpperCase()}
                    </h1>
                    <p className="font-serif text-sm italic text-on-primary/85 mt-1 max-w-xs leading-relaxed text-pretty">
                        &ldquo;Cội Nguồn Dòng Tộc • Lưu Phúc Muôn Đời&rdquo;
                    </p>
                </div>

                <span className="text-xs text-on-primary/70 mt-3">
                    Đang tải dữ liệu phả hệ...
                </span>
            </div>
        </div>
    );
};
