'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    UserPlus,
    CalendarPlus,
    CreditCard,
    FileSpreadsheet,
    Users,
    ArrowUpRight,
    ScrollText,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AdminStatCards } from './AdminStatCards';
import { AdminRecentActivities } from './AdminRecentActivities';
import { fetchMembersApi } from '@/services/api/memberApi';
import { fetchHomeDataApi, HomeDataResponse } from '@/services/api/homeApi';
import { MemberDto } from '@/types/memberType';

export function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [members, setMembers] = useState<MemberDto[]>([]);
    const [homeData, setHomeData] = useState<HomeDataResponse | null>(null);

    useEffect(() => {
        let isMounted = true;
        async function loadData() {
            setLoading(true);
            try {
                const [membersRes, homeRes] = await Promise.all([
                    fetchMembersApi(),
                    fetchHomeDataApi(),
                ]);
                if (isMounted) {
                    setMembers(membersRes);
                    setHomeData(homeRes);
                }
            } catch (err) {
                console.error('Lỗi tải dữ liệu admin dashboard:', err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }
        loadData();
        return () => {
            isMounted = false;
        };
    }, []);

    const totalMembers = members.length;
    const maleCount = members.filter((m) => m.gender === 'Male' || m.gender === 'MALE').length;
    const femaleCount = members.filter((m) => m.gender === 'Female' || m.gender === 'FEMALE').length;
    const maxGen = members.reduce((max, m) => Math.max(max, m.generationNumber || 0), 1);

    const fundBalance = homeData?.fundData?.balance
        ? parseInt(homeData.fundData.balance.replace(/\D/g, ''), 10) || 125000000
        : 125000000;

    const upcomingDays = homeData?.eventSpotlight?.daysRemaining ?? 12;

    return (
        <div className="space-y-6">
            {/* Header Welcome Banner Phẳng */}
            <div className="rounded-2xl bg-primary p-6 md:p-8 text-on-primary">
                <div className="max-w-2xl">
                    <p className="text-secondary-fixed text-xs font-bold uppercase mb-2">
                        Hệ Thống Quản Trị Tộc Phả
                    </p>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-on-primary text-balance">
                        Gia Tộc Họ Lê — Bảng Điều Hành
                    </h2>
                    <p className="mt-2 text-sm md:text-base text-on-primary/85 leading-relaxed text-pretty">
                        Theo dõi tổng quan nhân khẩu, chỉnh sửa phả ký, lưu trữ sử liệu tổ tiên và điều hành quỹ hương hỏa dòng tộc toàn diện.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3 tabular-nums">
                        <Link
                            href="/admin/members"
                            className="inline-flex items-center gap-2 min-h-11 px-4 rounded-xl bg-secondary-fixed hover:bg-secondary-fixed-dim text-primary font-bold text-xs sm:text-sm transition-colors duration-150"
                        >
                            <Users className="size-4" aria-hidden="true" />
                            <span>Quản lý thành viên ({totalMembers})</span>
                        </Link>
                        <Link
                            href="/admin/funds"
                            className="inline-flex items-center gap-2 min-h-11 px-4 rounded-xl bg-primary-container hover:bg-primary-container/80 text-on-primary text-xs sm:text-sm transition-colors duration-150 font-semibold"
                        >
                            <CreditCard className="size-4 text-secondary-fixed" aria-hidden="true" />
                            <span>Quỹ dòng họ</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <AdminStatCards
                totalMembers={totalMembers}
                maleCount={maleCount}
                femaleCount={femaleCount}
                generationCount={maxGen}
                fundBalance={fundBalance}
                upcomingEventDays={upcomingDays}
                loading={loading}
            />

            {/* Quick Actions Shortcuts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <Link
                    href="/admin/members"
                    className="p-4 flex flex-col items-center justify-center gap-2.5 text-center rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low transition-colors duration-150 group"
                >
                    <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors duration-150">
                        <UserPlus className="size-5" aria-hidden="true" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-on-surface">Thêm Thành Viên</span>
                </Link>

                <Link
                    href="/admin/events"
                    className="p-4 flex flex-col items-center justify-center gap-2.5 text-center rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low transition-colors duration-150 group"
                >
                    <div className="size-11 rounded-xl bg-secondary/12 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-on-secondary transition-colors duration-150">
                        <CalendarPlus className="size-5" aria-hidden="true" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-on-surface">Lập Sự Kiện / Giỗ</span>
                </Link>

                <Link
                    href="/admin/funds"
                    className="p-4 flex flex-col items-center justify-center gap-2.5 text-center rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low transition-colors duration-150 group"
                >
                    <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors duration-150">
                        <CreditCard className="size-5" aria-hidden="true" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-on-surface">Ghi Nhận Quỹ Họ</span>
                </Link>

                <Link
                    href="/members"
                    className="p-4 flex flex-col items-center justify-center gap-2.5 text-center rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low transition-colors duration-150 group"
                >
                    <div className="size-11 rounded-xl bg-secondary/12 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-on-secondary transition-colors duration-150">
                        <FileSpreadsheet className="size-5" aria-hidden="true" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-on-surface">Xem Cây Phả Hệ</span>
                </Link>
            </div>

            {/* Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <AdminRecentActivities />
                </div>

                <div className="space-y-6">
                    <Card className="bg-surface-container-lowest rounded-2xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="font-serif text-base font-bold text-primary flex items-center justify-between">
                                <span>Đại Lễ Gần Nhất</span>
                                <span className="text-xs px-2.5 py-0.5 rounded-md bg-primary/10 text-primary font-bold font-sans tabular-nums">
                                    Còn {upcomingDays} ngày
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-4 rounded-xl bg-surface-container-low">
                                <p className="font-serif font-bold text-on-surface text-sm">
                                    Lễ Giỗ Tổ Thủy Tiền Bối
                                </p>
                                <p className="text-xs text-on-surface-variant mt-1 tabular-nums">
                                    Ngày 12 tháng 3 Âm lịch • Từ đường Gia tộc, làng Đông Phù
                                </p>
                            </div>
                            <Link
                                href="/admin/events"
                                className="inline-flex items-center justify-center w-full min-h-10 px-3 text-xs font-semibold rounded-lg bg-surface-container hover:bg-surface-container-high text-primary transition-colors duration-150"
                            >
                                <span>Quản lý lịch sự kiện</span>
                                <ArrowUpRight className="size-4 ml-1" aria-hidden="true" />
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="bg-surface-container-low rounded-2xl">
                        <CardContent className="p-5 space-y-2">
                            <h4 className="font-serif text-sm font-bold text-primary flex items-center gap-2">
                                <ScrollText className="size-4 text-secondary shrink-0" aria-hidden="true" />
                                <span>Nguyên Tắc Quản Trị Phả Ký</span>
                            </h4>
                            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed text-pretty">
                                Mọi sửa đổi thông tin đinh bộ, ngày giỗ chạp và chi thu quỹ họ tộc cần được đối chiếu văn tự gốc và có sự chuẩn thuận của Ban Trị Sự.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
