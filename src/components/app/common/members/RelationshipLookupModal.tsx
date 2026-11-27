'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Users, Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { MemberDto } from '@/types/memberType';
import { apiFetch } from '@/services/api/apiClient';
import { useAuth } from '@/components/providers/AuthProvider';

interface RelationshipLookupModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    members: MemberDto[];
}

export function RelationshipLookupModal({
    open,
    onOpenChange,
    members,
}: RelationshipLookupModalProps) {
    const { user } = useAuth();
    const [fromId, setFromId] = useState<string>('');
    const [toId, setToId] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [resultTitle, setResultTitle] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        if (open && members.length > 0) {
            if (!fromId) {
                const defaultFrom = user?.linkedMember?.id
                    ? String(user.linkedMember.id)
                    : String(members[0].id);
                setFromId(defaultFrom);
            }
            if (!toId && members.length > 1) {
                const fallbackTo = members.find((m) => String(m.id) !== fromId) || members[0];
                setToId(String(fallbackTo.id));
            }
        }
    }, [open, members, user, fromId, toId]);

    const memberOptions = members.map((m) => ({
        value: String(m.id),
        label: `${m.fullName} (Đời ${m.generationNumber}${m.branch ? ` • ${m.branch}` : ''})`,
    }));

    const handleLookup = async () => {
        if (!fromId || !toId) return;
        if (fromId === toId) {
            setResultTitle('Cùng một người (Bản thân)');
            setErrorMsg(null);
            return;
        }
        try {
            setLoading(true);
            setErrorMsg(null);
            const res = await apiFetch(`/api/relationships?from=${fromId}&to=${toId}`, {
                cache: 'no-store',
            });
            const json = await res.json();
            if (res.ok && json.success && json.data?.title) {
                setResultTitle(json.data.title);
            } else {
                setErrorMsg(json.message || 'Không thể tra cứu vai vế giữa hai thành viên này.');
                setResultTitle(null);
            }
        } catch {
            setErrorMsg('Lỗi kết nối khi tra cứu vai vế.');
            setResultTitle(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSwap = () => {
        const prevFrom = fromId;
        setFromId(toId);
        setToId(prevFrom);
        setResultTitle(null);
    };

    const personA = members.find((m) => String(m.id) === fromId);
    const personB = members.find((m) => String(m.id) === toId);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent size="md" stickyLayout>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2.5">
                        <Users className="size-5 text-secondary shrink-0" aria-hidden="true" />
                        <span>Tra Cứu Vai Vế &amp; Cách Xưng Hô</span>
                    </DialogTitle>
                    <DialogDescription>
                        Chọn hai thành viên trong dòng họ để xem cách gọi nhau đúng lễ nghi gia tộc.
                    </DialogDescription>
                </DialogHeader>

                <DialogBody className="space-y-5">
                    <div className="space-y-4 p-4 sm:p-5 rounded-xl bg-surface-container-low">
                        <div className="space-y-1.5">
                            <Label htmlFor="relFrom" className="text-sm font-semibold text-on-surface">
                                Người thứ nhất (Người gọi)
                            </Label>
                            <Select
                                id="relFrom"
                                aria-label="Chọn người gọi"
                                value={fromId}
                                onValueChange={(v) => {
                                    setFromId(v);
                                    setResultTitle(null);
                                }}
                                options={memberOptions}
                                className="min-h-11"
                            />
                        </div>

                        <div className="flex justify-center">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleSwap}
                                className="min-h-9 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary text-xs font-semibold gap-1.5 cursor-pointer"
                            >
                                <ArrowLeftRight className="size-3.5" aria-hidden="true" />
                                <span>Đổi chiều xưng hô</span>
                            </Button>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="relTo" className="text-sm font-semibold text-on-surface">
                                Người thứ hai (Người được gọi)
                            </Label>
                            <Select
                                id="relTo"
                                aria-label="Chọn người được gọi"
                                value={toId}
                                onValueChange={(v) => {
                                    setToId(v);
                                    setResultTitle(null);
                                }}
                                options={memberOptions}
                                className="min-h-11"
                            />
                        </div>
                    </div>

                    {errorMsg && (
                        <div className="p-4 rounded-xl bg-primary/10 text-primary text-sm font-medium">
                            {errorMsg}
                        </div>
                    )}

                    {resultTitle && personA && personB && (
                        <div className="p-5 rounded-2xl bg-primary text-on-primary text-center space-y-2">
                            <p className="text-xs sm:text-sm text-on-primary/85">
                                <strong>{personA.fullName}</strong> (Đời {personA.generationNumber}) gọi{' '}
                                <strong>{personB.fullName}</strong> (Đời {personB.generationNumber}) là:
                            </p>
                            <p className="font-serif text-2xl sm:text-3xl font-bold text-secondary-fixed text-balance">
                                {resultTitle}
                            </p>
                        </div>
                    )}
                </DialogBody>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="min-h-11 px-5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface cursor-pointer"
                    >
                        Đóng
                    </Button>
                    <Button
                        type="button"
                        disabled={loading || !fromId || !toId}
                        onClick={handleLookup}
                        className="min-h-11 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold cursor-pointer gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                                <span>Đang tra cứu...</span>
                            </>
                        ) : (
                            <span>Xem Cách Xưng Hô</span>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
