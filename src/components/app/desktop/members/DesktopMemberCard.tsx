'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LunarDateBadge } from '@/components/app/common/LunarDateBadge';
import { MemberDto } from '@/types/memberType';
import { User, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface DesktopMemberCardProps {
    member: MemberDto;
    onViewDetails?: (id: number) => void;
}

interface MemberActionLinkProps {
    memberId: number;
    onViewDetails?: (id: number) => void;
    asButton?: boolean;
    className?: string;
    title?: string;
    ariaLabel?: string;
    children: React.ReactNode;
}

export const MemberActionLink = ({
    memberId,
    onViewDetails,
    asButton = false,
    className,
    title,
    ariaLabel,
    children,
}: MemberActionLinkProps) => {
    const href = `/members/${memberId}`;

    if (asButton) {
        return (
            <Button
                variant="ghost"
                nativeButton={!onViewDetails ? false : undefined}
                className={cn(
                    'min-h-10 px-4 text-sm font-semibold rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-primary transition-colors duration-150 cursor-pointer border-0',
                    className
                )}
                onClick={onViewDetails ? () => onViewDetails(memberId) : undefined}
                render={!onViewDetails ? <Link href={href} /> : undefined}
                title={title}
                aria-label={ariaLabel}
            >
                {children}
            </Button>
        );
    }

    if (onViewDetails) {
        return (
            <Button
                variant="ghost"
                className={cn('h-auto p-0 hover:bg-transparent font-normal justify-start text-left whitespace-normal', className)}
                onClick={() => onViewDetails(memberId)}
                title={title}
                aria-label={ariaLabel}
            >
                {children}
            </Button>
        );
    }

    return (
        <Link href={href} className={className} title={title} aria-label={ariaLabel}>
            {children}
        </Link>
    );
};

export const DesktopMemberCard = ({ member, onViewDetails }: DesktopMemberCardProps) => {
    return (
        <Card className="group bg-surface-container-lowest rounded-2xl transition-colors duration-150">
            <CardHeader className="p-5 pb-2">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden text-primary">
                            {member.avatarUrl ? (
                                <img
                                    src={member.avatarUrl}
                                    alt={`Chân dung ${member.fullName}`}
                                    className="size-full object-cover"
                                />
                            ) : (
                                <User className="size-6 text-primary" aria-hidden="true" />
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-secondary tabular-nums">
                                Đời thứ {member.generationNumber}
                                {member.gender ? ` • ${member.gender === 'Male' ? 'Nam' : 'Nữ'}` : ''}
                                {member.branch ? ` • ${member.branch}` : ''}
                            </p>
                            <CardTitle className="font-serif text-lg font-bold text-on-surface mt-0.5">
                                <MemberActionLink
                                    memberId={member.id}
                                    onViewDetails={onViewDetails}
                                    className="hover:text-primary text-left cursor-pointer font-serif font-bold text-on-surface transition-colors duration-150"
                                    title={`Xem hồ sơ của ${member.fullName}`}
                                >
                                    {member.fullName}
                                </MemberActionLink>
                            </CardTitle>
                        </div>
                    </div>

                    {/* Duy nhất 1 chỉ báo trạng thái sinh thời */}
                    <span
                        className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0',
                            member.isAlive
                                ? 'bg-emerald-700/12 text-emerald-800 dark:text-emerald-300'
                                : 'bg-surface-container-high text-on-surface-variant'
                        )}
                    >
                        <span
                            className={cn(
                                'size-1.5 rounded-full',
                                member.isAlive ? 'bg-emerald-600' : 'bg-outline'
                            )}
                            aria-hidden="true"
                        />
                        {member.isAlive ? 'Còn sống' : 'Đã khuất'}
                    </span>
                </div>
            </CardHeader>

            <CardContent className="px-5 py-3 space-y-3 flex-1">
                <LunarDateBadge
                    birthdaySolar={member.birthdaySolar}
                    birthdayLunar={member.birthdayLunar}
                    deathDayLunar={member.deathDayLunar}
                />

                {member.bio ? (
                    <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-3 text-pretty">
                        {member.bio}
                    </p>
                ) : (
                    <p className="text-xs italic text-outline">
                        Chưa có ghi chú tiểu sử cụ thể.
                    </p>
                )}
            </CardContent>

            <CardFooter className="py-3.5 px-5 bg-surface-container-low flex items-center justify-between">
                <span className="text-xs font-medium text-on-surface-variant tabular-nums">
                    Mã #{member.id} {member.roleTitle ? `• ${member.roleTitle}` : ''}
                </span>

                <MemberActionLink
                    memberId={member.id}
                    onViewDetails={onViewDetails}
                    asButton
                    ariaLabel={`Xem hồ sơ chi tiết của ${member.fullName}`}
                >
                    <span>Xem hồ sơ</span>
                    <ChevronRight className="size-4 ml-1" aria-hidden="true" />
                </MemberActionLink>
            </CardFooter>
        </Card>
    );
};
