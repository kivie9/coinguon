import { NextRequest } from 'next/server';
import { getAuthenticatedUser } from '@/utils/auth';
import { db } from '@/core/database/dataSource';
import { users } from '@/core/database/schema';
import { eq } from 'drizzle-orm';
import { hashPassword } from '@/utils/password';
import { recordAuditLog } from '@/utils/auditLog';
import { apiSuccess, apiForbidden, apiNotFound, apiBadRequest, apiError } from '@/utils/apiResponse';

interface Params {
    params: Promise<{ id: string }>;
}

function sanitizeUser(u: typeof users.$inferSelect) {
    return {
        id: u.id,
        email: u.email,
        phone: u.phone,
        fullName: u.fullName,
        avatarUrl: u.avatarUrl,
        role: u.role,
        status: u.status,
        memberId: u.memberId,
        lastLoginAt: u.lastLoginAt ? new Date(u.lastLoginAt).toISOString() : null,
        createdAt: new Date(u.createdAt).toISOString(),
    };
}

/**
 * PUT /api/users/[id]
 * Cập nhật vai trò, trạng thái (Duyệt/Khóa/Mở), liên kết phả hệ hoặc đặt lại mật khẩu
 * (Chỉ dành cho SUPER_ADMIN)
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

        const existing = await db.query.users.findFirst({
            where: eq(users.id, userId),
        });
        if (!existing) {
            return apiNotFound(`Không tìm thấy người dùng với ID #${userId}`);
        }

        const body = await request.json().catch(() => ({}));
        const isSelf = auth.user?.id === userId;

        // Ngăn Super Admin tự khóa hoặc tự hạ quyền của chính mình
        if (isSelf) {
            if (body.status && body.status !== 'ACTIVE') {
                return apiBadRequest('Không thể tự khóa hoặc vô hiệu hóa tài khoản của chính mình.');
            }
            if (body.role && body.role !== 'SUPER_ADMIN') {
                return apiBadRequest('Không thể tự hạ quyền Admin Tối Cao của chính mình.');
            }
        }

        const updateData: Partial<typeof users.$inferInsert> = {
            updatedAt: new Date(),
        };

        if (body.role !== undefined) {
            if (!['SUPER_ADMIN', 'CLAN_ADMIN', 'BRANCH_ADMIN', 'MEMBER'].includes(body.role)) {
                return apiBadRequest('Vai trò (role) không hợp lệ.');
            }
            updateData.role = body.role;
        }

        if (body.status !== undefined) {
            if (!['ACTIVE', 'LOCKED', 'PENDING'].includes(body.status)) {
                return apiBadRequest('Trạng thái (status) không hợp lệ.');
            }
            updateData.status = body.status;
        }

        if (body.fullName !== undefined) {
            const cleanName = String(body.fullName).trim();
            if (cleanName.length < 2 || cleanName.length > 100) {
                return apiBadRequest('Họ tên phải từ 2 đến 100 ký tự.');
            }
            updateData.fullName = cleanName;
        }

        if (body.phone !== undefined) {
            updateData.phone = body.phone ? String(body.phone).trim() : null;
        }

        if (body.memberId !== undefined) {
            if (body.memberId === null || body.memberId === '') {
                updateData.memberId = null;
            } else {
                const parsedMemberId = parseInt(String(body.memberId), 10);
                if (isNaN(parsedMemberId) || parsedMemberId <= 0) {
                    return apiBadRequest('ID thành viên phả hệ không hợp lệ.');
                }
                updateData.memberId = parsedMemberId;
            }
        }

        if (body.newPassword !== undefined && String(body.newPassword).length > 0) {
            const newPass = String(body.newPassword);
            if (newPass.length < 8) {
                return apiBadRequest('Mật khẩu mới phải có ít nhất 8 ký tự.');
            }
            updateData.passwordHash = await hashPassword(newPass);
        }

        const [updated] = await db
            .update(users)
            .set(updateData)
            .where(eq(users.id, userId))
            .returning();

        if (!updated) {
            return apiNotFound(`Không tìm thấy người dùng với ID #${userId}`);
        }

        await recordAuditLog({
            userId: auth.user?.id,
            action: 'UPDATE',
            entityName: 'users',
            entityId: userId,
            oldValues: { role: existing.role, status: existing.status, memberId: existing.memberId },
            newValues: {
                role: updated.role,
                status: updated.status,
                memberId: updated.memberId,
                passwordReset: Boolean(body.newPassword),
            },
            request,
        });

        return apiSuccess(sanitizeUser(updated), 'Cập nhật tài khoản người dùng thành công.');
    } catch (err) {
        console.error('Lỗi API PUT /api/users/[id]:', err);
        return apiError('Không thể cập nhật người dùng', 500);
    }
}

/**
 * DELETE /api/users/[id]
 * Xóa tài khoản người dùng (Chỉ SUPER_ADMIN, không cho tự xóa mình)
 */
export async function DELETE(request: NextRequest, { params }: Params) {
    try {
        const auth = await getAuthenticatedUser(request);
        if (!auth.isSuperAdmin) {
            return apiForbidden('Chỉ Super Admin mới có quyền xóa tài khoản.');
        }

        const { id } = await params;
        const userId = parseInt(id, 10);
        if (isNaN(userId)) {
            return apiBadRequest('ID người dùng không hợp lệ.');
        }

        if (auth.user?.id === userId) {
            return apiBadRequest('Không thể tự xóa tài khoản của chính mình.');
        }

        const existing = await db.query.users.findFirst({
            where: eq(users.id, userId),
        });
        if (!existing) {
            return apiNotFound(`Không tìm thấy người dùng với ID #${userId}`);
        }

        await db.delete(users).where(eq(users.id, userId));

        await recordAuditLog({
            userId: auth.user?.id,
            action: 'DELETE',
            entityName: 'users',
            entityId: userId,
            oldValues: { email: existing.email, fullName: existing.fullName, role: existing.role },
            request,
        });

        return apiSuccess({ id: userId }, 'Đã xóa tài khoản người dùng.');
    } catch (err) {
        console.error('Lỗi API DELETE /api/users/[id]:', err);
        return apiError('Không thể xóa người dùng', 500);
    }
}
