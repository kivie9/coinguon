import React from 'react';
import { Metadata } from 'next';
import { memberService } from '@/services/memberService';
import { MobileHomeDashboard } from '@/components/app/mobile/home/MobileHomeDashboard';
import { DesktopHomeDashboard } from '@/components/app/desktop/home/DesktopHomeDashboard';
import { ResponsiveView } from '@/components/common/ResponsiveView';
import { CLAN_CONFIG } from '@/config/clanConfig';

export const metadata: Metadata = {
    title: `${CLAN_CONFIG.name} • ${CLAN_CONFIG.slogan}`,
    description: `Trang thông tin tổng quan, lịch sử nhà thờ tổ và gia phả ${CLAN_CONFIG.branchFullTitle}.`,
};

export default async function HomePage() {
    const members = await memberService.getAllEnrichedMembers();

    return (
        <ResponsiveView
            mobile={<MobileHomeDashboard totalMembers={members.length} />}
            desktop={<DesktopHomeDashboard totalMembers={members.length} />}
        />
    );
}
