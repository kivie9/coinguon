'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNavigation } from '@/components/providers/NavigationProvider';
import { triggerHaptic } from '@/utils/haptics';

const HomeOutlineIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v6H4a1 1 0 0 1-1-1V9.5z" />
    </svg>
);

const HomeSolidIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M12 2.5L2.5 10a1 1 0 0 0-.2.6v9.4a1 1 0 0 0 1 1H8.5a1 1 0 0 0 1-1v-5.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5V20a1 1 0 0 0 1 1h5.2a1 1 0 0 0 1-1V10.6a1 1 0 0 0-.2-.6L12 2.5z" />
    </svg>
);

const TreeOutlineIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <circle cx="12" cy="5" r="3" />
        <path d="M12 8v5M6 16v-3h12v3" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="18" r="3" />
    </svg>
);

const TreeSolidIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path d="M12 8.5v4.5M6 15v-2h12v2" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="5" r="3.75" fill="currentColor" />
        <circle cx="6" cy="18" r="3.75" fill="currentColor" />
        <circle cx="18" cy="18" r="3.75" fill="currentColor" />
    </svg>
);

const CalendarOutlineIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2.5" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const CalendarSolidIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path fillRule="evenodd" clipRule="evenodd" d="M6 2a1 1 0 0 1 1 1v1h10V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1zm13 8H5v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9zm-10 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm4 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm4 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-8 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm4 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
    </svg>
);

const UserOutlineIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <circle cx="12" cy="7" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    </svg>
);

const UserSolidIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <circle cx="12" cy="7" r="4.5" />
        <path d="M12 13.5c-4.2 0-8 2.2-8.8 5.8-.2.9.5 1.7 1.4 1.7h14.8c.9 0 1.6-.8 1.4-1.7-.8-3.6-4.6-5.8-8.8-5.8z" />
    </svg>
);

const MenuOutlineIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
);

const MenuSolidIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
    </svg>
);

export const BottomNav = () => {
    const pathname = usePathname();
    const { menuOpen, setMenuOpen } = useNavigation();

    const tabs = [
        {
            id: 'clan',
            href: '/',
            label: 'Dòng Tộc',
            isActive: pathname === '/' && !menuOpen,
            outlineIcon: HomeOutlineIcon,
            solidIcon: HomeSolidIcon,
        },
        {
            id: 'tree',
            href: '/members',
            label: 'Phả Hệ',
            isActive: pathname.startsWith('/members') && !menuOpen,
            outlineIcon: TreeOutlineIcon,
            solidIcon: TreeSolidIcon,
        },
        {
            id: 'events',
            href: '/events',
            label: 'Giỗ Chạp',
            isActive: pathname.startsWith('/events') && !menuOpen,
            outlineIcon: CalendarOutlineIcon,
            solidIcon: CalendarSolidIcon,
        },
        {
            id: 'profile',
            href: '/profile',
            label: 'Hồ Sơ',
            isActive: pathname.startsWith('/profile') && !menuOpen,
            outlineIcon: UserOutlineIcon,
            solidIcon: UserSolidIcon,
        },
        {
            id: 'menu',
            href: '#',
            label: 'Menu',
            isActive: menuOpen,
            outlineIcon: MenuOutlineIcon,
            solidIcon: MenuSolidIcon,
            isAction: true,
        },
    ];

    return (
        <nav
            aria-label="Thanh điều hướng dưới đáy màn hình"
            className="fixed bottom-0 inset-x-0 w-full z-40 bg-surface-container-lowest border-t border-outline-variant/25 select-none pb-safe"
        >
            <div className="w-full max-w-2xl md:max-w-4xl mx-auto px-2 sm:px-6 py-1.5 flex items-center justify-around">
                {tabs.map((tab) => {
                    const isActive = tab.isActive;
                    const IconComponent = isActive ? tab.solidIcon : tab.outlineIcon;

                    const content = (
                        <div className="flex flex-col items-center justify-center py-0.5 min-h-11">
                            <div
                                className={`flex items-center justify-center w-12 sm:w-14 h-7 rounded-lg transition-colors duration-150 ${
                                    isActive
                                        ? 'bg-primary/12 text-primary'
                                        : 'text-on-surface-variant group-hover:text-primary'
                                }`}
                            >
                                <IconComponent className="size-5" />
                            </div>
                            <span
                                className={`text-xs leading-tight text-center transition-colors duration-150 mt-1 ${
                                    isActive
                                        ? 'font-bold text-primary'
                                        : 'font-medium text-on-surface-variant group-hover:text-primary'
                                }`}
                            >
                                {tab.label}
                            </span>
                        </div>
                    );

                    if (tab.isAction) {
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => {
                                    triggerHaptic('light');
                                    setMenuOpen(true);
                                }}
                                aria-label="Mở menu toàn tộc"
                                aria-expanded={menuOpen}
                                className="flex flex-1 flex-col items-center justify-center group cursor-pointer"
                            >
                                {content}
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={tab.id}
                            href={tab.href}
                            onClick={() => triggerHaptic('selection')}
                            aria-current={isActive ? 'page' : undefined}
                            className="flex flex-1 flex-col items-center justify-center group cursor-pointer"
                        >
                            {content}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};
