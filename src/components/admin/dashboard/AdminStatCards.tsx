'use client';

import React from 'react';
import {
    Users,
    Wallet,
    CalendarDays,
    Shield,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminStatCardsProps {
    totalMembers: number;
    maleCount: number;
    femaleCount: number;
    generationCount: number;
    fundBalance: number;
    upcomingEventDays: number;
    loading?: boolean;
}

export function AdminStatCards({
    totalMembers,
    maleCount,
    femaleCount,
    generationCount,
    fundBalance,
    upcomingEventDays,
    loading = false,
}: AdminStatCardsProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="p-5 bg-surface-container-lowest rounded-2xl">
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    const cards = [
        {
            title: 'Tổng Nhân Khẩu',
            value: totalMembers.toLocaleString('vi-VN'),
            subtitle: `${maleCount} Đinh nam · ${femaleCount} Nữ giới`,
            icon: Users,
            iconTone: 'bg-primary/10 text-primary',
        },
        {
            title: 'Thế Hệ Đã Ghi Phả',
            value: `${generationCount} Đời`,
            subtitle: 'Kế thừa từ Thủy Tổ đến nay',
            icon: Shield,
            iconTone: 'bg-secondary/12 text-secondary',
        },
        {
            title: 'Tồn Quỹ Dòng Họ',
            value: `${(fundBalance / 1000000).toFixed(1)} tr`,
            subtitle: `${fundBalance.toLocaleString('vi-VN')} VNĐ khả dụng`,
            icon: Wallet,
            iconTone: 'bg-secondary/12 text-secondary',
        },
        {
            title: 'Đại Lễ Gần Nhất',
            value: `Còn ${upcomingEventDays} ngày`,
            subtitle: 'Giỗ Tổ Dòng Họ Lê Tộc',
            icon: CalendarDays,
            iconTone: 'bg-primary/10 text-primary',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 tabular-nums">
            {cards.map((card, idx) => {
                const Icon = card.icon;
                return (
                    <Card
                        key={idx}
                        className="bg-surface-container-lowest rounded-2xl"
                    >
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold text-on-surface-variant uppercase">
                                        {card.title}
                                    </p>
                                    <h3 className="font-serif text-2xl font-bold text-primary mt-1">
                                        {card.value}
                                    </h3>
                                    <p className="text-xs text-on-surface-variant mt-1">
                                        {card.subtitle}
                                    </p>
                                </div>
                                <div
                                    className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${card.iconTone}`}
                                >
                                    <Icon className="size-5" aria-hidden="true" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
