'use client';

import React, { useState } from 'react';
import { MemberDto } from '@/types/memberType';
import { triggerHaptic } from '@/utils/haptics';
import { toast } from '@/components/ui/sonner';
import { useMemberFilter } from '@/hooks/useMemberFilter';
import { Button } from '@/components/ui/button';
import { MemberFilterBar } from '@/components/app/common/members/MemberFilterBar';
import { MobileMemberSection } from './MobileMemberSection';
import { MobileMemberDetailDrawer } from './MobileMemberDetailDrawer';

export interface MobileMemberListProps {
    members: MemberDto[];
    onViewDetails?: (id: number) => void;
}

export const MobileMemberList = ({ members, onViewDetails }: MobileMemberListProps) => {
    const [selectedMember, setSelectedMember] = useState<MemberDto | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const {
        searchQuery,
        setSearchQuery,
        selectedBranch,
        setSelectedBranch,
        selectedGen,
        setSelectedGen,
        availableGens,
        stats,
        filteredMembers,
        groupedByGen,
        resetFilters,
    } = useMemberFilter(members);

    const handleViewDetails = (id: number) => {
        triggerHaptic('medium');
        const found = members.find((m) => m.id === id);
        if (found) {
            setSelectedMember(found);
            setDrawerOpen(true);
        }
        onViewDetails?.(id);
    };

    const handleAddNewMember = () => {
        triggerHaptic('medium');
        toast.info('Đăng ký đinh mới', {
            description: 'Báo hỷ thành viên mới sinh trong dòng tộc. Ban Trị Sự Từ Đường sẽ đối chiếu và cập nhật vào thế thứ Gia Phả.',
        });
    };

    return (
        <div className="flex flex-col gap-3.5 w-full">
            <MemberFilterBar
                totalMembers={members.length}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedBranch={selectedBranch}
                onBranchChange={setSelectedBranch}
                selectedGen={selectedGen}
                onGenChange={setSelectedGen}
                availableGens={availableGens}
                stats={stats}
                onAddNewMember={handleAddNewMember}
            />

            {filteredMembers.length === 0 ? (
                <div className="p-8 text-center bg-surface-container-lowest rounded-2xl text-on-surface-variant text-sm">
                    <p className="font-serif font-bold text-primary text-base text-balance">Không tìm thấy thành viên</p>
                    <p className="text-xs text-on-surface-variant mt-1 text-pretty">
                        Không có dữ liệu khớp với &ldquo;{searchQuery}&rdquo; trong phạm vi bộ lọc đang chọn.
                    </p>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                        className="mt-3 min-h-10 px-4 rounded-xl bg-surface-container text-xs font-semibold text-primary hover:bg-surface-container-high transition-colors duration-150 cursor-pointer"
                    >
                        Đặt lại tất cả bộ lọc
                    </Button>
                </div>
            ) : (
                <MobileMemberSection
                    groupedByGen={groupedByGen}
                    selectedGen={selectedGen}
                    onViewDetails={handleViewDetails}
                    onAddNewMember={handleAddNewMember}
                />
            )}

            <MobileMemberDetailDrawer
                member={selectedMember}
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
            />
        </div>
    );
};
