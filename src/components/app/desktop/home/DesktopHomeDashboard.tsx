'use client';

import React from 'react';
import { DesktopHomeHero } from './DesktopHomeHero';
import { DesktopNewsFeed } from './DesktopNewsFeed';
import { DesktopFamilyRules } from './DesktopFamilyRules';
import { DesktopSidebar } from './DesktopSidebar';

interface DesktopHomeDashboardProps {
    totalMembers?: number;
}

export const DesktopHomeDashboard = ({ totalMembers = 520 }: DesktopHomeDashboardProps) => {
    return (
        <div className="flex flex-col gap-8 text-on-surface">
            {/* 1. HERO SHOWCASE BẢN TỘC: 2 Panel ngang chuẩn Desktop Widescreen */}
            <DesktopHomeHero totalMembers={totalMembers} />

            {/* 2. KHÔNG GIAN NỘI DUNG 2 CỘT CHUẨN DESKTOP & TABLET */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
                {/* === CỘT TRÁI: BẢN TIN DI SẢN & LƯỢC SỬ TỪ ĐƯỜNG === */}
                <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-6 lg:gap-8">
                    {/* Danh mục Bản Tin Di Sản & Tộc Sự (Grid 2 cột ngang) */}
                    <DesktopNewsFeed />

                    {/* Lược Sử & Gia Phong Tộc Ước Khai Sáng */}
                    <DesktopFamilyRules />
                </div>

                {/* === CỘT PHẢI: TIỆN ÍCH DÒNG HỌ & QUỸ TỘC === */}
                <div className="md:col-span-5 lg:col-span-4">
                    <DesktopSidebar />
                </div>
            </div>
        </div>
    );
};
