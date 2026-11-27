import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/core/database/dataSource';
import { users } from '@/core/database/schema';
import { hashPassword } from '@/utils/password';
import { apiSuccess, apiBadRequest, apiError } from '@/utils/apiResponse';
import { checkRateLimit } from '@/utils/rateLimit';
import { getClientIp, recordAuditLog } from '@/utils/auditLog';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/auth/register
 * Tạo tài khoản thành viên mới (mặc định PENDING chờ Ban Quản Trị phê duyệt)
 */
export async function POST(request: NextRequest) {
    try {
        const ip = getClientIp(request) || 'unknown';
        const limit = checkRateLimit(`register:${ip}`, 5, 10 * 60_000);
        if (!limit.allowed) {
            return apiError(
                `Bạn thao tác quá nhiều lần. Vui lòng thử lại sau ${limit.retryAfterSeconds} giây.`,
                429
            );
        }

        const body = await request.json().catch(() => ({}));
        const email = String(body.email || '').trim().toLowerCase();
        const password = String(body.password || '');
        const fullName = String(body.fullName || '').trim();
        const phone = body.phone ? String(body.phone).trim() : null;

        if (!email || !password || !fullName) {
            return apiBadRequest('Vui lòng nhập đầy đủ họ tên, email và mật khẩu.');
        }

        if (!EMAIL_REGEX.test(email)) {
            return apiBadRequest('Địa chỉ email không hợp lệ.');
        }

        if (fullName.length < 2 || fullName.length > 100) {
            return apiBadRequest('Họ và tên phải từ 2 đến 100 ký tự.');
        }

        if (password.length < 8) {
            return apiBadRequest('Mật khẩu phải có ít nhất 8 ký tự để đảm bảo an toàn.');
        }

        const existing = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (existing) {
            return apiBadRequest('Email này đã được đăng ký trong hệ thống.');
        }

        const passwordHash = await hashPassword(password);
        const [created] = await db
            .insert(users)
            .values({
                email,
                passwordHash,
                fullName,
                phone: phone || null,
                role: 'MEMBER',
                status: 'PENDING',
            })
            .returning();

        await recordAuditLog({
            userId: created.id,
            action: 'INSERT',
            entityName: 'users',
            entityId: created.id,
            newValues: { email: created.email, fullName: created.fullName, role: created.role, status: created.status },
            request,
        });

        return apiSuccess(
            {
                id: created.id,
                email: created.email,
                fullName: created.fullName,
                role: created.role,
                status: created.status,
            },
            'Đăng ký thành công! Tài khoản đang chờ Ban Quản Trị phê duyệt trước khi truy cập dữ liệu gia phả.',
            201
        );
    } catch (err) {
        console.error('Lỗi POST /api/auth/register:', err);
        return apiError('Không thể tạo tài khoản. Vui lòng kiểm tra kết nối cơ sở dữ liệu.', 500);
    }
}
