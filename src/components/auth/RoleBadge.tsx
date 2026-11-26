'use client';

import React from 'react';
import { UserRole } from '@/types/userType';
import { ShieldCheck, ShieldAlert, User, Crown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface RoleBadgeProps {
    role: UserRole;
    className?: string;
    showIcon?: boolean;
}

export function RoleBadge({ role, className, showIcon = true }: RoleBadgeProps) {
    switch (role) {
        case 'SUPER_ADMIN':
            return (
                <span
                    className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-primary text-on-primary',
                        className
                    )}
                >
                    {showIcon && <Crown className="size-3.5 text-secondary-fixed" aria-hidden="true" />}
                    <span>Admin Tối Cao</span>
                </span>
            );
        case 'CLAN_ADMIN':
            return (
                <span
                    className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-secondary/15 text-secondary',
                        className
                    )}
                >
                    {showIcon && <ShieldCheck className="size-3.5 text-secondary" aria-hidden="true" />}
                    <span>Quản Trị Dòng Họ</span>
                </span>
            );
        case 'BRANCH_ADMIN':
            return (
                <span
                    className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-primary/10 text-primary',
                        className
                    )}
                >
                    {showIcon && <ShieldAlert className="size-3.5 text-primary" aria-hidden="true" />}
                    <span>Quản Trị Chi Phái</span>
                </span>
            );
        case 'MEMBER':
            return (
                <span
                    className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-surface-container-high text-on-surface',
                        className
                    )}
                >
                    {showIcon && <User className="size-3.5 text-secondary" aria-hidden="true" />}
                    <span>Thành Viên Dòng Tộc</span>
                </span>
            );
        case 'GUEST':
        default:
            return null;
    }
}
