'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { GitFork, CalendarDays, Landmark, BookOpen } from 'lucide-react';
import { triggerHaptic } from '@/utils/haptics';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { HOME_FUND_DATA } from '@/components/app/common/home/homeData';

interface HomeQuickNavProps {
    onDonate?: () => void;
}

export const HomeQuickNav = ({ onDonate }: HomeQuickNavProps) => {
    const router = useRouter();

    const handleSwitchTab = (path: string) => {
        triggerHaptic('selection');
        router.push(path);
    };

    const handleDonateClick = () => {
        triggerHaptic('medium');
        if (onDonate) {
            onDonate();
        } else {
            toast.info('Quỹ Dòng Tộc & Công Đức', {
                description: `STK: ${HOME_FUND_DATA.bankAccount} • ${HOME_FUND_DATA.bankName} • ${HOME_FUND_DATA.accountName} • Cú pháp: [Họ Tên] - Cong duc`,
            });
        }
    };

    const items = [
        {
            label: 'Tra Cứu\nPhả Hệ',
            icon: GitFork,
            onClick: () => handleSwitchTab('/members'),
        },
        {
            label: 'Lịch Giỗ\nDòng Họ',
            icon: CalendarDays,
            onClick: () => handleSwitchTab('/events'),
        },
        {
            label: 'Quỹ Tộc\nCông Đức',
            icon: Landmark,
            onClick: handleDonateClick,
        },
        {
            label: 'Tộc Ước\nLược Sử',
            icon: BookOpen,
            onClick: () => handleSwitchTab('/profile'),
        },
    ];

    return (
        <section className="flex flex-col gap-2.5 select-none">
            <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-primary">Tiện Ích Tộc Sự</h3>
                <span className="text-xs text-on-surface-variant font-medium">Truy cập nhanh</span>
            </div>
            <div className="grid grid-cols-4 gap-2.5">
                {items.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Button
                            key={item.label}
                            variant="ghost"
                            onClick={item.onClick}
                            className="group flex flex-col items-center text-center p-3 h-auto rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-colors duration-150 cursor-pointer border-0"
                        >
                            <div className="size-11 rounded-xl bg-primary/10 group-hover:bg-primary group-hover:text-on-primary flex items-center justify-center text-primary mb-1.5 transition-colors duration-150">
                                <Icon className="size-5" aria-hidden="true" />
                            </div>
                            <span className="text-xs font-semibold text-on-surface leading-tight whitespace-pre-line">
                                {item.label}
                            </span>
                        </Button>
                    );
                })}
            </div>
        </section>
    );
};
