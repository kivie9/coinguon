'use client';

import React from 'react';
import { Users, BookOpen, Camera } from 'lucide-react';
import { triggerHaptic } from '@/utils/haptics';

export type MemberTabId = 1 | 2 | 3;

interface MemberDetailTabsProps {
    currentTab: MemberTabId;
    onTabChange: (tab: MemberTabId) => void;
}

export const MemberDetailTabs = ({
    currentTab,
    onTabChange,
}: MemberDetailTabsProps) => {
    const handleTabClick = (tab: MemberTabId) => {
        triggerHaptic('selection');
        onTabChange(tab);
    };

    const tabs = [
        {
            id: 1 as MemberTabId,
            icon: Users,
            shortLabel: 'Gia Đình',
            fullLabel: 'Cá Nhân & Gia Đình',
        },
        {
            id: 2 as MemberTabId,
            icon: BookOpen,
            shortLabel: 'Tiểu Sử',
            fullLabel: 'Tiểu Sử & Cống Hiến',
        },
        {
            id: 3 as MemberTabId,
            icon: Camera,
            shortLabel: 'Tư Liệu',
            fullLabel: 'Tư Liệu & Kỷ Niệm',
        },
    ];

    return (
        <div className="sticky top-[56px] sm:top-[60px] z-20 bg-surface px-4 sm:px-6 md:px-8 py-2.5 border-b border-outline-variant/25 select-none">
            <div className="flex items-center gap-1 p-1 bg-surface-container rounded-xl w-full max-w-5xl mx-auto">
                {tabs.map((tab) => {
                    const isActive = currentTab === tab.id;
                    const Icon = tab.icon;

                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => handleTabClick(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-1.5 min-h-10 px-2 sm:px-3 rounded-lg text-xs sm:text-sm transition-colors duration-150 cursor-pointer min-w-0 ${
                                isActive
                                    ? 'bg-primary text-on-primary font-bold'
                                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high font-medium'
                            }`}
                        >
                            <Icon className={`size-4 shrink-0 ${isActive ? 'text-secondary-fixed' : 'text-outline'}`} aria-hidden="true" />
                            <span className="sm:hidden font-semibold truncate">{tab.shortLabel}</span>
                            <span className="hidden sm:inline font-semibold truncate">{tab.fullLabel}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
