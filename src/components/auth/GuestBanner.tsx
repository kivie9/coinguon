'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Eye, LogIn, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthModal } from './AuthModal';

interface GuestBannerProps {
    onOpenAuth?: () => void;
}

export function GuestBanner({ onOpenAuth }: GuestBannerProps) {
    const { isGuest, switchDemoRole } = useAuth();
    const [dismissed, setDismissed] = useState(false);
    const [authModalOpen, setAuthModalOpen] = useState(false);

    if (!isGuest || dismissed) return null;

    const handleLoginClick = () => {
        if (onOpenAuth) {
            onOpenAuth();
        } else {
            setAuthModalOpen(true);
        }
    };

    return (
        <>
            <div className="bg-surface-container px-4 py-2.5 select-none">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
                    <div className="flex items-center gap-2.5 text-on-surface">
                        <Eye className="size-4 text-secondary shrink-0" aria-hidden="true" />
                        <span>
                            <strong className="font-semibold text-primary">Chế độ Khách (Dữ liệu mẫu):</strong>{' '}
                            Đăng nhập để xem phả ký, ngày kỵ nhật và sổ quỹ thực tế của dòng tộc.
                        </span>
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                        <Button
                            size="sm"
                            onClick={handleLoginClick}
                            className="h-9 px-3 text-xs font-semibold rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors duration-150 gap-1.5 cursor-pointer"
                        >
                            <LogIn className="size-3.5" aria-hidden="true" />
                            <span>Đăng nhập</span>
                        </Button>

                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => switchDemoRole('MEMBER')}
                            className="h-9 px-3 text-xs font-semibold rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors duration-150 cursor-pointer"
                            title="Bật chế độ xem thực tế của Thành viên"
                        >
                            <span>Trải nghiệm thành viên</span>
                        </Button>

                        <button
                            type="button"
                            onClick={() => setDismissed(true)}
                            aria-label="Đóng thông báo chế độ khách"
                            className="size-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-150 cursor-pointer"
                        >
                            <X className="size-4" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>

            {!onOpenAuth && (
                <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
            )}
        </>
    );
}
