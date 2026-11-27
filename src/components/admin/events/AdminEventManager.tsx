'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Calendar,
    CalendarPlus,
    MapPin,
    Users,
    Pencil,
    Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
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
    DialogBody,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { fetchEventsApi, LineageEventDto } from '@/services/api/eventApi';
import { apiFetch } from '@/services/api/apiClient';

export function AdminEventManager() {
    const [events, setEvents] = useState<LineageEventDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<LineageEventDto | null>(null);
    const [saving, setSaving] = useState(false);

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<'FESTIVAL' | 'ANNIVERSARY' | 'EDUCATION' | 'MEETING'>('FESTIVAL');
    const [dateLunar, setDateLunar] = useState('');
    const [dateSolar, setDateSolar] = useState('');
    const [location, setLocation] = useState('Từ đường Gia tộc');
    const [role, setRole] = useState('Toàn thể con cháu');
    const [description, setDescription] = useState('');

    const [deletingEvent, setDeletingEvent] = useState<LineageEventDto | null>(null);
    const [deleting, setDeleting] = useState(false);

    const loadEvents = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchEventsApi();
            setEvents(data);
        } catch (err) {
            console.error('Lỗi khi tải danh sách sự kiện:', err);
            toast.error('Không thể tải danh sách sự kiện.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadEvents();
    }, [loadEvents]);

    const openCreateDialog = () => {
        setEditingEvent(null);
        setTitle('');
        setCategory('FESTIVAL');
        setDateLunar('');
        setDateSolar(new Date().toISOString().split('T')[0]);
        setLocation('Từ đường Gia tộc');
        setRole('Toàn thể con cháu');
        setDescription('');
        setDialogOpen(true);
    };

    const openEditDialog = (evt: LineageEventDto) => {
        setEditingEvent(evt);
        setTitle(evt.title);
        setCategory(evt.category || 'FESTIVAL');
        setDateLunar(evt.dateLunar || '');
        setDateSolar(evt.targetDate || evt.dateSolar || '');
        setLocation(evt.location || '');
        setRole(evt.role || '');
        setDescription(evt.description || '');
        setDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error('Vui lòng nhập tên ngày lễ / sự kiện.');
            return;
        }

        const payload = {
            title: title.trim(),
            category,
            eventDateLunar: dateLunar.trim(),
            eventDateSolar: dateSolar.trim(),
            location: location.trim() || 'Từ đường Gia tộc',
            roleAudience: role.trim() || 'Toàn thể con cháu',
            description: description.trim(),
        };

        try {
            setSaving(true);
            const url = editingEvent ? `/api/events/${editingEvent.id}` : '/api/events';
            const method = editingEvent ? 'PUT' : 'POST';

            const res = await apiFetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const json = await res.json();

            if (!res.ok || !json.success) {
                toast.error(json.message || 'Không thể lưu sự kiện.');
                return;
            }

            toast.success(
                editingEvent
                    ? `Đã cập nhật sự kiện "${title.trim()}".`
                    : `Đã lưu sự kiện "${title.trim()}" vào cơ sở dữ liệu.`
            );
            setDialogOpen(false);
            await loadEvents();
        } catch {
            toast.error('Lỗi kết nối khi lưu sự kiện.');
        } finally {
            setSaving(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deletingEvent) return;
        try {
            setDeleting(true);
            const res = await apiFetch(`/api/events/${deletingEvent.id}`, {
                method: 'DELETE',
            });
            const json = await res.json();
            if (!res.ok || !json.success) {
                toast.error(json.message || 'Không thể xóa sự kiện.');
                return;
            }
            toast.success(`Đã xóa sự kiện "${deletingEvent.title}".`);
            setDeletingEvent(null);
            await loadEvents();
        } catch {
            toast.error('Lỗi kết nối khi xóa sự kiện.');
        } finally {
            setDeleting(false);
        }
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
                    <p className="text-sm text-on-surface-variant mt-0.5 text-pretty">
                        Lập kế hoạch tổ chức ngày giỗ tổ, lễ thanh minh, tảo mộ và họp họ thường niên
                    </p>
                </div>

                <Button
                    onClick={openCreateDialog}
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
                                <TableHead>Đối Tượng</TableHead>
                                <TableHead>Trạng Thái</TableHead>
                                <TableHead className="text-right w-24">Thao Tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-24 text-center text-on-surface-variant">
                                        Đang tải dữ liệu sự kiện...
                                    </TableCell>
                                </TableRow>
                            ) : events.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-24 text-center text-on-surface-variant">
                                        Chưa có sự kiện nào trong hệ thống.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                events.map((evt) => {
                                    // Sự kiện có ID >= 1000 là kỵ nhật tự động sinh từ hồ sơ thành viên đã khuất
                                    const isAutoAnniversary = evt.id >= 1000 && evt.category === 'ANNIVERSARY';
                                    return (
                                        <TableRow
                                            key={evt.id}
                                            className="hover:bg-surface-container-low/60 border-b border-outline-variant/20 tabular-nums"
                                        >
                                            <TableCell className="font-mono text-xs text-on-surface-variant font-semibold">
                                                #{evt.id}
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-serif font-bold text-sm text-on-surface">{evt.title}</p>
                                            </TableCell>
                                            <TableCell className="text-xs font-bold text-secondary">
                                                {evt.dateLunar || '—'}
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
                                                    <span className="truncate max-w-[160px]">{evt.role}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-primary/10 text-primary">
                                                    {evt.status || 'Sắp diễn ra'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {isAutoAnniversary ? (
                                                    <span className="text-xs text-on-surface-variant" title="Tự động tạo từ ngày mất thành viên">
                                                        Tự động
                                                    </span>
                                                ) : (
                                                    <div className="inline-flex items-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            aria-label={`Sửa sự kiện ${evt.title}`}
                                                            onClick={() => openEditDialog(evt)}
                                                            className="size-8 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface cursor-pointer"
                                                        >
                                                            <Pencil className="size-3.5" aria-hidden="true" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            aria-label={`Xóa sự kiện ${evt.title}`}
                                                            onClick={() => setDeletingEvent(evt)}
                                                            className="size-8 rounded-lg bg-surface-container-low hover:bg-primary/10 text-primary cursor-pointer"
                                                        >
                                                            <Trash2 className="size-3.5" aria-hidden="true" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Modal Lập / Sửa Sự Kiện */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent size="lg" stickyLayout>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2.5">
                            <CalendarPlus className="size-5 text-secondary shrink-0" aria-hidden="true" />
                            <span>{editingEvent ? 'Chỉnh Sửa Sự Kiện' : 'Lập Lễ Tiết & Sự Kiện Mới'}</span>
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                        <DialogBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2 space-y-1.5">
                                <Label htmlFor="evtTitle" className="text-sm font-semibold text-on-surface">
                                    Tên Sự Kiện / Ngày Lễ *
                                </Label>
                                <Input
                                    id="evtTitle"
                                    placeholder="Ví dụ: Giỗ Thủy Tiền Bối Đời Thứ 2"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="h-11 rounded-xl border-outline-variant/60 bg-surface-container-lowest text-sm"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="evtCategory" className="text-sm font-semibold text-on-surface">
                                    Phân loại
                                </Label>
                                <Select
                                    id="evtCategory"
                                    aria-label="Phân loại sự kiện"
                                    value={category}
                                    onValueChange={(v) => setCategory(v as 'FESTIVAL' | 'ANNIVERSARY' | 'EDUCATION' | 'MEETING')}
                                    options={[
                                        { value: 'FESTIVAL', label: 'Đại lễ / Lễ hội dòng họ' },
                                        { value: 'ANNIVERSARY', label: 'Ngày giỗ / Kỵ nhật' },
                                        { value: 'EDUCATION', label: 'Khuyến học / Tuyên dương' },
                                        { value: 'MEETING', label: 'Họp họ / Thường niên' },
                                    ]}
                                    className="min-h-11"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="evtRole" className="text-sm font-semibold text-on-surface">
                                    Đối Tượng / Vai Vế Chủ Trì
                                </Label>
                                <Input
                                    id="evtRole"
                                    placeholder="Ví dụ: Ban Trị Sự & Chi Trưởng..."
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="h-11 rounded-xl border-outline-variant/60 bg-surface-container-lowest text-sm"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="evtLunar" className="text-sm font-semibold text-on-surface">
                                    Ngày Âm Lịch
                                </Label>
                                <Input
                                    id="evtLunar"
                                    placeholder="12/03 Âm lịch"
                                    value={dateLunar}
                                    onChange={(e) => setDateLunar(e.target.value)}
                                    className="h-11 rounded-xl border-outline-variant/60 bg-surface-container-lowest tabular-nums text-sm"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="evtSolar" className="text-sm font-semibold text-on-surface">
                                    Ngày Dương Lịch
                                </Label>
                                <Input
                                    id="evtSolar"
                                    type="date"
                                    value={dateSolar}
                                    onChange={(e) => setDateSolar(e.target.value)}
                                    className="h-11 rounded-xl border-outline-variant/60 bg-surface-container-lowest tabular-nums text-sm"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-1.5">
                                <Label htmlFor="evtLocation" className="text-sm font-semibold text-on-surface">
                                    Địa Điểm Tổ Chức
                                </Label>
                                <Input
                                    id="evtLocation"
                                    placeholder="Từ đường Gia tộc..."
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="h-11 rounded-xl border-outline-variant/60 bg-surface-container-lowest text-sm"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-1.5">
                                <Label htmlFor="evtDesc" className="text-sm font-semibold text-on-surface">
                                    Mô tả / Chương trình buổi lễ
                                </Label>
                                <textarea
                                    id="evtDesc"
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Nội dung chương trình buổi lễ..."
                                    className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-3.5 text-sm text-on-surface leading-relaxed"
                                />
                            </div>
                        </div>
                        </DialogBody>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setDialogOpen(false)}
                                className="min-h-11 px-5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface cursor-pointer"
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                disabled={saving}
                                className="min-h-11 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold cursor-pointer"
                            >
                                {saving ? 'Đang lưu...' : editingEvent ? 'Cập Nhật' : 'Tạo Sự Kiện'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog Xác nhận xóa */}
            <Dialog open={!!deletingEvent} onOpenChange={(open) => !open && setDeletingEvent(null)}>
                <DialogContent size="sm">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-lg font-bold text-primary">
                            Xác Nhận Xóa Sự Kiện
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-on-surface-variant text-pretty">
                        Bạn có chắc chắn muốn xóa sự kiện <strong className="text-on-surface">{deletingEvent?.title}</strong>?
                    </p>
                    <DialogFooter className="pt-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setDeletingEvent(null)}
                            className="min-h-10 px-4 rounded-xl bg-surface-container-low text-on-surface cursor-pointer"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="button"
                            disabled={deleting}
                            onClick={handleConfirmDelete}
                            className="min-h-10 px-5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold cursor-pointer"
                        >
                            {deleting ? 'Đang xóa...' : 'Xóa sự kiện'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
