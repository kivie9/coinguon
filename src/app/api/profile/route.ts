import { clanService } from '@/services/clanService';
import { apiSuccess, apiError } from '@/utils/apiResponse';

export async function GET() {
    try {
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
