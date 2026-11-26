'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MemberDto } from '@/types/memberType';
import { MemberDetailView } from '@/components/app/common/members/MemberDetailView';
import { DesktopMemberDetailView } from '@/components/app/desktop/members/DesktopMemberDetailView';
import { useDevice } from '@/hooks/useDevice';

export function MemberDetailClient({ member }: { member: MemberDto }) {
    const router = useRouter();
    const { isDesktop, isTablet, isTouch, isIPad } = useDevice();

    const handleBack = () => {
        if (typeof window !== 'undefined') {
            if (window.opener && window.history.length <= 1) {
                window.close();
                return;
            }
            if (window.history.length > 1) {
                router.back();
            } else {
                router.push('/members');
            }
        }
    };

    // Tablet (bao gồm mọi dòng iPad ngang & dọc) và Mobile hiển thị thống nhất qua MemberDetailView
    // Chỉ màn hình Desktop PC / Laptop chuột không cảm ứng màn hình lớn mới hiển thị DesktopMemberDetailView
    const isRealDesktop = isDesktop && !isTablet && !isIPad && !isTouch;

    if (isRealDesktop) {
        return (
            <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-6">
                <DesktopMemberDetailView member={member} onBack={handleBack} />
            </div>
        );
    }

    return <MemberDetailView member={member} onBack={handleBack} />;
}
