import { NextRequest } from 'next/server';
import { homeService } from '@/services/homeService';
import { getAuthenticatedUser } from '@/utils/auth';
import { apiSuccess, apiError } from '@/utils/apiResponse';

export async function GET(request: NextRequest) {
    const auth = await getAuthenticatedUser(request);
    if (auth.isGuest) {
        return apiError('Vui lòng đăng nhập để xem trang tổng quan dòng họ.', 401);
    }

    const data = await homeService.getHomeData();
    return apiSuccess(data, undefined, 200, {
        isGuest: false,
        role: auth.role,
        dataSource: 'live',
    });
}
