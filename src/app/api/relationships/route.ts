import { NextRequest } from 'next/server';
import { memberService } from '@/services/memberService';
import { relationshipService } from '@/services/relationshipService';
import { getAuthenticatedUser } from '@/utils/auth';
import { apiSuccess, apiBadRequest, apiNotFound, apiError } from '@/utils/apiResponse';

/**
 * GET /api/relationships?from=1&to=2
 * Tra cứu vai vế / cách xưng hô giữa hai thành viên (Yêu cầu đăng nhập)
 */
export async function GET(request: NextRequest) {
    try {
        const auth = await getAuthenticatedUser(request);
        if (auth.isGuest) {
            return apiError('Vui lòng đăng nhập để tra cứu vai vế.', 401);
        }
        const { searchParams } = new URL(request.url);
        const fromParam = searchParams.get('from');
        const toParam = searchParams.get('to');

        if (!fromParam || !toParam) {
            return apiBadRequest('Vui lòng truyền đủ tham số `from` và `to` (ID của 2 thành viên).');
        }

        const idA = parseInt(fromParam, 10);
        const idB = parseInt(toParam, 10);

        if (isNaN(idA) || isNaN(idB)) {
            return apiBadRequest('ID thành viên phải là số nguyên hợp lệ.');
        }

        const personA = await memberService.getMemberByIdEnriched(idA);
        const personB = await memberService.getMemberByIdEnriched(idB);

        if (!personA || !personB) {
            return apiNotFound('Không tìm thấy thông tin một trong hai thành viên.');
        }

        const title = relationshipService.getRelationshipTitle(personA, personB);

        return apiSuccess({
            from: idA,
            to: idB,
            title,
        });
    } catch (error) {
        console.error('Lỗi API GET /api/relationships:', error);
        return apiError('Đã có lỗi xảy ra khi tính toán vai vế.');
    }
}
