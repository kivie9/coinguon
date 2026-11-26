'use client';

import React, { useState } from 'react';
import {
    Wallet,
    ArrowDownLeft,
    ArrowUpRight,
    PlusCircle,
    Search,
    CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { FundTransaction as Transaction, INITIAL_FUND_TRANSACTIONS } from '@/config/fundData';

export function AdminFundManager() {
    const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_FUND_TRANSACTIONS);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');

    React.useEffect(() => {
        fetch('/api/funds')
            .then((res) => res.json())
            .then((res) => {
                if (res.data?.transactions) {
                    setTransactions(res.data.transactions);
                }
            })
            .catch(() => {});
    }, []);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [formType, setFormType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
    const [formTitle, setFormTitle] = useState('');
    const [formContributor, setFormContributor] = useState('');
    const [formBranch, setFormBranch] = useState('Chi Trưởng');
    const [formAmount, setFormAmount] = useState('');
    const [formNote, setFormNote] = useState('');

    const totalIncome = transactions
        .filter((t) => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter((t) => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense + 125000000;

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

    const handleCreateTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        const amt = parseFloat(formAmount.replace(/[^0-9]/g, ''));
        if (!amt || isNaN(amt) || amt <= 0) {
            toast.error('Vui lòng nhập số tiền hợp lệ.');
            return;
        }
        if (!formTitle.trim()) {
            toast.error('Vui lòng nhập nội dung thu/chi.');
            return;
        }

        const newTx: Transaction = {
            id: `TX-${Date.now().toString().slice(-4)}`,
            type: formType,
            title: formTitle.trim(),
            contributor: formContributor.trim() || 'Thành viên gia tộc',
            branch: formBranch,
            amount: amt,
            date: new Date().toLocaleDateString('vi-VN'),
            note: formNote.trim() || 'Ghi nhận qua hệ thống Admin',
        };

        fetch('/api/funds', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTx),
        }).catch(() => {});

        setTransactions((prev) => [newTx, ...prev]);
        toast.success(
            formType === 'INCOME'
                ? `Đã ghi nhận khoản thu ${amt.toLocaleString('vi-VN')} VNĐ vào quỹ họ!`
                : `Đã ghi nhận phiếu chi ${amt.toLocaleString('vi-VN')} VNĐ thành công!`
        );
        setDialogOpen(false);
        setFormTitle('');
        setFormContributor('');
        setFormAmount('');
        setFormNote('');
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
                    <p className="text-sm text-on-surface-variant mt-0.5">
                        Minh bạch các khoản công đức, thu chi tu bổ từ đường và khuyến học họ tộc
                    </p>
                </div>

                <Button
                    onClick={() => setDialogOpen(true)}
                    className="min-h-11 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm shrink-0 transition-colors duration-150 cursor-pointer"
                >
                    <PlusCircle className="size-4 mr-2" aria-hidden="true" />
                    <span>Lập Phiếu Thu / Chi</span>
                </Button>
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
                        <span>Đã đối soát sổ sách tháng hiện tại</span>
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
                            Lịch Sử Thu Chi Gần Đây
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
                            <select
                                aria-label="Lọc loại giao dịch"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value as 'ALL' | 'INCOME' | 'EXPENSE')}
                                className="h-10 rounded-xl border border-outline-variant/60 bg-surface px-3 text-xs text-on-surface focus-visible:outline-none focus-visible:border-primary"
                            >
                                <option value="ALL">Tất cả</option>
                                <option value="INCOME">Tiền Thu (+)</option>
                                <option value="EXPENSE">Tiền Chi (-)</option>
                            </select>
                        </div>
                    </div>
                </CardHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-surface-container-low border-b border-outline-variant/30">
                                <TableHead className="w-20">Mã</TableHead>
                                <TableHead>Nội Dung</TableHead>
                                <TableHead>Người / Đơn Vị</TableHead>
                                <TableHead>Chi Phái</TableHead>
                                <TableHead>Ngày</TableHead>
                                <TableHead className="text-right">Số Tiền (VNĐ)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-on-surface-variant">
                                        Không tìm thấy giao dịch nào.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((tx) => (
                                    <TableRow key={tx.id} className="hover:bg-surface-container-low/60 border-b border-outline-variant/20 tabular-nums">
                                        <TableCell className="font-mono text-xs text-on-surface-variant font-semibold">
                                            {tx.id}
                                        </TableCell>
                                        <TableCell className="font-sans">
                                            <p className="font-bold text-sm text-on-surface">{tx.title}</p>
                                            <p className="text-xs text-on-surface-variant">{tx.note}</p>
                                        </TableCell>
                                        <TableCell className="text-xs font-semibold text-on-surface font-sans">
                                            {tx.contributor}
                                        </TableCell>
                                        <TableCell className="text-xs text-secondary font-medium font-sans">
                                            {tx.branch}
                                        </TableCell>
                                        <TableCell className="text-xs text-on-surface-variant">
                                            {tx.date}
                                        </TableCell>
                                        <TableCell className="text-right font-mono font-bold text-sm">
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
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Modal Lập Phiếu */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-md bg-surface rounded-2xl border-0 p-6">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-lg font-bold text-primary">
                            Lập Phiếu Thu / Chi Quỹ Họ
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleCreateTransaction} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-on-surface">Loại Phiếu</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className={`min-h-10 rounded-xl text-xs font-semibold cursor-pointer ${
                                        formType === 'INCOME'
                                            ? 'bg-emerald-700 text-white hover:bg-emerald-700 hover:text-white'
                                            : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                                    }`}
                                    onClick={() => setFormType('INCOME')}
                                >
                                    + Thu Quỹ / Công Đức
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className={`min-h-10 rounded-xl text-xs font-semibold cursor-pointer ${
                                        formType === 'EXPENSE'
                                            ? 'bg-primary text-on-primary hover:bg-primary hover:text-on-primary'
                                            : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                                    }`}
                                    onClick={() => setFormType('EXPENSE')}
                                >
                                    - Chi Phí / Tu Bổ
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="formTitle" className="text-xs font-semibold text-on-surface">
                                Nội Dung Khoản Thu / Chi
                            </Label>
                            <Input
                                id="formTitle"
                                placeholder="Ví dụ: Công đức xây dựng từ đường"
                                value={formTitle}
                                onChange={(e) => setFormTitle(e.target.value)}
                                required
                                className="h-10 rounded-xl border-outline-variant/60 bg-surface-container-lowest"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="formContributor" className="text-xs font-semibold text-on-surface">
                                    Người Đóng Góp / Người Nhận
                                </Label>
                                <Input
                                    id="formContributor"
                                    placeholder="Họ tên người..."
                                    value={formContributor}
                                    onChange={(e) => setFormContributor(e.target.value)}
                                    className="h-10 rounded-xl border-outline-variant/60 bg-surface-container-lowest"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="formBranch" className="text-xs font-semibold text-on-surface">
                                    Chi Họ
                                </Label>
                                <Input
                                    id="formBranch"
                                    placeholder="Chi Trưởng, Chi Hai..."
                                    value={formBranch}
                                    onChange={(e) => setFormBranch(e.target.value)}
                                    className="h-10 rounded-xl border-outline-variant/60 bg-surface-container-lowest"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="formAmount" className="text-xs font-semibold text-on-surface">
                                Số Tiền (VNĐ)
                            </Label>
                            <Input
                                id="formAmount"
                                type="number"
                                placeholder="Ví dụ: 5000000"
                                value={formAmount}
                                onChange={(e) => setFormAmount(e.target.value)}
                                required
                                className="h-10 rounded-xl border-outline-variant/60 bg-surface-container-lowest tabular-nums"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="formNote" className="text-xs font-semibold text-on-surface">
                                Ghi Chú
                            </Label>
                            <Input
                                id="formNote"
                                placeholder="Chi tiết thêm..."
                                value={formNote}
                                onChange={(e) => setFormNote(e.target.value)}
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
                                Lưu Phiếu
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
