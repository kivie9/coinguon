'use client';

import React from 'react';
import {
    Phone,
    MessageCircle,
    GitFork,
    Gift,
    Edit3,
} from 'lucide-react';
import { triggerHaptic } from '@/utils/haptics';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';

interface MemberQuickActionsProps {
    phone?: string | null;
    fullName: string;
    onViewTree: () => void;
}

export const MemberQuickActions = ({
    phone,
    fullName,
    onViewTree,
}: MemberQuickActionsProps) => {
    const handleChat = () => {
        triggerHaptic('light');
        toast.info('Nhắn tin tộc sự', {
            description: `Hệ thống đã kết nối kênh liên lạc gia tộc tới ${fullName}.`,
        });
    };

    const handleLongevityCard = () => {
        triggerHaptic('medium');
        toast.success('Thiệp chúc thọ gia tộc', {
            description: `Kính chúc ${fullName} Thượng Thọ An Khang, Phúc Như Đông Hải, Thọ Tỷ Nam Sơn!`,
        });
    };

    const handleEditProfile = () => {
        triggerHaptic('light');
        toast.info('Cập nhật hồ sơ', {
            description: `Mở biểu mẫu chỉnh sửa thông tin phả hệ cho ${fullName}.`,
        });
    };

    return (
        <div className="flex flex-col bg-surface-container-low select-none">
            <div className="grid grid-cols-4 gap-2 sm:gap-6 px-3 sm:px-6 md:px-8 py-3 max-w-5xl mx-auto w-full">
                <a
                    href={`tel:${phone || '0912345678'}`}
                    className="flex flex-col items-center gap-1.5 group p-2 rounded-xl hover:bg-surface-container transition-colors duration-150 cursor-pointer min-w-0"
                >
                    <div className="size-11 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors duration-150 shrink-0">
                        <Phone className="size-5" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-medium text-on-surface text-center truncate w-full">Gọi điện</span>
                </a>

                <Button
                    variant="ghost"
                    onClick={handleChat}
                    className="flex flex-col items-center gap-1.5 group p-2 h-auto rounded-xl hover:bg-surface-container transition-colors duration-150 cursor-pointer min-w-0"
                >
                    <div className="size-11 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors duration-150 shrink-0">
                        <MessageCircle className="size-5" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-medium text-on-surface text-center truncate w-full">Nhắn tin</span>
                </Button>

                <Button
                    variant="ghost"
                    onClick={onViewTree}
                    className="flex flex-col items-center gap-1.5 group p-2 h-auto rounded-xl hover:bg-surface-container transition-colors duration-150 cursor-pointer min-w-0"
                >
                    <div className="size-11 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors duration-150 shrink-0">
                        <GitFork className="size-5" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-medium text-on-surface text-center truncate w-full">Cây phả hệ</span>
                </Button>

                <Button
                    variant="ghost"
                    onClick={handleLongevityCard}
                    className="flex flex-col items-center gap-1.5 group p-2 h-auto rounded-xl hover:bg-surface-container transition-colors duration-150 cursor-pointer min-w-0"
                >
                    <div className="size-11 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors duration-150 shrink-0">
                        <Gift className="size-5" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-medium text-on-surface text-center truncate w-full">Thiệp thọ</span>
                </Button>
            </div>

            <div className="w-full bg-surface-container-lowest">
                <div className="px-4 sm:px-6 md:px-8 py-3 flex flex-col sm:flex-row gap-2.5 max-w-5xl mx-auto w-full">
                    <Button
                        size="sm"
                        onClick={handleEditProfile}
                        className="flex-1 inline-flex items-center justify-center gap-2 min-h-11 px-4 rounded-xl bg-primary text-on-primary text-sm font-semibold hover:bg-primary-container transition-colors duration-150 cursor-pointer min-w-0"
                    >
                        <Edit3 className="size-4 shrink-0" aria-hidden="true" />
                        <span className="truncate">Chỉnh sửa hồ sơ</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onViewTree}
                        className="flex-1 inline-flex items-center justify-center gap-2 min-h-11 px-4 rounded-xl bg-surface-container text-primary text-sm font-semibold hover:bg-surface-container-high transition-colors duration-150 cursor-pointer min-w-0"
                    >
                        <GitFork className="size-4 shrink-0" aria-hidden="true" />
                        <span className="truncate">Xem sơ đồ trực hệ</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};
