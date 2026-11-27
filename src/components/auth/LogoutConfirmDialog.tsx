'use client';

import React, { useState } from 'react';
import { LogOut, Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface LogoutConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => Promise<void> | void;
    userName?: string | null;
}

export function LogoutConfirmDialog({
    open,
    onOpenChange,
    onConfirm,
    userName,
}: LogoutConfirmDialogProps) {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        try {
            setLoading(true);
            await onConfirm();
            onOpenChange(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent size="sm">
                <DialogHeader>
                    <DialogTitle className="font-serif text-lg font-bold text-primary flex items-center gap-2.5">
                        <span className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <LogOut className="size-4.5" aria-hidden="true" />
                        </span>
                        <span>Xác Nhận Đăng Xuất</span>
                    </DialogTitle>
                    <DialogDescription className="text-sm text-on-surface-variant pt-2 leading-relaxed text-pretty">
                        {userName ? (
                            <>
                                Bạn có chắc chắn muốn đăng xuất khỏi tài khoản{' '}
                                <strong className="text-on-surface">{userName}</strong> không?
                            </>
                        ) : (
                            'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?'
                        )}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="pt-3">
                    <Button
                        type="button"
                        variant="ghost"
                        disabled={loading}
                        onClick={() => onOpenChange(false)}
                        className="min-h-10 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-medium cursor-pointer"
                    >
                        Ở lại
                    </Button>
                    <Button
                        type="button"
                        disabled={loading}
                        onClick={handleConfirm}
                        className="min-h-10 px-5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold cursor-pointer gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                                <span>Đang đăng xuất...</span>
                            </>
                        ) : (
                            <>
                                <LogOut className="size-4" aria-hidden="true" />
                                <span>Đăng xuất</span>
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
