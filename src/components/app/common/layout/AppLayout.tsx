'use client';

import React, { ReactNode } from 'react';
import { MobileHeader } from '@/components/app/mobile/layout/MobileHeader';
import { BottomNav } from '@/components/app/mobile/layout/BottomNav';
import { MobileNavDrawer } from '@/components/app/mobile/layout/MobileNavDrawer';
import { DesktopHeader } from '@/components/app/desktop/layout/DesktopHeader';
import { useNavigation } from '@/components/providers/NavigationProvider';
import { useClan } from '@/components/providers/ClanProvider';
import { useDevice } from '@/hooks/useDevice';

interface AppLayoutProps {
    children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
    const { menuOpen, setMenuOpen } = useNavigation();
    const { clan } = useClan();
    const { isDesktop, isTablet, isTouch, isIPad } = useDevice();

    const isRealDesktop = isDesktop && !isTablet && !isIPad && !isTouch;

    if (!isRealDesktop) {
        return (
            <div className="min-h-dvh bg-surface flex flex-col text-on-surface selection:bg-secondary-fixed selection:text-primary">
                <MobileHeader />
                <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-24">
                    {children}
                </main>
                <BottomNav />
                <MobileNavDrawer open={menuOpen} onOpenChange={setMenuOpen} />
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-surface flex flex-col text-on-surface selection:bg-secondary-fixed selection:text-primary">
            <DesktopHeader />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 pb-12">
                {children}
            </main>
            <footer className="bg-surface-container-low py-6 text-center text-sm text-on-surface-variant">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <p>{clan.footerCopyright}</p>
                </div>
            </footer>
        </div>
    );
};
