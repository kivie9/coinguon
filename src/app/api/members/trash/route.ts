import { NextRequest } from 'next/server';
import { isNotNull, eq, desc } from 'drizzle-orm';
import { db } from '@/core/database/dataSource';
import { members } from '@/core/database/schema';
import { getAuthenticatedUser } from '@/utils/auth';
import { recordAuditLog } from '@/utils/auditLog';
import { apiSuccess, apiBadRequest, apiForbidden, apiNotFound, apiError } from '@/utils/apiResponse';

/**
 * GET /api/members/trash
 * Lấy danh sách thành viên đã xóa mềm để khôi phục (Quản Trị Viên)
 */
export async function GET(request: NextRequest) {
    try {
        const auth = await getAuthenticatedUser(request);
        if (!auth.isAdmin && !auth.isSuperAdmin) {
            return apiForbidden('Chỉ Quản Trị Viên mới có quyền xem thùng rác thành viên.');
        }

        const deletedMembers = await db
            .select({
                id: members.id,
                fullName: members.fullName,
                gender: members.gender,
                generationNumber: members.generationNumber,
                isAlive: members.isAlive,
                deletedAt: members.deletedAt,
            })
            .from(members)
            .where(isNotNull(members.deletedAt))
            .orderBy(desc(members.deletedAt));

        return apiSuccess(deletedMembers);
    } catch (error) {
        console.error('Lỗi GET /api/members/trash:', error);
        return apiError('Không thể tải danh sách thành viên đã xóa.', 500);
    }
}

/**
 * POST /api/members/trash
 * Khôi phục thành viên đã xóa mềm theo { id }
 */
export async function POST(request: NextRequest) {
    try {
        const auth = await getAuthenticatedUser(request);
        if (!auth.isAdmin && !auth.isSuperAdmin) {
            return apiForbidden('Chỉ Quản Trị Viên mới có quyền khôi phục thành viên.');
        }

        const body = await request.json().catch(() => ({}));
        const memberId = Number(body.id);
        if (!Number.isInteger(memberId) || memberId <= 0) {
            return apiBadRequest('ID thành viên không hợp lệ.');
        }

        const [restored] = await db
            .update(members)
            .set({ deletedAt: null, updatedAt: new Date() })
            .where(eq(members.id, memberId))
            .returning();

        if (!restored) {
            return apiNotFound('Không tìm thấy thành viên cần khôi phục.');
        }

        await recordAuditLog({
            userId: auth.user?.id,
            action: 'RESTORE',
            entityName: 'members',
            entityId: memberId,
            newValues: { fullName: restored.fullName },
            request,
        });

        return apiSuccess(restored, `Đã khôi phục hồ sơ "${restored.fullName}" thành công.`);
    } catch (error) {
        console.error('Lỗi POST /api/members/trash:', error);
        return apiError('Không thể khôi phục thành viên.', 500);
    }
}
