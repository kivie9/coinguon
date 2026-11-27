'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { UserRole, UserStatus, UserProfileDto } from '@/types/userType';
import { MemberDto } from '@/types/memberType';
import { apiFetch } from '@/services/api/apiClient';
import { fetchMembersApi } from '@/services/api/memberApi';
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
    KeyRound,
    Link2,
    Trash2,
    Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

const ROLE_LABELS: Record<string, string> = {
    SUPER_ADMIN: 'Admin Tối Cao',
    CLAN_ADMIN: 'Trưởng Tộc / Quản Trị Họ',
    BRANCH_ADMIN: 'Trưởng Chi',
    MEMBER: 'Thành Viên',
};

export default function AdminUsersPage() {
    const { user: currentUser, isSuperAdmin, role } = useAuth();
    const [usersList, setUsersList] = useState<UserProfileDto[]>([]);
    const [membersList, setMembersList] = useState<MemberDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('ALL');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    // Dialog Đặt lại mật khẩu
    const [resetUser, setResetUser] = useState<UserProfileDto | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [resetting, setResetting] = useState(false);

    // Dialog Liên kết hồ sơ phả hệ
    const [linkUser, setLinkUser] = useState<UserProfileDto | null>(null);
    const [memberSearch, setMemberSearch] = useState('');
    const [selectedMemberId, setSelectedMemberId] = useState<string>('');
    const [linking, setLinking] = useState(false);

    // Dialog Xóa tài khoản
    const [deleteUser, setDeleteUser] = useState<UserProfileDto | null>(null);
    const [deleting, setDeleting] = useState(false);

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            const query = new URLSearchParams();
            if (roleFilter !== 'ALL') query.set('role', roleFilter);
            if (statusFilter !== 'ALL') query.set('status', statusFilter);
            if (search.trim()) query.set('search', search.trim());

            const res = await apiFetch(`/api/users?${query.toString()}`, { cache: 'no-store' });
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
    }, [roleFilter, statusFilter, search]);

    useEffect(() => {
        if (isSuperAdmin) {
            loadUsers();
        }
    }, [isSuperAdmin, roleFilter, statusFilter]);

    useEffect(() => {
        if (isSuperAdmin) {
            fetchMembersApi().then(setMembersList).catch(() => {});
        }
    }, [isSuperAdmin]);

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
                toast.success(`Đã cập nhật vai trò thành: ${ROLE_LABELS[newRole] || newRole}`);
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

    const handleStatusChange = async (userId: number, nextStatus: UserStatus) => {
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
                    nextStatus === 'ACTIVE'
                        ? 'Đã kích hoạt / duyệt tài khoản thành công.'
                        : 'Đã khóa tài khoản thành công.'
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

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resetUser) return;
        if (newPassword.length < 8) {
            toast.error('Mật khẩu mới phải có ít nhất 8 ký tự.');
            return;
        }
        try {
            setResetting(true);
            const res = await apiFetch(`/api/users/${resetUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newPassword }),
            });
            const json = await res.json();
            if (res.ok && json.success) {
                toast.success(`Đã đặt lại mật khẩu cho ${resetUser.fullName}.`);
                setResetUser(null);
                setNewPassword('');
            } else {
                toast.error(json.message || 'Không thể đặt lại mật khẩu.');
            }
        } catch {
            toast.error('Lỗi kết nối khi đặt lại mật khẩu.');
        } finally {
            setResetting(false);
        }
    };

    const handleSaveMemberLink = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!linkUser) return;
        try {
            setLinking(true);
            const memberIdVal = selectedMemberId ? Number(selectedMemberId) : null;
            const res = await apiFetch(`/api/users/${linkUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ memberId: memberIdVal }),
            });
            const json = await res.json();
            if (res.ok && json.success) {
                toast.success('Đã cập nhật liên kết hồ sơ phả hệ.');
                setLinkUser(null);
                loadUsers();
            } else {
                toast.error(json.message || 'Cập nhật liên kết thất bại.');
            }
        } catch {
            toast.error('Lỗi kết nối khi liên kết phả hệ.');
        } finally {
            setLinking(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deleteUser) return;
        try {
            setDeleting(true);
            const res = await apiFetch(`/api/users/${deleteUser.id}`, {
                method: 'DELETE',
            });
            const json = await res.json();
            if (res.ok && json.success) {
                toast.success(`Đã xóa tài khoản ${deleteUser.fullName}.`);
                setUsersList((prev) => prev.filter((u) => u.id !== deleteUser.id));
                setDeleteUser(null);
            } else {
                toast.error(json.message || 'Không thể xóa tài khoản.');
            }
        } catch {
            toast.error('Lỗi kết nối khi xóa tài khoản.');
        } finally {
            setDeleting(false);
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

    const pendingCount = usersList.filter((u) => u.status === 'PENDING').length;
    const superAdminCount = usersList.filter((u) => u.role === 'SUPER_ADMIN').length;
    const adminCount = usersList.filter((u) => u.role === 'CLAN_ADMIN' || u.role === 'BRANCH_ADMIN').length;
    const memberCount = usersList.filter((u) => u.role === 'MEMBER').length;

    const filteredMembers = membersList.filter((m) =>
        !memberSearch.trim()
            ? true
            : m.fullName.toLowerCase().includes(memberSearch.toLowerCase()) ||
              String(m.id).includes(memberSearch.trim())
    );

    return (
        <div className="space-y-6">
            {/* Thống kê nhanh */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 tabular-nums">
                <Card className="rounded-2xl bg-surface-container-lowest">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-secondary/12 text-secondary flex items-center justify-center shrink-0">
                            <Clock className="size-5" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="text-xs text-on-surface-variant">Chờ duyệt</p>
                            <p className="text-xl font-bold text-secondary">{pendingCount}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl bg-surface-container-lowest">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Crown className="size-5" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="text-xs text-on-surface-variant">Admin Tối Cao</p>
                            <p className="text-xl font-bold text-primary">{superAdminCount}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl bg-surface-container-lowest">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-surface-container text-on-surface flex items-center justify-center shrink-0">
                            <Shield className="size-5" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="text-xs text-on-surface-variant">Quản trị Họ / Chi</p>
                            <p className="text-xl font-bold text-on-surface">{adminCount}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl bg-surface-container-lowest">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-surface-container text-on-surface flex items-center justify-center shrink-0">
                            <Users className="size-5" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="text-xs text-on-surface-variant">Thành Viên</p>
                            <p className="text-xl font-bold text-on-surface">{memberCount}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bảng quản lý người dùng */}
            <Card className="rounded-2xl bg-surface-container-lowest overflow-hidden">
                <CardHeader className="p-5 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="font-serif text-lg text-primary flex items-center gap-2 text-balance">
                                <UserCheck className="size-5 text-secondary" aria-hidden="true" />
                                <span>Danh Sách Tài Khoản &amp; Phê Duyệt</span>
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm text-on-surface-variant mt-1">
                                Duyệt thành viên mới, gán hồ sơ phả hệ, phân quyền hoặc đặt lại mật khẩu cho người thân.
                            </CardDescription>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={loadUsers}
                            disabled={loading}
                            className="min-h-10 px-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface gap-1.5 shrink-0 cursor-pointer"
                        >
                            <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
                            <span>Làm mới</span>
                        </Button>
                    </div>

                    {/* Bộ lọc */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                loadUsers();
                            }}
                            className="relative flex-1"
                        >
                            <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" aria-hidden="true" />
                            <Input
                                placeholder="Tìm theo tên, email hoặc SĐT..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 h-10 rounded-xl border-outline-variant/60 bg-surface text-sm"
                            />
                        </form>

                        <div className="sm:w-52">
                            <Select
                                aria-label="Lọc theo vai trò"
                                value={roleFilter}
                                onValueChange={setRoleFilter}
                                options={[
                                    { value: 'ALL', label: 'Tất cả vai trò' },
                                    { value: 'SUPER_ADMIN', label: 'Admin Tối Cao' },
                                    { value: 'CLAN_ADMIN', label: 'Trưởng Tộc / Quản Trị Họ' },
                                    { value: 'BRANCH_ADMIN', label: 'Trưởng Chi' },
                                    { value: 'MEMBER', label: 'Thành Viên' },
                                ]}
                                className="bg-surface"
                            />
                        </div>

                        <div className="sm:w-44">
                            <Select
                                aria-label="Lọc theo trạng thái"
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                                options={[
                                    { value: 'ALL', label: 'Tất cả trạng thái' },
                                    { value: 'PENDING', label: 'Chờ duyệt' },
                                    { value: 'ACTIVE', label: 'Đang hoạt động' },
                                    { value: 'LOCKED', label: 'Đã khóa' },
                                ]}
                                className="bg-surface"
                            />
                        </div>
                    </div>
                </CardHeader>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-surface-container-low border-b border-outline-variant/30">
                                <TableHead>Người dùng</TableHead>
                                <TableHead>Hồ sơ phả hệ</TableHead>
                                <TableHead>Vai trò</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-on-surface-variant text-sm">
                                        Đang tải danh sách tài khoản...
                                    </TableCell>
                                </TableRow>
                            ) : usersList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-on-surface-variant text-sm">
                                        Không tìm thấy tài khoản nào phù hợp.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                usersList.map((u) => {
                                    const isSelf = currentUser?.id === u.id;
                                    const isBusy = updatingId === u.id;

                                    return (
                                        <TableRow
                                            key={u.id}
                                            className="hover:bg-surface-container-low/60 border-b border-outline-variant/20 tabular-nums"
                                        >
                                            <TableCell>
                                                <p className="font-semibold text-sm text-on-surface">
                                                    {u.fullName} {isSelf && <span className="text-xs text-primary">(Bạn)</span>}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-on-surface-variant mt-0.5">
                                                    {u.email && (
                                                        <span className="inline-flex items-center gap-1">
                                                            <Mail className="size-3" aria-hidden="true" />
                                                            {u.email}
                                                        </span>
                                                    )}
                                                    {u.phone && (
                                                        <span className="inline-flex items-center gap-1">
                                                            <Phone className="size-3" aria-hidden="true" />
                                                            {u.phone}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                {u.linkedMember ? (
                                                    <div className="text-xs">
                                                        <p className="font-semibold text-on-surface">{u.linkedMember.fullName}</p>
                                                        <p className="text-on-surface-variant">
                                                            Đời {u.linkedMember.generationNumber}
                                                            {u.linkedMember.branchTitle ? ` • ${u.linkedMember.branchTitle}` : ''}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-on-surface-variant">Chưa liên kết</span>
                                                )}
                                            </TableCell>

                                            <TableCell className="min-w-[160px]">
                                                <Select
                                                    aria-label={`Vai trò của ${u.fullName}`}
                                                    value={u.role}
                                                    disabled={isBusy || isSelf}
                                                    onValueChange={(v) => handleRoleChange(u.id, v as UserRole)}
                                                    options={[
                                                        { value: 'MEMBER', label: 'Thành Viên' },
                                                        { value: 'BRANCH_ADMIN', label: 'Trưởng Chi' },
                                                        { value: 'CLAN_ADMIN', label: 'Trưởng Tộc' },
                                                        { value: 'SUPER_ADMIN', label: 'Admin Tối Cao' },
                                                    ]}
                                                    className="min-h-9 py-1.5 text-xs bg-surface"
                                                />
                                            </TableCell>

                                            <TableCell>
                                                {u.status === 'ACTIVE' ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-700/12 text-emerald-700">
                                                        <CheckCircle2 className="size-3.5" aria-hidden="true" />
                                                        Hoạt động
                                                    </span>
                                                ) : u.status === 'PENDING' ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-secondary/12 text-secondary">
                                                        <Clock className="size-3.5" aria-hidden="true" />
                                                        Chờ duyệt
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-primary/10 text-primary">
                                                        <Lock className="size-3.5" aria-hidden="true" />
                                                        Đã khóa
                                                    </span>
                                                )}
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <div className="inline-flex items-center justify-end gap-1.5">
                                                    {u.status === 'PENDING' && (
                                                        <Button
                                                            size="sm"
                                                            disabled={isBusy}
                                                            onClick={() => handleStatusChange(u.id, 'ACTIVE')}
                                                            className="min-h-9 px-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold cursor-pointer"
                                                        >
                                                            Duyệt
                                                        </Button>
                                                    )}

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        aria-label={`Liên kết phả hệ cho ${u.fullName}`}
                                                        title="Liên kết hồ sơ phả hệ"
                                                        onClick={() => {
                                                            setLinkUser(u);
                                                            setSelectedMemberId(u.memberId ? String(u.memberId) : '');
                                                            setMemberSearch('');
                                                        }}
                                                        className="size-9 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface cursor-pointer"
                                                    >
                                                        <Link2 className="size-4" aria-hidden="true" />
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        aria-label={`Đặt lại mật khẩu cho ${u.fullName}`}
                                                        title="Đặt lại mật khẩu"
                                                        onClick={() => {
                                                            setResetUser(u);
                                                            setNewPassword('');
                                                        }}
                                                        className="size-9 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface cursor-pointer"
                                                    >
                                                        <KeyRound className="size-4" aria-hidden="true" />
                                                    </Button>

                                                    {!isSelf && u.status !== 'PENDING' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            disabled={isBusy}
                                                            aria-label={u.status === 'ACTIVE' ? `Khóa ${u.fullName}` : `Mở khóa ${u.fullName}`}
                                                            title={u.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    u.id,
                                                                    u.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE'
                                                                )
                                                            }
                                                            className="size-9 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface cursor-pointer"
                                                        >
                                                            {u.status === 'ACTIVE' ? (
                                                                <Lock className="size-4" aria-hidden="true" />
                                                            ) : (
                                                                <Unlock className="size-4" aria-hidden="true" />
                                                            )}
                                                        </Button>
                                                    )}

                                                    {!isSelf && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            aria-label={`Xóa tài khoản ${u.fullName}`}
                                                            title="Xóa tài khoản"
                                                            onClick={() => setDeleteUser(u)}
                                                            className="size-9 rounded-lg bg-surface-container-low hover:bg-primary/10 text-primary cursor-pointer"
                                                        >
                                                            <Trash2 className="size-4" aria-hidden="true" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Dialog Đặt lại mật khẩu */}
            <Dialog open={!!resetUser} onOpenChange={(open) => !open && setResetUser(null)}>
                <DialogContent size="md" stickyLayout>
                    <DialogHeader>
                        <DialogTitle>Đặt Lại Mật Khẩu</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleResetPassword} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                        <DialogBody className="space-y-4">
                            <p className="text-sm text-on-surface-variant text-pretty">
                                Tài khoản: <strong className="text-on-surface">{resetUser?.fullName}</strong> ({resetUser?.email})
                            </p>
                            <div className="space-y-1.5">
                                <Label htmlFor="resetPassInput" className="text-sm font-semibold text-on-surface">
                                    Mật khẩu mới (tối thiểu 8 ký tự)
                                </Label>
                                <Input
                                    id="resetPassInput"
                                    type="password"
                                    minLength={8}
                                    required
                                    placeholder="Nhập mật khẩu mới..."
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="h-11 rounded-xl border-outline-variant/60 bg-surface-container-lowest"
                                />
                            </div>
                        </DialogBody>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setResetUser(null)}
                                className="min-h-11 px-5 rounded-xl bg-surface-container-low text-on-surface cursor-pointer"
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                disabled={resetting}
                                className="min-h-11 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold cursor-pointer"
                            >
                                {resetting ? 'Đang lưu...' : 'Lưu mật khẩu mới'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog Liên kết hồ sơ phả hệ */}
            <Dialog open={!!linkUser} onOpenChange={(open) => !open && setLinkUser(null)}>
                <DialogContent size="md" stickyLayout>
                    <DialogHeader>
                        <DialogTitle>Liên Kết Hồ Sơ Phả Hệ</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSaveMemberLink} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                        <DialogBody className="space-y-4">
                            <p className="text-sm text-on-surface-variant text-pretty">
                                Gắn tài khoản <strong className="text-on-surface">{linkUser?.fullName}</strong> với hồ sơ thành viên trong gia phả (giúp xác định Chi cho Trưởng Chi và vai vế).
                            </p>
                            <div className="space-y-1.5">
                                <Label htmlFor="memberSearchInput" className="text-sm font-semibold text-on-surface">
                                    Tìm nhanh thành viên
                                </Label>
                                <Input
                                    id="memberSearchInput"
                                    placeholder="Gõ tên thành viên..."
                                    value={memberSearch}
                                    onChange={(e) => setMemberSearch(e.target.value)}
                                    className="h-11 rounded-xl border-outline-variant/60 bg-surface-container-lowest"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="memberSelect" className="text-sm font-semibold text-on-surface">
                                    Chọn hồ sơ phả hệ
                                </Label>
                                <Select
                                    id="memberSelect"
                                    aria-label="Chọn hồ sơ phả hệ"
                                    value={selectedMemberId}
                                    onValueChange={setSelectedMemberId}
                                    options={[
                                        { value: '', label: '-- Không liên kết --' },
                                        ...filteredMembers.slice(0, 80).map((m) => ({
                                            value: String(m.id),
                                            label: `#${m.id} — ${m.fullName} (Đời ${m.generationNumber})`,
                                        })),
                                    ]}
                                    className="min-h-11"
                                />
                            </div>
                        </DialogBody>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setLinkUser(null)}
                                className="min-h-11 px-5 rounded-xl bg-surface-container-low text-on-surface cursor-pointer"
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                disabled={linking}
                                className="min-h-11 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold cursor-pointer"
                            >
                                {linking ? 'Đang lưu...' : 'Lưu liên kết'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog Xác nhận xóa tài khoản */}
            <Dialog open={!!deleteUser} onOpenChange={(open) => !open && setDeleteUser(null)}>
                <DialogContent size="sm">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-lg font-bold text-primary">
                            Xác Nhận Xóa Tài Khoản
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-on-surface-variant text-pretty">
                        Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản <strong className="text-on-surface">{deleteUser?.fullName}</strong> ({deleteUser?.email})? Hành động này không thể hoàn tác.
                    </p>
                    <DialogFooter className="pt-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setDeleteUser(null)}
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
                            {deleting ? 'Đang xóa...' : 'Xóa tài khoản'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
