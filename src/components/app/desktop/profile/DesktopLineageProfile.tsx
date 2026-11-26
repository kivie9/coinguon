'use client';

import React, { useState, useEffect } from 'react';
import {
    BookOpen,
    HeartHandshake,
    Shield,
    Phone,
    MapPin,
    Award,
    Copy,
    Share2,
    Check,
    Users,
    CheckCircle2,
    ExternalLink,
    Compass,
    Scroll,
    Printer,
} from 'lucide-react';
import { fetchProfileApi, LineageProfileDto } from '@/services/api';
import { toast } from '@/components/ui/sonner';
import { triggerHaptic } from '@/utils/haptics';
import { PwaInstallButton } from '@/components/app/common/PwaInstallButton';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useClan } from '@/components/providers/ClanProvider';

interface DesktopLineageProfileProps {
    initialProfile?: LineageProfileDto | null;
}

export const DesktopLineageProfile = ({ initialProfile }: DesktopLineageProfileProps) => {
    const { clan } = useClan();
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

    const handleCopyPhone = (phone: string) => {
        triggerHaptic('light');
        if (typeof window !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(phone);
            toast.success('Đã sao chép số điện thoại!', {
                description: `Số liên hệ: ${phone}`,
            });
        }
    };

    const handleCopyBankInfo = () => {
        triggerHaptic('medium');
        const bankInfo = `STK: ${clan.donation.accountNumberClean} • ${clan.donation.bankName} • ${clan.donation.accountHolder} • ND: ${clan.donation.syntax}`;
        if (typeof window !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(clan.donation.accountNumberClean);
            toast.success('Đã sao chép số tài khoản công đức!', {
                description: bankInfo,
            });
        }
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
            <div className="flex flex-col gap-8 w-full">
                <Skeleton className="h-60 w-full rounded-2xl" />
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-8 space-y-6">
                        <Skeleton className="h-48 w-full rounded-2xl" />
                        <Skeleton className="h-72 w-full rounded-2xl" />
                    </div>
                    <div className="col-span-4 space-y-6">
                        <Skeleton className="h-60 w-full rounded-2xl" />
                        <Skeleton className="h-44 w-full rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 w-full text-on-surface">
            {/* 1. HERO TOP BANNER PHẲNG */}
            <div className="rounded-2xl bg-primary text-on-primary p-8 md:p-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="flex-1 min-w-0 max-w-2xl xl:max-w-3xl">
                        <p className="text-secondary-fixed text-xs font-bold uppercase mb-2.5">
                            {clan.branchFullTitle} • Thờ Phụng Bách Niên
                        </p>
                        <h1 className="text-2xl lg:text-3xl xl:text-4xl font-serif font-bold text-on-primary uppercase leading-tight text-balance">
                            Hồ Sơ &amp; Tư Liệu {clan.name}
                        </h1>
                        <p className="mt-2.5 text-sm md:text-base text-on-primary/85 leading-relaxed text-pretty">
                            {clan.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-5">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handlePrintProfile}
                                className="inline-flex items-center gap-2 min-h-11 px-4 rounded-xl bg-primary-container hover:bg-primary-container/80 text-xs sm:text-sm font-semibold text-on-primary transition-colors duration-150 cursor-pointer"
                            >
                                <Printer className="size-4 text-secondary-fixed" aria-hidden="true" />
                                <span>In Hồ Sơ Tộc Phả</span>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleShareProfile}
                                className="inline-flex items-center gap-2 min-h-11 px-4 rounded-xl bg-secondary-fixed hover:bg-secondary-fixed-dim text-primary text-xs sm:text-sm font-bold transition-colors duration-150 cursor-pointer"
                            >
                                {copiedShare ? (
                                    <>
                                        <Check className="size-4" aria-hidden="true" />
                                        <span>Đã Sao Chép Liên Kết</span>
                                    </>
                                ) : (
                                    <>
                                        <Share2 className="size-4" aria-hidden="true" />
                                        <span>Chia Sẻ Toàn Tộc</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3 shrink-0 w-full lg:w-auto xl:max-w-xl tabular-nums">
                        <div className="bg-primary-container rounded-xl p-4 text-center min-w-[110px] flex flex-col justify-center">
                            <span className="block text-2xl font-bold font-serif text-secondary-fixed">
                                {profile.stats?.foundedYear || clan.stats?.foundedYear || clan.ancestralHall.foundedYear}
                            </span>
                            <span className="text-xs text-on-primary/85 font-medium block mt-0.5">
                                Khởi Dựng
                            </span>
                        </div>
                        <div className="bg-primary-container rounded-xl p-4 text-center min-w-[110px] flex flex-col justify-center">
                            <span className="block text-2xl font-bold font-serif text-secondary-fixed truncate" title={profile.ancestralHall.area}>
                                {profile.ancestralHall.area}
                            </span>
                            <span className="text-xs text-on-primary/85 font-medium block mt-0.5">
                                Khuôn Viên
                            </span>
                        </div>
                        <div className="bg-primary-container rounded-xl p-4 text-center min-w-[110px] flex flex-col justify-center">
                            <span className="block text-2xl font-bold font-serif text-secondary-fixed">
                                {profile.stats?.generationsCount || clan.stats?.generationsCount || 8} Đời
                            </span>
                            <span className="text-xs text-on-primary/85 font-medium block mt-0.5">
                                Thế Thứ
                            </span>
                        </div>
                        <div className="bg-primary-container rounded-xl p-4 text-center min-w-[110px] flex flex-col justify-center">
                            <span className="block text-xl xl:text-2xl font-bold font-serif text-secondary-fixed whitespace-nowrap">
                                {profile.ancestralHall.ranking?.toLowerCase().includes('tỉnh') ? 'Cấp Tỉnh' : 'Di Tích'}
                            </span>
                            <span className="text-xs text-on-primary/85 font-medium block mt-0.5">
                                Xếp Hạng
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. BỐ CỤC 12 CỘT */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
                {/* CỘT CHÍNH */}
                <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-6">
                    {/* KHỐI 1: TỘC TRƯỞNG & BAN TRỊ SỰ */}
                    <div className="p-6 bg-surface-container-lowest rounded-2xl">
                        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/25 mb-5 gap-2">
                            <h2 className="font-serif text-lg font-bold text-primary text-balance">
                                Tộc Trưởng &amp; Ban Trị Sự Đại Diện
                            </h2>
                            <span className="text-xs font-semibold text-secondary shrink-0 tabular-nums">
                                {profile.leader.term}
                            </span>
                        </div>

                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="size-24 rounded-2xl overflow-hidden bg-surface-container-low shrink-0">
                                <img
                                    src={profile.leader.avatarUrl}
                                    alt={profile.leader.fullName}
                                    className="size-full object-cover"
                                />
                            </div>

                            <div className="flex-1 space-y-2">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div>
                                        <h3 className="font-serif text-xl font-bold text-primary">
                                            {profile.leader.fullName}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-secondary font-semibold mt-0.5">
                                            {profile.leader.title} • {profile.leader.branch} • {profile.leader.generation || 'Đời thứ IX'}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleCopyPhone(profile.leader.phone)}
                                        className="inline-flex items-center gap-1.5 min-h-10 px-3.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-primary transition-colors duration-150 cursor-pointer tabular-nums"
                                    >
                                        <Phone className="size-3.5 text-secondary" aria-hidden="true" />
                                        <span>{profile.leader.phone}</span>
                                    </Button>
                                </div>

                                <p className="text-sm text-on-surface-variant leading-relaxed text-pretty">
                                    {profile.leader.bio || clan.contact.leader.bio || 'Thay mặt Hội đồng Gia tộc phụ trách điều hành mọi công tác kỵ nhật, hương hỏa tổ tiên, gìn giữ từ đường và điều phối quỹ tương thân tương ái, khuyến học khuyến tài cho con cháu trong toàn tộc.'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-outline-variant/25 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {(profile.committees || clan.committees || []).map((com) => {
                                const renderIcon = () => {
                                    if (com.icon === 'award') return <Award className="size-4" aria-hidden="true" />;
                                    if (com.icon === 'scroll') return <Scroll className="size-4" aria-hidden="true" />;
                                    return <Users className="size-4" aria-hidden="true" />;
                                };
                                return (
                                    <div key={com.id} className="p-3.5 rounded-xl bg-surface-container-low flex items-center gap-3">
                                        <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                            {renderIcon()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-on-surface truncate">{com.name}</p>
                                            <p className="text-xs text-on-surface-variant truncate">{com.role}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* KHỐI 2: VĂN BẢN TỘC ƯỚC */}
                    <div className="p-6 bg-surface-container-lowest rounded-2xl">
                        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/25 mb-5 gap-2">
                            <h2 className="font-serif text-lg font-bold text-primary text-balance">
                                Văn Bản Quy Chuẩn &amp; Tộc Ước Lưu Truyền
                            </h2>
                            <span className="text-xs font-semibold text-secondary tabular-nums">
                                {profile.documents.length + 1} Tư liệu chính thức
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {profile.documents.map((doc, idx) => (
                                <div
                                    key={doc.id}
                                    className="p-5 rounded-xl bg-surface-container-low flex flex-col justify-between"
                                >
                                    <div className="space-y-2.5">
                                        <div className="flex items-center justify-between">
                                            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                                <BookOpen className="size-5" aria-hidden="true" />
                                            </div>
                                            <span className="text-xs font-semibold text-on-surface-variant tabular-nums">
                                                Mã TƯ-0{idx + 1}
                                            </span>
                                        </div>
                                        <h3 className="font-serif text-base font-bold text-primary text-balance">
                                            {doc.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed text-pretty">
                                            {doc.description}
                                        </p>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-outline-variant/25 flex items-center justify-between">
                                        <span className="text-xs text-on-surface-variant font-medium tabular-nums">
                                            {doc.updatedAt}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="xs"
                                            onClick={() => {
                                                triggerHaptic('light');
                                                toast.info(`Mở tư liệu: "${doc.title}"`, {
                                                    description: 'Bản số hóa Hán Nôm & Quốc ngữ có lưu trữ tại Thư viện Từ đường.',
                                                });
                                            }}
                                            className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer h-auto p-0"
                                        >
                                            <span>Xem trích lục</span>
                                            <ExternalLink className="size-3.5" aria-hidden="true" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            <div className="p-5 rounded-xl bg-secondary/12 flex flex-col justify-between">
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <div className="size-10 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center">
                                            <Scroll className="size-5" aria-hidden="true" />
                                        </div>
                                        <span className="text-xs font-bold uppercase text-secondary">
                                            Gia huấn cổ
                                        </span>
                                    </div>
                                    <h3 className="font-serif text-base font-bold text-primary text-balance">
                                        Gia Huấn Thập Điều Tiền Nhân Để Lại
                                    </h3>
                                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed text-pretty">
                                        Mười điều răn dạy con cháu: Hiếu đễ kính cha mẹ, hòa thuận anh em, trọng chữ tín danh dự, chăm lo đèn sách và giữ gìn thanh danh dòng tộc.
                                    </p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-outline-variant/25 flex items-center justify-between">
                                    <span className="text-xs text-secondary font-medium tabular-nums">
                                        Khắc gỗ năm Tự Đức 1852
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="xs"
                                        onClick={() => {
                                            triggerHaptic('light');
                                            toast.success('Bản ghi Gia Huấn Thập Điều', {
                                                description: 'Đã sẵn sàng tải bản scan mộc bản chữ Nôm cổ.',
                                            });
                                        }}
                                        className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer h-auto p-0"
                                    >
                                        <span>Xem 10 Điều</span>
                                        <ExternalLink className="size-3.5" aria-hidden="true" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* KHỐI 3: KIẾN TRÚC & ĐỊA CHỈ NHÀ THỜ TỔ */}
                    <div className="p-6 bg-surface-container-lowest rounded-2xl">
                        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/25 mb-5 gap-2">
                            <h2 className="font-serif text-lg font-bold text-primary text-balance">
                                Kiến Trúc &amp; Địa Chỉ Nhà Thờ Tổ
                            </h2>
                            <span className="text-xs text-secondary font-semibold flex items-center gap-1 shrink-0">
                                <CheckCircle2 className="size-3.5 text-secondary" aria-hidden="true" />
                                <span>{profile.ancestralHall.ranking}</span>
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                            <div className="md:col-span-5 rounded-xl overflow-hidden bg-surface-container-low">
                                <img
                                    src="https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800&auto=format&fit=crop"
                                    alt="Từ Đường Lê Tộc Đại Tôn"
                                    className="w-full h-48 object-cover"
                                />
                                <p className="px-3.5 py-2 text-xs font-serif font-bold text-primary">
                                    Chính Điện Tiền Tế – Hậu Cung
                                </p>
                            </div>

                            <div className="md:col-span-7 space-y-3">
                                <div>
                                    <h3 className="font-serif text-lg font-bold text-primary">
                                        {profile.ancestralHall.name}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-on-surface-variant flex items-center gap-1.5 mt-1">
                                        <MapPin className="size-4 text-secondary shrink-0" aria-hidden="true" />
                                        <span>{profile.ancestralHall.address}</span>
                                    </p>
                                </div>

                                <p className="text-sm text-on-surface-variant leading-relaxed text-pretty">
                                    Từ đường được thiết kế cấu trúc chữ Đinh truyền thống, gồm 5 gian tiền tế vì kèo gỗ lim chạm khắc rồng phượng, lợp ngói mũi hài cổ kính. Bên trong lưu giữ 16 bức đại tự cổ và hệ thống văn bia tiến sĩ dòng họ.
                                </p>

                                <div className="pt-2 flex flex-wrap gap-2.5">
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.ancestralHall.address)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 min-h-10 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs sm:text-sm font-semibold transition-colors duration-150"
                                    >
                                        <Compass className="size-4" aria-hidden="true" />
                                        <span>Chỉ Đường Google Maps</span>
                                    </a>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            triggerHaptic('light');
                                            if (typeof window !== 'undefined' && navigator.clipboard) {
                                                navigator.clipboard.writeText(profile.ancestralHall.address);
                                                toast.success('Đã sao chép địa chỉ từ đường!', {
                                                    description: profile.ancestralHall.address,
                                                });
                                            }
                                        }}
                                        className="inline-flex items-center gap-1.5 min-h-10 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs sm:text-sm font-semibold text-primary transition-colors duration-150 cursor-pointer"
                                    >
                                        <Copy className="size-4" aria-hidden="true" />
                                        <span>Sao Chép Địa Chỉ</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI */}
                <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-6 sticky top-20">
                    {/* KHỐI 1: QUỸ CÔNG ĐỨC */}
                    <div className="p-6 rounded-2xl bg-surface-container-low space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <HeartHandshake className="size-5" aria-hidden="true" />
                            </div>
                            <div>
                                <h3 className="font-serif text-base font-bold text-primary">
                                    Quỹ Hương Hỏa &amp; Khuyến Học
                                </h3>
                                <p className="text-xs text-secondary font-medium">Phụng sự việc họ &amp; Vun đắp hiền tài</p>
                            </div>
                        </div>

                        <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed text-pretty">
                            Mọi khoản phát tâm công đức được công khai minh bạch trong kỳ tế thu hàng năm và dùng cho việc trùng tu tôn tạo từ đường, chăm sóc phần mộ tiền hiền và trao học bổng khuyến học.
                        </p>

                        <div className="p-4 rounded-xl bg-surface-container-lowest space-y-2 tabular-nums">
                            <div className="flex justify-between text-xs sm:text-sm">
                                <span className="text-on-surface-variant">Ngân hàng:</span>
                                <span className="font-bold text-primary">{clan.donation.bankName}</span>
                            </div>
                            <div className="flex justify-between text-xs sm:text-sm">
                                <span className="text-on-surface-variant">Số tài khoản:</span>
                                <span className="font-mono font-bold text-secondary">{clan.donation.accountNumber}</span>
                            </div>
                            <div className="flex justify-between text-xs sm:text-sm">
                                <span className="text-on-surface-variant">Chủ tài khoản:</span>
                                <span className="font-semibold text-primary">{clan.donation.accountHolder}</span>
                            </div>
                            <div className="flex justify-between text-xs pt-2 border-t border-outline-variant/25">
                                <span className="text-on-surface-variant">Cú pháp:</span>
                                <span className="font-semibold text-on-surface">{clan.donation.syntax}</span>
                            </div>
                        </div>

                        <Button
                            onClick={handleCopyBankInfo}
                            className="w-full min-h-11 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer"
                        >
                            <Copy className="size-4" aria-hidden="true" />
                            <span>Sao Chép Số Tài Khoản Công Đức</span>
                        </Button>
                    </div>

                    {/* KHỐI 2: BAN LIÊN LẠC CON CHÁU XA QUÊ */}
                    <div className="p-6 bg-surface-container-lowest rounded-2xl space-y-4">
                        <div className="flex items-center gap-2.5 pb-3 border-b border-outline-variant/25">
                            <Users className="size-5 text-secondary" aria-hidden="true" />
                            <h3 className="font-serif text-base font-bold text-primary">
                                Ban Liên Lạc Con Cháu Xa Quê
                            </h3>
                        </div>

                        <div className="space-y-2.5">
                            {(profile.liaisonBranches || clan.liaisonBranches || []).map((liaison) => (
                                <div key={liaison.id} className="p-3.5 rounded-xl bg-surface-container-low">
                                    <div className="flex justify-between items-center gap-2">
                                        <span className="text-sm font-bold text-primary">{liaison.region}</span>
                                        <span className="text-xs text-secondary font-semibold tabular-nums">{liaison.familiesCount}</span>
                                    </div>
                                    <p className="text-xs text-on-surface-variant mt-1 tabular-nums">{liaison.contactInfo}</p>
                                </div>
                            ))}
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                triggerHaptic('light');
                                toast.info('Đăng ký kết nối con cháu xa quê', {
                                    description: `Vui lòng liên hệ hotline Ban Trị Sự (${clan.contact.hotline}) hoặc gửi email đến ${clan.contact.email}.`,
                                });
                            }}
                            className="w-full min-h-10 rounded-xl bg-surface-container text-primary hover:bg-surface-container-high text-xs sm:text-sm font-semibold transition-colors duration-150 cursor-pointer"
                        >
                            Đăng Ký Thành Viên Xa Quê
                        </Button>
                    </div>

                    {/* KHỐI 3: PWA */}
                    <div className="p-5 bg-surface-container-lowest rounded-2xl flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <Shield className="size-5" aria-hidden="true" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-primary">Ứng dụng Cội Nguồn (PWA)</p>
                                <p className="text-xs text-on-surface-variant">Tra cứu ngoại tuyến không cần mạng</p>
                            </div>
                        </div>
                        <PwaInstallButton className="w-full min-h-10 text-xs sm:text-sm font-semibold justify-center" />
                        <p className="text-xs text-center text-on-surface-variant">
                            {clan.copyrightFull}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
