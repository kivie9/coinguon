'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { RoleBadge } from './RoleBadge';
import { AuthModal } from './AuthModal';
import { LogoutConfirmDialog } from './LogoutConfirmDialog';
import {
    LogIn,
    LogOut,
    Shield,
    User,
    ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function UserMenu() {
    const { user, role, isGuest, isAdmin, logout } = useAuth();
    const [authOpen, setAuthOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [logoutOpen, setLogoutOpen] = useState(false);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-expanded={menuOpen}
                className="flex items-center gap-2 min-h-10 px-2.5 sm:px-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors duration-150 cursor-pointer text-left"
                aria-label="Tài khoản người dùng"
            >
                <div className={`size-7 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                    isGuest
                        ? 'bg-surface-container-high text-on-surface-variant'
                        : 'bg-primary text-on-primary'
                }`}>
                    {isGuest ? (
                        <User className="size-3.5 text-on-surface-variant" aria-hidden="true" />
                    ) : user?.fullName ? (
                        user.fullName.charAt(0).toUpperCase()
                    ) : (
                        <User className="size-3.5 text-on-primary" aria-hidden="true" />
                    )}
                </div>
                <div className="hidden sm:flex flex-col min-w-0 max-w-[130px]">
                    <span className="text-xs font-bold truncate text-on-surface leading-tight">
                        {isGuest
                            ? 'Khách'
                            : (user?.fullName?.split(' ').slice(-2).join(' ') || 'Thành viên')}
                    </span>
                    <span className="text-xs text-on-surface-variant truncate leading-tight">
                        {isGuest
                            ? 'Dữ liệu mẫu'
                            : role === 'SUPER_ADMIN'
                            ? 'Admin'
                            : role === 'CLAN_ADMIN' || role === 'BRANCH_ADMIN'
                            ? 'Quản trị'
                            : 'Thành viên'}
                    </span>
                </div>
                <ChevronDown className="size-3.5 text-on-surface-variant shrink-0" aria-hidden="true" />
            </button>

            {menuOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-12 z-50 w-68 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm p-3 space-y-2.5 text-xs select-none">
                        {isGuest ? (
                            <div className="p-3 bg-surface-container-low rounded-xl flex items-center gap-3">
                                <div className="size-9 rounded-full bg-surface-container-high text-on-surface-variant font-bold text-xs flex items-center justify-center shrink-0">
                                    <User className="size-4" aria-hidden="true" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold text-on-surface truncate">Tài khoản Khách</p>
                                    <p className="text-xs text-on-surface-variant truncate">Chưa đăng nhập • Dữ liệu mẫu</p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-3 bg-surface-container-low rounded-xl space-y-1">
                                <p className="text-sm font-bold text-on-surface truncate">{user?.fullName}</p>
                                <p className="text-xs text-on-surface-variant truncate">{user?.email}</p>
                                {role !== 'GUEST' && (
                                    <div className="pt-1.5">
                                        <RoleBadge role={role} />
                                    </div>
                                )}
                            </div>
                        )}

                        {isGuest && (
                            <div className="space-y-1.5">
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        setAuthOpen(true);
                                    }}
                                    className="w-full min-h-10 text-xs font-semibold rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors duration-150 cursor-pointer gap-1.5"
                                >
                                    <LogIn className="size-3.5" aria-hidden="true" />
                                    <span>Đăng nhập nhanh</span>
                                </Button>
                                <Link
                                    href="/login"
                                    onClick={() => setMenuOpen(false)}
                                    className="block text-center text-xs text-on-surface-variant hover:text-primary transition-colors duration-150 py-1"
                                >
                                    Mở trang đăng nhập đầy đủ
                                </Link>
                            </div>
                        )}

                        <div className="space-y-1">
                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-2.5 w-full p-2.5 rounded-lg text-primary hover:bg-primary/8 font-semibold text-sm transition-colors duration-150"
                                >
                                    <Shield className="size-4 text-primary" aria-hidden="true" />
                                    <span>Trang Quản Trị Hệ Thống</span>
                                </Link>
                            )}
                            <Link
                                href="/profile"
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center gap-2.5 w-full p-2.5 rounded-lg text-on-surface hover:bg-surface-container-low text-sm transition-colors duration-150"
                            >
                                <User className="size-4 text-secondary" aria-hidden="true" />
                                <span>Hồ sơ dòng họ &amp; Tư liệu</span>
                            </Link>
                        </div>

                        {!isGuest && (
                            <div className="border-t border-outline-variant/25 pt-1.5">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        setLogoutOpen(true);
                                    }}
                                    className="flex items-center gap-2.5 w-full p-2.5 rounded-lg text-destructive hover:bg-destructive/10 text-sm font-medium transition-colors duration-150 cursor-pointer"
                                >
                                    <LogOut className="size-4" aria-hidden="true" />
                                    <span>Đăng xuất</span>
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}

            <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
            <LogoutConfirmDialog
                open={logoutOpen}
                onOpenChange={setLogoutOpen}
                onConfirm={logout}
                userName={user?.fullName}
            />
        </div>
    );
}
