'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bell, Calendar } from 'lucide-react';
import { triggerHaptic } from '@/utils/haptics';

interface NotificationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const NotificationDialog = ({ open, onOpenChange }: NotificationDialogProps) => {
    const notifications = [
        {
            id: '1',
            tag: 'Đại Lễ Tộc Sự',
            title: 'Họp Mặt Khai Xuân & Giỗ Tổ Chi II',
            time: '15/01 Âm lịch • Từ Đường Đại Tôn',
            desc: 'Ban Trị Sự Từ Đường Chi II chuẩn bị chu đáo nghi lễ tế tổ, thụ lộc đầu xuân và đón tiếp con cháu nội ngoại xa gần về bái tổ.',
            isNew: true,
        },
        {
            id: '2',
            tag: 'Khuyến Học',
            title: 'Tiếp nhận hồ sơ tuyên dương con cháu đỗ đạt',
            time: 'Hạn chót: Mùng 10 tháng Giêng',
            desc: 'Ban Khuyến học dòng tộc nhận danh sách học sinh giỏi, tân sinh viên đại học và cao học để vinh danh trong ngày Khai Xuân.',
            isNew: false,
        },
        {
            id: '3',
            tag: 'Mừng Thọ',
            title: 'Lễ Chúc Thọ các Cụ Thượng Thọ Xuân Ất Tỵ',
            time: 'Từ Đường Chi 2 Bản Tộc',
            desc: 'Toàn tộc mừng thọ 4 cụ từ 70 đến 90 tuổi, trao khánh vàng và thiệp thọ kính chúc các cụ bách niên giai lão.',
            isNew: false,
        },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md p-5 bg-surface rounded-2xl border-0">
                <DialogHeader className="pb-2 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Bell className="size-5 text-primary" aria-hidden="true" />
                        </div>
                        <div>
                            <DialogTitle className="font-serif text-lg font-bold text-primary text-balance">
                                Thông Báo Tộc Sự
                            </DialogTitle>
                            <DialogDescription className="text-xs text-on-surface-variant">
                                Tin tức &amp; Việc họ từ Ban Trị Sự Từ Đường
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex flex-col gap-3 py-2 max-h-[60dvh] overflow-y-auto no-scrollbar">
                    {notifications.map((item) => (
                        <div
                            key={item.id}
                            className={`p-4 rounded-xl transition-colors duration-150 ${
                                item.isNew
                                    ? 'bg-surface-container'
                                    : 'bg-surface-container-low'
                            }`}
                        >
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                                <span className="text-xs font-semibold text-secondary">
                                    {item.tag}
                                </span>
                                {item.isNew && (
                                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                                        Mới
                                    </span>
                                )}
                            </div>
                            <h4 className="font-serif text-sm font-bold text-on-surface leading-snug mb-1 text-balance">
                                {item.title}
                            </h4>
                            <p className="text-xs text-secondary font-medium flex items-center gap-1.5 mb-1.5 tabular-nums">
                                <Calendar className="size-3.5 text-secondary shrink-0" aria-hidden="true" />
                                <span>{item.time}</span>
                            </p>
                            <p className="text-xs text-on-surface-variant leading-relaxed text-pretty">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="pt-2 flex justify-end">
                    <Button
                        size="sm"
                        onClick={() => {
                            triggerHaptic('light');
                            onOpenChange(false);
                        }}
                        className="min-h-10 px-4 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:bg-primary-container transition-colors duration-150 cursor-pointer"
                    >
                        Đã đọc tất cả
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
