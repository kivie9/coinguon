'use client';

import React from 'react';
import { MemberDto } from '@/types/memberType';
import { useMemberFilter } from '@/hooks/useMemberFilter';
import { Button } from '@/components/ui/button';
import { MemberFilterBar } from '@/components/app/common/members/MemberFilterBar';
import { DesktopMemberCard } from './DesktopMemberCard';

export interface DesktopMemberListProps {
    members: MemberDto[];
    onViewDetails?: (id: number) => void;
}

export const DesktopMemberList = ({ members, onViewDetails }: DesktopMemberListProps) => {
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
        resetFilters,
    } = useMemberFilter(members);

    return (
        <div className="flex flex-col gap-6 w-full">
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
            />

            {filteredMembers.length === 0 ? (
                <div className="p-12 text-center bg-surface-container-lowest rounded-2xl text-on-surface-variant">
                    <p className="font-serif font-bold text-primary text-lg text-balance">Không tìm thấy thành viên</p>
                    <p className="text-sm text-on-surface-variant mt-1.5 text-pretty">
                        Không có dữ liệu khớp với &ldquo;{searchQuery}&rdquo; trong phạm vi bộ lọc đang chọn.
                    </p>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                        className="mt-4 min-h-10 px-4 rounded-xl bg-surface-container text-xs font-semibold text-primary hover:bg-surface-container-high transition-colors duration-150 cursor-pointer"
                    >
                        Đặt lại tất cả bộ lọc
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredMembers.map((member) => (
                        <DesktopMemberCard
                            key={member.id}
                            member={member}
                            onViewDetails={onViewDetails}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
