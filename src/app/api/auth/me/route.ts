import { NextRequest } from 'next/server';
import { getAuthenticatedUser } from '@/utils/auth';
import { apiSuccess } from '@/utils/apiResponse';

/**
 * GET /api/auth/me
 * Trả về thông tin phiên làm việc, vai trò phân quyền và trạng thái đăng nhập
 */
export async function GET(request: NextRequest) {
    const authContext = await getAuthenticatedUser(request);
    return apiSuccess(authContext);
}

