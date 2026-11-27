'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Wallet,
    ArrowDownLeft,
    ArrowUpRight,
    PlusCircle,
    Search,
    CheckCircle2,
    Pencil,
    Trash2,
    Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
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
import { FundTransaction as Transaction, FundOverview } from '@/config/fundData';
import { apiFetch } from '@/services/api/apiClient';
import { exportToCsv } from '@/utils/exportCsv';

export function AdminFundManager() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [overview, setOverview] = useState<FundOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingTx, setEditingTx] = useState<Transaction | null>(null);
    const [saving, setSaving] = useState(false);

    const [formType, setFormType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
    const [formTitle, setFormTitle] = useState('');
    const [formContributor, setFormContributor] = useState('');
    const [formBranch, setFormBranch] = useState('Chi Trưởng');
    const [formAmount, setFormAmount] = useState('');
    const [formNote, setFormNote] = useState('');

    const [deletingTx, setDeletingTx] = useState<Transaction | null>(null);
    const [deleting, setDeleting] = useState(false);

    const loadFunds = useCallback(async () => {
        try {
            setLoading(true);
            const res = await apiFetch('/api/funds', { cache: 'no-store' });
            if (res.ok) {
                const json = await res.json();
                if (json.data?.transactions) setTransactions(json.data.transactions);
                if (json.data?.overview) setOverview(json.data.overview);
            }
        } catch (err) {
            console.error('Lỗi tải dữ liệu quỹ:', err);
            toast.error('Không thể tải dữ liệu sổ quỹ.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadFunds();
    }, [loadFunds]);

    const totalIncome = transactions
        .filter((t) => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter((t) => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = overview ? overview.currentAmount : totalIncome - totalExpense;

    const filtered = transactions.filter((t) => {
        if (typeFilter !== 'ALL' && t.type !== typeFilter) return false;
        if (
            search.trim() &&
            !t.title.toLowerCase().includes(search.toLowerCase()) &&
            !t.contributor.toLowerCase().includes(search.toLowerCase())
        ) {
            return false;
        }
        return true;
    });

    const openCreateDialog = () => {
        setEditingTx(null);
        setFormType('INCOME');
        setFormTitle('');
        setFormContributor('');
        setFormBranch('Chi Trưởng');
        setFormAmount('');
        setFormNote('');
        setDialogOpen(true);
    };

    const openEditDialog = (tx: Transaction) => {
        setEditingTx(tx);
        setFormType(tx.type);
        setFormTitle(tx.title);
        setFormContributor(tx.contributor);
        setFormBranch(tx.branch || 'Chi Trưởng');
        setFormAmount(String(tx.amount));
        setFormNote(tx.note || '');
        setDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const amt = parseFloat(formAmount.replace(/[^0-9]/g, ''));
        if (!amt || isNaN(amt) || amt <= 0) {
            toast.error('Vui lòng nhập số tiền hợp lệ lớn hơn 0.');
            return;
        }
        if (!formTitle.trim()) {
            toast.error('Vui lòng nhập nội dung thu/chi.');
            return;
        }

        const payload = {
            type: formType,
            title: formTitle.trim(),
            contributor: formContributor.trim() || 'Thành viên gia tộc',
            branch: formBranch,
            amount: amt,
            note: formNote.trim() || 'Ghi nhận qua hệ thống Admin',
        };

        try {
            setSaving(true);
            const url = editingTx ? `/api/funds/${encodeURIComponent(editingTx.id)}` : '/api/funds';
            const method = editingTx ? 'PUT' : 'POST';

            const res = await apiFetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const json = await res.json();

            if (!res.ok || !json.success) {
                toast.error(json.message || 'Không thể lưu phiếu thu/chi.');
                return;
            }

            toast.success(
                editingTx
                    ? 'Đã cập nhật phiếu thu/chi thành công!'
                    : formType === 'INCOME'
                      ? `Đã ghi nhận khoản thu ${amt.toLocaleString('vi-VN')} VNĐ vào quỹ họ!`
                      : `Đã ghi nhận phiếu chi ${amt.toLocaleString('vi-VN')} VNĐ thành công!`
            );
            setDialogOpen(false);
            await loadFunds();
        } catch {
            toast.error('Lỗi kết nối khi lưu giao dịch quỹ.');
        } finally {
            setSaving(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deletingTx) return;
        try {
            setDeleting(true);
            const res = await apiFetch(`/api/funds/${encodeURIComponent(deletingTx.id)}`, {
                method: 'DELETE',
            });
            const json = await res.json();
            if (!res.ok || !json.success) {
                toast.error(json.message || 'Không thể xóa giao dịch.');
                return;
            }
            toast.success(`Đã xóa phiếu ${deletingTx.id}.`);
            setDeletingTx(null);
            await loadFunds();
        } catch {
            toast.error('Lỗi kết nối khi xóa giao dịch.');
        } finally {
            setDeleting(false);
        }
    };

    const handleExportCsv = () => {
        exportToCsv(
            `so-quy-dong-ho-${new Date().toISOString().split('T')[0]}`,
            ['Mã phiếu', 'Loại', 'Nội dung', 'Người / Đơn vị', 'Chi phái', 'Ngày', 'Số tiền (VNĐ)', 'Ghi chú'],
            filtered.map((tx) => [
                tx.id,
                tx.type === 'INCOME' ? 'Thu' : 'Chi',
                tx.title,
                tx.contributor,
                tx.branch,
                tx.date,
                tx.type === 'INCOME' ? tx.amount : -tx.amount,
                tx.note,
            ])
        );
        toast.success('Đã xuất file sổ quỹ CSV (hỗ trợ mở trực tiếp bằng Excel).');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary flex items-center gap-2 text-balance">
                        <Wallet className="size-6 text-secondary" aria-hidden="true" />
                        <span>Sổ Quỹ Dòng Họ &amp; Hương Hỏa</span>
                    </h2>
                    <p className="text-sm text-on-surface-variant mt-0.5 text-pretty">
                        Minh bạch các khoản công đức, thu chi tu bổ từ đường và khuyến học họ tộc
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant="ghost"
                        onClick={handleExportCsv}
                        className="min-h-11 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-sm cursor-pointer"
                    >
                        <Download className="size-4 mr-2" aria-hidden="true" />
                        <span>Xuất Excel (CSV)</span>
                    </Button>
                    <Button
                        onClick={openCreateDialog}
                        className="min-h-11 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm shrink-0 transition-colors duration-150 cursor-pointer"
                    >
                        <PlusCircle className="size-4 mr-2" aria-hidden="true" />
                        <span>Lập Phiếu Thu / Chi</span>
                    </Button>
                </div>
            </div>

            {/* Fund Summary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 tabular-nums">
                <Card className="p-5 bg-primary text-on-primary rounded-2xl">
                    <p className="text-xs font-semibold uppercase text-secondary-fixed">
                        Số Dư Quỹ Khả Dụng
                    </p>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-on-primary mt-1">
                        {balance.toLocaleString('vi-VN')} đ
                    </h3>
                    <p className="text-xs text-on-primary/85 mt-1 flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5 text-secondary-fixed shrink-0" aria-hidden="true" />
                        <span>Đồng bộ trực tiếp từ sổ thu chi</span>
                    </p>
                </Card>

                <Card className="p-5 bg-surface-container-lowest rounded-2xl">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase text-on-surface-variant">
                            Tổng Thu / Công Đức
                        </p>
                        <div className="size-8 rounded-lg bg-emerald-700/12 text-emerald-700 flex items-center justify-center">
                            <ArrowDownLeft className="size-4" aria-hidden="true" />
                        </div>
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                        +{totalIncome.toLocaleString('vi-VN')} đ
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1">
                        Từ {transactions.filter((t) => t.type === 'INCOME').length} lượt đóng góp
                    </p>
                </Card>

                <Card className="p-5 bg-surface-container-lowest rounded-2xl">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase text-on-surface-variant">
                            Tổng Chi Tu Bổ / Sự Kiện
                        </p>
                        <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <ArrowUpRight className="size-4" aria-hidden="true" />
                        </div>
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-primary mt-1">
                        -{totalExpense.toLocaleString('vi-VN')} đ
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1">
                        {transactions.filter((t) => t.type === 'EXPENSE').length} khoản chi phí được phê duyệt
                    </p>
                </Card>
            </div>

            {/* Filter and Table */}
            <Card className="bg-surface-container-lowest rounded-2xl overflow-hidden">
                <CardHeader className="p-5 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <CardTitle className="font-serif text-base font-bold text-primary">
                            Lịch Sử Thu Chi ({filtered.length})
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="relative w-48 sm:w-64">
                                <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" aria-hidden="true" />
                                <Input
                                    aria-label="Tìm khoản thu chi"
                                    placeholder="Tìm khoản thu / chi..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 h-10 text-xs rounded-xl border-outline-variant/60 bg-surface"
                                />
                            </div>
                            <div className="w-40 shrink-0">
                                <Select
                                    aria-label="Lọc loại giao dịch"
                                    value={typeFilter}
                                    onValueChange={(v) => setTypeFilter(v as 'ALL' | 'INCOME' | 'EXPENSE')}
                                    options={[
                                        { value: 'ALL', label: 'Tất cả' },
                                        { value: 'INCOME', label: 'Tiền Thu (+)' },
                                        { value: 'EXPENSE', label: 'Tiền Chi (-)' },
                                    ]}
                                    className="bg-surface text-xs"
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-surface-container-low border-b border-outline-variant/30">
                                <TableHead className="w-24">Mã</TableHead>
                                <TableHead>Nội Dung</TableHead>
                                <TableHead>Người / Đơn Vị</TableHead>
                                <TableHead>Chi Phái</TableHead>
                                <TableHead>Ngày</TableHead>
                                <TableHead className="text-right">Số Tiền (VNĐ)</TableHead>
                                <TableHead className="text-right w-24">Thao Tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-on-surface-variant">
                                        Đang tải sổ quỹ...
                                    </TableCell>
                                </TableRow>
                            ) : filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-on-surface-variant">
                                        Không tìm thấy giao dịch nào.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((tx) => (
                                    <TableRow
                                        key={tx.id}
                                        className="hover:bg-surface-container-low/60 border-b border-outline-variant/20 tabular-nums"
                                    >
                                        <TableCell className="font-mono text-xs text-on-surface-variant font-semibold">
                                            {tx.id}
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-semibold text-sm text-on-surface">{tx.title}</p>
                                            {tx.note && (
                                                <p className="text-xs text-on-surface-variant truncate max-w-xs">{tx.note}</p>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm text-on-surface">{tx.contributor}</TableCell>
                                        <TableCell className="text-xs text-on-surface-variant">{tx.branch}</TableCell>
                                        <TableCell className="text-xs text-on-surface-variant">{tx.date}</TableCell>
                                        <TableCell className="text-right font-bold text-sm">
                                            <span
                                                className={
                                                    tx.type === 'INCOME'
                                                        ? 'text-emerald-700 dark:text-emerald-400'
                                                        : 'text-primary'
                                                }
                                            >
                                                {tx.type === 'INCOME' ? '+' : '-'}
                                                {tx.amount.toLocaleString('vi-VN')} đ
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="inline-flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Sửa phiếu ${tx.id}`}
                                                    onClick={() => openEditDialog(tx)}
                                                    className="size-8 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface cursor-pointer"
                                                >
                                                    <Pencil className="size-3.5" aria-hidden="true" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Xóa phiếu ${tx.id}`}
                                                    onClick={() => setDeletingTx(tx)}
                                                    className="size-8 rounded-lg bg-surface-container-low hover:bg-primary/10 text-primary cursor-pointer"
                                                >
                                                    <Trash2 className="size-3.5" aria-hidden="true" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Dialog Lập / Sửa Phiếu */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent size="lg" stickyLayout>
                    <DialogHeader>
                        <DialogTitle>
                            {editingTx ? `Chỉnh Sửa Phiếu ${editingTx.id}` : 'Lập Phiếu Thu / Chi Mới'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                        <DialogBody className="space-y-5">
                        <div className="grid grid-cols-2 gap-3 p-1.5 rounded-xl bg-surface-container-low">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setFormType('INCOME')}
                                className={`min-h-11 rounded-lg font-semibold text-sm cursor-pointer ${
                                    formType === 'INCOME'
                                        ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                                        : 'bg-transparent text-on-surface hover:bg-surface-container'
                                }`}
                            >
                                Phiếu Thu / Công Đức (+)
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setFormType('EXPENSE')}
                                className={`min-h-11 rounded-lg font-semibold text-sm cursor-pointer ${
                                    formType === 'EXPENSE'
                                        ? 'bg-primary text-on-primary hover:bg-primary-container'
                                        : 'bg-transparent text-on-surface hover:bg-surface-container'
                                }`}
                            >
                                Phiếu Chi / Tu Bổ (-)
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2 space-y-1.5">
                                <Label htmlFor="fundTitle" className="text-sm font-semibold text-on-surface">
                                    Nội dung thu / chi *
                                </Label>
                                <Input
                                    id="fundTitle"
                                    required
                                    placeholder="Ví dụ: Công đức tu bổ nhà thờ họ..."
                                    value={formTitle}
                                    onChange={(e) => setFormTitle(e.target.value)}
                                    className="h-11 rounded-xl border-outline-variant/60 bg-surface-container-lowest text-sm"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="fundAmount" className="text-sm font-semibold text-on-surface">
                                    Số tiền (VNĐ) *
                                </Label>
                                <Input
                                    id="fundAmount"
                                    type="number"
                                    min={1000}
                                    required
                                    placeholder="1000000"
                                    value={formAmount}
                                    onChange={(e) => setFormAmount(e.target.value)}
                                    className="h-11 rounded-xl border-outline-variant/60 bg-surface-container-lowest tabular-nums text-sm"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="fundBranch" className="text-sm font-semibold text-on-surface">
                                    Chi phái
                                </Label>
                                <Input
                                    id="fundBranch"
                                    value={formBranch}
                                    onChange={(e) => setFormBranch(e.target.value)}
                                    className="h-11 rounded-xl border-outline-variant/60 bg-surface-container-lowest text-sm"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="fundContributor" className="text-sm font-semibold text-on-surface">
                                    {formType === 'INCOME' ? 'Người đóng góp' : 'Đơn vị / người nhận chi'} *
                                </Label>
                                <Input
                                    id="fundContributor"
                                    required
                                    placeholder="Ví dụ: Ông Lê Văn Phúc"
                                    value={formContributor}
                                    onChange={(e) => setFormContributor(e.target.value)}
                                    className="h-11 rounded-xl border-outline-variant/60 bg-surface-container-lowest text-sm"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="fundNote" className="text-sm font-semibold text-on-surface">
                                    Ghi chú
                                </Label>
                                <Input
                                    id="fundNote"
                                    placeholder="Thông tin bổ sung (nếu có)..."
                                    value={formNote}
                                    onChange={(e) => setFormNote(e.target.value)}
                                    className="h-11 rounded-xl border-outline-variant/60 bg-surface-container-lowest text-sm"
                                />
                            </div>
                        </div>
                        </DialogBody>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setDialogOpen(false)}
                                className="min-h-11 px-5 rounded-xl bg-surface-container-low text-on-surface cursor-pointer"
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                disabled={saving}
                                className="min-h-11 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold cursor-pointer"
                            >
                                {saving ? 'Đang lưu...' : editingTx ? 'Cập nhật phiếu' : 'Lưu phiếu'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog Xác nhận xóa */}
            <Dialog open={!!deletingTx} onOpenChange={(open) => !open && setDeletingTx(null)}>
                <DialogContent size="sm">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-lg font-bold text-primary">
                            Xác Nhận Xóa Phiếu Quỹ
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-on-surface-variant text-pretty">
                        Bạn có chắc chắn muốn xóa phiếu <strong className="text-on-surface">{deletingTx?.id}</strong> ({deletingTx?.title})? Số dư quỹ sẽ được tự động tính lại.
                    </p>
                    <DialogFooter className="pt-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setDeletingTx(null)}
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
                            {deleting ? 'Đang xóa...' : 'Xóa phiếu'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
