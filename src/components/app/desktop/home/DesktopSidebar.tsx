'use client';

import React from 'react';
import Link from 'next/link';
import {
    Flower2,
    Calendar,
    MapPin,
    ChevronRight,
    PiggyBank,
    HeartHandshake,
    ArrowRight,
} from 'lucide-react';
import { triggerHaptic } from '@/utils/haptics';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { useClan } from '@/components/providers/ClanProvider';
import {
    HOME_UPCOMING_ANNIVERSARY,
    HOME_FUND_DATA,
} from '@/components/app/common/home/homeData';
import { fetchGenerationsApi } from '@/services/api/memberApi';
import { getRomanNumeral } from '@/utils/memberUtils';

interface DesktopSidebarProps {
    generations?: string[];
}

export const DesktopSidebar = ({ generations: initialGenerations }: DesktopSidebarProps = {}) => {
    const { clan } = useClan();
    const [generations, setGenerations] = React.useState<Array<{ generation: number; label: string }>>(() => {
        if (initialGenerations && initialGenerations.length > 0) {
            return initialGenerations.map((label, idx) => ({ generation: idx + 1, label }));
        }
        return [1, 2, 3, 4].map((g) => ({ generation: g, label: `Đời ${getRomanNumeral(g)}` }));
    });

    React.useEffect(() => {
        fetchGenerationsApi().then((res) => {
            if (res.generations && res.generations.length > 0) {
                setGenerations(res.generations.map((g) => ({ generation: g, label: `Đời ${getRomanNumeral(g)}` })));
            }
        });
    }, []);

    const handleDonate = () => {
        triggerHaptic('medium');
        toast.info('Quỹ Dòng Tộc & Công Đức', {
            description: `STK: ${clan.donation.accountNumber} • ${clan.donation.bankName} • ${clan.donation.accountHolder} • Cú pháp: ${clan.donation.syntax}`,
        });
    };

    const handleStatement = () => {
        triggerHaptic('light');
        toast.info('Báo Cáo Sao Kê Quỹ', {
            description: `Đã cập nhật bảng sao kê Quỹ Dòng Tộc minh bạch. Số dư: ${HOME_FUND_DATA.balance}`,
        });
    };

    return (
        <aside className="w-full flex flex-col gap-6 sticky top-20 select-none">
            {/* 1. Kỵ Nhật Gần Nhất */}
            <section className="bg-surface-container-lowest rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase text-secondary">
                        Kỵ Nhật Gần Nhất
                    </span>
                    <span className="text-xs font-semibold text-on-surface-variant">
                        {HOME_UPCOMING_ANNIVERSARY.generation}
                    </span>
                </div>

                <div className="flex items-start gap-3.5">
                    <div className="size-11 rounded-xl bg-secondary/12 flex items-center justify-center text-secondary shrink-0">
                        <Flower2 className="size-5 text-secondary" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-base text-primary text-balance">
                            {HOME_UPCOMING_ANNIVERSARY.name}
                        </h4>
                        <div className="mt-2 flex flex-col gap-1.5 text-xs text-on-surface-variant">
                            <div className="flex items-center gap-1.5 text-primary font-semibold tabular-nums">
                                <Calendar className="size-3.5 shrink-0" aria-hidden="true" />
                                <span>{HOME_UPCOMING_ANNIVERSARY.lunarDate}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MapPin className="size-3.5 text-secondary shrink-0" aria-hidden="true" />
                                <span>{HOME_UPCOMING_ANNIVERSARY.location}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-3 border-t border-outline-variant/25 flex items-center justify-between text-xs">
                    <span className="text-on-surface-variant">
                        Phân công: <strong className="text-primary">{HOME_UPCOMING_ANNIVERSARY.assignedBranch}</strong>
                    </span>
                    <Link
                        href="/events"
                        className="text-primary font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                        <span>Nghi lễ</span>
                        <ChevronRight className="size-3.5" aria-hidden="true" />
                    </Link>
                </div>
            </section>

            {/* 2. Minh Bạch Quỹ Trùng Tu & Khuyến Học */}
            <section className="bg-surface-container-low rounded-2xl p-5 flex flex-col gap-3.5">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <PiggyBank className="size-5 text-secondary shrink-0" aria-hidden="true" />
                        <span className="font-serif font-bold text-sm text-primary">
                            {HOME_FUND_DATA.desktopTitle}
                        </span>
                    </div>
                    <span className="text-xs font-bold text-secondary tabular-nums">
                        Đạt {HOME_FUND_DATA.percent}%
                    </span>
                </div>

                <div className="w-full bg-surface-container-highest rounded-full h-2.5 overflow-hidden">
                    <div
                        className="bg-secondary h-full rounded-full"
                        style={{ width: `${HOME_FUND_DATA.percent}%` }}
                    />
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                    <div>
                        <span className="text-xs text-on-surface-variant block">
                            Số dư khả dụng
                        </span>
                        <span className="font-serif font-bold text-lg text-primary tabular-nums">
                            {HOME_FUND_DATA.balance}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleStatement}
                            className="min-h-10 px-3 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors duration-150 cursor-pointer"
                        >
                            Sao kê
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleDonate}
                            className="min-h-10 px-3.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container text-xs font-semibold flex items-center gap-1.5 transition-colors duration-150 cursor-pointer"
                        >
                            <HeartHandshake className="size-3.5" aria-hidden="true" />
                            <span>Công đức</span>
                        </Button>
                    </div>
                </div>
            </section>

            {/* 3. Lối Tắt Tra Cứu Phả Hệ Theo Đời */}
            <section className="bg-surface-container-lowest rounded-2xl p-5 flex flex-col gap-3.5">
                <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-sm text-primary">
                        Tra Cứu Phả Hệ Theo Đời
                    </h4>
                    <span className="text-xs text-on-surface-variant tabular-nums">{generations.length} Thế Hệ</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {generations.map(({ generation, label }) => (
                        <Link
                            key={generation}
                            href={`/members?gen=${generation}`}
                            className="text-center py-2.5 px-1 rounded-lg bg-surface-container-low hover:bg-primary hover:text-on-primary text-xs font-semibold text-on-surface transition-colors duration-150 cursor-pointer"
                        >
                            {label}
                        </Link>
                    ))}
                </div>
                <Link
                    href="/members"
                    className="min-h-10 text-center py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-primary transition-colors duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                    <span>Xem toàn bộ sơ đồ gia phả</span>
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
            </section>

            {/* 4. Thông Tin Địa Chỉ Từ Đường */}
            <div className="p-4 rounded-2xl bg-surface-container-low text-xs text-on-surface-variant flex items-start gap-3">
                <MapPin className="size-5 text-secondary shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                    <p className="font-serif font-bold text-sm text-primary">{clan.ancestralHall.name}</p>
                    <p className="text-on-surface mt-1 leading-relaxed">{clan.ancestralHall.address}</p>
                    <p className="text-xs text-on-surface-variant mt-1 tabular-nums">
                        Ban Quản Lý: {clan.contact.hotline} ({clan.contact.leader.fullName})
                    </p>
                </div>
            </div>
        </aside>
    );
};
