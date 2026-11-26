'use client';

import React from 'react';
import { ArrowLeft, Share2 } from 'lucide-react';
import { triggerHaptic } from '@/utils/haptics';
import { Button } from '@/components/ui/button';

interface MemberDetailHeaderProps {
    fullName: string;
    branch?: string | null;
    onBack?: () => void;
    onShare: () => void;
}

export const MemberDetailHeader = ({
    branch,
    onBack,
    onShare,
}: MemberDetailHeaderProps) => {
    return (
        <header className="sticky top-0 z-30 bg-surface-container-lowest border-b border-outline-variant/25 select-none">
            <div className="flex items-center justify-between px-3 sm:px-6 md:px-8 py-2.5 sm:py-3 w-full max-w-5xl mx-auto pt-safe">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                        triggerHaptic('light');
                        onBack?.();
                    }}
                    aria-label="Quay lại"
                    className="size-10 rounded-xl hover:bg-surface-container-low text-on-surface transition-colors duration-150 cursor-pointer shrink-0"
                >
                    <ArrowLeft className="size-5 text-on-surface" aria-hidden="true" />
                </Button>

                <div className="flex flex-col items-center min-w-0 px-2 text-center max-w-[68%] sm:max-w-[75%]">
                    <span className="font-serif text-primary text-base font-bold truncate w-full">
                        Hồ Sơ Thành Viên
                    </span>
                    <span className="text-xs text-secondary font-medium uppercase truncate w-full">
                        {branch || 'Lê Tộc Đại Tôn • Chi 2'}
                    </span>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onShare}
                    aria-label="Chia sẻ hồ sơ"
                    className="size-10 rounded-xl hover:bg-surface-container-low text-primary transition-colors duration-150 cursor-pointer shrink-0"
                    title="Chia sẻ hồ sơ"
                >
                    <Share2 className="size-5 text-primary" aria-hidden="true" />
                </Button>
            </div>
        </header>
    );
};
