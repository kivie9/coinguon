'use client';

import React, { useState, useMemo } from 'react';
import {
    Users,
    Search,
    X,
    LayoutGrid,
    GitFork,
    Table as TableIcon,
    User,
    ChevronRight,
    Filter,
} from 'lucide-react';
import { MemberDto } from '@/types/memberType';
import { useMemberFilter } from '@/hooks/useMemberFilter';
import { DesktopMemberCard } from './DesktopMemberCard';
import { Card } from '@/components/ui/card';
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from '@/components/ui/table';
import { BRANCH_OPTIONS } from '@/constants/memberConstants';
import { getRomanNumeral, getGenerationTitle } from '@/utils/memberUtils';
import { useClan } from '@/components/providers/ClanProvider';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { DesktopMemberDetailView } from './DesktopMemberDetailView';
import { VoiceSearchButton } from '@/components/common/VoiceSearchButton';
import { RelationshipLookupModal } from '@/components/app/common/members/RelationshipLookupModal';
import { useAuth } from '@/components/providers/AuthProvider';

export interface DesktopMemberExplorerProps {
    members: MemberDto[];
    onViewDetails?: (id: number) => void;
}

type ViewMode = 'grid' | 'tree' | 'table';

export const DesktopMemberExplorer = ({
    members,
    onViewDetails,
}: DesktopMemberExplorerProps) => {
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'LIVING' | 'DECEASED'>('ALL');
    const [detailMember, setDetailMember] = useState<MemberDto | null>(null);
    const [relModalOpen, setRelModalOpen] = useState(false);
    const { clan } = useClan();
    const { user } = useAuth();

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const v = params.get('view') as ViewMode | null;
            if (v && (v === 'tree' || v === 'grid' || v === 'table')) {
                setViewMode(v);
            }
        }
    }, []);

    const handleViewMemberDetails = (id: number) => {
        const found = members.find((m) => m.id === id);
        if (found) {
            setDetailMember(found);
        }
        onViewDetails?.(id);
    };

    const {
        searchQuery,
        setSearchQuery,
        selectedBranch,
        setSelectedBranch,
        selectedGen,
        setSelectedGen,
        availableGens,
        stats,
        filteredMembers: baseFiltered,
        resetFilters,
        groupedByGen,
    } = useMemberFilter(members);

    const filteredMembers = useMemo(() => {
        if (statusFilter === 'ALL') return baseFiltered;
        if (statusFilter === 'LIVING') return baseFiltered.filter((m) => m.isAlive);
        return baseFiltered.filter((m) => !m.isAlive);
    }, [baseFiltered, statusFilter]);

    const totalGens = availableGens.length;

    return (
        <div className="flex flex-col gap-6 w-full text-on-surface">
            {/* 1. HERO TOP BANNER PHẲNG */}
            <div className="rounded-2xl bg-primary text-on-primary p-7 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <p className="text-secondary-fixed text-xs font-bold uppercase mb-2">
                            {clan.branchFullTitle}
                        </p>
                        <h1 className="text-2xl lg:text-3xl font-serif font-bold text-on-primary uppercase text-balance">
                            {clan.memberExplorerTitle}
                        </h1>
                        <p className="mt-2 text-sm text-on-primary/85 max-w-2xl leading-relaxed text-pretty">
                            {clan.memberExplorerSubtitle}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0 tabular-nums">
                        <div className="bg-primary-container rounded-xl p-3.5 text-center min-w-[104px]">
                            <span className="block text-2xl font-bold font-serif text-secondary-fixed">
                                {members.length}
                            </span>
                            <span className="text-xs text-on-primary/85 font-medium mt-0.5 block">Nhân Khẩu</span>
                        </div>
                        <div className="bg-primary-container rounded-xl p-3.5 text-center min-w-[104px]">
                            <span className="block text-2xl font-bold font-serif text-secondary-fixed">
                                {stats.male}
                            </span>
                            <span className="text-xs text-on-primary/85 font-medium mt-0.5 block">Đinh Nam</span>
                        </div>
                        <div className="bg-primary-container rounded-xl p-3.5 text-center min-w-[104px]">
                            <span className="block text-2xl font-bold font-serif text-secondary-fixed">
                                {stats.female}
                            </span>
                            <span className="text-xs text-on-primary/85 font-medium mt-0.5 block">Nữ Giới</span>
                        </div>
                        <div className="bg-primary-container rounded-xl p-3.5 text-center min-w-[104px]">
                            <span className="block text-2xl font-bold font-serif text-secondary-fixed">
                                {totalGens}
                            </span>
                            <span className="text-xs text-on-primary/85 font-medium mt-0.5 block">Thế Hệ</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. THANH CÔNG CỤ ĐIỀU KHIỂN & BỘ LỌC PHẲNG */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1 w-full max-w-2xl">
                        <div className="relative flex-1">
                            <Search className="size-4 text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
                            <input
                                type="text"
                                aria-label="Tìm kiếm thành viên"
                                placeholder="Tìm kiếm theo họ tên, tự hiệu, chức tước, quê quán..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-11 pl-10 pr-10 bg-surface text-on-surface text-sm rounded-xl border border-outline-variant/60 placeholder:text-outline focus:outline-none focus:border-primary transition-colors duration-150"
                            />
                            {searchQuery && (
                                <Button
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={() => setSearchQuery('')}
                                    aria-label="Xóa từ khóa tìm kiếm"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors duration-150 cursor-pointer"
                                >
                                    <X className="size-4" aria-hidden="true" />
                                </Button>
                            )}
                        </div>

                        <VoiceSearchButton onResult={setSearchQuery} />

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setRelModalOpen(true)}
                            className="min-h-11 px-3.5 rounded-xl bg-secondary/12 hover:bg-secondary/20 text-secondary font-semibold text-sm shrink-0 gap-1.5 cursor-pointer"
                        >
                            <Users className="size-4" aria-hidden="true" />
                            <span>Tra cứu vai vế</span>
                        </Button>

                        {user?.linkedMember && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => handleViewMemberDetails(user.linkedMember!.id)}
                                className="min-h-11 px-3.5 rounded-xl bg-primary/10 hover:bg-primary/15 text-primary font-semibold text-sm shrink-0 gap-1.5 cursor-pointer"
                            >
                                <User className="size-4" aria-hidden="true" />
                                <span>Hồ sơ của tôi</span>
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center gap-1 p-1 bg-surface-container-low rounded-xl shrink-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewMode('grid')}
                            className={`flex items-center gap-1.5 min-h-9 px-3 rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                                viewMode === 'grid'
                                    ? 'bg-primary text-on-primary hover:bg-primary hover:text-on-primary'
                                    : 'text-on-surface-variant hover:text-primary'
                            }`}
                        >
                            <LayoutGrid className="size-4" aria-hidden="true" />
                            <span>Thẻ Phả Hệ</span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewMode('tree')}
                            className={`flex items-center gap-1.5 min-h-9 px-3 rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                                viewMode === 'tree'
                                    ? 'bg-primary text-on-primary hover:bg-primary hover:text-on-primary'
                                    : 'text-on-surface-variant hover:text-primary'
                            }`}
                        >
                            <GitFork className="size-4" aria-hidden="true" />
                            <span>Sơ Đồ Cây</span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewMode('table')}
                            className={`flex items-center gap-1.5 min-h-9 px-3 rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                                viewMode === 'table'
                                    ? 'bg-primary text-on-primary hover:bg-primary hover:text-on-primary'
                                    : 'text-on-surface-variant hover:text-primary'
                            }`}
                        >
                            <TableIcon className="size-4" aria-hidden="true" />
                            <span>Bảng Danh Mục</span>
                        </Button>
                    </div>
                </div>

                <div className="pt-3 border-t border-outline-variant/25 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-semibold text-on-surface-variant mr-1 flex items-center gap-1">
                            <Filter className="size-3.5" aria-hidden="true" />
                            Chi tộc:
                        </span>
                        {BRANCH_OPTIONS.map((branch) => {
                            const isSelected = selectedBranch === branch.id;
                            return (
                                <Button
                                    key={branch.id}
                                    variant="ghost"
                                    size="xs"
                                    onClick={() => setSelectedBranch(branch.id)}
                                    className={`min-h-8 px-3 rounded-lg text-xs font-medium transition-colors duration-150 cursor-pointer ${
                                        isSelected
                                            ? 'bg-primary text-on-primary hover:bg-primary hover:text-on-primary font-semibold'
                                            : 'bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container'
                                    }`}
                                >
                                    {branch.label}
                                </Button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap tabular-nums">
                        <span className="text-xs font-semibold text-on-surface-variant mr-1">Thế hệ:</span>
                        <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => setSelectedGen('all')}
                            className={`min-h-8 px-2.5 rounded-lg text-xs font-medium transition-colors duration-150 cursor-pointer ${
                                selectedGen === 'all'
                                    ? 'bg-secondary text-on-secondary hover:bg-secondary hover:text-on-secondary font-bold'
                                    : 'bg-surface-container-low text-on-surface-variant hover:text-secondary hover:bg-surface-container'
                            }`}
                        >
                            Tất cả ({availableGens.length} Đời)
                        </Button>
                        {availableGens.map((gen) => {
                            const isSelected = selectedGen === gen;
                            const roman = getRomanNumeral(gen);
                            return (
                                <Button
                                    key={gen}
                                    variant="ghost"
                                    size="xs"
                                    onClick={() => setSelectedGen(gen)}
                                    className={`min-h-8 px-2.5 rounded-lg text-xs font-medium transition-colors duration-150 cursor-pointer ${
                                        isSelected
                                            ? 'bg-secondary text-on-secondary hover:bg-secondary hover:text-on-secondary font-bold'
                                            : 'bg-surface-container-low text-on-surface-variant hover:text-secondary hover:bg-surface-container'
                                    }`}
                                >
                                    Đời {roman}
                                </Button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                        <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => setStatusFilter('ALL')}
                            className={`min-h-8 px-3 rounded-lg text-xs font-medium cursor-pointer transition-colors duration-150 ${
                                statusFilter === 'ALL'
                                    ? 'bg-tertiary text-on-tertiary hover:bg-tertiary hover:text-on-tertiary font-semibold'
                                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                            }`}
                        >
                            Tất cả
                        </Button>
                        <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => setStatusFilter('LIVING')}
                            className={`min-h-8 px-3 rounded-lg text-xs font-medium cursor-pointer transition-colors duration-150 ${
                                statusFilter === 'LIVING'
                                    ? 'bg-emerald-700 text-white hover:bg-emerald-700 hover:text-white font-semibold'
                                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                            }`}
                        >
                            Còn sống
                        </Button>
                        <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => setStatusFilter('DECEASED')}
                            className={`min-h-8 px-3 rounded-lg text-xs font-medium cursor-pointer transition-colors duration-150 ${
                                statusFilter === 'DECEASED'
                                    ? 'bg-primary text-on-primary hover:bg-primary hover:text-on-primary font-semibold'
                                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                            }`}
                        >
                            Đã khuất
                        </Button>
                    </div>
                </div>
            </div>

            {/* 3. NỘI DUNG HIỂN THỊ CHÍNH */}
            {filteredMembers.length === 0 ? (
                <div className="p-14 text-center bg-surface-container-lowest rounded-2xl text-on-surface-variant">
                    <div className="size-14 mx-auto rounded-2xl bg-surface-container-low flex items-center justify-center text-primary mb-4">
                        <Users className="size-7 text-primary" aria-hidden="true" />
                    </div>
                    <p className="font-serif font-bold text-primary text-xl text-balance">Không tìm thấy thành viên phù hợp</p>
                    <p className="text-sm text-on-surface-variant mt-2 max-w-md mx-auto text-pretty">
                        Không có dữ liệu thành viên nào thỏa mãn tiêu chí tìm kiếm &ldquo;{searchQuery}&rdquo; trong phạm vi bộ lọc hiện tại.
                    </p>
                    <Button
                        variant="default"
                        onClick={() => {
                            resetFilters();
                            setStatusFilter('ALL');
                        }}
                        className="mt-5 min-h-11 px-5 rounded-xl bg-primary text-on-primary text-sm font-semibold hover:bg-primary-container transition-colors duration-150 cursor-pointer"
                    >
                        Khôi phục tất cả bộ lọc
                    </Button>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredMembers.map((member) => (
                        <DesktopMemberCard
                            key={member.id}
                            member={member}
                            onViewDetails={handleViewMemberDetails}
                        />
                    ))}
                </div>
            ) : viewMode === 'tree' ? (
                <div className="flex flex-col gap-8 bg-surface-container-lowest p-6 rounded-2xl">
                    <div className="flex items-center justify-between pb-3 border-b border-outline-variant/25">
                        <div>
                            <h3 className="font-serif font-bold text-lg text-primary flex items-center gap-2 text-balance">
                                <GitFork className="size-5 text-secondary" aria-hidden="true" />
                                <span>Phả Đồ Trực Hệ Đại Tôn Theo Các Thế Hệ</span>
                            </h3>
                            <p className="text-xs text-on-surface-variant mt-0.5">
                                Kết nối huyết thống từ Thủy Khởi Tổ truyền thừa đến các đời kế tiếp
                            </p>
                        </div>
                        <span className="text-xs font-semibold text-secondary tabular-nums">
                            {filteredMembers.length} thành viên
                        </span>
                    </div>

                    <div className="space-y-8">
                        {Object.entries(groupedByGen).map(([genStr, groupMembers]) => {
                            const genNum = parseInt(genStr, 10);
                            const { title, badge } = getGenerationTitle(genNum);
                            const genFiltered = groupMembers.filter((m) => {
                                if (statusFilter === 'LIVING') return m.isAlive;
                                if (statusFilter === 'DECEASED') return !m.isAlive;
                                return true;
                            });

                            if (genFiltered.length === 0) return null;

                            return (
                                <div key={genNum} className="relative pl-7 border-l border-outline-variant/60 space-y-4">
                                    <div className="absolute -left-3 top-0 size-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-xs tabular-nums">
                                        {genNum}
                                    </div>

                                    <div>
                                        <h4 className="font-serif font-bold text-base text-primary uppercase">
                                            {title}
                                        </h4>
                                        <p className="text-xs text-on-surface-variant tabular-nums">
                                            {badge} ({genFiltered.length} thành viên)
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {genFiltered.map((m) => (
                                            <button
                                                key={m.id}
                                                type="button"
                                                onClick={() => handleViewMemberDetails(m.id)}
                                                className="group p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors duration-150 flex flex-col gap-2.5 cursor-pointer text-left"
                                            >
                                                <div className="flex items-center gap-3 w-full">
                                                    <div className="size-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden text-primary">
                                                        {m.avatarUrl ? (
                                                            <img
                                                                src={m.avatarUrl}
                                                                alt={m.fullName}
                                                                className="size-full object-cover"
                                                            />
                                                        ) : (
                                                            <User className="size-5 text-secondary" aria-hidden="true" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-serif font-bold text-sm text-on-surface group-hover:text-primary transition-colors duration-150 truncate">
                                                            {m.fullName}
                                                        </p>
                                                        {m.courtesyName && (
                                                            <p className="text-xs text-secondary italic truncate">
                                                                {m.courtesyName}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="pt-2 border-t border-outline-variant/25 flex items-center justify-between w-full text-xs text-on-surface-variant">
                                                    <span className="truncate">{m.roleTitle || 'Thành viên'}</span>
                                                    <span
                                                        className={`font-semibold shrink-0 ${
                                                            m.isAlive ? 'text-emerald-700' : 'text-on-surface-variant'
                                                        }`}
                                                    >
                                                        {m.isAlive ? 'Còn sống' : 'Đã khuất'}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <Card className="bg-surface-container-lowest overflow-hidden rounded-2xl">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-surface-container-low border-b border-outline-variant/30">
                                    <TableHead className="w-16">ID</TableHead>
                                    <TableHead>Họ và Tên</TableHead>
                                    <TableHead>Thế Hệ</TableHead>
                                    <TableHead>Chi Phái</TableHead>
                                    <TableHead>Năm Sinh</TableHead>
                                    <TableHead>Trạng Thái</TableHead>
                                    <TableHead>Kỵ Nhật Âm Lịch</TableHead>
                                    <TableHead>Nơi An Táng / Cư Trú</TableHead>
                                    <TableHead className="text-right">Hồ Sơ</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMembers.map((m) => (
                                    <TableRow key={m.id} className="hover:bg-surface-container-low/60 border-b border-outline-variant/20">
                                        <TableCell className="font-mono text-xs text-on-surface-variant font-semibold tabular-nums">
                                            #{m.id}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-serif font-bold text-sm text-on-surface">
                                                {m.fullName}
                                            </div>
                                            {m.courtesyName && (
                                                <div className="text-xs text-secondary italic">
                                                    {m.courtesyName}
                                                </div>
                                            )}
                                            {m.spouse && (
                                                <div className="text-xs text-on-surface-variant mt-0.5">
                                                    Hôn phối: {m.spouse}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-xs font-semibold text-secondary tabular-nums">
                                            Đời thứ {m.generationNumber}
                                        </TableCell>
                                        <TableCell className="text-xs font-medium text-on-surface-variant">
                                            {m.branch || 'Chi Trưởng'}
                                        </TableCell>
                                        <TableCell className="text-xs text-on-surface-variant tabular-nums">
                                            {m.birthdaySolar || 'Chưa rõ'}
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                                                    m.isAlive
                                                        ? 'bg-emerald-700/12 text-emerald-800 dark:text-emerald-300'
                                                        : 'bg-surface-container-high text-on-surface-variant'
                                                }`}
                                            >
                                                {m.isAlive ? 'Còn sống' : 'Đã khuất'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-xs text-primary font-medium tabular-nums">
                                            {m.deathDayLunar ? `${m.deathDayLunar} ÂL` : '—'}
                                        </TableCell>
                                        <TableCell className="text-xs text-on-surface-variant max-w-xs truncate">
                                            {m.burialPlace || m.residence || 'Từ đường bản tộc'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleViewMemberDetails(m.id)}
                                                className="inline-flex items-center gap-1 min-h-9 px-3 rounded-lg bg-surface-container-low hover:bg-primary hover:text-on-primary text-xs font-semibold text-primary transition-colors duration-150 cursor-pointer"
                                            >
                                                <span>Chi tiết</span>
                                                <ChevronRight className="size-3.5" aria-hidden="true" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            )}

            <Dialog open={!!detailMember} onOpenChange={(open) => !open && setDetailMember(null)}>
                <DialogContent
                    showCloseButton={true}
                    className="sm:max-w-6xl w-full max-h-[92dvh] overflow-y-auto p-6 md:p-8 bg-surface rounded-2xl border-0"
                >
                    <DialogHeader className="sr-only">
                        <DialogTitle>Hồ Sơ Thành Viên: {detailMember?.fullName}</DialogTitle>
                        <DialogDescription>
                            Chi tiết thông tin phả ký, tiểu sử, con cháu và công đức của {detailMember?.fullName}
                        </DialogDescription>
                    </DialogHeader>
                    {detailMember && (
                        <DesktopMemberDetailView
                            member={detailMember}
                            onBack={() => setDetailMember(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <RelationshipLookupModal
                open={relModalOpen}
                onOpenChange={setRelModalOpen}
                members={members}
            />
        </div>
    );
};
