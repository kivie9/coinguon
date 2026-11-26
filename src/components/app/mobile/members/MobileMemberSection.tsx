'use client';

import React from 'react';
import { MemberDto } from '@/types/memberType';
import { MobileMemberCard } from './MobileMemberCard';
import { getGenerationTitle } from '@/utils/memberUtils';
import { GenFilter } from '@/hooks/useMemberFilter';

interface MobileMemberSectionProps {
    groupedByGen: { [gen: number]: MemberDto[] };
    selectedGen: GenFilter;
    onViewDetails: (id: number) => void;
    onAddNewMember?: () => void;
}

export const MobileMemberSection = ({
    groupedByGen,
    selectedGen,
    onViewDetails,
}: MobileMemberSectionProps) => {
    return (
        <div className="flex flex-col gap-5 pb-16">
            {Object.entries(groupedByGen).map(([genStr, groupMembers]) => {
                const genNum = parseInt(genStr, 10);
                const { title, badge } = getGenerationTitle(genNum);

                return (
                    <div key={genNum} className="flex flex-col gap-2.5">
                        <div className="flex items-center justify-between px-1 py-1">
                            <h2 className="font-serif text-sm font-bold text-primary uppercase">
                                {title}
                            </h2>
                            <span className="text-xs font-semibold text-secondary tabular-nums">
                                {groupMembers.length} {badge}
                            </span>
                        </div>

                        <div className="flex flex-col gap-2.5 w-full">
                            {groupMembers.map((member, idx) => (
                                <MobileMemberCard
                                    key={member.id}
                                    member={member}
                                    defaultExpanded={genNum === 1 && idx === 0 && selectedGen === 'all'}
                                    onViewDetails={onViewDetails}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
