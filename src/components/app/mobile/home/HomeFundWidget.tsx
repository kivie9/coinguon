'use client';

import React from 'react';
import { PiggyBank, HeartHandshake } from 'lucide-react';
import { triggerHaptic } from '@/utils/haptics';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { HOME_FUND_DATA } from '@/components/app/common/home/homeData';

interface HomeFundWidgetProps {
    onDonate?: () => void;
}

export const HomeFundWidget = ({ onDonate }: HomeFundWidgetProps) => {
    const handleDonateClick = () => {
        triggerHaptic('medium');
        if (onDonate) {
            onDonate();
        } else {
            toast.info('Công đức Quỹ Dòng Tộc', {
                description: `STK: ${HOME_FUND_DATA.bankAccount} • ${HOME_FUND_DATA.bankName} • ${HOME_FUND_DATA.accountName} • Cú pháp: [Họ Tên] - Cong duc quy toc`,
            });
        }
    };

    const handleStatement = () => {
        triggerHaptic('light');
        toast.info('Báo Cáo Sao Kê Quỹ', {
            description: `Đã cập nhật bảng sao kê Quỹ Dòng Tộc minh bạch niên khóa 2025-2026. Số dư: ${HOME_FUND_DATA.balance}`,
        });
    };

    return (
        <section className="bg-surface-container-low rounded-2xl p-4 flex flex-col gap-3 select-none">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                    <PiggyBank className="size-4.5 text-secondary shrink-0" aria-hidden="true" />
                    <span className="font-serif font-bold text-sm text-primary truncate">
                        {HOME_FUND_DATA.title}
                    </span>
                </div>
                <span className="text-xs font-bold text-secondary shrink-0 tabular-nums">
                    Đạt {HOME_FUND_DATA.percent}%
                </span>
            </div>

            <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                <div
                    className="bg-secondary h-full rounded-full"
                    style={{ width: `${HOME_FUND_DATA.percent}%` }}
                />
            </div>

            <div className="flex items-center justify-between gap-2 pt-0.5">
                <div>
                    <span className="text-xs text-on-surface-variant block">
                        Số dư khả dụng
                    </span>
                    <span className="font-serif font-bold text-base text-primary tabular-nums">
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
                        onClick={handleDonateClick}
                        className="min-h-10 px-3 rounded-lg bg-primary text-on-primary hover:bg-primary-container text-xs font-semibold flex items-center gap-1.5 transition-colors duration-150 cursor-pointer"
                    >
                        <HeartHandshake className="size-3.5" aria-hidden="true" />
                        <span>Công đức</span>
                    </Button>
                </div>
            </div>
        </section>
    );
};
