import React, { ReactNode } from 'react';
import { DesktopHeader } from './DesktopHeader';

interface DesktopLayoutProps {
    children: ReactNode;
}

export const DesktopLayout = ({ children }: DesktopLayoutProps) => {
    return (
        <div className="min-h-dvh bg-surface flex flex-col text-on-surface">
            <DesktopHeader />
            <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-8">
                {children}
            </main>
            <footer className="bg-surface-container-low py-6 px-8 text-center text-sm text-on-surface-variant">
                <p className="tabular-nums">© {new Date().getFullYear()} Cội Nguồn — Hệ Thống Gia Phả Dòng Tộc</p>
            </footer>
        </div>
    );
};
