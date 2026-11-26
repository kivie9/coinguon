'use client';

import React from 'react';
import { HomeHeroBanner } from './HomeHeroBanner';
import { HomeQuickNav } from './HomeQuickNav';
import { HomeUpcomingAnniversary } from './HomeUpcomingAnniversary';
import { HomeFundWidget } from './HomeFundWidget';
import { HomeNewsFeed } from './HomeNewsFeed';

interface MobileHomeDashboardProps {
    totalMembers?: number;
}

export const MobileHomeDashboard = ({ totalMembers = 520 }: MobileHomeDashboardProps) => {
    return (
        <div className="flex flex-col gap-5 pb-6 text-on-surface">
            {/* 1. Hero Banner Gia Huấn & Đại Lễ */}
            <HomeHeroBanner totalMembers={totalMembers} />

            {/* 2. Tiện Ích Lối Tắt Tộc Sự */}
            <HomeQuickNav />

            {/* 3. Tiêu Điểm Kỵ Nhật Gần Nhất & Tiến Độ Quỹ Tộc (2 cột trên Tablet, 1 cột trên Mobile) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <HomeUpcomingAnniversary />
                <HomeFundWidget />
            </div>

            {/* 5. Bản Tin Di Sản & Tộc Sự */}
            <HomeNewsFeed />
        </div>
    );
};
