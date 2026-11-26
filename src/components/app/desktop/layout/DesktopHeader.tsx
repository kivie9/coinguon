'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PUBLIC_NAV_ITEMS } from '@/config/navigation';
import { useClan } from '@/components/providers/ClanProvider';
import { UserMenu } from '@/components/auth/UserMenu';

export const DesktopHeader = () => {
    const pathname = usePathname();
    const { clan } = useClan();

    return (
        <header className="sticky top-0 z-40 bg-surface-container-lowest border-b border-outline-variant/25 select-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3.5 flex items-center justify-between gap-4">
                <Link
                    href="/"
                    className="flex items-center gap-3 shrink-0 group"
                    title="Trở về trang tổng quan dòng tộc"
                >
                    <div className="size-10 md:size-11 rounded-xl bg-primary text-secondary-fixed flex items-center justify-center shrink-0 group-hover:bg-primary-container transition-colors duration-150">
                        <span className="font-serif text-base md:text-lg font-bold">{Array.from(clan.hanNomName || '黎')[0]}</span>
                    </div>
                    <div className="shrink-0">
                        <h1 className="font-serif text-lg md:text-xl font-bold uppercase text-primary leading-none whitespace-nowrap">
                            {clan.name}
                        </h1>
                        <p className="text-xs font-medium text-secondary mt-1 whitespace-nowrap hidden lg:block">
                            {clan.subSlogan}
                        </p>
                    </div>
                </Link>

                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                    <nav aria-label="Điều hướng chính" className="flex items-center gap-1 md:gap-1.5">
                        {PUBLIC_NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    aria-current={isActive ? 'page' : undefined}
                                    className={`inline-flex items-center gap-2 min-h-10 px-3 lg:px-4 text-sm font-semibold rounded-lg transition-colors duration-150 cursor-pointer whitespace-nowrap select-none ${
                                        isActive
                                            ? 'bg-primary text-on-primary'
                                            : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                                    }`}
                                >
                                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <UserMenu />
                </div>
            </div>
        </header>
    );
};
