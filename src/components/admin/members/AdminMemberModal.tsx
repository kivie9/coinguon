'use client';

import React, { useState, useEffect } from 'react';
import { MemberDto } from '@/types/memberType';
import { createMemberApi, updateMemberApi } from '@/services/api/memberApi';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { Loader2, UserPlus, Pencil } from 'lucide-react';

interface AdminMemberModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    member?: MemberDto | null;
    onSuccess: () => void;
}

export function AdminMemberModal({
    open,
    onOpenChange,
    member,
    onSuccess,
}: AdminMemberModalProps) {
    const isEdit = !!member;

    const [fullName, setFullName] = useState('');
    const [courtesyName, setCourtesyName] = useState('');
    const [gender, setGender] = useState<'Male' | 'Female'>('Male');
    const [generationNumber, setGenerationNumber] = useState(1);
    const [branch, setBranch] = useState('Chi Trưởng');
    const [isAlive, setIsAlive] = useState<boolean>(true);
    const [birthdaySolar, setBirthdaySolar] = useState('');
    const [deathDayLunar, setDeathDayLunar] = useState('');
    const [burialPlace, setBurialPlace] = useState('');
    const [spouse, setSpouse] = useState('');
    const [bio, setBio] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (member) {
            setFullName(member.fullName || '');
            setCourtesyName(member.courtesyName || '');
            setGender(member.gender?.toLowerCase() === 'female' ? 'Female' : 'Male');
            setGenerationNumber(member.generationNumber || 1);
            setBranch(member.branch || 'Chi Trưởng');
            setIsAlive(member.isAlive ?? true);
            setBirthdaySolar(member.birthdaySolar || '');
            setDeathDayLunar(member.deathDayLunar || '');
            setBurialPlace(member.burialPlace || '');
            setSpouse(member.spouse || '');
            setBio(member.bio || '');
        } else {
            setFullName('');
            setCourtesyName('');
            setGender('Male');
            setGenerationNumber(1);
            setBranch('Chi Trưởng');
            setIsAlive(true);
            setBirthdaySolar('');
            setDeathDayLunar('');
            setBurialPlace('');
            setSpouse('');
            setBio('');
        }
    }, [member, open]);

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
                gender,
                generationNumber: Number(generationNumber),
                isAlive,
                birthdaySolar: birthdaySolar.trim() || undefined,
                deathDayLunar: !isAlive ? deathDayLunar.trim() || undefined : undefined,
                bio: bio.trim() || undefined,
            };

            let res;
            if (isEdit && member) {
                res = await updateMemberApi(member.id, payload);
            } else {
                res = await createMemberApi(payload);
            }

            if (res.success) {
                toast.success(
                    isEdit
                        ? 'Cập nhật thông tin thành viên thành công!'
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
            <DialogContent className="max-w-lg max-h-[90dvh] overflow-y-auto bg-surface rounded-2xl border-0 p-6">
                <DialogHeader>
                    <DialogTitle className="font-serif flex items-center gap-2 text-lg font-bold text-primary">
                        {isEdit ? (
                            <>
                                <Pencil className="size-5 text-secondary" aria-hidden="true" />
                                <span>Chỉnh Sửa Hồ Sơ Thành Viên</span>
                            </>
                        ) : (
                            <>
                                <UserPlus className="size-5 text-secondary" aria-hidden="true" />
                                <span>Đăng Ký Thành Viên Mới</span>
                            </>
                        )}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="fullName" className="text-xs font-semibold text-on-surface">
                            Họ và Tên <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="fullName"
                            placeholder="Ví dụ: Lê Văn An"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="h-10 rounded-xl border-outline-variant/60 bg-surface-container-lowest"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="courtesyName" className="text-xs font-semibold text-on-surface">
                                Tên Chữ / Tự Hiệu
                            </Label>
                            <Input
                                id="courtesyName"
                                placeholder="Ví dụ: Phúc Đức"
                                value={courtesyName}
                                onChange={(e) => setCourtesyName(e.target.value)}
                                className="h-10 rounded-xl border-outline-variant/60 bg-surface-container-lowest"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="gender" className="text-xs font-semibold text-on-surface">
                                Giới Tính
                            </Label>
                            <select
                                id="gender"
                                value={gender}
                                onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                                className="w-full h-10 rounded-xl border border-outline-variant/60 bg-surface-container-lowest px-3 text-sm text-on-surface focus-visible:outline-none focus-visible:border-primary"
                            >
                                <option value="Male">Nam (Đinh nam)</option>
                                <option value="Female">Nữ giới</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="generation" className="text-xs font-semibold text-on-surface">
                                Đời / Thế Hệ
                            </Label>
                            <Input
                                id="generation"
                                type="number"
                                min={1}
                                max={30}
                                value={generationNumber}
                                onChange={(e) => setGenerationNumber(Number(e.target.value))}
                                className="h-10 rounded-xl border-outline-variant/60 bg-surface-container-lowest tabular-nums"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="branch" className="text-xs font-semibold text-on-surface">
                                Chi / Nhánh Họ
                            </Label>
                            <Input
                                id="branch"
                                placeholder="Chi Trưởng, Chi Hai..."
                                value={branch}
                                onChange={(e) => setBranch(e.target.value)}
                                className="h-10 rounded-xl border-outline-variant/60 bg-surface-container-lowest"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="isAlive" className="text-xs font-semibold text-on-surface">
                                Tình Trạng
                            </Label>
                            <select
                                id="isAlive"
                                value={isAlive ? 'true' : 'false'}
                                onChange={(e) => setIsAlive(e.target.value === 'true')}
                                className="w-full h-10 rounded-xl border border-outline-variant/60 bg-surface-container-lowest px-3 text-sm text-on-surface focus-visible:outline-none focus-visible:border-primary"
                            >
                                <option value="true">Còn sống</option>
                                <option value="false">Đã khuất</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="birthDay" className="text-xs font-semibold text-on-surface">
                                Ngày / Năm Sinh
                            </Label>
                            <Input
                                id="birthDay"
                                placeholder="Ví dụ: 1985-08-15"
                                value={birthdaySolar}
                                onChange={(e) => setBirthdaySolar(e.target.value)}
                                className="h-10 rounded-xl border-outline-variant/60 bg-surface-container-lowest tabular-nums"
                            />
                        </div>
                    </div>

                    {!isAlive && (
                        <div className="p-4 bg-surface-container-low rounded-xl space-y-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="deathDayLunar" className="text-xs font-semibold text-on-surface">
                                    Ngày Giỗ Âm Lịch
                                </Label>
                                <Input
                                    id="deathDayLunar"
                                    placeholder="Ví dụ: 15/07 Âm lịch"
                                    value={deathDayLunar}
                                    onChange={(e) => setDeathDayLunar(e.target.value)}
                                    className="h-10 rounded-xl border-outline-variant/60 bg-surface-container-lowest tabular-nums"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="burialPlace" className="text-xs font-semibold text-on-surface">
                                    Nơi An Táng / Mộ Phần
                                </Label>
                                <Input
                                    id="burialPlace"
                                    placeholder="Ví dụ: Nghĩa trang dòng họ, làng Đông Phù"
                                    value={burialPlace}
                                    onChange={(e) => setBurialPlace(e.target.value)}
                                    className="h-10 rounded-xl border-outline-variant/60 bg-surface-container-lowest"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <Label htmlFor="spouse" className="text-xs font-semibold text-on-surface">
                            Phối Ngẫu (Vợ / Chồng)
                        </Label>
                        <Input
                            id="spouse"
                            placeholder="Ví dụ: Trần Thị Mai"
                            value={spouse}
                            onChange={(e) => setSpouse(e.target.value)}
                            className="h-10 rounded-xl border-outline-variant/60 bg-surface-container-lowest"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="bio" className="text-xs font-semibold text-on-surface">
                            Tiểu Sử / Phả Ký Ghi Chép
                        </Label>
                        <textarea
                            id="bio"
                            rows={3}
                            placeholder="Ghi chép công trạng, học vấn, chức tước hoặc tiểu sử..."
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-3 text-sm text-on-surface focus-visible:outline-none focus-visible:border-primary"
                        />
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            disabled={saving}
                            className="min-h-10 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface cursor-pointer"
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="submit"
                            disabled={saving}
                            className="min-h-10 px-5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold cursor-pointer"
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
