import { NextRequest } from 'next/server';
import { apiSuccess } from '@/utils/apiResponse';

/**
 * POST /api/auth/logout
 * Dọn sạch các cookie phiên Auth.js khi đăng xuất
 */
export async function POST(request: NextRequest) {
    const response = apiSuccess(null, 'Đăng xuất thành công');

    try {
        const allCookies = request.cookies.getAll();
        for (const c of allCookies) {
            if (
                c.name.includes('authjs') ||
                c.name.includes('next-auth') ||
                c.name === 'giapha_token'
            ) {
                response.cookies.set(c.name, '', {
                    path: '/',
                    httpOnly: true,
                    sameSite: 'lax',
                    maxAge: 0,
                });
            }
        }
    } catch {
        // Ignore cookie parsing error
    }

    return response;
}
