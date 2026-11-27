'use client';

import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { triggerHaptic } from '@/utils/haptics';
import { Button } from '@/components/ui/button';
import { NotificationDialog } from './NotificationDialog';
import { useClan } from '@/components/providers/ClanProvider';
import { UserMenu } from '@/components/auth/UserMenu';
import { FontSizeToggle } from '@/components/common/FontSizeToggle';

export const MobileHeader = () => {
    const [notificationOpen, setNotificationOpen] = useState(false);
    const { clan } = useClan();

    const handleNotificationClick = () => {
        triggerHaptic('medium');
        setNotificationOpen(true);
    };

    return (
        <>
            <header className="relative w-full bg-surface-container-lowest px-4 sm:px-6 py-3 border-b border-outline-variant/25 select-none">
                <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="size-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
                            <span className="font-serif text-secondary-fixed text-base font-bold">
                                {Array.from(clan.hanNomName || '黎')[0]}
                            </span>
                        </div>

                        <div className="min-w-0">
                            <h1 className="font-serif text-base sm:text-lg font-bold text-primary leading-tight truncate">
                                {clan.name}
                            </h1>
                            <p className="text-xs text-secondary font-medium mt-0.5 truncate">
                                {clan.branchTitle} • {clan.subSlogan}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        <FontSizeToggle compact />

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleNotificationClick}
                            aria-label="Thông báo tộc sự"
                            className="relative size-10 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors duration-150 cursor-pointer"
                        >
                            <Bell className="size-4.5 text-on-surface-variant" aria-hidden="true" />
                            <span className="absolute top-2 right-2 size-2 rounded-full bg-primary" aria-hidden="true" />
                        </Button>

                        <UserMenu />
                    </div>
                </div>
            </header>

            <NotificationDialog
                open={notificationOpen}
                onOpenChange={setNotificationOpen}
            />
        </>
    );
};
