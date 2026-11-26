import { NextRequest } from 'next/server';
import { clanService } from '@/services/clanService';
import { INITIAL_CLAN_DATA } from '@/config/clanData';
import { getAuthenticatedUser } from '@/utils/auth';
import { apiSuccess, apiForbidden, apiError } from '@/utils/apiResponse';

export async function GET(request: NextRequest) {
    try {
        const auth = await getAuthenticatedUser(request);
        const clanInfo = auth.isGuest ? { ...INITIAL_CLAN_DATA } : await clanService.getClanInfo();
        return apiSuccess(clanInfo, undefined, 200, {
            isGuest: auth.isGuest,
            role: auth.role,
            dataSource: auth.isGuest ? 'mock' : 'live',
        });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin dòng tộc:', error);
        return apiError('Không thể tải thông tin dòng họ', 500);
    }
}

export async function PUT(request: NextRequest) {
    try {
        const auth = await getAuthenticatedUser(request);
        if (!auth.isAdmin && !auth.isSuperAdmin) {
            return apiForbidden('Chỉ Quản Trị Viên mới có quyền cập nhật thông tin dòng tộc.');
        }

        const body = await request.json();
        const updated = await clanService.updateClanInfo(body);
        return apiSuccess(updated, 'Cập nhật thông tin dòng tộc thành công');
    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin dòng tộc:', error);
        return apiError('Cập nhật thông tin thất bại', 400);
    }
}

