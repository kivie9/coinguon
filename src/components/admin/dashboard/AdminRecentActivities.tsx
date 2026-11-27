'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Clock,
    UserCheck,
    Wallet,
    Calendar,
    ChevronRight,
    CheckCircle2,
    Newspaper,
    Landmark,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { apiFetch } from '@/services/api/apiClient';

interface AuditLogRow {
    id: number;
    action: string;
    entityName: string;
    entityId: number;
    createdAt: string;
    user?: {
        fullName?: string;
    } | null;
}

const ACTION_LABEL: Record<string, string> = {
    INSERT: 'Thêm mới',
    UPDATE: 'Cập nhật',
    DELETE: 'Xóa',
    RESTORE: 'Khôi phục',
};

const ENTITY_LABEL: Record<string, string> = {
    members: 'hồ sơ thành viên',
    fund_transactions: 'phiếu thu/chi quỹ',
    events: 'sự kiện dòng họ',
    users: 'tài khoản người dùng',
    news_articles: 'bản tin dòng họ',
    clans: 'thông tin dòng họ',
};

export function AdminRecentActivities() {
    const [logs, setLogs] = useState<AuditLogRow[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        apiFetch('/api/audit-logs?limit=8', { cache: 'no-store' })
            .then((res) => (res.ok ? res.json() : null))
            .then((json) => {
                if (active && Array.isArray(json?.data)) {
                    setLogs(json.data);
                }
            })
            .catch(() => {})
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);

    return (
        <Card className="bg-surface-container-lowest rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="font-serif text-base font-bold text-primary flex items-center gap-2">
                    <Clock className="size-4 text-secondary" aria-hidden="true" />
                    <span>Nhật Ký Kiểm Toán &amp; Thay Đổi</span>
                </CardTitle>
                <Link
                    href="/admin/members"
                    className="inline-flex items-center text-xs text-primary hover:underline font-semibold"
                >
                    <span>Quản lý</span>
                    <ChevronRight className="size-3.5 ml-0.5" aria-hidden="true" />
                </Link>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <p className="py-6 text-center text-xs text-on-surface-variant">Đang tải nhật ký hệ thống...</p>
                ) : logs.length === 0 ? (
                    <p className="py-6 text-center text-xs text-on-surface-variant">
                        Chưa có thao tác quản trị nào được ghi nhận. Mọi thay đổi thành viên, quỹ, sự kiện và phân quyền sẽ tự động lưu tại đây.
                    </p>
                ) : (
                    <div className="divide-y divide-outline-variant/25">
                        {logs.map((log) => {
                            let iconTone = 'text-primary bg-primary/10';
                            let IconComponent = UserCheck;
                            if (log.entityName === 'fund_transactions') {
                                iconTone = 'text-secondary bg-secondary/12';
                                IconComponent = Wallet;
                            } else if (log.entityName === 'events') {
                                iconTone = 'text-primary bg-primary/10';
                                IconComponent = Calendar;
                            } else if (log.entityName === 'news_articles') {
                                iconTone = 'text-secondary bg-secondary/12';
                                IconComponent = Newspaper;
                            } else if (log.entityName === 'clans') {
                                iconTone = 'text-primary bg-primary/10';
                                IconComponent = Landmark;
                            }

                            const actionText = ACTION_LABEL[log.action] || log.action;
                            const entityText = ENTITY_LABEL[log.entityName] || log.entityName;
                            const timeText = log.createdAt
                                ? new Intl.DateTimeFormat('vi-VN', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                  }).format(new Date(log.createdAt))
                                : '';

                            return (
                                <div key={log.id} className="py-3 first:pt-1 last:pb-0 flex items-start gap-3">
                                    <div className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${iconTone}`}>
                                        <IconComponent className="size-4" aria-hidden="true" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-sm font-bold text-on-surface truncate">
                                                {actionText} {entityText} #{log.entityId}
                                            </p>
                                            <span className="text-xs text-on-surface-variant shrink-0 tabular-nums">
                                                {timeText}
                                            </span>
                                        </div>
                                        <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                                            <CheckCircle2 className="size-3 text-emerald-600 shrink-0" aria-hidden="true" />
                                            <span>Thực hiện bởi: {log.user?.fullName || 'Quản trị viên'}</span>
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
