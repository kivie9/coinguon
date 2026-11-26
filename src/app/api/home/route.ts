import { NextRequest } from 'next/server';
import { homeService } from '@/services/homeService';
import { getAuthenticatedUser } from '@/utils/auth';
import { apiSuccess } from '@/utils/apiResponse';

export async function GET(request: NextRequest) {
    const auth = await getAuthenticatedUser(request);
    const data = await homeService.getHomeData();
    return apiSuccess(data, undefined, 200, {
        isGuest: auth.isGuest,
        role: auth.role,
        dataSource: auth.isGuest ? 'mock' : 'live',
    });
}
