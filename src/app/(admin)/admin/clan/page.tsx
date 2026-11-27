'use client';

import React, { useState, useEffect } from 'react';
import { Landmark, Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { apiFetch } from '@/services/api/apiClient';

export default function AdminClanPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [name, setName] = useState('');
    const [shortName, setShortName] = useState('');
    const [hanNomName, setHanNomName] = useState('');
    const [foundedYear, setFoundedYear] = useState('');
    const [slogan, setSlogan] = useState('');
    const [motto, setMotto] = useState('');
    const [description, setDescription] = useState('');
    const [footerCopyright, setFooterCopyright] = useState('');

    const [hallName, setHallName] = useState('');
    const [hallAddress, setHallAddress] = useState('');
    const [hallProvince, setHallProvince] = useState('');
    const [hallRanking, setHallRanking] = useState('');

    useEffect(() => {
        async function loadClan() {
            try {
                setLoading(true);
                const res = await apiFetch('/api/clan', { cache: 'no-store' });
                if (res.ok) {
                    const json = await res.json();
                    const data = json.data;
                    if (data) {
                        setName(data.name || '');
                        setShortName(data.shortName || '');
                        setHanNomName(data.hanNomName || '');
                        setFoundedYear(data.stats?.foundedYear ? String(data.stats.foundedYear) : '');
                        setSlogan(data.slogan || '');
                        setMotto(data.motto || '');
                        setDescription(data.description || '');
                        setFooterCopyright(data.footerCopyright || '');

                        setHallName(data.ancestralHall?.name || '');
                        setHallAddress(data.ancestralHall?.address || '');
                        setHallProvince(data.ancestralHall?.province || '');
                        setHallRanking(data.ancestralHall?.ranking || '');
                    }
                }
            } catch {
                toast.error('Không thể tải thông tin dòng họ.');
            } finally {
                setLoading(false);
            }
        }
        loadClan();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error('Vui lòng nhập tên dòng họ.');
            return;
        }
        try {
            setSaving(true);
            const res = await apiFetch('/api/clan', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim(),
                    shortName: shortName.trim(),
                    hanNomName: hanNomName.trim(),
                    slogan: slogan.trim(),
                    motto: motto.trim(),
                    description: description.trim(),
                    footerCopyright: footerCopyright.trim(),
                    stats: foundedYear ? { foundedYear: Number(foundedYear) } : undefined,
                    ancestralHall: {
                        name: hallName.trim(),
                        address: hallAddress.trim(),
                        province: hallProvince.trim(),
                        ranking: hallRanking.trim(),
                    },
                }),
            });
            const json = await res.json();
            if (res.ok && json.success) {
                toast.success('Đã lưu thông tin dòng họ thành công.');
            } else {
                toast.error(json.message || 'Cập nhật thông tin dòng họ thất bại.');
            }
        } catch {
            toast.error('Lỗi kết nối khi lưu thông tin dòng họ.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="py-12 text-center text-sm text-on-surface-variant">
                Đang tải cấu hình thông tin dòng họ...
            </div>
        );
    }

    return (
        <form onSubmit={handleSave} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary flex items-center gap-2 text-balance">
                        <Landmark className="size-6 text-secondary" aria-hidden="true" />
                        <span>Thông Tin Dòng Họ &amp; Từ Đường</span>
                    </h2>
                    <p className="text-sm text-on-surface-variant mt-0.5 text-pretty">
                        Cập nhật tên đại tôn, tôn chỉ gia phong và địa chỉ nhà thờ họ hiển thị trên toàn hệ thống.
                    </p>
                </div>

                <Button
                    type="submit"
                    disabled={saving}
                    className="min-h-11 px-5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm cursor-pointer shrink-0"
                >
                    {saving ? (
                        <>
                            <Loader2 className="size-4 mr-2 animate-spin" aria-hidden="true" />
                            <span>Đang lưu...</span>
                        </>
                    ) : (
                        <>
                            <Save className="size-4 mr-2" aria-hidden="true" />
                            <span>Lưu Cấu Hình</span>
                        </>
                    )}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-surface-container-lowest rounded-2xl">
                    <CardHeader className="p-5 pb-3">
                        <CardTitle className="font-serif text-base text-primary">Thông Tin Đại Tôn</CardTitle>
                        <CardDescription className="text-xs text-on-surface-variant">
                            Tên gọi, đại tự Hán Nôm và lời giới thiệu dòng tộc
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 pt-2 space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="clanName" className="text-xs font-semibold text-on-surface">
                                Tên Dòng Họ *
                            </Label>
                            <Input
                                id="clanName"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-10 rounded-xl border-outline-variant/60 bg-surface"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="clanShort" className="text-xs font-semibold text-on-surface">
                                    Tên Ngắn
                                </Label>
                                <Input
                                    id="clanShort"
                                    value={shortName}
                                    onChange={(e) => setShortName(e.target.value)}
                                    className="h-10 rounded-xl border-outline-variant/60 bg-surface"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="clanHanNom" className="text-xs font-semibold text-on-surface">
                                    Đại Tự Hán Nôm
                                </Label>
                                <Input
                                    id="clanHanNom"
                                    value={hanNomName}
                                    onChange={(e) => setHanNomName(e.target.value)}
                                    className="h-10 rounded-xl border-outline-variant/60 bg-surface font-serif"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="clanYear" className="text-xs font-semibold text-on-surface">
                                    Năm Khởi Tổ
                                </Label>
                                <Input
                                    id="clanYear"
                                    type="number"
                                    value={foundedYear}
                                    onChange={(e) => setFoundedYear(e.target.value)}
                                    className="h-10 rounded-xl border-outline-variant/60 bg-surface tabular-nums"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="clanSlogan" className="text-xs font-semibold text-on-surface">
                                Khẩu Hiệu / Tôn Chỉ
                            </Label>
                            <Input
                                id="clanSlogan"
                                value={slogan}
                                onChange={(e) => setSlogan(e.target.value)}
                                className="h-10 rounded-xl border-outline-variant/60 bg-surface"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="clanMotto" className="text-xs font-semibold text-on-surface">
                                Gia Huấn / Lời Răn Tổ Tiên
                            </Label>
                            <Input
                                id="clanMotto"
                                value={motto}
                                onChange={(e) => setMotto(e.target.value)}
                                className="h-10 rounded-xl border-outline-variant/60 bg-surface"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="clanDesc" className="text-xs font-semibold text-on-surface">
                                Giới Thiệu Chung
                            </Label>
                            <textarea
                                id="clanDesc"
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full rounded-xl border border-outline-variant/60 bg-surface p-3 text-sm text-on-surface"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-surface-container-lowest rounded-2xl">
                    <CardHeader className="p-5 pb-3">
                        <CardTitle className="font-serif text-base text-primary">Từ Đường &amp; Bản Quyền</CardTitle>
                        <CardDescription className="text-xs text-on-surface-variant">
                            Địa chỉ nhà thờ họ và thông tin chân trang
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 pt-2 space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="hallName" className="text-xs font-semibold text-on-surface">
                                Tên Từ Đường / Nhà Thờ Họ
                            </Label>
                            <Input
                                id="hallName"
                                value={hallName}
                                onChange={(e) => setHallName(e.target.value)}
                                className="h-10 rounded-xl border-outline-variant/60 bg-surface"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="hallAddress" className="text-xs font-semibold text-on-surface">
                                Địa Chỉ Cụ Thể
                            </Label>
                            <Input
                                id="hallAddress"
                                value={hallAddress}
                                onChange={(e) => setHallAddress(e.target.value)}
                                className="h-10 rounded-xl border-outline-variant/60 bg-surface"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="hallProvince" className="text-xs font-semibold text-on-surface">
                                    Tỉnh / Thành Phố
                                </Label>
                                <Input
                                    id="hallProvince"
                                    value={hallProvince}
                                    onChange={(e) => setHallProvince(e.target.value)}
                                    className="h-10 rounded-xl border-outline-variant/60 bg-surface"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="hallRanking" className="text-xs font-semibold text-on-surface">
                                    Xếp Hạng Di Tích
                                </Label>
                                <Input
                                    id="hallRanking"
                                    value={hallRanking}
                                    onChange={(e) => setHallRanking(e.target.value)}
                                    className="h-10 rounded-xl border-outline-variant/60 bg-surface"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="footerCopy" className="text-xs font-semibold text-on-surface">
                                Dòng Bản Quyền Chân Trang
                            </Label>
                            <Input
                                id="footerCopy"
                                value={footerCopyright}
                                onChange={(e) => setFooterCopyright(e.target.value)}
                                className="h-10 rounded-xl border-outline-variant/60 bg-surface"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </form>
    );
}
