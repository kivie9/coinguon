import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import { db } from '@/core/database/dataSource';
import { users } from '@/core/database/schema';
import { UserRole, UserStatus, UserProfileDto } from '@/types/userType';

export interface AuthContext {
    user: UserProfileDto | null;
    role: UserRole;
    isGuest: boolean;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    branchId: number | null;
}

const GUEST_CONTEXT: AuthContext = {
    user: null,
    role: 'GUEST',
    isGuest: true,
    isAdmin: false,
    isSuperAdmin: false,
    branchId: null,
};

async function buildAuthContextFromSession(): Promise<AuthContext> {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return GUEST_CONTEXT;
        }

        const sessionUser = session.user;

        // Cố gắng đọc bản ghi mới nhất từ D1/SQLite (để kiểm tra trạng thái LOCKED và liên kết phả hệ)
        try {
            const dbUser = await db.query.users.findFirst({
                where: eq(users.email, sessionUser.email),
                with: {
                    member: {
                        with: {
                            branch: true,
                        },
                    },
                },
            });

            if (dbUser) {
                if (dbUser.status !== 'ACTIVE') {
                    return GUEST_CONTEXT;
                }

                const role = dbUser.role as UserRole;
                const isSuperAdmin = role === 'SUPER_ADMIN';
                const isAdmin = isSuperAdmin || role === 'CLAN_ADMIN' || role === 'BRANCH_ADMIN';

                return {
                    isGuest: false,
                    role,
                    isAdmin,
                    isSuperAdmin,
                    branchId: dbUser.member?.branchId ?? null,
                    user: {
                        id: dbUser.id,
                        email: dbUser.email,
                        phone: dbUser.phone,
                        fullName: dbUser.fullName,
                        avatarUrl: dbUser.avatarUrl,
                        role,
                        status: dbUser.status as UserStatus,
                        memberId: dbUser.memberId,
                        lastLoginAt: dbUser.lastLoginAt ? new Date(dbUser.lastLoginAt).toISOString() : null,
                        createdAt: new Date(dbUser.createdAt).toISOString(),
                        linkedMember: dbUser.member
                            ? {
                                  id: dbUser.member.id,
                                  fullName: dbUser.member.fullName,
                                  generationNumber: dbUser.member.generationNumber,
                                  roleTitle: dbUser.member.roleTitle,
                                  branchTitle: (dbUser.member as { branch?: { branchTitle?: string | null } }).branch?.branchTitle || null,
                              }
                            : null,
                    },
                };
            }
        } catch {
            // Fallback sang dữ liệu JWT nếu DB đang tạm tắt
        }

        const role = (sessionUser.role || 'MEMBER') as UserRole;
        const isSuperAdmin = role === 'SUPER_ADMIN';
        const isAdmin = isSuperAdmin || role === 'CLAN_ADMIN' || role === 'BRANCH_ADMIN';

        return {
            isGuest: false,
            role,
            isAdmin,
            isSuperAdmin,
            branchId: null,
            user: {
                id: sessionUser.dbId || 0,
                email: sessionUser.email,
                phone: sessionUser.phone ?? null,
                fullName: sessionUser.name || sessionUser.email.split('@')[0],
                avatarUrl: sessionUser.image ?? null,
                role,
                status: (sessionUser.status || 'ACTIVE') as UserStatus,
                memberId: sessionUser.memberId ?? null,
                lastLoginAt: null,
                createdAt: new Date().toISOString(),
                linkedMember: null,
            },
        };
    } catch {
        return GUEST_CONTEXT;
    }
}

/**
 * Xác thực người dùng phía Server Component thông qua phiên Auth.js v5
 */
export async function getServerAuth(): Promise<AuthContext> {
    return buildAuthContextFromSession();
}

/**
 * Trích xuất và xác thực người dùng từ NextRequest
 * Ưu tiên phiên Auth.js v5; hỗ trợ chế độ Demo Role (x-demo-role) khi chưa đăng nhập.
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<AuthContext> {
    const sessionAuth = await buildAuthContextFromSession();
    if (!sessionAuth.isGuest) {
        return sessionAuth;
    }

    // Chỉ cho phép x-demo-role trong môi trường phát triển (development) hoặc khi bật ALLOW_DEMO_ROLE=true
    const allowDemoRole =
        process.env.NODE_ENV !== 'production' || process.env.ALLOW_DEMO_ROLE === 'true';
    const demoRoleHeader = allowDemoRole
        ? (request.headers.get('x-demo-role') as UserRole | null)
        : null;
    if (demoRoleHeader && ['MEMBER', 'BRANCH_ADMIN', 'CLAN_ADMIN', 'SUPER_ADMIN'].includes(demoRoleHeader)) {
        const isSuperAdmin = demoRoleHeader === 'SUPER_ADMIN';
        const isAdmin = isSuperAdmin || demoRoleHeader === 'CLAN_ADMIN' || demoRoleHeader === 'BRANCH_ADMIN';

        return {
            isGuest: false,
            role: demoRoleHeader,
            isAdmin,
            isSuperAdmin,
            branchId: null,
            user: {
                id: 999,
                email: `${demoRoleHeader.toLowerCase()}@coinguon.vn`,
                phone: '0912.345.678',
                fullName: `Tài khoản ${demoRoleHeader} (Demo)`,
                avatarUrl: null,
                role: demoRoleHeader,
                status: 'ACTIVE',
                memberId: 1,
                lastLoginAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                linkedMember: {
                    id: 1,
                    fullName: 'Lê Văn Khang',
                    generationNumber: 9,
                    roleTitle: 'Tộc Trưởng',
                    branchTitle: 'Chi Trưởng Đại Tôn',
                },
            },
        };
    }

    return GUEST_CONTEXT;
}
