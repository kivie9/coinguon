'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Sheet,
    SheetContent,
    SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { PwaInstallButton } from '@/components/app/common/PwaInstallButton';
import { triggerHaptic } from '@/utils/haptics';
import { DRAWER_NAV_SECTIONS } from '@/config/navigation';
import { useClan } from '@/components/providers/ClanProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import { RoleBadge } from '@/components/auth/RoleBadge';
import { AuthModal } from '@/components/auth/AuthModal';
import {
    Landmark,
    X,
    ChevronRight,
    ShieldCheck,
    Info,
    User,
    LogIn,
} from 'lucide-react';

interface MobileNavDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const MobileNavDrawer = ({ open, onOpenChange }: MobileNavDrawerProps) => {
    const { clan } = useClan();
    const { user, role, isGuest } = useAuth();
    const pathname = usePathname();
    const [currentSearch, setCurrentSearch] = React.useState('');
    const [authOpen, setAuthOpen] = React.useState(false);

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentSearch(window.location.search);
        }
    }, [open, pathname]);

    const handleItemClick = () => {
        triggerHaptic('light');
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="left"
                fullScreen={true}
                showCloseButton={false}
                className="p-0 flex flex-col bg-surface text-on-surface select-none"
            >
                <div className="pt-safe bg-surface-container-lowest border-b border-outline-variant/25">
                    <div className="h-14 px-4 sm:px-6 max-w-2xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <span className="font-serif text-base font-bold text-primary truncate">
                                Menu Toàn Tộc
                            </span>
                            <span className="text-xs font-semibold text-secondary shrink-0">
                                • {clan.branchTitle}
                            </span>
                        </div>
                        <span className="text-xs text-on-surface-variant font-medium shrink-0">
                            {clan.systemName}
                        </span>
                    </div>
                </div>

                <div className="p-4 sm:p-6 pb-2 max-w-2xl mx-auto w-full space-y-3">
                    <div className="p-4 bg-primary text-on-primary rounded-2xl flex items-center gap-3.5">
                        <div className="size-12 rounded-xl bg-primary-container flex items-center justify-center text-secondary-fixed shrink-0">
                            <Landmark className="size-6" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-serif text-base sm:text-lg font-bold text-on-primary truncate leading-tight">
                                {clan.name}
                            </h3>
                            <p className="text-xs text-on-primary/85 italic truncate mt-0.5">
                                &ldquo;{clan.motto}&rdquo;
                            </p>
                        </div>
                    </div>

                    <div className="p-3.5 bg-surface-container-low rounded-xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className={`size-9 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                                isGuest
                                    ? 'bg-surface-container-high text-on-surface-variant'
                                    : 'bg-primary/12 text-primary'
                            }`}>
                                {isGuest ? (
                                    <User className="size-4 text-on-surface-variant" aria-hidden="true" />
                                ) : user?.fullName ? (
                                    user.fullName.charAt(0).toUpperCase()
                                ) : (
                                    <User className="size-4 text-primary" aria-hidden="true" />
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-on-surface truncate">
                                    {isGuest ? 'Khách (Dữ liệu mẫu)' : (user?.fullName || 'Thành viên dòng họ')}
                                </p>
                                <p className="text-xs text-on-surface-variant truncate">
                                    {isGuest ? 'Đăng nhập để xem dữ liệu thực' : (user?.email || 'Hệ thống phả hệ số')}
                                </p>
                            </div>
                        </div>
                        {isGuest ? (
                            <Button
                                size="sm"
                                onClick={() => setAuthOpen(true)}
                                className="min-h-10 px-3 text-xs font-semibold rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors duration-150 cursor-pointer gap-1.5 shrink-0"
                            >
                                <LogIn className="size-3.5" aria-hidden="true" />
                                <span>Đăng nhập</span>
                            </Button>
                        ) : (
                            <RoleBadge role={role} />
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-2 space-y-5 max-w-2xl mx-auto w-full">
                    {DRAWER_NAV_SECTIONS.map((section) => (
                        <div key={section.id} className="space-y-2">
                            <span className="text-xs font-bold uppercase text-on-surface-variant px-1">
                                {section.title}
                            </span>

                            <div className="bg-surface-container-lowest rounded-xl overflow-hidden divide-y divide-outline-variant/25">
                                {section.items.map((item) => {
                                    const Icon = item.icon;
                                    const isTreeItem = item.id === 'tree-view' || item.href.includes('view=tree');
                                    const isMemberListItem = item.id === 'member-list';
                                    const isViewingTree = currentSearch.includes('view=tree');

                                    let isActive = false;
                                    if (isTreeItem) {
                                        isActive = pathname.startsWith('/members') && isViewingTree;
                                    } else if (isMemberListItem) {
                                        isActive = pathname.startsWith('/members') && !isViewingTree;
                                    } else if (item.href === '/') {
                                        isActive = pathname === '/';
                                    } else {
                                        isActive = pathname.startsWith(item.href);
                                    }

                                    return (
                                        <Link
                                            key={item.id}
                                            href={item.href}
                                            onClick={handleItemClick}
                                            className={`w-full flex items-center justify-between p-3.5 text-left transition-colors duration-150 cursor-pointer ${
                                                isActive
                                                    ? 'bg-primary/8 text-primary'
                                                    : 'hover:bg-surface-container-low'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`size-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-150 ${
                                                        isActive
                                                            ? 'bg-primary text-secondary-fixed'
                                                            : item.iconBgClass || 'bg-surface-container text-primary'
                                                    }`}
                                                >
                                                    <Icon className="size-4.5" aria-hidden="true" />
                                                </div>
                                                <div>
                                                    <p className={`text-sm ${isActive ? 'font-bold text-primary' : 'font-semibold text-on-surface'}`}>
                                                        {item.label}
                                                    </p>
                                                    {item.subtitle && (
                                                        <p className="text-xs text-on-surface-variant mt-0.5">
                                                            {item.subtitle}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <ChevronRight className={`size-4 shrink-0 ${isActive ? 'text-primary' : 'text-outline'}`} aria-hidden="true" />
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    <div className="p-4 bg-surface-container-low rounded-xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="size-5 text-primary shrink-0" aria-hidden="true" />
                            <div>
                                <p className="text-sm font-bold text-on-surface">Ứng dụng độc lập PWA</p>
                                <p className="text-xs text-on-surface-variant">Mở toàn màn hình không viền trình duyệt</p>
                            </div>
                        </div>
                        <PwaInstallButton
                            showText={false}
                            variant="ghost"
                            size="sm"
                            className="size-10 rounded-lg"
                        />
                    </div>
                </div>

                <div className="p-4 pt-3 border-t border-outline-variant/25 pb-safe bg-surface-container-lowest">
                    <div className="max-w-2xl mx-auto flex flex-col gap-2.5">
                        <SheetClose asChild>
                            <Button
                                variant="ghost"
                                size="lg"
                                className="w-full min-h-11 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-serif font-bold text-sm transition-colors duration-150 cursor-pointer flex items-center justify-center gap-2"
                                onClick={() => triggerHaptic('light')}
                            >
                                <X className="size-4.5 text-secondary-fixed" aria-hidden="true" />
                                <span>Đóng Menu Toàn Tộc</span>
                            </Button>
                        </SheetClose>

                        <div className="flex items-center justify-center gap-1.5 text-xs text-on-surface-variant">
                            <Info className="size-3.5 text-outline" aria-hidden="true" />
                            <span>{clan.systemName} • {clan.name}</span>
                        </div>
                    </div>
                </div>
            </SheetContent>
            <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
        </Sheet>
    );
};
