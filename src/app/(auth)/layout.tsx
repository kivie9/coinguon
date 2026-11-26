import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CLAN_CONFIG } from '@/config/clanConfig';

export const metadata = {
    title: `Xác Thực Tài Khoản • ${CLAN_CONFIG.name}`,
    description: 'Đăng nhập hoặc đăng ký tài khoản thành viên trong không gian phả hệ gia tộc.',
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-dvh bg-surface flex flex-col justify-between antialiased selection:bg-secondary-fixed selection:text-primary text-on-surface">
            <header className="w-full max-w-6xl mx-auto px-4 py-4 sm:py-6 flex items-center justify-between gap-3">
                <Link
                    href="/"
                    className="flex items-center gap-3 group"
                >
                    <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-secondary-fixed font-serif font-bold text-lg group-hover:bg-primary-container transition-colors duration-150">
                        {CLAN_CONFIG.hanNomName}
                    </div>
                    <div>
                        <span className="font-serif font-bold text-base text-primary block leading-tight">
                            {CLAN_CONFIG.name}
                        </span>
                        <span className="text-xs text-secondary block mt-0.5">
                            {CLAN_CONFIG.subSlogan || 'Cội Nguồn Linh Thiêng • Vạn Đời Thịnh Vượng'}
                        </span>
                    </div>
                </Link>

                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 min-h-10 text-sm font-medium text-on-surface bg-surface-container-low hover:bg-surface-container px-3.5 py-2 rounded-lg transition-colors duration-150"
                >
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    <span>Trang Chủ</span>
                </Link>
            </header>

            <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </main>

            <footer className="w-full py-4 text-center text-xs text-on-surface-variant bg-surface-container-low">
                <p>{CLAN_CONFIG.footerCopyright || `© 2026 ${CLAN_CONFIG.name}. Bảo lưu mọi quyền phả ký gia tộc.`}</p>
            </footer>
        </div>
    );
}
