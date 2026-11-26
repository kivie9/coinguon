'use client';

import React from 'react';
import Link from 'next/link';
import {
    Clock,
    UserCheck,
    Wallet,
    Calendar,
    ChevronRight,
    CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ActivityItem {
    id: string;
    type: 'member' | 'fund' | 'event';
    title: string;
    description: string;
    timestamp: string;
    actor: string;
}

const MOCK_ACTIVITIES: ActivityItem[] = [
    {
        id: '1',
        type: 'member',
        title: 'Cập nhật phả ký Chi 2',
        description: 'Bổ sung thông tin ngày sinh và tự hiệu của Lê Văn Phúc',
        timestamp: '15 phút trước',
        actor: 'Lê Văn Toàn',
    },
    {
        id: '2',
        type: 'fund',
        title: 'Ghi nhận đóng góp quỹ công đức',
        description: 'Đóng góp 5,000,000đ tôn tạo lăng mộ tổ tiền bối',
        timestamp: '2 giờ trước',
        actor: 'Lê Thị Hoa',
    },
    {
        id: '3',
        type: 'event',
        title: 'Phát hành thông báo Giỗ Tổ',
        description: 'Lên lịch chuẩn bị cỗ tế và đón tiếp bà con chi xa về dự',
        timestamp: '1 ngày trước',
        actor: 'Ban Trị Sự',
    },
    {
        id: '4',
        type: 'member',
        title: 'Thêm mới thành viên đời thứ 5',
        description: 'Đăng ký đinh mới: Lê Văn Minh (sinh năm 2024)',
        timestamp: '2 ngày trước',
        actor: 'Lê Văn Hùng',
    },
];

export function AdminRecentActivities() {
    return (
        <Card className="bg-surface-container-lowest rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="font-serif text-base font-bold text-primary flex items-center gap-2">
                    <Clock className="size-4 text-secondary" aria-hidden="true" />
                    <span>Nhật Ký Thay Đổi Gần Đây</span>
                </CardTitle>
                <Link
                    href="/admin/members"
                    className="inline-flex items-center text-xs text-primary hover:underline font-semibold"
                >
                    <span>Xem chi tiết</span>
                    <ChevronRight className="size-3.5 ml-0.5" aria-hidden="true" />
                </Link>
            </CardHeader>
            <CardContent>
                <div className="divide-y divide-outline-variant/25">
                    {MOCK_ACTIVITIES.map((act) => {
                        let iconTone = 'text-primary bg-primary/10';
                        let IconComponent = UserCheck;
                        if (act.type === 'fund') {
                            iconTone = 'text-secondary bg-secondary/12';
                            IconComponent = Wallet;
                        } else if (act.type === 'event') {
                            iconTone = 'text-primary bg-primary/10';
                            IconComponent = Calendar;
                        }

                        return (
                            <div key={act.id} className="py-3.5 first:pt-1 last:pb-0 flex items-start gap-3">
                                <div className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${iconTone}`}>
                                    <IconComponent className="size-4" aria-hidden="true" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-bold text-on-surface truncate">
                                            {act.title}
                                        </p>
                                        <span className="text-xs text-on-surface-variant shrink-0 tabular-nums">
                                            {act.timestamp}
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-on-surface-variant line-clamp-1 mt-0.5">
                                        {act.description}
                                    </p>
                                    <p className="text-xs text-outline mt-1 flex items-center gap-1">
                                        <CheckCircle2 className="size-3.5 text-secondary shrink-0" aria-hidden="true" />
                                        <span>Thực hiện bởi: <strong className="font-semibold text-on-surface">{act.actor}</strong></span>
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
