'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
    Search,
    UserPlus,
    Pencil,
    Trash2,
    Eye,
    Users,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminMemberModal } from './AdminMemberModal';
import { AdminMemberDeleteDialog } from './AdminMemberDeleteDialog';
import { fetchMembersApi } from '@/services/api/memberApi';
import { MemberDto } from '@/types/memberType';
import { matchesSearchQuery } from '@/utils/memberUtils';

export function AdminMemberList() {
    const [members, setMembers] = useState<MemberDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedGen, setSelectedGen] = useState<number | 'ALL'>('ALL');
    const [selectedGender, setSelectedGender] = useState<'ALL' | 'MALE' | 'FEMALE'>('ALL');

    const [modalOpen, setModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<MemberDto | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingMember, setDeletingMember] = useState<MemberDto | null>(null);

    const [page, setPage] = useState(1);
    const pageSize = 10;

    const loadMembers = async () => {
        setLoading(true);
        try {
            const data = await fetchMembersApi();
            setMembers(data);
        } catch (err) {
            console.error('Lỗi khi tải danh sách thành viên admin:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMembers();
    }, []);

    const generations = useMemo(() => {
        const set = new Set<number>();
        members.forEach((m) => {
            if (m.generationNumber) set.add(m.generationNumber);
        });
        return Array.from(set).sort((a, b) => a - b);
    }, [members]);

    const filteredMembers = useMemo(() => {
        return members.filter((m) => {
            if (search.trim() && !matchesSearchQuery(m, search)) {
                return false;
            }
            if (selectedGen !== 'ALL' && m.generationNumber !== selectedGen) {
                return false;
            }
            if (selectedGender !== 'ALL') {
                const isMale = m.gender?.toLowerCase() === 'male';
                if (selectedGender === 'MALE' && !isMale) return false;
                if (selectedGender === 'FEMALE' && isMale) return false;
            }
            return true;
        });
    }, [members, search, selectedGen, selectedGender]);

    const totalPages = Math.ceil(filteredMembers.length / pageSize) || 1;
    const paginatedMembers = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredMembers.slice(start, start + pageSize);
    }, [filteredMembers, page]);

    const handleOpenAdd = () => {
        setEditingMember(null);
        setModalOpen(true);
    };

    const handleOpenEdit = (m: MemberDto) => {
        setEditingMember(m);
        setModalOpen(true);
    };

    const handleOpenDelete = (m: MemberDto) => {
        setDeletingMember(m);
        setDeleteDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary flex items-center gap-2 text-balance">
                        <Users className="size-6 text-secondary" aria-hidden="true" />
                        <span>Sổ Đinh Bộ &amp; Danh Sách Thành Viên</span>
                    </h2>
                    <p className="text-sm text-on-surface-variant mt-0.5 tabular-nums">
                        Tổng cộng {members.length} nhân khẩu qua {generations.length} thế hệ gia tộc
                    </p>
                </div>

                <Button
                    onClick={handleOpenAdd}
                    className="min-h-11 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm shrink-0 transition-colors duration-150 cursor-pointer"
                >
                    <UserPlus className="size-4 mr-2" aria-hidden="true" />
                    <span>Thêm Thành Viên Mới</span>
                </Button>
            </div>

            {/* Filter & Search Bar */}
            <Card className="bg-surface-container-lowest rounded-2xl">
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="relative sm:col-span-6">
                            <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" aria-hidden="true" />
                            <Input
                                aria-label="Tìm kiếm thành viên"
                                placeholder="Tìm theo tên, chữ đệm, tự hiệu, quê quán..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="pl-10 h-10 rounded-xl border-outline-variant/60 bg-surface text-sm"
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <select
                                aria-label="Lọc theo thế hệ"
                                value={selectedGen}
                                onChange={(e) => {
                                    setSelectedGen(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value));
                                    setPage(1);
                                }}
                                className="w-full h-10 rounded-xl border border-outline-variant/60 bg-surface px-3 text-sm text-on-surface focus-visible:outline-none focus-visible:border-primary"
                            >
                                <option value="ALL">Tất cả các đời (1..{generations.length})</option>
                                {generations.map((gen) => (
                                    <option key={gen} value={gen}>
                                        Đời thứ {gen}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="sm:col-span-3">
                            <select
                                aria-label="Lọc theo giới tính"
                                value={selectedGender}
                                onChange={(e) => {
                                    setSelectedGender(e.target.value as 'ALL' | 'MALE' | 'FEMALE');
                                    setPage(1);
                                }}
                                className="w-full h-10 rounded-xl border border-outline-variant/60 bg-surface px-3 text-sm text-on-surface focus-visible:outline-none focus-visible:border-primary"
                            >
                                <option value="ALL">Mọi giới tính</option>
                                <option value="MALE">Nam (Đinh nam)</option>
                                <option value="FEMALE">Nữ giới</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Table Card */}
            <Card className="bg-surface-container-lowest rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-surface-container-low border-b border-outline-variant/30">
                                <TableHead className="w-16">ID</TableHead>
                                <TableHead>Họ và Tên</TableHead>
                                <TableHead>Đời / Chi</TableHead>
                                <TableHead>Giới Tính</TableHead>
                                <TableHead>Năm Sinh - Kỵ Nhật</TableHead>
                                <TableHead>Trạng Thái</TableHead>
                                <TableHead className="text-right">Thao Tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : paginatedMembers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-on-surface-variant">
                                        Không tìm thấy thành viên nào phù hợp với điều kiện tìm kiếm.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedMembers.map((m) => {
                                    const isDeceased = !m.isAlive;
                                    const isMale = m.gender?.toLowerCase() === 'male';

                                    return (
                                        <TableRow key={m.id} className="hover:bg-surface-container-low/60 border-b border-outline-variant/20">
                                            <TableCell className="font-mono text-xs text-on-surface-variant font-semibold tabular-nums">
                                                #{m.id}
                                            </TableCell>

                                            <TableCell>
                                                <div className="font-serif font-bold text-on-surface text-sm flex items-center gap-2">
                                                    <span>{m.fullName}</span>
                                                    {m.courtesyName && (
                                                        <span className="text-xs text-secondary font-sans font-normal italic">
                                                            {m.courtesyName.startsWith('(') ? m.courtesyName : `(${m.courtesyName})`}
                                                        </span>
                                                    )}
                                                </div>
                                                {m.spouse && (
                                                    <p className="text-xs text-on-surface-variant mt-0.5">
                                                        Phối ngẫu: {m.spouse}
                                                    </p>
                                                )}
                                            </TableCell>

                                            <TableCell className="tabular-nums">
                                                <span className="text-xs font-bold text-primary block">
                                                    Đời thứ {m.generationNumber}
                                                </span>
                                                <span className="text-xs text-on-surface-variant">
                                                    {m.branch || 'Chi Trưởng'}
                                                </span>
                                            </TableCell>

                                            <TableCell className="text-xs font-medium text-on-surface-variant">
                                                {isMale ? 'Nam (Đinh)' : 'Nữ giới'}
                                            </TableCell>

                                            <TableCell className="text-xs text-on-surface-variant tabular-nums">
                                                <div>{m.birthdaySolar || 'Chưa rõ năm sinh'}</div>
                                                {isDeceased && m.deathDayLunar && (
                                                    <div className="text-xs text-secondary font-semibold mt-0.5">
                                                        Giỗ: {m.deathDayLunar}
                                                    </div>
                                                )}
                                            </TableCell>

                                            {/* Duy nhất 1 badge trạng thái trên mỗi dòng */}
                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-md ${
                                                        isDeceased
                                                            ? 'bg-surface-container-high text-on-surface-variant'
                                                            : 'bg-emerald-700/12 text-emerald-800 dark:text-emerald-300'
                                                    }`}
                                                >
                                                    <span
                                                        className={`size-1.5 rounded-full ${
                                                            isDeceased ? 'bg-outline' : 'bg-emerald-600'
                                                        }`}
                                                        aria-hidden="true"
                                                    />
                                                    {isDeceased ? 'Đã khuất' : 'Còn sống'}
                                                </span>
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        href={`/members/${m.id}`}
                                                        aria-label={`Xem hồ sơ của ${m.fullName}`}
                                                        className="inline-flex items-center justify-center size-9 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors duration-150"
                                                        title="Xem hồ sơ người dùng"
                                                    >
                                                        <Eye className="size-4" aria-hidden="true" />
                                                    </Link>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleOpenEdit(m)}
                                                        aria-label={`Sửa thông tin ${m.fullName}`}
                                                        className="size-9 rounded-lg text-secondary hover:text-primary hover:bg-surface-container cursor-pointer"
                                                        title="Sửa thông tin"
                                                    >
                                                        <Pencil className="size-4" aria-hidden="true" />
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleOpenDelete(m)}
                                                        aria-label={`Xóa thành viên ${m.fullName}`}
                                                        className="size-9 rounded-lg text-destructive hover:bg-destructive/10 cursor-pointer"
                                                        title="Xóa thành viên"
                                                    >
                                                        <Trash2 className="size-4" aria-hidden="true" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination footer */}
                <div className="flex items-center justify-between p-4 bg-surface-container-low text-xs text-on-surface-variant tabular-nums">
                    <div>
                        Hiển thị {paginatedMembers.length} / {filteredMembers.length} thành viên
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            disabled={page <= 1}
                            aria-label="Trang trước"
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            className="size-9 rounded-lg bg-surface-container-lowest hover:bg-surface-container cursor-pointer"
                        >
                            <ChevronLeft className="size-4" aria-hidden="true" />
                        </Button>
                        <span className="font-semibold text-on-surface px-1">
                            Trang {page} / {totalPages}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            disabled={page >= totalPages}
                            aria-label="Trang sau"
                            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                            className="size-9 rounded-lg bg-surface-container-lowest hover:bg-surface-container cursor-pointer"
                        >
                            <ChevronRight className="size-4" aria-hidden="true" />
                        </Button>
                    </div>
                </div>
            </Card>

            <AdminMemberModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                member={editingMember}
                onSuccess={loadMembers}
            />

            <AdminMemberDeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                member={deletingMember}
                onSuccess={loadMembers}
            />
        </div>
    );
}
