'use client';

import React, { ReactNode } from 'react';
import { MobileHeader } from './MobileHeader';
import { BottomNav } from './BottomNav';
import { MobileNavDrawer } from './MobileNavDrawer';
import { useNavigation } from '@/components/providers/NavigationProvider';
import { PullToRefresh } from './PullToRefresh';

interface MobileLayoutProps {
    children: ReactNode;
}

export const MobileLayout = ({ children }: MobileLayoutProps) => {
    const { menuOpen, setMenuOpen } = useNavigation();

    return (
        <div className="min-h-dvh bg-surface flex flex-col text-on-surface selection:bg-secondary-fixed selection:text-primary">
            <div className="w-full max-w-[480px] mx-auto min-h-dvh bg-surface flex flex-col pb-24 relative">
                <MobileHeader />
                <main className="flex-1 px-4 pt-4 w-full">
                    <PullToRefresh>
                        {children}
                    </PullToRefresh>
                </main>
                <BottomNav />
                <MobileNavDrawer open={menuOpen} onOpenChange={setMenuOpen} />
            </div>
        </div>
    );
};
