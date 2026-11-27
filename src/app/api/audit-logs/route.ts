import { NextRequest } from 'next/server';
import { desc } from 'drizzle-orm';
import { db } from '@/core/database/dataSource';
import { auditLogs } from '@/core/database/schema';
import { getAuthenticatedUser } from '@/utils/auth';
import { apiSuccess, apiForbidden, apiError } from '@/utils/apiResponse';

/**
 * GET /api/audit-logs
 * Lấy nhật ký thao tác quản trị gần đây (Chỉ Quản Trị Viên)
 */
export async function GET(request: NextRequest) {
    try {
        const auth = await getAuthenticatedUser(request);
        if (auth.isGuest || (!auth.isAdmin && !auth.isSuperAdmin)) {
            return apiForbidden('Chỉ Quản Trị Viên mới có quyền xem nhật ký hệ thống.');
        }

        const { searchParams } = new URL(request.url);
        const limit = Math.min(100, Math.max(5, parseInt(searchParams.get('limit') || '30', 10) || 30));

        const logs = await db.query.auditLogs.findMany({
            with: {
                user: {
                    columns: {
                        id: true,
                        fullName: true,
                        email: true,
                        role: true,
                    },
                },
            },
            orderBy: [desc(auditLogs.createdAt)],
            limit,
        });

        return apiSuccess(logs);
    } catch (error) {
        console.error('Lỗi GET /api/audit-logs:', error);
        return apiError('Không thể tải nhật ký thao tác.', 500);
    }
}
