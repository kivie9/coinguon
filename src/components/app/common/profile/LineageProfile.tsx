'use client';

import React, { useEffect, useState } from 'react';
import {
    Landmark,
    BookOpen,
    HeartHandshake,
    ShieldCheck,
    Info,
    Menu,
    Printer,
    Share2,
    Check,
} from 'lucide-react';
import { PwaInstallButton } from '@/components/app/common/PwaInstallButton';
import { useNavigation } from '@/components/providers/NavigationProvider';
import { triggerHaptic } from '@/utils/haptics';
import { toast } from '@/components/ui/sonner';
import { fetchProfileApi, LineageProfileDto } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useClan } from '@/components/providers/ClanProvider';

interface LineageProfileProps {
    initialProfile?: LineageProfileDto | null;
}

export const LineageProfile = ({ initialProfile }: LineageProfileProps) => {
    const { clan } = useClan();
    const { setMenuOpen } = useNavigation();
    const [profile, setProfile] = useState<LineageProfileDto | null>(initialProfile || null);
    const [loading, setLoading] = useState(!initialProfile);
    const [copiedShare, setCopiedShare] = useState(false);

    useEffect(() => {
        let isMounted = true;
        if (!initialProfile) {
            fetchProfileApi().then((data) => {
                if (isMounted) {
                    setProfile(data);
                    setLoading(false);
                }
            });
        }
        return () => {
            isMounted = false;
        };
    }, [initialProfile]);

    const handleOpenFullMenu = () => {
        triggerHaptic('light');
        setMenuOpen(true);
    };

    const handlePrintProfile = () => {
        if (typeof window !== 'undefined') {
            window.print();
        }
    };

    const handleShareProfile = () => {
        triggerHaptic('light');
        if (typeof window !== 'undefined') {
            if (navigator.share) {
                navigator.share({
                    title: `${clan.name} • Hồ Sơ Dòng Tộc`,
                    text: clan.description,
                    url: window.location.href,
                }).catch(() => {});
            } else if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                setCopiedShare(true);
                setTimeout(() => setCopiedShare(false), 2500);
                toast.success('Đã sao chép liên kết hồ sơ dòng họ!', {
                    description: 'Bạn có thể chia sẻ liên kết này cho con cháu trong gia tộc.',
                });
            }
        }
    };

    if (loading || !profile) {
        return (
            <div className="flex flex-col gap-4 pb-6 w-full">
                <Skeleton className="h-44 w-full rounded-2xl" />
                <Skeleton className="h-24 w-full rounded-2xl" />
                <Skeleton className="h-36 w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 pb-6 text-on-surface select-none">
            {/* 1. HERO BANNER PHẲNG */}
            <div className="rounded-2xl bg-primary text-on-primary p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-secondary-fixed text-xs font-bold uppercase truncate">
                        {clan.branchFullTitle}
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleOpenFullMenu}
                        className="flex items-center gap-1.5 text-xs font-bold text-secondary-fixed bg-primary-container hover:bg-primary-container/80 min-h-9 px-3 rounded-lg transition-colors duration-150 cursor-pointer shrink-0"
                    >
                        <Menu className="size-3.5" aria-hidden="true" />
                        <span>Menu</span>
                    </Button>
                </div>

                <div>
                    <h1 className="text-xl font-serif font-bold text-on-primary uppercase leading-snug text-balance">
                        Hồ Sơ &amp; Tư Liệu {clan.name}
                    </h1>
                    <p className="mt-1.5 text-xs sm:text-sm text-on-primary/85 leading-relaxed line-clamp-3 text-pretty">
                        {clan.description}
                    </p>
                </div>

                <div className="grid grid-cols-3 divide-x divide-on-primary/15 py-3 px-2 bg-primary-container rounded-xl text-center tabular-nums">
                    <div className="px-1">
                        <span className="block font-serif text-lg font-bold text-secondary-fixed">
                            {profile.stats?.foundedYear || clan.stats?.foundedYear || clan.ancestralHall.foundedYear}
                        </span>
                        <span className="text-xs text-on-primary/85 font-medium">Khởi Dựng</span>
                    </div>
                    <div className="px-1">
                        <span className="block font-serif text-lg font-bold text-secondary-fixed">
                            {profile.stats?.generationsCount || clan.stats?.generationsCount || 8} Đời
                        </span>
                        <span className="text-xs text-on-primary/85 font-medium">Thế Thứ</span>
                    </div>
                    <div className="px-1">
                        <span className="block font-serif text-lg font-bold text-secondary-fixed truncate">
                            {profile.ancestralHall.area}
                        </span>
                        <span className="text-xs text-on-primary/85 font-medium">Khuôn Viên</span>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handlePrintProfile}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 min-h-11 rounded-xl bg-primary-container hover:bg-primary-container/80 text-xs sm:text-sm font-semibold text-on-primary transition-colors duration-150 cursor-pointer"
                    >
                        <Printer className="size-4 text-secondary-fixed shrink-0" aria-hidden="true" />
                        <span>In Hồ Sơ</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleShareProfile}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 min-h-11 rounded-xl bg-secondary-fixed hover:bg-secondary-fixed-dim text-primary text-xs sm:text-sm font-bold transition-colors duration-150 cursor-pointer"
                    >
                        {copiedShare ? (
                            <>
                                <Check className="size-4 shrink-0" aria-hidden="true" />
                                <span>Đã Sao Chép</span>
                            </>
                        ) : (
                            <>
                                <Share2 className="size-4 shrink-0" aria-hidden="true" />
                                <span>Chia Sẻ</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* 2. Thẻ Danh Nhân Trưởng Ban */}
            <div className="p-4 bg-surface-container-lowest rounded-2xl flex items-center gap-3.5">
                <div className="size-14 rounded-xl shrink-0 overflow-hidden bg-surface-container-low">
                    <img
                        className="size-full object-cover"
                        alt={profile.leader.fullName}
                        src={profile.leader.avatarUrl}
                    />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="font-serif text-base font-bold text-primary truncate">
                            {profile.leader.fullName}
                        </h3>
                        <span className="text-xs font-semibold text-secondary shrink-0">
                            {profile.leader.generation || 'Đời thứ IX'}
                        </span>
                    </div>
                    <p className="text-xs sm:text-sm text-secondary font-medium">{profile.leader.title}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5 tabular-nums">
                        {profile.leader.term} • {profile.leader.branch}
                    </p>
                </div>
            </div>

            {/* 3. Nhóm Tư Liệu Lịch Sử */}
            <div className="space-y-2">
                <span className="text-xs font-bold uppercase text-on-surface-variant px-1 tabular-nums">
                    Văn bản &amp; Tộc ước ({profile.documents.length})
                </span>

                <div className="bg-surface-container-lowest rounded-2xl overflow-hidden divide-y divide-outline-variant/25">
                    {profile.documents.map((doc) => (
                        <div key={doc.id} className="p-4 flex items-start gap-3">
                            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <BookOpen className="size-5" aria-hidden="true" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-on-surface">{doc.title}</h4>
                                <p className="text-xs text-on-surface-variant leading-relaxed mt-1 text-pretty">
                                    {doc.description}
                                </p>
                                <span className="text-xs text-secondary font-medium block mt-1 tabular-nums">
                                    {doc.updatedAt}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. Địa chỉ Từ Đường */}
            <div className="p-4 bg-surface-container-lowest rounded-2xl flex items-start gap-3">
                <div className="size-10 rounded-xl bg-secondary/12 text-secondary flex items-center justify-center shrink-0">
                    <Landmark className="size-5" aria-hidden="true" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-on-surface">{profile.ancestralHall.name}</h4>
                    <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">{profile.ancestralHall.address}</p>
                    <p className="text-xs text-secondary mt-1 tabular-nums">
                        Khởi dựng: {profile.ancestralHall.foundedYear} • Diện tích: {profile.ancestralHall.area} • {profile.ancestralHall.ranking}
                    </p>
                </div>
            </div>

            {/* 5. Tiện Ích Ứng Dụng PWA */}
            <div className="p-4 bg-surface-container-low rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="size-5 text-primary shrink-0" aria-hidden="true" />
                    <div>
                        <p className="text-sm font-bold text-on-surface">Cài đặt ứng dụng PWA</p>
                        <p className="text-xs text-on-surface-variant">Dùng ngoại tuyến không cần mạng</p>
                    </div>
                </div>
                <PwaInstallButton size="sm" className="px-3 text-xs font-semibold shrink-0" />
            </div>

            {/* 6. Quỹ Tộc */}
            <div className="p-4 bg-secondary/12 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <HeartHandshake className="size-5 text-secondary shrink-0" aria-hidden="true" />
                    <div>
                        <p className="text-sm font-bold text-primary">Đóng góp công đức dòng họ</p>
                        <p className="text-xs text-on-surface-variant">Quỹ khuyến học &amp; Trùng tu từ đường</p>
                    </div>
                </div>
                <Button
                    size="sm"
                    onClick={() => {
                        triggerHaptic('medium');
                        toast.info('Công đức Quỹ Dòng Tộc', {
                            description: `STK: ${clan.donation.accountNumber} • ${clan.donation.bankName} • ${clan.donation.accountHolder} • Cú pháp: ${clan.donation.syntax}`,
                        });
                    }}
                    className="min-h-10 px-3.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors duration-150 cursor-pointer shrink-0"
                >
                    Công đức
                </Button>
            </div>

            <div className="text-center pt-2 text-xs text-on-surface-variant flex items-center justify-center gap-1.5">
                <Info className="size-3.5" aria-hidden="true" />
                <span>{clan.copyright}</span>
            </div>
        </div>
    );
};
