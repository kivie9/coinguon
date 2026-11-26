'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Flower2, Calendar, MapPin, ChevronRight } from 'lucide-react';
import { triggerHaptic } from '@/utils/haptics';
import { Button } from '@/components/ui/button';
import { HOME_UPCOMING_ANNIVERSARY } from '@/components/app/common/home/homeData';

export const HomeUpcomingAnniversary = () => {
    const router = useRouter();

    const handleViewRituals = () => {
        triggerHaptic('selection');
        router.push('/events');
    };

    return (
        <section className="bg-surface-container-lowest rounded-2xl p-4 space-y-3 select-none">
            <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase text-secondary">
                    Kỵ Nhật Gần Nhất
                </span>
                <span className="text-xs text-on-surface-variant font-medium">
                    {HOME_UPCOMING_ANNIVERSARY.shortGeneration}
                </span>
            </div>

            <div className="flex items-start gap-3">
                <div className="size-10 rounded-xl bg-secondary/12 flex items-center justify-center text-secondary shrink-0">
                    <Flower2 className="size-5 text-secondary" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-base text-primary text-balance">
                        {HOME_UPCOMING_ANNIVERSARY.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-on-surface-variant mt-1.5">
                        <span className="flex items-center gap-1 font-semibold text-primary tabular-nums">
                            <Calendar className="size-3.5 shrink-0" aria-hidden="true" />
                            <span>{HOME_UPCOMING_ANNIVERSARY.lunarDate}</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <MapPin className="size-3.5 text-secondary shrink-0" aria-hidden="true" />
                            <span>{HOME_UPCOMING_ANNIVERSARY.location}</span>
                        </span>
                    </div>
                </div>
            </div>

            <div className="pt-2.5 border-t border-outline-variant/25 flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">
                    Phân công: <strong className="text-on-surface">{HOME_UPCOMING_ANNIVERSARY.assignedBranch}</strong>
                </span>
                <Button
                    variant="link"
                    size="xs"
                    onClick={handleViewRituals}
                    className="text-primary font-bold hover:underline flex items-center gap-0.5 cursor-pointer h-auto p-0 text-xs"
                >
                    <span>Nghi lễ</span>
                    <ChevronRight className="size-3.5" aria-hidden="true" />
                </Button>
            </div>
        </section>
    );
};
