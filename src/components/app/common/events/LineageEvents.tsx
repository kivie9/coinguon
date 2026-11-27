'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, ChevronRight, Bell, Printer } from 'lucide-react';
import { triggerHaptic } from '@/utils/haptics';
import { toast } from '@/components/ui/sonner';
import { fetchEventsApi, LineageEventDto } from '@/services/api';
import { downloadEventIcs } from '@/utils/calendarIcs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface LineageEventsProps {
    initialEvents?: LineageEventDto[];
}

export const LineageEvents = ({ initialEvents }: LineageEventsProps) => {
    const [events, setEvents] = useState<LineageEventDto[]>(initialEvents || []);
    const [loading, setLoading] = useState(!initialEvents || initialEvents.length === 0);

    useEffect(() => {
        if (!initialEvents || initialEvents.length === 0) {
            fetchEventsApi().then((data) => {
                setEvents(data);
                setLoading(false);
            });
        }
    }, [initialEvents]);

    const handleRemindMe = (ev: LineageEventDto) => {
        triggerHaptic('medium');
        downloadEventIcs(ev);
        toast.success('Đã tải lịch nhắc tế tự (.ics)', {
            description: `Mở tệp vừa tải để lưu "${ev.title}" vào Lịch điện thoại (tự báo trước 1 ngày).`,
        });
    };

    const handlePrintSchedule = () => {
        triggerHaptic('light');
        if (typeof window !== 'undefined') {
            window.print();
        }
    };

    const currentYear = new Date().getFullYear();

    if (loading) {
        return (
            <div className="flex flex-col gap-4 pb-6 w-full">
                <div className="flex items-center justify-between pb-1">
                    <Skeleton className="h-5 w-44 rounded" />
                    <Skeleton className="h-4 w-28 rounded" />
                </div>
                <Skeleton className="h-44 rounded-2xl" />
                <Skeleton className="h-28 rounded-2xl" />
                <Skeleton className="h-28 rounded-2xl" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 pb-6 text-on-surface select-none">
            <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                <div>
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-primary uppercase">
                        Lịch Tế Tự &amp; Kỵ Nhật
                    </h2>
                    <span className="text-xs sm:text-sm text-secondary font-semibold tabular-nums">
                        Năm {currentYear}
                    </span>
                </div>

                <Button
                    variant="ghost"
                    onClick={handlePrintSchedule}
                    className="min-h-10 px-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs sm:text-sm font-semibold gap-1.5 cursor-pointer print:hidden"
                >
                    <Printer className="size-4 text-secondary" aria-hidden="true" />
                    <span>In lịch giỗ năm</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {events.map((ev) => (
                    <div
                        key={ev.id}
                        className={`rounded-2xl p-5 flex flex-col gap-3 ${
                            ev.featured
                                ? 'md:col-span-2 bg-primary text-on-primary'
                                : 'bg-surface-container-lowest text-on-surface'
                        }`}
                    >
                        <div className="flex items-start justify-between gap-2">
                            <span
                                className={`text-xs font-bold uppercase px-2.5 py-1 rounded-md tabular-nums ${
                                    ev.featured
                                        ? 'bg-primary-container text-secondary-fixed'
                                        : 'bg-secondary/12 text-secondary'
                                }`}
                            >
                                {ev.status}
                            </span>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemindMe(ev)}
                                aria-label={`Lưu lịch nhắc sự kiện ${ev.title}`}
                                className={`min-h-10 px-3 rounded-xl text-xs font-semibold gap-1.5 transition-colors duration-150 cursor-pointer shrink-0 print:hidden ${
                                    ev.featured
                                        ? 'bg-primary-container hover:bg-primary-container/80 text-secondary-fixed'
                                        : 'bg-surface-container-low hover:bg-surface-container text-primary'
                                }`}
                                title="Tải lịch nhắc (.ics) về điện thoại"
                            >
                                <Bell className="size-4" aria-hidden="true" />
                                <span>Nhắc lịch</span>
                            </Button>
                        </div>

                        <div>
                            <h3
                                className={`font-serif text-base sm:text-lg font-bold leading-snug line-clamp-2 text-balance ${
                                    ev.featured ? 'text-on-primary' : 'text-primary'
                                }`}
                            >
                                {ev.title}
                            </h3>
                            <div
                                className={`mt-2.5 flex flex-col gap-1.5 text-xs sm:text-sm ${
                                    ev.featured ? 'text-on-primary/90' : 'text-on-surface-variant'
                                }`}
                            >
                                <div className="flex items-center gap-2 tabular-nums">
                                    <Calendar className={`size-4 shrink-0 ${ev.featured ? 'text-secondary-fixed' : 'text-secondary'}`} aria-hidden="true" />
                                    <span>
                                        <strong>{ev.dateLunar}</strong> (Dương lịch: {ev.dateSolar})
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className={`size-4 shrink-0 ${ev.featured ? 'text-secondary-fixed' : 'text-secondary'}`} aria-hidden="true" />
                                    <span>{ev.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className={`size-4 shrink-0 ${ev.featured ? 'text-secondary-fixed' : 'text-secondary'}`} aria-hidden="true" />
                                    <span>Phụ trách: {ev.role}</span>
                                </div>
                            </div>
                        </div>

                        {ev.featured && (
                            <div className="pt-3 border-t border-on-primary/15 flex items-center justify-between text-xs text-on-primary/90">
                                <span className="italic">Kính mời con cháu tề tựu đông đủ</span>
                                <span className="flex items-center gap-1 font-semibold text-secondary-fixed">
                                    Chi tiết <ChevronRight className="size-3.5" aria-hidden="true" />
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
