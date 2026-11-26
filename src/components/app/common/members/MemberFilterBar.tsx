'use client';

import React from 'react';
import { Search, X, Plus } from 'lucide-react';
import { triggerHaptic } from '@/utils/haptics';
import { BRANCH_OPTIONS } from '@/constants/memberConstants';
import { getRomanNumeral } from '@/utils/memberUtils';
import { BranchFilter, GenFilter } from '@/hooks/useMemberFilter';
import { Button } from '@/components/ui/button';

interface MemberFilterBarProps {
    totalMembers: number;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedBranch: BranchFilter;
    onBranchChange: (branch: BranchFilter) => void;
    selectedGen: GenFilter;
    onGenChange: (gen: GenFilter) => void;
    availableGens: number[];
    stats: { male: number; female: number; total: number };
    onAddNewMember?: () => void;
}

export const MemberFilterBar = ({
    totalMembers,
    searchQuery,
    onSearchChange,
    selectedBranch,
    onBranchChange,
    selectedGen,
    onGenChange,
    availableGens,
    stats,
    onAddNewMember,
}: MemberFilterBarProps) => {
    return (
        <div className="flex flex-col gap-3 bg-surface-container-lowest p-3.5 rounded-2xl select-none">
            <div className="flex items-center gap-2.5 w-full">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary">
                        <Search className="size-4 text-secondary" aria-hidden="true" />
                    </div>
                    <input
                        type="text"
                        aria-label="Tìm kiếm thành viên"
                        placeholder="Tìm thành viên, tự hiệu, chức vị..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full h-11 pl-10 pr-9 bg-surface text-on-surface text-sm rounded-xl border border-outline-variant/60 placeholder:text-outline focus:outline-none focus:border-primary transition-colors duration-150"
                    />
                    {searchQuery && (
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => onSearchChange('')}
                            aria-label="Xóa tìm kiếm"
                            className="absolute inset-y-0 right-0 my-auto mr-2.5 text-outline hover:text-primary transition-colors duration-150 cursor-pointer"
                        >
                            <X className="size-4" aria-hidden="true" />
                        </Button>
                    )}
                </div>

                {onAddNewMember && (
                    <Button
                        onClick={onAddNewMember}
                        aria-label="Đăng ký đinh mới"
                        className="shrink-0 bg-primary hover:bg-primary-container text-on-primary px-3.5 sm:px-4 min-h-11 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 border-0 transition-colors duration-150 cursor-pointer"
                    >
                        <Plus className="size-4" aria-hidden="true" />
                        <span className="hidden sm:inline">Đăng Ký Đinh Mới</span>
                        <span className="sm:hidden">Đinh Mới</span>
                    </Button>
                )}
            </div>

            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 flex-1 min-w-0">
                    {BRANCH_OPTIONS.map((opt) => (
                        <Button
                            key={opt.id}
                            variant="ghost"
                            size="xs"
                            onClick={() => {
                                triggerHaptic('selection');
                                onBranchChange(opt.id);
                            }}
                            className={`min-h-8 px-3 rounded-lg text-xs shrink-0 font-medium transition-colors duration-150 cursor-pointer tabular-nums ${
                                selectedBranch === opt.id
                                    ? 'bg-primary text-on-primary hover:bg-primary hover:text-on-primary font-semibold'
                                    : 'bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container'
                            }`}
                        >
                            {opt.id === 'all' ? `Tất cả (${totalMembers})` : opt.label}
                        </Button>
                    ))}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-secondary font-semibold shrink-0 tabular-nums">
                    <span>{stats.male} Nam</span>
                    <span>•</span>
                    <span>{stats.female} Nữ</span>
                </div>
            </div>

            <div className="flex items-center gap-1.5 pt-2 border-t border-outline-variant/25 overflow-x-auto no-scrollbar">
                <span className="text-xs text-on-surface-variant font-semibold shrink-0 pr-1">Đời:</span>
                <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => {
                        triggerHaptic('selection');
                        onGenChange('all');
                    }}
                    className={`min-h-8 px-2.5 rounded-lg text-xs shrink-0 font-medium transition-colors duration-150 cursor-pointer ${
                        selectedGen === 'all'
                            ? 'bg-secondary text-on-secondary hover:bg-secondary hover:text-on-secondary font-bold'
                            : 'bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container'
                    }`}
                >
                    Tất cả
                </Button>
                {availableGens.map((gen) => {
                    const roman = getRomanNumeral(gen);
                    const isSelected = selectedGen === gen;
                    return (
                        <Button
                            key={gen}
                            variant="ghost"
                            size="xs"
                            onClick={() => {
                                triggerHaptic('selection');
                                onGenChange(gen);
                            }}
                            className={`min-h-8 px-2.5 rounded-lg text-xs shrink-0 font-medium transition-colors duration-150 cursor-pointer ${
                                isSelected
                                    ? 'bg-secondary text-on-secondary hover:bg-secondary hover:text-on-secondary font-bold'
                                    : 'bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container'
                            }`}
                        >
                            Đời {roman}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
};
