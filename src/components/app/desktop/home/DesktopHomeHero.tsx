'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, GitFork, CalendarDays, MapPin, Users } from 'lucide-react';
import { triggerHaptic } from '@/utils/haptics';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { HOME_EVENT_SPOTLIGHT } from '@/components/app/common/home/homeData';
import { useClan } from '@/components/providers/ClanProvider';

interface DesktopHomeHeroProps {
    totalMembers?: number;
}

export const DesktopHomeHero = ({ totalMembers = 520 }: DesktopHomeHeroProps) => {
    const { clan } = useClan();

    const handleRegisterEvent = () => {
        triggerHaptic('medium');
        toast.success('Báo hỷ thành công!', {
            description: `Ban Trị Sự ${clan.ancestralHall.shortName} đã ghi nhận danh sách tham dự Đại Lễ.`,
        });
    };

    return (
        <section className="rounded-2xl bg-primary text-on-primary p-6 md:p-8 lg:p-10 select-none">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center">
                {/* Cột Trái (7 cols): Danh xưng, Gia huấn & Thống kê then chốt */}
                <div className="md:col-span-7 flex flex-col gap-5 md:gap-6">
                    <p className="text-secondary-fixed text-xs font-bold uppercase">
                        Gia Huấn Bách Niên • {clan.name}
                    </p>

                    <div>
                        <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-on-primary leading-tight text-balance">
                            Cội Nguồn Dòng Tộc &amp; Không Gian Nhà Thờ Tổ
                        </h2>
                        <p className="font-serif text-base italic text-secondary-fixed mt-3 leading-relaxed text-pretty">
                            &ldquo;{clan.motto}&rdquo;
                        </p>
                        <p className="text-sm text-on-primary/85 mt-2 max-w-xl leading-relaxed text-pretty">
                            {clan.description}
                        </p>
                    </div>

                    {/* Thống kê 4 chỉ số lớn trên nền phẳng */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3.5 px-4 bg-primary-container rounded-xl tabular-nums">
                        <div className="flex flex-col">
                            <span className="font-serif text-2xl lg:text-3xl font-bold text-secondary-fixed">
                                {clan.stats?.generationsCount || 8}
                            </span>
                            <span className="text-xs text-on-primary/85 font-medium mt-0.5">Thế Hệ</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-serif text-2xl lg:text-3xl font-bold text-secondary-fixed">
                                {clan.stats?.totalRegistrations || 342}
                            </span>
                            <span className="text-xs text-on-primary/85 font-medium mt-0.5">Đinh Bộ</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-serif text-2xl lg:text-3xl font-bold text-secondary-fixed">
                                {totalMembers}
                            </span>
                            <span className="text-xs text-on-primary/85 font-medium mt-0.5">Thành Viên</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-serif text-2xl lg:text-3xl font-bold text-secondary-fixed">
                                {clan.stats?.yearsText || '200+'}
                            </span>
                            <span className="text-xs text-on-primary/85 font-medium mt-0.5">Năm Khai Tự</span>
                        </div>
                    </div>

                    {/* Phím bấm hành động chính */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                        <Button
                            size="default"
                            nativeButton={false}
                            className="inline-flex items-center gap-2 min-h-11 px-5 rounded-xl bg-secondary-fixed hover:bg-secondary-fixed-dim text-primary font-bold text-sm border-0 transition-colors duration-150 cursor-pointer"
                            render={<Link href="/members" />}
                        >
                            <GitFork className="size-4 text-primary" aria-hidden="true" />
                            <span>Tra cứu cây phả hệ</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="default"
                            nativeButton={false}
                            className="inline-flex items-center gap-2 min-h-11 px-5 rounded-xl bg-primary-container hover:bg-primary-container/80 text-on-primary font-semibold text-sm border-0 transition-colors duration-150 cursor-pointer"
                            render={<Link href="/events" />}
                        >
                            <CalendarDays className="size-4 text-secondary-fixed" aria-hidden="true" />
                            <span>Lịch giỗ chạp trong năm</span>
                        </Button>
                    </div>
                </div>

                {/* Cột Phải (5 cols): Tiêu điểm Đại lễ & Báo hỷ tham dự */}
                <div className="md:col-span-5 bg-primary-container rounded-2xl p-5 md:p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase text-secondary-fixed">
                            {HOME_EVENT_SPOTLIGHT.badge}
                        </span>
                        <span className="bg-secondary text-on-secondary px-3 py-1 rounded-lg text-xs font-bold tabular-nums">
                            Còn {HOME_EVENT_SPOTLIGHT.daysRemaining} ngày
                        </span>
                    </div>

                    <div>
                        <h3 className="font-serif text-xl font-bold text-on-primary leading-snug line-clamp-2 text-balance">
                            {HOME_EVENT_SPOTLIGHT.title}
                        </h3>
                        <div className="flex flex-col gap-2 mt-3 text-sm text-on-primary/90">
                            <div className="flex items-center gap-2 tabular-nums">
                                <Calendar className="size-4 text-secondary-fixed shrink-0" aria-hidden="true" />
                                <span className="truncate"><strong>Thời gian:</strong> {HOME_EVENT_SPOTLIGHT.lunarDate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="size-4 text-secondary-fixed shrink-0" aria-hidden="true" />
                                <span className="truncate"><strong>Địa điểm:</strong> {HOME_EVENT_SPOTLIGHT.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="size-4 text-secondary-fixed shrink-0" aria-hidden="true" />
                                <span className="truncate"><strong>Thành phần:</strong> {HOME_EVENT_SPOTLIGHT.attendees}</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-on-primary/85 leading-relaxed line-clamp-3 text-pretty">
                        {HOME_EVENT_SPOTLIGHT.invitation}
                    </p>

                    <Button
                        onClick={handleRegisterEvent}
                        className="w-full min-h-11 px-4 rounded-xl bg-secondary-fixed hover:bg-secondary-fixed-dim text-primary font-bold text-sm border-0 transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer mt-1"
                    >
                        <span>Báo hỷ tham dự đại lễ giỗ tổ</span>
                        <ArrowRight className="size-4 text-primary" aria-hidden="true" />
                    </Button>
                </div>
            </div>
        </section>
    );
};
