'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MemberDto } from '@/types/memberType';
import { triggerHaptic } from '@/utils/haptics';
import { toast } from '@/components/ui/sonner';
import { MemberDetailHeader } from './detail/MemberDetailHeader';
import { MemberHero } from './detail/MemberHero';
import { MemberQuickActions } from './detail/MemberQuickActions';
import { MemberDetailTabs, MemberTabId } from './detail/MemberDetailTabs';
import { MemberPersonalTab } from './detail/MemberPersonalTab';
import { MemberBioTab } from './detail/MemberBioTab';
import { MemberGalleryTab } from './detail/MemberGalleryTab';

interface MemberDetailViewProps {
    member: MemberDto;
    onBack?: () => void;
}

export const MemberDetailView = ({ member, onBack }: MemberDetailViewProps) => {
    const router = useRouter();
    const [currentTab, setCurrentTab] = useState<MemberTabId>(1);

    const handleShare = () => {
        triggerHaptic('light');
        if (typeof navigator !== 'undefined' && navigator.share) {
            navigator
                .share({
                    title: `${member.fullName} • Gia Phả Lê Tộc`,
                    text: `Hồ sơ ${member.fullName} - Đời thứ ${member.generationNumber} (${member.roleTitle || 'Thành viên dòng họ'})`,
                    url: window.location.href,
                })
                .catch(() => {});
        } else if (typeof window !== 'undefined') {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href).catch(() => {});
            }
            toast.success('Đã sao chép liên kết!', {
                description: `Đã sao chép liên kết hồ sơ của ${member.fullName} vào bộ nhớ tạm.`,
            });
        }
    };

    const handleViewTree = () => {
        triggerHaptic('selection');
        onBack?.();
        if (typeof window !== 'undefined' && window.location.pathname !== '/members') {
            router.push('/members');
        }
    };

    return (
        <div className="relative flex min-h-dvh w-full flex-col bg-surface text-on-surface">
            <div className="w-full max-w-5xl mx-auto flex flex-col min-h-dvh bg-surface">
                <MemberDetailHeader
                    fullName={member.fullName}
                    branch={member.branch}
                    onBack={onBack}
                    onShare={handleShare}
                />

                <MemberHero member={member} />

                <MemberQuickActions
                    phone={member.phone}
                    fullName={member.fullName}
                    onViewTree={handleViewTree}
                />

                <MemberDetailTabs
                    currentTab={currentTab}
                    onTabChange={setCurrentTab}
                />

                <div className="flex-1 p-4 sm:p-6 md:p-8 space-y-4 pb-28 sm:pb-20 w-full max-w-5xl mx-auto">
                    {currentTab === 1 && (
                        <MemberPersonalTab
                            member={member}
                            onViewTree={handleViewTree}
                        />
                    )}
                    {currentTab === 2 && <MemberBioTab member={member} />}
                    {currentTab === 3 && <MemberGalleryTab member={member} />}
                </div>
            </div>
        </div>
    );
};
