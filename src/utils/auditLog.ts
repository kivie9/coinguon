import { NextRequest } from 'next/server';
import { db } from '@/core/database/dataSource';
import { auditLogs } from '@/core/database/schema';

export type AuditAction = 'INSERT' | 'UPDATE' | 'DELETE' | 'RESTORE';

interface RecordAuditLogParams {
    userId?: number | null;
    action: AuditAction;
    entityName: string;
    entityId: number;
    oldValues?: Record<string, unknown> | null;
    newValues?: Record<string, unknown> | null;
    request?: NextRequest;
}

export function getClientIp(request?: NextRequest): string | null {
    if (!request) return null;
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0].trim();
    return request.headers.get('cf-connecting-ip') || request.headers.get('x-real-ip') || null;
}

/**
 * Ghi nhật ký thao tác quản trị vào bảng audit_logs.
 * Không làm gián đoạn luồng chính nếu CSDL tạm thời không khả dụng.
 */
export async function recordAuditLog({
    userId,
    action,
    entityName,
    entityId,
    oldValues = null,
    newValues = null,
    request,
}: RecordAuditLogParams): Promise<void> {
    try {
        await db.insert(auditLogs).values({
            userId: userId && userId > 0 ? userId : null,
            action,
            entityName,
            entityId,
            oldValues: oldValues ?? undefined,
            newValues: newValues ?? undefined,
            ipAddress: getClientIp(request),
        });
    } catch (err) {
        console.warn('[AuditLog] Không thể ghi nhật ký thao tác:', err);
    }
}
