'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Wallet,
    Calendar,
    ExternalLink,
    ShieldCheck,
    ChevronRight,
    UserCog,
    LogOut,
    Newspaper,
    Landmark,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/components/providers/AuthProvider';
import { LogoutConfirmDialog } from '@/components/auth/LogoutConfirmDialog';

interface NavItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    superAdminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
    {
        label: 'Tổng quan',
        href: '/admin',
        icon: LayoutDashboard,
    },
    {
        label: 'Quản lý thành viên',
        href: '/admin/members',
        icon: Users,
    },
    {
        label: 'Quỹ dòng họ',
        href: '/admin/funds',
        icon: Wallet,
    },
    {
        label: 'Sự kiện & Giỗ chạp',
        href: '/admin/events',
        icon: Calendar,
    },
    {
        label: 'Tin tức & Thông báo',
        href: '/admin/news',
        icon: Newspaper,
    },
    {
        label: 'Thông tin Dòng họ',
        href: '/admin/clan',
        icon: Landmark,
    },
    {
        label: 'Người dùng & Phân quyền',
        href: '/admin/users',
        icon: UserCog,
        superAdminOnly: true,
    },
];

interface AdminSidebarProps {
    className?: string;
    onCloseMobile?: () => void;
}

export function AdminSidebar({ className, onCloseMobile }: AdminSidebarProps) {
    const pathname = usePathname();
    const { user, role, isSuperAdmin, logout } = useAuth();
    const [logoutOpen, setLogoutOpen] = useState(false);

    const isActive = (href: string) => {
        if (href === '/admin') {
            return pathname === '/admin';
        }
        return pathname.startsWith(href);
    };

    return (
        <aside
            className={cn(
                'flex flex-col h-full bg-tertiary text-on-tertiary select-none',
                className
            )}
        >
            {/* Header / Brand */}
            <div className="h-16 flex items-center gap-3 px-5 border-b border-on-tertiary/10">
                <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-secondary-fixed font-serif font-bold text-xl shrink-0">
                    黎
                </div>
                <div className="flex-1 min-w-0">
                    <span className="font-serif font-bold text-on-tertiary text-sm block truncate">
                        GIA TỘC HỌ LÊ
                    </span>
                    <p className="text-xs text-on-tertiary/70 truncate">
                        Ban Quản Trị &amp; Phả Ký
                    </p>
                </div>
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                <div className="px-3 pb-2 text-xs font-semibold uppercase text-on-tertiary/60">
                    Menu Quản Trị
                </div>

                {NAV_ITEMS.filter((item) => !item.superAdminOnly || isSuperAdmin).map((item) => {
                    const active = isActive(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onCloseMobile}
                            aria-current={active ? 'page' : undefined}
                            className={cn(
                                'flex items-center gap-3 min-h-10 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 group',
                                active
                                    ? 'bg-primary text-on-primary font-semibold'
                                    : 'text-on-tertiary/80 hover:text-on-tertiary hover:bg-tertiary-container'
                            )}
                        >
                            <Icon
                                className={cn(
                                    'size-4 shrink-0',
                                    active ? 'text-secondary-fixed' : 'text-on-tertiary/70 group-hover:text-on-tertiary'
                                )}
                            />
                            <span className="flex-1">{item.label}</span>
                        </Link>
                    );
                })}

                <div className="pt-6 px-3 pb-2 text-xs font-semibold uppercase text-on-tertiary/60">
                    Lối Tắt Ứng Dụng
                </div>

                <Link
                    href="/"
                    className="flex items-center gap-3 min-h-10 px-3.5 py-2.5 rounded-lg text-sm font-medium text-on-tertiary/80 hover:text-on-tertiary hover:bg-tertiary-container transition-colors duration-150 group"
                >
                    <ExternalLink className="size-4 text-on-tertiary/70 group-hover:text-secondary-fixed transition-colors duration-150" aria-hidden="true" />
                    <span className="flex-1">Xem Trang Người Dùng</span>
                    <ChevronRight className="size-3.5 text-on-tertiary/60" aria-hidden="true" />
                </Link>
            </div>

            {/* Admin Profile Footer */}
            <div className="p-3 border-t border-on-tertiary/10">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-tertiary-container">
                    <div className="size-9 rounded-full bg-primary flex items-center justify-center text-secondary-fixed font-bold text-xs shrink-0">
                        {user?.fullName?.charAt(0) || <ShieldCheck className="size-4" aria-hidden="true" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-on-tertiary truncate">
                            {user?.fullName || 'Ban Quản Trị'}
                        </p>
                        <p className="text-xs text-on-tertiary/70 truncate">
                            {user?.email || (role === 'SUPER_ADMIN' ? 'Admin Tối Cao' : 'Quản trị viên')}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setLogoutOpen(true)}
                        aria-label="Đăng xuất"
                        title="Đăng xuất"
                        className="size-9 rounded-lg flex items-center justify-center text-on-tertiary/70 hover:text-on-tertiary hover:bg-primary transition-colors duration-150 cursor-pointer shrink-0"
                    >
                        <LogOut className="size-4" aria-hidden="true" />
                    </button>
                </div>
            </div>

            <LogoutConfirmDialog
                open={logoutOpen}
                onOpenChange={setLogoutOpen}
                onConfirm={logout}
                userName={user?.fullName}
            />
        </aside>
    );
}
