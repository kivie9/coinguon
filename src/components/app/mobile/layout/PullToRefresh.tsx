'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import { triggerHaptic } from '@/utils/haptics';

interface PullToRefreshProps {
    children: ReactNode;
}

export const PullToRefresh = ({ children }: PullToRefreshProps) => {
    const router = useRouter();
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const startY = useRef(0);
    const pulling = useRef(false);

    const PULL_THRESHOLD = 70;

    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => {
            // Bỏ qua nếu chạm vào thanh điều hướng, nút bấm, drawer hoặc input
            const target = e.target as HTMLElement | null;
            if (target?.closest('nav, header, button, a, [role="dialog"], input')) {
                pulling.current = false;
                return;
            }

            // Chỉ kích hoạt khi đang ở đỉnh trang và kéo từ nửa trên màn hình
            if (window.scrollY <= 0 && e.touches[0].clientY < 250) {
                startY.current = e.touches[0].clientY;
                pulling.current = true;
            } else {
                pulling.current = false;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!pulling.current || isRefreshing || window.scrollY > 0) return;
            const currentY = e.touches[0].clientY;
            const diff = currentY - startY.current;

            if (diff > 5) {
                // Thêm độ kháng cự (resistance) khi kéo
                const distance = Math.min((diff - 5) * 0.4, PULL_THRESHOLD + 15);
                setPullDistance(distance);

                if (distance >= PULL_THRESHOLD && pullDistance < PULL_THRESHOLD) {
                    triggerHaptic('light');
                }
            }
        };

        const handleTouchEnd = () => {
            if (!pulling.current) return;
            pulling.current = false;

            if (pullDistance >= PULL_THRESHOLD) {
                setIsRefreshing(true);
                triggerHaptic('medium');
                setPullDistance(45);

                router.refresh();

                setTimeout(() => {
                    setIsRefreshing(false);
                    setPullDistance(0);
                }, 600);
            } else {
                setPullDistance(0);
            }
        };

        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [pullDistance, isRefreshing, router]);

    return (
        <div className="relative min-h-[calc(100vh-140px)] w-full">
            {/* Vòng xoay trạng thái kéo để làm mới */}
            <div
                style={{
                    height: `${pullDistance}px`,
                    opacity: pullDistance > 10 ? Math.min(pullDistance / 40, 1) : 0,
                    transition: pulling.current ? 'none' : 'height 0.2s ease, opacity 0.2s ease',
                }}
                className="overflow-hidden flex items-center justify-center pointer-events-none select-none text-primary"
            >
                <div className="size-8 rounded-full bg-surface-container-high border border-outline-variant/50 shadow-xs flex items-center justify-center">
                    <RefreshCw
                        className={`size-4 text-primary ${isRefreshing ? 'animate-spin' : ''}`}
                        style={{
                            transform: `rotate(${pullDistance * 4}deg)`,
                        }}
                    />
                </div>
            </div>

            {/* Nội dung trang con */}
            <div
                style={{
                    transform: pullDistance > 0 ? `translateY(${pullDistance * 0.25}px)` : 'none',
                    transition: pulling.current ? 'none' : 'transform 0.2s ease',
                }}
            >
                {children}
            </div>
        </div>
    );
};
