import { NextRequest } from 'next/server';
import { getAuthenticatedUser } from '@/utils/auth';
import { db } from '@/core/database/dataSource';
import { users } from '@/core/database/schema';
import { desc } from 'drizzle-orm';
import { apiSuccess, apiForbidden, apiError } from '@/utils/apiResponse';

/**
 * GET /api/users
 * Lấy danh sách toàn bộ người dùng trong hệ thống (Dành cho Quản Trị Viên)
 */
export async function GET(request: NextRequest) {
    try {
        const auth = await getAuthenticatedUser(request);
        if (!auth.isSuperAdmin) {
            return apiForbidden('Chỉ Admin Tối Cao (SUPER_ADMIN) mới có quyền xem danh sách người dùng.');
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search')?.toLowerCase() || '';
        const roleFilter = searchParams.get('role');
        const statusFilter = searchParams.get('status');

        const allUsers = await db.query.users.findMany({
            with: {
                member: {
                    with: {
                        branch: true,
                    },
                },
            },
            orderBy: [desc(users.createdAt)],
        });

        const filtered = allUsers.filter((u) => {
            if (roleFilter && u.role !== roleFilter) return false;
            if (statusFilter && u.status !== statusFilter) return false;
            if (search) {
                const matchName = u.fullName.toLowerCase().includes(search);
                const matchEmail = (u.email || '').toLowerCase().includes(search);
                const matchPhone = (u.phone || '').includes(search);
                return matchName || matchEmail || matchPhone;
            }
            return true;
        });

        const formatted = filtered.map((u) => ({
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
            linkedMember: u.member
                ? {
                      id: u.member.id,
                      fullName: u.member.fullName,
                      generationNumber: u.member.generationNumber,
                      roleTitle: u.member.roleTitle,
                      branchTitle: (u.member as any).branch?.branchTitle || null,
                  }
                : null,
        }));

        return apiSuccess(formatted, undefined, 200, {
            total: formatted.length,
            rolesCount: {
                superAdmin: formatted.filter((u) => u.role === 'SUPER_ADMIN').length,
                clanAdmin: formatted.filter((u) => u.role === 'CLAN_ADMIN').length,
                branchAdmin: formatted.filter((u) => u.role === 'BRANCH_ADMIN').length,
                member: formatted.filter((u) => u.role === 'MEMBER').length,
            },
        });
    } catch (err) {
        console.error('Lỗi API GET /api/users:', err);
        return apiError('Không thể tải danh sách người dùng', 500);
    }
}

