import React from 'react';
import { notFound } from 'next/navigation';
import { memberService } from '@/services/memberService';
import { MemberDetailClient } from './MemberDetailClient';
import { Metadata } from 'next';
import { CLAN_CONFIG } from '@/config/clanConfig';

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const member = await memberService.getMemberByIdEnriched(Number(id));

    if (!member) {
        return {
            title: `Không tìm thấy hồ sơ thành viên | ${CLAN_CONFIG.name}`,
        };
    }

    return {
        title: `${member.fullName} - Hồ Sơ Gia Phả ${CLAN_CONFIG.name}`,
        description: `Hồ sơ chi tiết của ${member.fullName}, Đời thứ ${member.generationNumber} - Dòng Họ ${CLAN_CONFIG.name}.`,
    };
}

export default async function MemberDetailPage({ params }: Props) {
    const { id } = await params;
    const member = await memberService.getMemberByIdEnriched(Number(id));

    if (!member) {
        notFound();
    }

    return <MemberDetailClient member={member} />;
}
