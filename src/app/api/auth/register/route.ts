import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/core/database/dataSource';
import { users } from '@/core/database/schema';
import { hashPassword } from '@/utils/password';
import { apiSuccess, apiBadRequest, apiError } from '@/utils/apiResponse';

/**
 * POST /api/auth/register
 * Tạo tài khoản thành viên mới (Auth.js + Cloudflare D1 / SQLite)
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => ({}));
        const email = String(body.email || '').trim().toLowerCase();
        const password = String(body.password || '');
        const fullName = String(body.fullName || '').trim();
        const phone = body.phone ? String(body.phone).trim() : null;

        if (!email || !password || !fullName) {
            return apiBadRequest('Vui lòng nhập đầy đủ họ tên, email và mật khẩu.');
        }

        if (password.length < 6) {
            return apiBadRequest('Mật khẩu phải có ít nhất 6 ký tự.');
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
                status: 'ACTIVE',
            })
            .returning();

        return apiSuccess(
            {
                id: created.id,
                email: created.email,
                fullName: created.fullName,
                role: created.role,
            },
            'Đăng ký tài khoản thành công',
            201
        );
    } catch (err) {
        console.error('Lỗi POST /api/auth/register:', err);
        return apiError('Không thể tạo tài khoản. Vui lòng kiểm tra kết nối cơ sở dữ liệu.', 500);
    }
}
