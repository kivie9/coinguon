'use client';

import React, { useState, useEffect } from 'react';
import { MemberDto } from '@/types/memberType';
import { createMemberApi, updateMemberApi } from '@/services/api/memberApi';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { Loader2, UserPlus, Pencil } from 'lucide-react';

export interface MemberParentPreset {
    fatherId?: number;
    motherId?: number;
    generationNumber: number;
    parentName: string;
    branch?: string;
}

interface AdminMemberModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    member?: MemberDto | null;
    parentPreset?: MemberParentPreset | null;
    onSuccess: () => void;
}

export function AdminMemberModal({
    open,
    onOpenChange,
    member,
    parentPreset,
    onSuccess,
}: AdminMemberModalProps) {
    const isEdit = !!member;

    const [fullName, setFullName] = useState('');
    const [courtesyName, setCourtesyName] = useState('');
    const [gender, setGender] = useState<'Male' | 'Female'>('Male');
    const [generationNumber, setGenerationNumber] = useState(1);
    const [isAlive, setIsAlive] = useState<boolean>(true);
    const [birthdaySolar, setBirthdaySolar] = useState('');
    const [deathDayLunar, setDeathDayLunar] = useState('');
    const [burialPlace, setBurialPlace] = useState('');
    const [residence, setResidence] = useState('');
    const [phone, setPhone] = useState('');
    const [bio, setBio] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (member) {
            setFullName(member.fullName || '');
            setCourtesyName(member.courtesyName || '');
            setGender(member.gender?.toLowerCase() === 'female' ? 'Female' : 'Male');
            setGenerationNumber(member.generationNumber || 1);
            setIsAlive(member.isAlive ?? true);
            setBirthdaySolar(member.birthdaySolar || '');
            setDeathDayLunar(member.deathDayLunar || '');
            setBurialPlace(member.burialPlace || '');
            setResidence(member.residence || '');
            setPhone(member.phone || '');
            setBio(member.bio || '');
        } else {
            setFullName('');
            setCourtesyName('');
            setGender('Male');
            setGenerationNumber(parentPreset?.generationNumber ?? 1);
            setIsAlive(true);
            setBirthdaySolar('');
            setDeathDayLunar('');
            setBurialPlace('');
            setResidence('');
            setPhone('');
            setBio('');
        }
    }, [member, parentPreset, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName.trim()) {
            toast.error('Vui lòng nhập họ và tên thành viên.');
            return;
        }

        setSaving(true);
        try {
            const payload = {
                fullName: fullName.trim(),
                courtesyName: courtesyName.trim() || null,
                gender,
                generationNumber: Number(generationNumber),
                isAlive,
                birthdaySolar: birthdaySolar.trim() || null,
                deathDayLunar: !isAlive ? deathDayLunar.trim() || null : null,
                burialPlace: !isAlive ? burialPlace.trim() || null : null,
                residence: residence.trim() || null,
                phone: phone.trim() || null,
                bio: bio.trim() || null,
                ...(parentPreset?.fatherId ? { fatherId: parentPreset.fatherId } : {}),
                ...(parentPreset?.motherId ? { motherId: parentPreset.motherId } : {}),
            };

            const res =
                isEdit && member
                    ? await updateMemberApi(member.id, payload)
                    : await createMemberApi(payload);

            if (res.success) {
                toast.success(
                    isEdit
                        ? 'Cập nhật thông tin thành viên thành công!'
                        : parentPreset
                          ? `Đã thêm con của ${parentPreset.parentName} vào phả hệ!`
                          : 'Thêm mới thành viên vào phả hệ thành công!'
                );
                onOpenChange(false);
                onSuccess();
            } else {
                toast.error(res.message || 'Không thể lưu thông tin thành viên.');
            }
        } catch (err) {
            console.error('Lỗi lưu thành viên:', err);
            toast.error('Đã xảy ra lỗi khi kết nối tới máy chủ.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent size="xl" stickyLayout>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2.5">
                        {isEdit ? (
                            <>
                                <Pencil className="size-5 text-secondary shrink-0" aria-hidden="true" />
                                <span>Chỉnh Sửa Hồ Sơ Thành Viên</span>
                            </>
                        ) : (
                            <>
                                <UserPlus className="size-5 text-secondary shrink-0" aria-hidden="true" />
                                <span>{parentPreset ? 'Thêm Con Trực Hệ' : 'Đăng Ký Thành Viên Mới'}</span>
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        Điền đầy đủ danh tính, thế hệ và thông tin cư trú / kỵ nhật để lưu vào sổ đinh bộ dòng họ.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                    <DialogBody className="space-y-5">
                        {!isEdit && parentPreset && (
                            <div className="p-3.5 bg-surface-container-low rounded-xl text-sm text-on-surface">
                                Tự động liên kết là con của <strong className="text-primary">{parentPreset.parentName}</strong> — đã điền sẵn <strong>Đời thứ {parentPreset.generationNumber}</strong>.
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
                        {/* Cột 1: Thông tin định danh & thế hệ */}
                        <div className="space-y-4 p-4 sm:p-5 rounded-xl bg-surface-container-low">
                            <p className="text-xs font-bold uppercase text-primary">
                                1. Danh Tính &amp; Thế Hệ
                            </p>

                            <div className="space-y-1.5">
                                <Label htmlFor="fullName" className="text-sm font-semibold text-on-surface">
                                    Họ và Tên <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="fullName"
                                    placeholder="Ví dụ: Lê Văn An"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    className="h-11 rounded-xl border-outline-variant/60 bg-surface-container-lowest text-sm"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="courtesyName" className="text-sm font-semibold text-on-surface">
                                    Tên Chữ / Tự Hiệu
                                </Label>
                                <Input
                                    id="courtesyName"
                                    placeholder="Ví dụ: Tự Phúc Đức"
                                    value={courtesyName}
                                    onChange={(e) => setCourtesyName(e.target.value)}
                                    className="h-11 rounded-xl border-outline-variant/60 bg-surface-container-lowest text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div className="space-y-1.5">
                                    <Label htmlFor="gender" className="text-sm font-semibold text-on-surface">
                                        Giới Tính
                                    </Label>
                                    <Select
                                        id="gender"
                                        aria-label="Giới Tính"
                                        value={gender}
                                        onValueChange={(v) => setGender(v as 'Male' | 'Female')}
                                        options={[
                                            { value: 'Male', label: 'Nam (Đinh nam)' },
                                            { value: 'Female', label: 'Nữ giới' },
                                        ]}
                                        className="min-h-11"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="generation" className="text-sm font-semibold text-on-surface">
                                        Đời / Thế Hệ
                                    </Label>
                                    <Input
                                        id="generation"
                                        type="number"
                                        min={1}
                                        max={50}
                                        value={generationNumber}
                                        onChange={(e) => setGenerationNumber(Number(e.target.value))}
                                        className="h-11 rounded-xl border-outline-variant/60 bg-surface-container-lowest tabular-nums text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div className="space-y-1.5">
                                    <Label htmlFor="isAlive" className="text-sm font-semibold text-on-surface">
                                        Tình Trạng
                                    </Label>
                                    <Select
                                        id="isAlive"
                                        aria-label="Tình Trạng"
                                        value={isAlive ? 'true' : 'false'}
                                        onValueChange={(v) => setIsAlive(v === 'true')}
                                        options={[
                                            { value: 'true', label: 'Còn sống' },
                                            { value: 'false', label: 'Đã khuất' },
                                        ]}
                                        className="min-h-11"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="birthDay" className="text-sm font-semibold text-on-surface">
                                        Ngày / Năm Sinh
                                    </Label>
                                    <Input
                                        id="birthDay"
                                        placeholder="Ví dụ: 1985-08-15"
                                        value={birthdaySolar}
                                        onChange={(e) => setBirthdaySolar(e.target.value)}
                                        className="h-11 rounded-xl border-outline-variant/60 bg-surface-container-lowest tabular-nums text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Cột 2: Liên hệ, Kỵ nhật & Phả ký */}
                        <div className="space-y-4 p-4 sm:p-5 rounded-xl bg-surface-container-low">
                            <p className="text-xs font-bold uppercase text-primary">
                                2. Liên Hệ, Mộ Phần &amp; Phả Ký
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div className="space-y-1.5">
                                    <Label htmlFor="memberPhone" className="text-sm font-semibold text-on-surface">
                                        Số Điện Thoại
                                    </Label>
                                    <Input
                                        id="memberPhone"
                                        placeholder="0912..."
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="h-11 rounded-xl border-outline-variant/60 bg-surface-container-lowest tabular-nums text-sm"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="memberResidence" className="text-sm font-semibold text-on-surface">
                                        Nơi Cư Trú Hiện Nay
                                    </Label>
                                    <Input
                                        id="memberResidence"
                                        placeholder="Hà Nội, Hải Dương..."
                                        value={residence}
                                        onChange={(e) => setResidence(e.target.value)}
                                        className="h-11 rounded-xl border-outline-variant/60 bg-surface-container-lowest text-sm"
                                    />
                                </div>
                            </div>

                            {!isAlive && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3.5 bg-surface-container rounded-xl">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="deathDayLunar" className="text-sm font-semibold text-on-surface">
                                            Ngày Giỗ Âm Lịch
                                        </Label>
                                        <Input
                                            id="deathDayLunar"
                                            placeholder="15/07 Âm lịch"
                                            value={deathDayLunar}
                                            onChange={(e) => setDeathDayLunar(e.target.value)}
                                            className="h-11 rounded-xl border-outline-variant/60 bg-surface-container-lowest tabular-nums text-sm"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="burialPlace" className="text-sm font-semibold text-on-surface">
                                            Nơi An Táng / Mộ Phần
                                        </Label>
                                        <Input
                                            id="burialPlace"
                                            placeholder="Nghĩa trang dòng họ..."
                                            value={burialPlace}
                                            onChange={(e) => setBurialPlace(e.target.value)}
                                            className="h-11 rounded-xl border-outline-variant/60 bg-surface-container-lowest text-sm"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <Label htmlFor="bio" className="text-sm font-semibold text-on-surface">
                                    Tiểu Sử / Phả Ký Ghi Chép
                                </Label>
                                <textarea
                                    id="bio"
                                    rows={isAlive ? 6 : 4}
                                    placeholder="Ghi chép công trạng, học vấn, chức tước hoặc tiểu sử..."
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-3.5 text-sm text-on-surface leading-relaxed focus-visible:outline-none focus-visible:border-primary"
                                />
                            </div>
                        </div>
                        </div>
                    </DialogBody>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            disabled={saving}
                            className="min-h-11 px-5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-medium cursor-pointer"
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="submit"
                            disabled={saving}
                            className="min-h-11 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold cursor-pointer"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="size-4 mr-2 animate-spin" aria-hidden="true" />
                                    <span>Đang lưu...</span>
                                </>
                            ) : (
                                <span>{isEdit ? 'Lưu Thay Đổi' : 'Tạo Thành Viên'}</span>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
