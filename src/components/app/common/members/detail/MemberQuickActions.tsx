'use client';

import React from 'react';
import Link from 'next/link';
import {
    Phone,
    MessageCircle,
    GitFork,
    Printer,
    Edit3,
} from 'lucide-react';
import { triggerHaptic } from '@/utils/haptics';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';

interface MemberQuickActionsProps {
    phone?: string | null;
    fullName: string;
    isAlive?: boolean;
    onViewTree: () => void;
}

export const MemberQuickActions = ({
    phone,
    fullName,
    isAlive = true,
    onViewTree,
}: MemberQuickActionsProps) => {
    const { isAdmin } = useAuth();
    const cleanPhone = phone?.replace(/[^\d+]/g, '') || '';
    const hasRealPhone = isAlive && cleanPhone.length >= 8;

    const handlePrint = () => {
        triggerHaptic('light');
        if (typeof window !== 'undefined') {
            window.print();
        }
    };

    return (
        <div className="flex flex-col bg-surface-container-low select-none print:hidden">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 px-4 sm:px-6 md:px-8 py-4 max-w-5xl mx-auto w-full">
                {hasRealPhone && (
                    <a
                        href={`tel:${cleanPhone}`}
                        className="inline-flex items-center gap-2 min-h-11 px-4 rounded-xl bg-surface-container-lowest hover:bg-primary hover:text-on-primary text-primary font-semibold text-sm transition-colors duration-150 cursor-pointer"
                    >
                        <Phone className="size-4 shrink-0" aria-hidden="true" />
                        <span>Gọi điện ({phone})</span>
                    </a>
                )}

                {hasRealPhone && (
                    <a
                        href={`sms:${cleanPhone}`}
                        className="inline-flex items-center gap-2 min-h-11 px-4 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface font-semibold text-sm transition-colors duration-150 cursor-pointer"
                    >
                        <MessageCircle className="size-4 text-secondary shrink-0" aria-hidden="true" />
                        <span>Nhắn tin SMS</span>
                    </a>
                )}

                <Button
                    variant="ghost"
                    onClick={onViewTree}
                    className="inline-flex items-center gap-2 min-h-11 px-4 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface font-semibold text-sm transition-colors duration-150 cursor-pointer"
                >
                    <GitFork className="size-4 text-primary shrink-0" aria-hidden="true" />
                    <span>Xem cây phả hệ</span>
                </Button>

                <Button
                    variant="ghost"
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 min-h-11 px-4 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface font-semibold text-sm transition-colors duration-150 cursor-pointer"
                >
                    <Printer className="size-4 text-secondary shrink-0" aria-hidden="true" />
                    <span>In hồ sơ (A4)</span>
                </Button>

                {isAdmin && (
                    <Link
                        href="/admin/members"
                        title={`Chỉnh sửa hồ sơ ${fullName} trong trang quản trị`}
                        className="inline-flex items-center gap-2 min-h-11 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm transition-colors duration-150 cursor-pointer"
                    >
                        <Edit3 className="size-4 shrink-0" aria-hidden="true" />
                        <span>Sửa trong Quản trị</span>
                    </Link>
                )}
            </div>
        </div>
    );
};
