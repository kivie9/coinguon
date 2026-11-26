'use client';

import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { triggerHaptic } from '@/utils/haptics';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { HOME_EVENT_SPOTLIGHT } from '@/components/app/common/home/homeData';
import { useClan } from '@/components/providers/ClanProvider';

interface HomeHeroBannerProps {
    totalMembers?: number;
    onRegisterEvent?: () => void;
}

export const HomeHeroBanner = ({
    totalMembers = 520,
    onRegisterEvent,
}: HomeHeroBannerProps) => {
    const { clan } = useClan();
    const handleRegister = () => {
        triggerHaptic('medium');
        if (onRegisterEvent) {
            onRegisterEvent();
        } else {
            toast.success('Báo hỷ thành công!', {
                description: 'Ban Trị Sự Từ Đường Chi II đã ghi nhận danh sách tham dự Đại Lễ Khai Xuân Ất Tỵ.',
            });
        }
    };

    return (
        <section className="rounded-2xl bg-primary text-on-primary p-5 flex flex-col gap-4 select-none">
            {/* Gia huấn thượng tôn */}
            <div className="flex flex-col gap-1">
                <span className="text-secondary-fixed text-xs font-bold uppercase">
                    Gia Huấn Trăm Năm
                </span>
                <p className="font-serif text-base italic text-on-primary leading-relaxed text-pretty">
                    &ldquo;Cây có cội mới trổ cành xanh lá • Nước có nguồn mới biển rộng sông sâu&rdquo;
                </p>
            </div>

            {/* Chỉ số thống kê phẳng */}
            <div className="grid grid-cols-3 divide-x divide-on-primary/15 py-3 bg-primary-container rounded-xl tabular-nums">
                <div className="flex flex-col items-center text-center px-2">
                    <span className="font-serif text-xl font-bold text-secondary-fixed">
                        {clan.stats?.generationsCount || 8}
                    </span>
                    <span className="text-xs text-on-primary/85 font-medium mt-0.5">Thế Hệ</span>
                </div>
                <div className="flex flex-col items-center text-center px-2">
                    <span className="font-serif text-xl font-bold text-secondary-fixed">
                        {clan.stats?.totalRegistrations || 342}
                    </span>
                    <span className="text-xs text-on-primary/85 font-medium mt-0.5">Đinh Bộ</span>
                </div>
                <div className="flex flex-col items-center text-center px-2">
                    <span className="font-serif text-xl font-bold text-secondary-fixed">{totalMembers}</span>
                    <span className="text-xs text-on-primary/85 font-medium mt-0.5">Nội Ngoại</span>
                </div>
            </div>

            {/* Thẻ Đại Lễ Tộc Sự Nổi Bật */}
            <div className="bg-primary-container rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                        <span className="text-xs uppercase font-bold text-secondary-fixed block">
                            {HOME_EVENT_SPOTLIGHT.badge}
                        </span>
                        <h2 className="font-serif text-base font-bold text-on-primary mt-1 leading-snug line-clamp-2 text-balance">
                            {HOME_EVENT_SPOTLIGHT.title}
                        </h2>
                        <p className="text-xs text-on-primary/85 mt-1.5 flex items-center gap-1.5 truncate tabular-nums">
                            <Calendar className="size-3.5 text-secondary-fixed shrink-0" aria-hidden="true" />
                            <span className="truncate">{HOME_EVENT_SPOTLIGHT.lunarDate} • Từ Đường Đại Tôn</span>
                        </p>
                    </div>
                    <span className="bg-secondary text-on-secondary px-2.5 py-1 rounded-lg shrink-0 text-xs font-bold tabular-nums">
                        Còn {HOME_EVENT_SPOTLIGHT.daysRemaining} ngày
                    </span>
                </div>

                <Button
                    onClick={handleRegister}
                    className="w-full min-h-11 px-4 rounded-xl bg-secondary-fixed hover:bg-secondary-fixed-dim text-primary font-bold text-sm border-0 transition-colors duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                    <span>Báo hỷ tham dự đại lễ</span>
                    <ArrowRight className="size-4 text-primary" aria-hidden="true" />
                </Button>
            </div>
        </section>
    );
};
