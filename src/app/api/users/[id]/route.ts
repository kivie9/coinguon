import { NextRequest } from 'next/server';
import { getAuthenticatedUser } from '@/utils/auth';
import { db } from '@/core/database/dataSource';
import { users } from '@/core/database/schema';
import { eq } from 'drizzle-orm';
import { apiSuccess, apiForbidden, apiNotFound, apiBadRequest, apiError } from '@/utils/apiResponse';

interface Params {
    params: Promise<{ id: string }>;
}

/**
 * PUT /api/users/[id]
 * Cập nhật vai trò (phân quyền), trạng thái (Khóa/Mở) hoặc liên kết thành viên phả hệ
 * (Yêu cầu quyền SUPER_ADMIN)
 */
export async function PUT(request: NextRequest, { params }: Params) {
    try {
        const auth = await getAuthenticatedUser(request);
        if (!auth.isSuperAdmin) {
            return apiForbidden('Chỉ Super Admin mới có quyền phân quyền và chỉnh sửa người dùng.');
        }

        const { id } = await params;
        const userId = parseInt(id, 10);
        if (isNaN(userId)) {
            return apiBadRequest('ID người dùng không hợp lệ.');
        }

        const body = await request.json();
        const updateData: Partial<typeof users.$inferInsert> = {
            updatedAt: new Date(),
        };

        if (body.role) {
            if (!['SUPER_ADMIN', 'CLAN_ADMIN', 'BRANCH_ADMIN', 'MEMBER'].includes(body.role)) {
                return apiBadRequest('Vai trò (role) không hợp lệ.');
            }
            updateData.role = body.role;
        }

        if (body.status) {
            if (!['ACTIVE', 'LOCKED', 'PENDING'].includes(body.status)) {
                return apiBadRequest('Trạng thái (status) không hợp lệ.');
            }
            updateData.status = body.status;
        }

        if (body.fullName !== undefined) {
            updateData.fullName = body.fullName;
        }

        if (body.phone !== undefined) {
            updateData.phone = body.phone;
        }

        if (body.memberId !== undefined) {
            updateData.memberId = body.memberId ? parseInt(body.memberId, 10) : null;
        }

        const [updated] = await db
            .update(users)
            .set(updateData)
            .where(eq(users.id, userId))
            .returning();

        if (!updated) {
            return apiNotFound(`Không tìm thấy người dùng với ID #${userId}`);
        }

        return apiSuccess(updated, 'Cập nhật phân quyền người dùng thành công.');
    } catch (err) {
        console.error('Lỗi API PUT /api/users/[id]:', err);
        return apiError('Không thể cập nhật người dùng', 500);
    }
}

