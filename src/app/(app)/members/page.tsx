import React from 'react';
import { Metadata } from 'next';
import { memberService } from '@/services/memberService';
import { getSampleHeritageMembers } from '@/services/mappers/memberMapper';
import { getServerAuth } from '@/utils/auth';
import { MobileMemberList } from '@/components/app/mobile/members/MobileMemberList';
import { DesktopMemberExplorer } from '@/components/app/desktop/members/DesktopMemberExplorer';
import { ResponsiveView } from '@/components/common/ResponsiveView';
import { CLAN_CONFIG } from '@/config/clanConfig';

export const metadata: Metadata = {
    title: `Phả Hệ & Danh Sách Thành Viên | ${CLAN_CONFIG.name}`,
    description: 'Tra cứu danh sách thành viên, các đời thế hệ và cây phả hệ dòng tộc.',
};

export default async function MembersPage() {
    const auth = await getServerAuth();
    // Mặc định Khách (Guest) xem dữ liệu Mock, Đăng nhập xem dữ liệu CSDL thực tế
    const members = auth.isGuest
        ? getSampleHeritageMembers()
        : await memberService.getAllEnrichedMembers();

    return (
        <ResponsiveView
            mobile={<MobileMemberList members={members} />}
            desktop={<DesktopMemberExplorer members={members} />}
        />
    );
}
