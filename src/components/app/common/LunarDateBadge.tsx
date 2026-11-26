import React from 'react';
import { Calendar, Moon } from 'lucide-react';

interface LunarDateBadgeProps {
    birthdaySolar?: string | null;
    birthdayLunar?: string | null;
    deathDayLunar?: string | null;
    compact?: boolean;
}

export const LunarDateBadge = ({
    birthdaySolar,
    birthdayLunar,
    deathDayLunar,
    compact = false,
}: LunarDateBadgeProps) => {
    if (!birthdaySolar && !birthdayLunar && !deathDayLunar) return null;

    if (compact) {
        return (
            <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant tabular-nums">
                {birthdaySolar && (
                    <span className="inline-flex items-center gap-1 bg-surface-container-low px-2.5 py-1 rounded-md">
                        <Calendar className="size-3.5 text-secondary" aria-hidden="true" />
                        {birthdaySolar}
                    </span>
                )}
                {birthdayLunar && (
                    <span className="inline-flex items-center gap-1 bg-secondary/12 px-2.5 py-1 rounded-md text-secondary font-medium">
                        <Moon className="size-3.5 text-secondary" aria-hidden="true" />
                        ÂL: {birthdayLunar}
                    </span>
                )}
                {deathDayLunar && (
                    <span className="inline-flex items-center gap-1 bg-primary/10 px-2.5 py-1 rounded-md text-primary font-semibold">
                        <Moon className="size-3.5 text-primary" aria-hidden="true" />
                        Giỗ: {deathDayLunar}
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className="p-3 bg-surface-container-low rounded-xl space-y-1.5 text-sm tabular-nums">
            {birthdaySolar && (
                <p className="flex items-center gap-2 text-on-surface-variant">
                    <Calendar className="size-4 text-secondary shrink-0" aria-hidden="true" />
                    <span>Dương lịch: <strong className="text-on-surface font-semibold">{birthdaySolar}</strong></span>
                </p>
            )}
            {birthdayLunar && (
                <p className="flex items-center gap-2 text-on-surface-variant">
                    <Moon className="size-4 text-secondary shrink-0" aria-hidden="true" />
                    <span>Âm lịch: <strong className="text-secondary font-semibold">{birthdayLunar}</strong></span>
                </p>
            )}
            {deathDayLunar && (
                <p className="flex items-center gap-2 text-primary">
                    <Moon className="size-4 text-primary shrink-0" aria-hidden="true" />
                    <span>Ngày giỗ (Âm lịch): <strong className="font-semibold">{deathDayLunar}</strong></span>
                </p>
            )}
        </div>
    );
};
