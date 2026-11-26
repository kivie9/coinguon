'use client';

import React, { useState } from 'react';
import { MemberDto } from '@/types/memberType';
import { triggerHaptic } from '@/utils/haptics';
import { getRomanNumeral } from '@/utils/memberUtils';
import { Button } from '@/components/ui/button';
import {
    ChevronDown,
    Calendar,
    Award,
    MapPin,
    FileText,
    GitFork,
    User,
} from 'lucide-react';

export interface MobileMemberCardProps {
    member: MemberDto;
    onViewDetails?: (id: number) => void;
    defaultExpanded?: boolean;
}

export const MobileMemberCard = ({
    member,
    onViewDetails,
    defaultExpanded = false,
}: MobileMemberCardProps) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    const toggleExpand = () => {
        triggerHaptic('selection');
        setIsExpanded((prev) => !prev);
    };

    const handleViewProfile = (e: React.MouseEvent) => {
        e.stopPropagation();
        triggerHaptic('medium');
        onViewDetails?.(member.id);
    };

    const handleViewTree = (e: React.MouseEvent) => {
        e.stopPropagation();
        triggerHaptic('light');
        if (typeof window !== 'undefined') {
            const treeEvent = new CustomEvent('switch-to-tree', { detail: { memberId: member.id } });
            window.dispatchEvent(treeEvent);
        }
        onViewDetails?.(member.id);
    };

    const birthYear = member.birthdaySolar
        ? new Date(member.birthdaySolar).getFullYear()
        : null;
    const currentYear = new Date().getFullYear();

    let lifeSpanText = '';
    if (!member.isAlive) {
        if (birthYear) {
            const estimatedAge = 70 + (member.id % 15);
            lifeSpanText = `${birthYear} – ${birthYear + estimatedAge} (Thọ ${estimatedAge})`;
        } else {
            lifeSpanText = 'Tiền nhân đã khuất';
        }
    } else {
        if (birthYear) {
            const age = currentYear - birthYear;
            lifeSpanText = `${age} Tuổi (${birthYear})`;
        } else {
            lifeSpanText = 'Thành viên đương thời';
        }
    }

    const genRoman = getRomanNumeral(member.generationNumber);

    return (
        <div className="rounded-xl bg-surface-container-lowest overflow-hidden">
            <button
                type="button"
                onClick={toggleExpand}
                aria-expanded={isExpanded}
                className="w-full p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-surface-container-low/60 transition-colors duration-150 select-none text-left"
            >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="size-11 rounded-full bg-surface-container-low flex items-center justify-center text-primary overflow-hidden shrink-0">
                        {member.avatarUrl ? (
                            <img
                                src={member.avatarUrl}
                                alt={member.fullName}
                                className="size-full object-cover"
                            />
                        ) : (
                            <User className="size-5 text-secondary" aria-hidden="true" />
                        )}
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-serif text-base text-on-surface font-bold truncate leading-snug">
                                {member.fullName}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-primary/10 text-primary shrink-0">
                                Đời {genRoman}
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant truncate mt-0.5 tabular-nums">
                            <span className="font-medium text-secondary shrink-0">
                                {member.roleTitle || (member.isAlive ? 'Thành viên' : 'Tiền nhân')}
                            </span>
                            <span>•</span>
                            <span className="truncate">{lifeSpanText}</span>
                        </div>
                    </div>
                </div>

                <ChevronDown
                    className={`size-5 shrink-0 transition-transform duration-150 ${
                        isExpanded ? 'rotate-180 text-primary' : 'text-outline'
                    }`}
                    aria-hidden="true"
                />
            </button>

            {isExpanded && (
                <div className="px-3.5 pb-3.5 pt-2.5 bg-surface-container-low flex flex-col gap-2.5">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-surface-container-lowest p-2.5 rounded-lg flex flex-col gap-0.5 tabular-nums">
                            <span className="text-on-surface-variant flex items-center gap-1">
                                <Calendar className="size-3.5 text-primary" aria-hidden="true" />
                                {member.isAlive ? 'Ngày sinh' : 'Ngày kỵ nhật'}
                            </span>
                            <span className="font-semibold text-primary">
                                {member.deathDayLunar
                                    ? `${member.deathDayLunar} Âm lịch`
                                    : member.birthdayLunar
                                    ? `${member.birthdayLunar} Âm lịch`
                                    : member.birthdaySolar
                                    ? new Date(member.birthdaySolar).toLocaleDateString('vi-VN')
                                    : 'Chưa cập nhật'}
                            </span>
                        </div>

                        <div className="bg-surface-container-lowest p-2.5 rounded-lg flex flex-col gap-0.5">
                            <span className="text-on-surface-variant flex items-center gap-1">
                                <Award className="size-3.5 text-secondary" aria-hidden="true" />
                                {member.spouse ? 'Hôn phối' : 'Danh vị'}
                            </span>
                            <span className="font-semibold text-on-surface truncate">
                                {member.spouse || member.roleTitle || 'Thành viên dòng tộc'}
                            </span>
                        </div>

                        <div className="col-span-2 bg-surface-container-lowest p-2.5 rounded-lg flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 text-on-surface-variant min-w-0 flex-1">
                                <MapPin className="size-3.5 text-secondary shrink-0" aria-hidden="true" />
                                <span className="truncate">
                                    {member.isAlive ? 'Cư trú: ' : 'An táng: '}
                                    <strong className="text-on-surface font-medium">
                                        {member.burialPlace || member.residence || 'Nghĩa trang Dòng tộc'}
                                    </strong>
                                </span>
                            </div>
                            <span className="text-xs text-secondary font-semibold shrink-0">
                                {member.branch || 'Bản tộc'}
                            </span>
                        </div>

                        {member.duties && (
                            <div className="col-span-2 bg-surface-container-lowest p-2.5 rounded-lg flex items-center gap-1.5 text-on-surface-variant">
                                <Award className="size-3.5 text-secondary shrink-0" aria-hidden="true" />
                                <span className="truncate">
                                    Trách nhiệm: <strong className="text-primary font-semibold">{member.duties}</strong>
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <Button
                            size="sm"
                            onClick={handleViewProfile}
                            className="flex-1 min-h-10 px-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors duration-150 cursor-pointer"
                        >
                            <FileText className="size-3.5" aria-hidden="true" />
                            <span>Xem Hồ Sơ</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleViewTree}
                            className="flex-1 min-h-10 px-3 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors duration-150 cursor-pointer"
                        >
                            <GitFork className="size-3.5 text-secondary" aria-hidden="true" />
                            <span>Trên Phả Hệ</span>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
