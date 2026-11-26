'use client';

import React, { useState, useEffect } from 'react';
import {
    Calendar,
    CalendarPlus,
    MapPin,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { fetchEventsApi, LineageEventDto } from '@/services/api/eventApi';

export function AdminEventManager() {
    const [events, setEvents] = useState<LineageEventDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);

    const [title, setTitle] = useState('');
    const [dateLunar, setDateLunar] = useState('');
    const [dateSolar, setDateSolar] = useState('');
    const [location, setLocation] = useState('Từ đường Gia tộc, làng Đông Phù');
    const [role, setRole] = useState('Toàn thể con cháu');

    useEffect(() => {
        let isMounted = true;
        async function load() {
            setLoading(true);
            try {
                const data = await fetchEventsApi();
                if (isMounted) setEvents(data);
            } catch (err) {
                console.error('Lỗi khi tải danh sách sự kiện:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        load();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleCreateEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error('Vui lòng nhập tên ngày lễ / sự kiện.');
            return;
        }

        const newEvent: LineageEventDto = {
            id: Date.now(),
            title: title.trim(),
            dateSolar: dateSolar.trim() || '20/11/2026',
            dateLunar: dateLunar.trim() || '15/10 Âm lịch',
            location: location.trim(),
            role: role.trim() || 'Toàn thể tộc nhân',
            status: 'Sắp diễn ra',
            featured: false,
        };

        setEvents([newEvent, ...events]);
        toast.success(`Đã thêm sự kiện "${title}" vào lịch tế lễ dòng họ!`);
        setDialogOpen(false);
        setTitle('');
        setDateLunar('');
        setDateSolar('');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary flex items-center gap-2 text-balance">
                        <Calendar className="size-6 text-secondary" aria-hidden="true" />
                        <span>Quản Lý Lễ Tiết &amp; Giỗ Chạp Tộc Phả</span>
                    </h2>
                    <p className="text-sm text-on-surface-variant mt-0.5">
                        Lập kế hoạch tổ chức ngày giỗ tổ, lễ thanh minh, tảo mộ và họp họ thường niên
                    </p>
                </div>

                <Button
                    onClick={() => setDialogOpen(true)}
                    className="min-h-11 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm shrink-0 transition-colors duration-150 cursor-pointer"
                >
                    <CalendarPlus className="size-4 mr-2" aria-hidden="true" />
                    <span>Lập Sự Kiện Mới</span>
                </Button>
            </div>

            {/* Event List Table */}
            <Card className="bg-surface-container-lowest rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-surface-container-low border-b border-outline-variant/30">
                                <TableHead className="w-20">Mã</TableHead>
                                <TableHead>Tên Lễ / Sự Kiện</TableHead>
                                <TableHead>Ngày Âm Lịch</TableHead>
                                <TableHead>Ngày Dương Lịch</TableHead>
                                <TableHead>Địa Điểm</TableHead>
                                <TableHead>Đối Tượng Tham Gia</TableHead>
                                <TableHead className="text-right">Trạng Thái</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-on-surface-variant">
                                        Đang tải dữ liệu sự kiện...
                                    </TableCell>
                                </TableRow>
                            ) : events.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-on-surface-variant">
                                        Chưa có sự kiện nào trong hệ thống.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                events.map((evt) => (
                                    <TableRow key={evt.id} className="hover:bg-surface-container-low/60 border-b border-outline-variant/20 tabular-nums">
                                        <TableCell className="font-mono text-xs text-on-surface-variant font-semibold">
                                            #{evt.id}
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-serif font-bold text-sm text-on-surface">{evt.title}</p>
                                        </TableCell>
                                        <TableCell className="text-xs font-bold text-secondary">
                                            {evt.dateLunar}
                                        </TableCell>
                                        <TableCell className="text-xs text-on-surface-variant font-medium">
                                            {evt.dateSolar}
                                        </TableCell>
                                        <TableCell className="text-xs text-on-surface-variant max-w-xs truncate font-sans">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="size-3.5 text-secondary shrink-0" aria-hidden="true" />
                                                <span className="truncate">{evt.location}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs font-sans">
                                            <div className="flex items-center gap-1.5 text-on-surface-variant">
                                                <Users className="size-3.5 text-outline shrink-0" aria-hidden="true" />
                                                <span>{evt.role}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-primary/10 text-primary">
                                                {evt.status || 'Sắp diễn ra'}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Modal Lập Sự Kiện */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-md bg-surface rounded-2xl border-0 p-6">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-lg font-bold text-primary flex items-center gap-2">
                            <CalendarPlus className="size-5 text-secondary" aria-hidden="true" />
                            <span>Lập Lễ Tiết &amp; Sự Kiện Mới</span>
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleCreateEvent} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="evtTitle" className="text-xs font-semibold text-on-surface">
                                Tên Sự Kiện / Ngày Lễ <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="evtTitle"
                                placeholder="Ví dụ: Giỗ Thủy Tiền Bối Đời Thứ 2"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="h-10 rounded-xl border-outline-variant/60 bg-surface-container-lowest"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="evtLunar" className="text-xs font-semibold text-on-surface">
                                    Ngày Âm Lịch
                                </Label>
                                <Input
                                    id="evtLunar"
                                    placeholder="Ví dụ: 12/03 Âm lịch"
                                    value={dateLunar}
                                    onChange={(e) => setDateLunar(e.target.value)}
                                    className="h-10 rounded-xl border-outline-variant/60 bg-surface-container-lowest tabular-nums"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="evtSolar" className="text-xs font-semibold text-on-surface">
                                    Ngày Dương Lịch
                                </Label>
                                <Input
                                    id="evtSolar"
                                    placeholder="Ví dụ: 20/11/2026"
                                    value={dateSolar}
                                    onChange={(e) => setDateSolar(e.target.value)}
                                    className="h-10 rounded-xl border-outline-variant/60 bg-surface-container-lowest tabular-nums"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="evtLocation" className="text-xs font-semibold text-on-surface">
                                Địa Điểm Tổ Chức
                            </Label>
                            <Input
                                id="evtLocation"
                                placeholder="Từ đường Gia tộc, làng Đông Phù..."
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="h-10 rounded-xl border-outline-variant/60 bg-surface-container-lowest"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="evtRole" className="text-xs font-semibold text-on-surface">
                                Đối Tượng / Vai Vế Chủ Trì
                            </Label>
                            <Input
                                id="evtRole"
                                placeholder="Ví dụ: Ban Trị Sự & Chi Trưởng..."
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="h-10 rounded-xl border-outline-variant/60 bg-surface-container-lowest"
                            />
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setDialogOpen(false)}
                                className="min-h-10 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface cursor-pointer"
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                className="min-h-10 px-5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold cursor-pointer"
                            >
                                Tạo Sự Kiện
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
