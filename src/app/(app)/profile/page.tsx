import React from 'react';
import { Metadata } from 'next';
import { LineageProfile } from '@/components/app/common/profile/LineageProfile';
import { DesktopLineageProfile } from '@/components/app/desktop/profile/DesktopLineageProfile';
import { ResponsiveView } from '@/components/common/ResponsiveView';
import { CLAN_CONFIG } from '@/config/clanConfig';

export const metadata: Metadata = {
    title: `Tư Liệu & Hồ Sơ Dòng Tộc | ${CLAN_CONFIG.name}`,
    description: 'Hồ sơ bản tộc, gia huấn tiền nhân, tư liệu nhà thờ tổ và các công trình tâm linh.',
};

export default function ProfilePage() {
    return (
        <ResponsiveView
            mobile={<LineageProfile />}
            desktop={<DesktopLineageProfile />}
        />
    );
}
