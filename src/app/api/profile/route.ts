import { NextRequest } from 'next/server';
import { clanService } from '@/services/clanService';
import { getAuthenticatedUser } from '@/utils/auth';
import { apiSuccess, apiError } from '@/utils/apiResponse';

export async function GET(request: NextRequest) {
    try {
        const auth = await getAuthenticatedUser(request);
        if (auth.isGuest) {
            return apiError('Vui lòng đăng nhập để xem hồ sơ dòng tộc.', 401);
        }

        const clan = await clanService.getClanInfo();
        const profileData = {
            stats: clan.stats,
            leader: {
                ...clan.contact.leader,
                title: clan.contact.leader.role,
            },
            committees: clan.committees,
            liaisonBranches: clan.liaisonBranches,
            ancestralHall: {
                name: clan.ancestralHall.name,
                address: clan.ancestralHall.address,
                foundedYear: clan.ancestralHall.foundedYearText,
                area: clan.ancestralHall.area,
                ranking: clan.ancestralHall.ranking,
            },
            documents: clan.documents,
        };

        return apiSuccess(profileData);
    } catch (error) {
        console.error('Lỗi khi lấy thông tin hồ sơ dòng tộc:', error);
        return apiError('Không thể tải hồ sơ dòng tộc', 500);
    }
}
