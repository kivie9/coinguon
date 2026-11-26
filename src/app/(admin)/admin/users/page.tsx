'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { UserRole, UserStatus, UserProfileDto } from '@/types/userType';
import { apiFetch } from '@/services/api/apiClient';
import { toast } from '@/components/ui/sonner';
import {
    Users,
    Search,
    Shield,
    Crown,
    Lock,
    Unlock,
    RefreshCw,
    UserCheck,
    AlertCircle,
    CheckCircle2,
    Mail,
    Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export default function AdminUsersPage() {
    const { isSuperAdmin, role } = useAuth();
    const [usersList, setUsersList] = useState<UserProfileDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('ALL');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const query = new URLSearchParams();
            if (roleFilter !== 'ALL') query.set('role', roleFilter);
            if (statusFilter !== 'ALL') query.set('status', statusFilter);
            if (search.trim()) query.set('search', search.trim());

            const res = await apiFetch(`/api/users?${query.toString()}`);
            if (res.ok) {
                const json = await res.json();
                setUsersList(json.data || []);
            } else if (res.status === 403) {
                toast.error('Chỉ Admin tối cao mới có quyền truy cập trang quản lý người dùng.');
            }
        } catch (err) {
            console.error('Lỗi khi tải danh sách users:', err);
            toast.error('Không thể tải danh sách tài khoản.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, [roleFilter, statusFilter]);

    const handleRoleChange = async (userId: number, newRole: UserRole) => {
        try {
            setUpdatingId(userId);
            const res = await apiFetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole }),
            });
            const json = await res.json();
            if (res.ok && json.success) {
                toast.success(`Đã cập nhật vai trò người dùng thành: ${newRole}`);
                setUsersList((prev) =>
                    prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
                );
            } else {
                toast.error(json.message || 'Cập nhật vai trò thất bại.');
            }
        } catch {
            toast.error('Lỗi kết nối khi cập nhật vai trò.');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleStatusToggle = async (userId: number, currentStatus: UserStatus) => {
        const nextStatus: UserStatus = currentStatus === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
        try {
            setUpdatingId(userId);
            const res = await apiFetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: nextStatus }),
            });
            const json = await res.json();
            if (res.ok && json.success) {
                toast.success(
                    nextStatus === 'LOCKED'
                        ? 'Đã khóa tài khoản thành công.'
                        : 'Đã mở khóa tài khoản thành công.'
                );
                setUsersList((prev) =>
                    prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u))
                );
            } else {
                toast.error(json.message || 'Cập nhật trạng thái thất bại.');
            }
        } catch {
            toast.error('Lỗi kết nối khi cập nhật trạng thái.');
        } finally {
            setUpdatingId(null);
        }
    };

    if (!isSuperAdmin) {
        return (
            <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <AlertCircle className="size-7" aria-hidden="true" />
                </div>
                <h2 className="font-serif text-xl font-bold text-primary text-balance">Giới Hạn Quyền Truy Cập</h2>
                <p className="text-sm text-on-surface-variant max-w-md mt-2 text-pretty">
                    Tính năng Phân quyền &amp; Quản lý Người dùng chỉ dành riêng cho tài khoản có vai trò <strong>Admin Tối Cao (SUPER_ADMIN)</strong>.
                </p>
                <div className="mt-4 p-4 bg-surface-container-low rounded-xl text-xs sm:text-sm text-on-surface">
                    Vai trò hiện tại của bạn: <strong className="font-bold text-primary">{role}</strong>.
                </div>
            </div>
        );
    }

    const superAdminCount = usersList.filter((u) => u.role === 'SUPER_ADMIN').length;
    const clanAdminCount = usersList.filter((u) => u.role === 'CLAN_ADMIN').length;
    const branchAdminCount = usersList.filter((u) => u.role === 'BRANCH_ADMIN').length;
    const memberCount = usersList.filter((u) => u.role === 'MEMBER').length;

    return (
        <div className="space-y-6">
            {/* Header Thống Kê */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 tabular-nums">
                <Card className="rounded-2xl bg-surface-container-lowest">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Crown className="size-5" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-on-surface-variant">Admin Tối Cao</p>
                            <h3 className="font-serif text-xl font-bold text-primary">{superAdminCount}</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl bg-surface-container-lowest">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-secondary/12 text-secondary flex items-center justify-center shrink-0">
                            <Shield className="size-5" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-on-surface-variant">Quản Trị Dòng Họ</p>
                            <h3 className="font-serif text-xl font-bold text-primary">{clanAdminCount}</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl bg-surface-container-lowest">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <UserCheck className="size-5" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-on-surface-variant">Quản Trị Chi Phái</p>
                            <h3 className="font-serif text-xl font-bold text-primary">{branchAdminCount}</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl bg-surface-container-lowest">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center shrink-0">
                            <Users className="size-5 text-secondary" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-on-surface-variant">Thành Viên</p>
                            <h3 className="font-serif text-xl font-bold text-primary">{memberCount}</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bảng Danh Sách Người Dùng */}
            <Card className="rounded-2xl bg-surface-container-lowest overflow-hidden">
                <CardHeader className="p-5 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <CardTitle className="font-serif text-lg font-bold text-primary flex items-center gap-2">
                                <Users className="size-5 text-secondary" aria-hidden="true" />
                                <span>Danh Sách Người Dùng &amp; Phân Quyền</span>
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                                Quản lý cấp quyền, liên kết thành viên phả ký và kích hoạt/khóa tài khoản.
                            </CardDescription>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={loadUsers}
                            className="min-h-10 px-3.5 gap-1.5 text-xs font-semibold rounded-xl bg-surface-container-low hover:bg-surface-container text-primary self-start sm:self-auto cursor-pointer"
                        >
                            <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
                            <span>Làm mới</span>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3">
                        <div className="relative">
                            <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" aria-hidden="true" />
                            <Input
                                aria-label="Tìm kiếm người dùng"
                                placeholder="Tìm theo tên, email, SĐT..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && loadUsers()}
                                className="pl-10 h-10 text-xs sm:text-sm rounded-xl border-outline-variant/60 bg-surface"
                            />
                        </div>

                        <select
                            aria-label="Lọc vai trò"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="h-10 px-3 text-xs sm:text-sm rounded-xl border border-outline-variant/60 bg-surface text-on-surface focus-visible:outline-none focus-visible:border-primary"
                        >
                            <option value="ALL">Tất cả vai trò</option>
                            <option value="SUPER_ADMIN">Admin Tối Cao (SUPER_ADMIN)</option>
                            <option value="CLAN_ADMIN">Quản Trị Dòng Họ (CLAN_ADMIN)</option>
                            <option value="BRANCH_ADMIN">Quản Trị Chi Phái (BRANCH_ADMIN)</option>
                            <option value="MEMBER">Thành Viên Thường (MEMBER)</option>
                        </select>

                        <select
                            aria-label="Lọc trạng thái"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="h-10 px-3 text-xs sm:text-sm rounded-xl border border-outline-variant/60 bg-surface text-on-surface focus-visible:outline-none focus-visible:border-primary"
                        >
                            <option value="ALL">Tất cả trạng thái</option>
                            <option value="ACTIVE">Đang hoạt động (ACTIVE)</option>
                            <option value="LOCKED">Đã khóa (LOCKED)</option>
                        </select>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-surface-container-low border-b border-outline-variant/30 text-xs uppercase">
                                <TableHead className="w-12 text-center">ID</TableHead>
                                <TableHead>Người dùng</TableHead>
                                <TableHead>Thành viên phả hệ</TableHead>
                                <TableHead className="w-52">Phân quyền vai trò</TableHead>
                                <TableHead className="w-28 text-center">Trạng thái</TableHead>
                                <TableHead className="w-24 text-right">Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {usersList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-on-surface-variant text-sm">
                                        {loading ? 'Đang tải danh sách người dùng...' : 'Không tìm thấy tài khoản phù hợp.'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                usersList.map((u) => {
                                    const isSelf = isSuperAdmin && u.email === 'admin@coinguon.vn';
                                    const isUpdating = updatingId === u.id;

                                    return (
                                        <TableRow key={u.id} className="hover:bg-surface-container-low/60 border-b border-outline-variant/20 text-xs sm:text-sm">
                                            <TableCell className="text-center font-mono font-semibold text-on-surface-variant tabular-nums">
                                                #{u.id}
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="size-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                                                        {u.fullName?.charAt(0) || 'U'}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-on-surface truncate">{u.fullName}</p>
                                                        <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-0.5 tabular-nums">
                                                            {u.email && (
                                                                <span className="flex items-center gap-1">
                                                                    <Mail className="size-3" aria-hidden="true" />
                                                                    <span>{u.email}</span>
                                                                </span>
                                                            )}
                                                            {u.phone && (
                                                                <span className="flex items-center gap-1">
                                                                    <Phone className="size-3" aria-hidden="true" />
                                                                    <span>{u.phone}</span>
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                {u.linkedMember ? (
                                                    <div>
                                                        <span className="font-semibold text-on-surface">
                                                            {u.linkedMember.fullName}
                                                        </span>
                                                        <div className="text-xs text-secondary tabular-nums">
                                                            Đời {u.linkedMember.generationNumber} • {u.linkedMember.roleTitle || 'Hậu duệ'}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-outline italic">
                                                        Chưa liên kết phả ký
                                                    </span>
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                <select
                                                    aria-label={`Phân quyền vai trò cho ${u.fullName}`}
                                                    value={u.role}
                                                    disabled={isUpdating || isSelf}
                                                    onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                                                    className="w-full h-9 px-2.5 text-xs font-semibold rounded-lg border border-outline-variant/60 bg-surface text-on-surface cursor-pointer disabled:opacity-50"
                                                >
                                                    <option value="SUPER_ADMIN">Admin Tối Cao</option>
                                                    <option value="CLAN_ADMIN">Quản Trị Dòng Họ</option>
                                                    <option value="BRANCH_ADMIN">Quản Trị Chi Phái</option>
                                                    <option value="MEMBER">Thành Viên Thường</option>
                                                </select>
                                            </TableCell>

                                            <TableCell className="text-center">
                                                {u.status === 'ACTIVE' ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-700/12 text-emerald-800 dark:text-emerald-300">
                                                        <CheckCircle2 className="size-3.5 text-emerald-600" aria-hidden="true" />
                                                        <span>Hoạt động</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-destructive/12 text-destructive">
                                                        <Lock className="size-3.5" aria-hidden="true" />
                                                        <span>Bị khóa</span>
                                                    </span>
                                                )}
                                            </TableCell>

                                            <TableCell className="text-right">
                                                {!isSelf ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-xs"
                                                        disabled={isUpdating}
                                                        aria-label={u.status === 'ACTIVE' ? `Khóa tài khoản ${u.fullName}` : `Mở khóa tài khoản ${u.fullName}`}
                                                        onClick={() => handleStatusToggle(u.id, u.status)}
                                                        className={`size-9 rounded-lg cursor-pointer ${
                                                            u.status === 'ACTIVE'
                                                                ? 'text-destructive hover:bg-destructive/10'
                                                                : 'text-emerald-700 hover:bg-emerald-700/10'
                                                        }`}
                                                        title={u.status === 'ACTIVE' ? 'Khóa tài khoản này' : 'Mở khóa tài khoản'}
                                                    >
                                                        {u.status === 'ACTIVE' ? (
                                                            <Lock className="size-4" aria-hidden="true" />
                                                        ) : (
                                                            <Unlock className="size-4" aria-hidden="true" />
                                                        )}
                                                    </Button>
                                                ) : (
                                                    <span className="text-xs text-outline italic">
                                                        Tài khoản gốc
                                                    </span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
