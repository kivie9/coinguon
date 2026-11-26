'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    Calendar,
    CalendarDays,
    Clock,
    MapPin,
    Users,
    Bell,
    Compass,
    BookOpen,
    ExternalLink,
} from 'lucide-react';
import { fetchEventsFullApi, EventsApiResponse, LineageEventDto, EventRitualStep, EventContactPerson } from '@/services/api';
import { toast } from '@/components/ui/sonner';
import { triggerHaptic } from '@/utils/haptics';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useClan } from '@/components/providers/ClanProvider';

interface DesktopEventsExplorerProps {
    initialData?: EventsApiResponse | null;
}

export const DesktopEventsExplorer = ({ initialData }: DesktopEventsExplorerProps) => {
    const { clan } = useClan();
    const [eventsData, setEventsData] = useState<EventsApiResponse | null>(initialData || null);
    const [loading, setLoading] = useState(!initialData);
    const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'ANNIVERSARY' | 'FESTIVAL' | 'EDUCATION'>('ALL');

    useEffect(() => {
        if (!initialData) {
            let isMounted = true;
            fetchEventsFullApi().then((data) => {
                if (isMounted) {
                    setEventsData(data);
                    setLoading(false);
                }
            });
            return () => {
                isMounted = false;
            };
        }
    }, [initialData]);

    const events: LineageEventDto[] = useMemo(() => eventsData?.events || [], [eventsData]);
    const rituals: EventRitualStep[] = useMemo(() => eventsData?.rituals || [], [eventsData]);
    const contacts: EventContactPerson[] = useMemo(() => eventsData?.contacts || [], [eventsData]);

    const featuredEvent = useMemo(() => {
        return eventsData?.featuredEvent || events.find((e) => e.featured) || events[0];
    }, [eventsData, events]);

    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        if (!featuredEvent) return;

        const updateCountdown = () => {
            let targetMs = 0;
            if (featuredEvent.targetDate) {
                const parsed = new Date(featuredEvent.targetDate).getTime();
                if (parsed > Date.now()) {
                    targetMs = parsed;
                }
            }

            if (!targetMs) {
                const days = featuredEvent.daysRemaining && featuredEvent.daysRemaining > 0 ? featuredEvent.daysRemaining : 12;
                const futureDate = new Date();
                futureDate.setDate(futureDate.getDate() + days);
                futureDate.setHours(8, 30, 0, 0);
                targetMs = futureDate.getTime();
            }

            const diff = Math.max(0, targetMs - Date.now());
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds });
        };

        updateCountdown();
        const intervalId = setInterval(updateCountdown, 1000);
        return () => clearInterval(intervalId);
    }, [featuredEvent]);

    const filteredEvents = useMemo(() => {
        if (categoryFilter === 'ALL') return events;
        return events.filter((e) => e.category === categoryFilter);
    }, [events, categoryFilter]);

    const handleRemindMe = (eventTitle: string) => {
        triggerHaptic('medium');
        toast.success('Đã lưu lịch nhắc tế tự!', {
            description: `Hệ thống sẽ gửi thông báo trước ngày cử hành: "${eventTitle}".`,
        });
    };

    const handleAddToCalendar = (title: string, date: string) => {
        triggerHaptic('light');
        toast.info('Tạo tệp lịch iCal / Google Calendar', {
            description: `Đã chuẩn bị thông tin sự kiện "${title}" ngày ${date}.`,
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-8 w-full">
                <Skeleton className="h-60 w-full rounded-2xl" />
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-8 space-y-4">
                        <Skeleton className="h-32 w-full rounded-2xl" />
                        <Skeleton className="h-32 w-full rounded-2xl" />
                        <Skeleton className="h-32 w-full rounded-2xl" />
                    </div>
                    <div className="col-span-4 space-y-4">
                        <Skeleton className="h-48 w-full rounded-2xl" />
                        <Skeleton className="h-48 w-full rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 w-full text-on-surface">
            {/* 1. HERO SPOTLIGHT BANNER PHẲNG */}
            {featuredEvent && (
                <div className="rounded-2xl bg-primary text-on-primary p-7 lg:p-9">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div className="max-w-2xl space-y-3">
                            <p className="text-secondary-fixed text-xs font-bold uppercase">
                                {featuredEvent.category === 'FESTIVAL' ? 'Đại Lễ Trọng Đại Của Gia Tộc' : 'Sự Kiện Trọng Điểm Bản Tộc'}
                            </p>
                            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-on-primary uppercase leading-snug text-balance">
                                {featuredEvent.title}
                            </h1>
                            <p className="text-sm text-on-primary/85 leading-relaxed text-pretty">
                                {featuredEvent.description || 'Kính mời toàn thể con cháu nội ngoại xa gần bớt chút thời gian tề tựu về trước Từ Đường Đại Tôn để dâng hương kính cáo tổ tiên, tưởng nhớ công đức sinh thành và thắt chặt tình phụng sự dòng họ.'}
                            </p>

                            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-secondary-fixed font-medium tabular-nums">
                                <span className="flex items-center gap-1.5 bg-primary-container px-3 py-1.5 rounded-lg">
                                    <Calendar className="size-4 text-secondary-fixed" aria-hidden="true" />
                                    <span>Âm lịch: <strong>{featuredEvent.dateLunar}</strong></span>
                                </span>
                                <span className="flex items-center gap-1.5 bg-primary-container px-3 py-1.5 rounded-lg">
                                    <Clock className="size-4 text-secondary-fixed" aria-hidden="true" />
                                    <span>Dương lịch: {featuredEvent.dateSolar}</span>
                                </span>
                                <span className="flex items-center gap-1.5 bg-primary-container px-3 py-1.5 rounded-lg">
                                    <MapPin className="size-4 text-secondary-fixed" aria-hidden="true" />
                                    <span>{featuredEvent.location}</span>
                                </span>
                            </div>
                        </div>

                        <div className="shrink-0 bg-primary-container rounded-2xl p-6 flex flex-col items-center text-center min-w-[260px]">
                            <span className="text-xs font-bold uppercase text-secondary-fixed">
                                Thời Gian Đếm Ngược
                            </span>

                            <div className="flex items-center gap-2.5 mt-3 tabular-nums">
                                <div className="flex flex-col items-center">
                                    <span className="text-3xl font-serif font-bold text-on-primary">
                                        {String(timeLeft.days).padStart(2, '0')}
                                    </span>
                                    <span className="text-xs text-on-primary/80">Ngày</span>
                                </div>
                                <span className="text-2xl text-secondary-fixed/70 font-bold">:</span>
                                <div className="flex flex-col items-center">
                                    <span className="text-3xl font-serif font-bold text-on-primary">
                                        {String(timeLeft.hours).padStart(2, '0')}
                                    </span>
                                    <span className="text-xs text-on-primary/80">Giờ</span>
                                </div>
                                <span className="text-2xl text-secondary-fixed/70 font-bold">:</span>
                                <div className="flex flex-col items-center">
                                    <span className="text-3xl font-serif font-bold text-on-primary">
                                        {String(timeLeft.minutes).padStart(2, '0')}
                                    </span>
                                    <span className="text-xs text-on-primary/80">Phút</span>
                                </div>
                                <span className="text-2xl text-secondary-fixed/70 font-bold">:</span>
                                <div className="flex flex-col items-center">
                                    <span className="text-3xl font-serif font-bold text-secondary-fixed">
                                        {String(timeLeft.seconds).padStart(2, '0')}
                                    </span>
                                    <span className="text-xs text-on-primary/80">Giây</span>
                                </div>
                            </div>

                            <Button
                                onClick={() => handleRemindMe(featuredEvent.title)}
                                className="mt-4 w-full min-h-11 px-4 rounded-xl bg-secondary-fixed hover:bg-secondary-fixed-dim text-primary font-bold text-sm border-0 transition-colors duration-150 cursor-pointer flex items-center justify-center gap-2"
                            >
                                <Bell className="size-4" aria-hidden="true" />
                                <span>Nhắc Tôi Trước Ngày Lễ</span>
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. BỐ CỤC 12 CỘT */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
                {/* CỘT TRÁI */}
                <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-surface-container-lowest rounded-2xl">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="size-5 text-secondary" aria-hidden="true" />
                            <h2 className="font-serif font-bold text-base text-primary uppercase tabular-nums">
                                Lịch Tế Tự &amp; Kỵ Nhật Năm Nay ({filteredEvents.length})
                            </h2>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                            {(
                                [
                                    { id: 'ALL', label: `Tất Cả (${events.length})` },
                                    { id: 'ANNIVERSARY', label: 'Giỗ Tiền Nhân' },
                                    { id: 'FESTIVAL', label: 'Đại Lễ Bản Tộc' },
                                    { id: 'EDUCATION', label: 'Khuyến Học' },
                                ] as const
                            ).map((tab) => {
                                const isActive = categoryFilter === tab.id;
                                return (
                                    <Button
                                        key={tab.id}
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setCategoryFilter(tab.id)}
                                        className={`min-h-9 px-3 rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer tabular-nums ${
                                            isActive
                                                ? 'bg-primary text-on-primary hover:bg-primary hover:text-on-primary'
                                                : 'bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container'
                                        }`}
                                    >
                                        {tab.label}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredEvents.length === 0 ? (
                            <div className="p-12 text-center bg-surface-container-lowest rounded-2xl">
                                <p className="text-sm text-on-surface-variant">Không có sự kiện nào trong danh mục đã chọn.</p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setCategoryFilter('ALL')}
                                    className="mt-3 min-h-10 px-4 rounded-lg bg-surface-container text-primary font-semibold text-xs cursor-pointer"
                                >
                                    Xem tất cả sự kiện
                                </Button>
                            </div>
                        ) : (
                            filteredEvents.map((ev) => (
                                <div
                                    key={ev.id}
                                    className={`p-5 sm:p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                                        ev.featured
                                            ? 'bg-secondary/12'
                                            : 'bg-surface-container-lowest'
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="size-16 rounded-xl bg-surface-container-low flex flex-col items-center justify-center text-center shrink-0 tabular-nums">
                                            <span className="text-xs font-bold uppercase text-secondary">
                                                Âm Lịch
                                            </span>
                                            <span className="text-base font-bold font-serif text-primary mt-0.5">
                                                {ev.dateLunar.split(' ')[0]}
                                            </span>
                                        </div>

                                        <div className="space-y-1.5">
                                            {/* Duy nhất 1 nhãn trạng thái trên mỗi thẻ */}
                                            <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-bold bg-primary/10 text-primary tabular-nums">
                                                {ev.status || 'Sắp diễn ra'}
                                            </span>

                                            <h3 className="font-serif font-bold text-base sm:text-lg text-primary line-clamp-2 text-balance">
                                                {ev.title}
                                            </h3>

                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-on-surface-variant tabular-nums">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="size-3.5 text-secondary" aria-hidden="true" />
                                                    Dương lịch: {ev.dateSolar}
                                                </span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="size-3.5 text-secondary" aria-hidden="true" />
                                                    {ev.location}
                                                </span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="size-3.5 text-secondary" aria-hidden="true" />
                                                    {ev.role}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0 md:self-center">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleAddToCalendar(ev.title, ev.dateSolar)}
                                            className="inline-flex items-center gap-1.5 min-h-10 px-3.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors duration-150 cursor-pointer"
                                            title="Lưu vào lịch"
                                        >
                                            <Calendar className="size-3.5 text-secondary" aria-hidden="true" />
                                            <span>Lưu Lịch</span>
                                        </Button>

                                        <Button
                                            size="sm"
                                            onClick={() => handleRemindMe(ev.title)}
                                            className="inline-flex items-center gap-1.5 min-h-10 px-3.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container text-xs font-semibold transition-colors duration-150 cursor-pointer"
                                            title="Nhắc nhở"
                                        >
                                            <Bell className="size-3.5" aria-hidden="true" />
                                            <span>Nhắc Nhở</span>
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* CỘT PHẢI */}
                <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-6 sticky top-20">
                    <div className="p-6 bg-surface-container-lowest rounded-2xl space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/25">
                            <BookOpen className="size-4.5 text-secondary" aria-hidden="true" />
                            <h3 className="font-serif font-bold text-sm text-primary uppercase">
                                Nghi Thức Tế Lễ Chuẩn Mực
                            </h3>
                        </div>

                        <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-on-surface-variant">
                            {rituals.map((item) => (
                                <div key={item.step} className="flex items-start gap-3">
                                    <span className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 tabular-nums">
                                        {item.step}
                                    </span>
                                    <p className="text-pretty">
                                        <strong className="text-on-surface tabular-nums">{item.title} ({item.time}):</strong> {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 bg-surface-container-lowest rounded-2xl space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/25">
                            <Compass className="size-4.5 text-secondary" aria-hidden="true" />
                            <h3 className="font-serif font-bold text-sm text-primary uppercase">
                                Ban Khánh Tiết Tiếp Đón
                            </h3>
                        </div>

                        <div className="space-y-2.5 text-sm">
                            {contacts.map((contact, idx) => (
                                <div key={idx} className="p-3.5 bg-surface-container-low rounded-xl flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="font-bold text-primary truncate">{contact.name}</p>
                                        <p className="text-xs text-on-surface-variant truncate">{contact.role}</p>
                                    </div>
                                    <a
                                        href={`tel:${contact.phone}`}
                                        className="text-xs font-bold text-secondary hover:underline shrink-0 tabular-nums"
                                    >
                                        {contact.phone}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 bg-surface-container-low rounded-2xl space-y-2.5">
                        <h4 className="font-serif font-bold text-sm text-primary flex items-center gap-2">
                            <MapPin className="size-4 text-secondary" aria-hidden="true" />
                            <span>{clan.ancestralHall.name}</span>
                        </h4>
                        <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed text-pretty">
                            {clan.ancestralHall.address}
                        </p>
                        <a
                            href={clan.ancestralHall.mapsQueryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline pt-1"
                        >
                            <span>Mở chỉ đường trên Google Maps</span>
                            <ExternalLink className="size-3.5" aria-hidden="true" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
