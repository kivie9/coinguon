'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { useAuth } from '@/components/providers/AuthProvider';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/auth/AuthModal';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const { isAdmin, isGuest, isLoading } = useAuth();
    const [authModalOpen, setAuthModalOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="min-h-dvh bg-surface flex flex-col items-center justify-center text-on-surface">
                <div className="size-10 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" aria-hidden="true" />
                <p className="text-sm font-medium text-on-surface-variant">Đang kiểm tra quyền truy cập hệ thống...</p>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="min-h-dvh bg-surface flex flex-col items-center justify-center p-4 antialiased text-on-surface">
                <div className="max-w-md w-full bg-surface-container-lowest rounded-2xl p-6 sm:p-8 text-center space-y-5">
                    <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                        <ShieldAlert className="size-7" aria-hidden="true" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl font-bold font-serif text-primary text-balance">
                            Yêu Cầu Quyền Quản Trị
                        </h2>
                        <p className="text-sm text-on-surface-variant leading-relaxed text-pretty">
                            Khu vực này dành riêng cho Ban Quản Trị dòng họ (Trưởng tộc, Trưởng chi) và Quản trị viên tối cao.
                        </p>
                    </div>

                    <div className="p-3.5 bg-surface-container-low rounded-xl text-left text-xs sm:text-sm text-on-surface-variant text-pretty">
                        {isGuest
                            ? 'Vui lòng đăng nhập bằng tài khoản quản trị để tiếp tục truy cập khu vực này.'
                            : 'Tài khoản hiện tại của bạn chưa được cấp quyền quản trị hệ thống. Vui lòng liên hệ Trưởng tộc hoặc Admin tối cao.'}
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                        <Link href="/login?redirect=/admin" className="w-full">
                            <Button
                                className="w-full min-h-11 bg-primary text-on-primary hover:bg-primary-container rounded-xl font-semibold text-sm gap-2 cursor-pointer transition-colors duration-150"
                            >
                                <LogIn className="size-4" aria-hidden="true" />
                                <span>Đăng nhập tài khoản</span>
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button
                                variant="ghost"
                                className="w-full min-h-10 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-xl text-sm gap-1.5 cursor-pointer transition-colors duration-150"
                            >
                                <ArrowLeft className="size-4" aria-hidden="true" />
                                <span>Trở về Trang Phả Hệ</span>
                            </Button>
                        </Link>
                    </div>
                </div>

                <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-surface flex antialiased text-on-surface">
            <div className="hidden lg:block w-64 shrink-0 fixed inset-y-0 left-0 z-40">
                <AdminSidebar className="w-64" />
            </div>

            <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
                <AdminHeader />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
