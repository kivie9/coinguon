'use client';

import React from 'react';
import { Cake } from 'lucide-react';
import { MemberDto } from '@/types/memberType';
import { calculateAge } from '@/utils/memberUtils';
import { DEFAULT_MEMBER_AVATAR } from '@/constants/memberConstants';

interface MemberHeroProps {
    member: MemberDto;
}

export const MemberHero = ({ member }: MemberHeroProps) => {
    const avatarUrl = member.avatarUrl || DEFAULT_MEMBER_AVATAR;
    const birthYear = member.birthdaySolar
        ? new Date(member.birthdaySolar).getFullYear()
        : null;
    const age = calculateAge(member.birthdaySolar, 1948);

    const getHonorific = () => {
        if (!member.isAlive) {
            if (member.generationNumber <= 2 || age >= 70) {
                return member.gender === 'female' ? 'Cụ Bà ' : 'Cụ ';
            }
            return member.gender === 'female' ? 'Bà ' : 'Cụ ';
        }
        if (age >= 70) return member.gender === 'female' ? 'Cụ Bà ' : 'Cụ ';
        if (age >= 50) return member.gender === 'female' ? 'Bà ' : 'Ông ';
        if (member.gender === 'female') return 'Chị ';
        if (age < 18) return 'Cháu ';
        return 'Anh ';
    };

    const honorific = getHonorific();

    return (
        <section className="px-4 sm:px-6 md:px-8 py-5 bg-surface-container-lowest select-none">
            <div className="flex items-center gap-4 sm:gap-6 w-full max-w-5xl mx-auto">
                <div className="size-16 sm:size-20 rounded-2xl overflow-hidden bg-surface-container-low shrink-0">
                    <img
                        alt={`Chân dung ${member.fullName}`}
                        className="size-full object-cover"
                        src={avatarUrl}
                    />
                </div>

                <div className="flex flex-col items-start text-left flex-1 min-w-0">
                    <p className="text-xs font-semibold text-secondary tabular-nums">
                        Đời thứ {member.generationNumber} • {member.branch || 'Chi 2'}
                        {member.roleTitle ? ` • ${member.roleTitle}` : ''}
                    </p>

                    <h1 className="font-serif text-primary text-lg sm:text-2xl font-bold leading-snug mt-0.5 truncate max-w-full">
                        {honorific}{member.fullName.toUpperCase()}
                    </h1>

                    {member.courtesyName && (
                        <p className="text-secondary font-medium text-xs sm:text-sm italic truncate max-w-full">
                            {member.courtesyName.startsWith('(') ? member.courtesyName : `(${member.courtesyName})`}
                        </p>
                    )}

                    <div className="text-xs sm:text-sm text-on-surface-variant font-medium flex items-center gap-1.5 flex-wrap mt-1.5 tabular-nums">
                        <Cake className="size-4 text-primary shrink-0" aria-hidden="true" />
                        <span>Sinh năm {birthYear || '---'}</span>
                        <span>•</span>
                        {member.isAlive ? (
                            <span className="text-primary font-bold">
                                {age >= 70 ? `Thượng Thọ ${age} Tuổi` : `${age} Tuổi`}
                            </span>
                        ) : (
                            <span className="text-on-surface-variant font-semibold">
                                {age > 0 ? `Hưởng thọ ${age} tuổi` : 'Đã khuất'}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
