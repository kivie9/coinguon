'use client';

import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { MemberDto } from '@/types/memberType';
import { MemberDetailView } from '@/components/app/common/members/MemberDetailView';
import { DesktopMemberDetailView } from '@/components/app/desktop/members/DesktopMemberDetailView';
import { useDevice } from '@/hooks/useDevice';

interface MobileMemberDetailDrawerProps {
    member: MemberDto | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const MobileMemberDetailDrawer = ({
    member,
    open,
    onOpenChange,
}: MobileMemberDetailDrawerProps) => {
    return (
        <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
            <SheetContent
                side="right"
                fullScreen={true}
                showCloseButton={false}
                className="p-0 flex flex-col bg-surface text-on-surface overflow-y-auto"
            >
                {member && (
                    <MemberDetailView
                        member={member}
                        onBack={() => onOpenChange(false)}
                    />
                )}
            </SheetContent>
        </Sheet>
    );
};
