'use client';

import React, { useState } from 'react';
import { MemberDto } from '@/types/memberType';
import { deleteMemberApi } from '@/services/api/memberApi';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface AdminMemberDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    member: MemberDto | null;
    onSuccess: () => void;
}

export function AdminMemberDeleteDialog({
    open,
    onOpenChange,
    member,
    onSuccess,
}: AdminMemberDeleteDialogProps) {
    const [deleting, setDeleting] = useState(false);

    if (!member) return null;

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const res = await deleteMemberApi(member.id);
            if (res.success) {
                toast.success(`Đã xóa thành viên "${member.fullName}" khỏi hệ thống.`);
                onOpenChange(false);
                onSuccess();
            } else {
                toast.error(res.message || 'Không thể xóa thành viên.');
            }
        } catch (err) {
            console.error('Lỗi khi xóa thành viên:', err);
            toast.error('Đã xảy ra lỗi khi kết nối máy chủ.');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent size="sm">
                <DialogHeader>
                    <DialogTitle className="font-serif flex items-center gap-2 text-destructive font-bold text-lg">
                        <AlertTriangle className="size-5 text-destructive" aria-hidden="true" />
                        <span>Xác Nhận Xóa Thành Viên</span>
                    </DialogTitle>
                    <DialogDescription className="text-sm pt-2 text-on-surface-variant text-pretty">
                        Hành động này sẽ ẩn thành viên{' '}
                        <strong className="text-on-surface">{member.fullName}</strong> (Đời thứ {member.generationNumber}) khỏi danh sách hiển thị. Bạn có chắc chắn muốn tiếp tục không?
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="pt-4">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={deleting}
                        className="min-h-10 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface cursor-pointer"
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleting}
                        className="min-h-10 px-5 rounded-xl font-semibold cursor-pointer"
                    >
                        {deleting ? (
                            <>
                                <Loader2 className="size-4 mr-2 animate-spin" aria-hidden="true" />
                                <span>Đang xóa...</span>
                            </>
                        ) : (
                            <span>Xác Nhận Xóa</span>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
