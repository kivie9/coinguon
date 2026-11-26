import { HomeDataResponse } from './api/homeApi';
import {
    HOME_EVENT_SPOTLIGHT,
    HOME_UPCOMING_ANNIVERSARY,
    HOME_FUND_DATA,
    HOME_FAMILY_RULES,
    HOME_NEWS_ITEMS,
    HOME_ANCESTRAL_TEMPLE,
    HOME_GENERATIONS,
} from '@/components/app/common/home/homeData';
import { memberService } from './memberService';
import { eventService } from './eventService';
import { fundService } from './fundService';
import { clanService } from './clanService';
import { getRomanNumeral } from '@/utils/memberUtils';

export class HomeService {
    async getHomeData(): Promise<HomeDataResponse> {
        // Lấy danh sách đời động từ CSDL qua memberService
        let dynamicGenerations: string[] = [];
        try {
            const availableGens = await memberService.getAvailableGenerations();
            if (availableGens && availableGens.length > 0) {
                dynamicGenerations = availableGens.map((g) => `Đời ${getRomanNumeral(g)}`);
            }
        } catch {
            // Fallback nếu có lỗi CSDL
        }

        if (dynamicGenerations.length === 0) {
            dynamicGenerations = [...HOME_GENERATIONS];
        }

        // Lấy dữ liệu sự kiện động từ eventService
        let eventSpotlight = { ...HOME_EVENT_SPOTLIGHT };
        let upcomingAnniversary = { ...HOME_UPCOMING_ANNIVERSARY };
        try {
            const eventsData = await eventService.getEventsFullData();
            if (eventsData?.featuredEvent) {
                const feat = eventsData.featuredEvent;
                eventSpotlight = {
                    badge: feat.category === 'FESTIVAL' ? 'Đại Lễ Dòng Tộc' : 'Sự Kiện Trọng Đại',
                    title: feat.title,
                    lunarDate: feat.dateLunar || feat.dateSolar,
                    location: feat.location,
                    attendees: feat.role || 'Toàn thể gia quyến',
                    invitation: feat.description || 'Kính mời bà con tề tựu đông đủ.',
                    daysRemaining: feat.daysRemaining || 5,
                };
            }

            const anniversary = eventsData.events.find((e) => e.category === 'ANNIVERSARY');
            if (anniversary) {
                upcomingAnniversary = {
                    name: anniversary.title,
                    generation: 'Tiền Nhân Khởi Tổ',
                    shortGeneration: 'Đời I',
                    lunarDate: anniversary.dateLunar,
                    location: anniversary.location,
                    assignedBranch: anniversary.role || 'Chi Trưởng Đại Tôn',
                };
            }
        } catch {
            // Fallback
        }

        // Lấy dữ liệu quỹ từ fundService
        let fundData = { ...HOME_FUND_DATA };
        try {
            const ov = await fundService.getOverview();
            fundData = {
                title: ov.title,
                desktopTitle: ov.desktopTitle,
                percent: ov.percent,
                balance: ov.balance,
                bankAccount: ov.bankAccount,
                bankName: ov.bankName,
                accountName: ov.accountName,
            };
        } catch {
            // Fallback
        }

        // Lấy thông tin từ đường từ clanService
        let ancestralTemple = { ...HOME_ANCESTRAL_TEMPLE };
        try {
            const clan = await clanService.getClanInfo();
            if (clan.ancestralHall) {
                ancestralTemple = {
                    name: clan.ancestralHall.name,
                    address: clan.ancestralHall.address,
                    manager: clan.contact.leader.fullName,
                    phone: clan.contact.leader.phone,
                };
            }
        } catch {
            // Fallback
        }

        return {
            eventSpotlight,
            upcomingAnniversary,
            fundData,
            familyRules: [...HOME_FAMILY_RULES],
            newsItems: [...HOME_NEWS_ITEMS],
            ancestralTemple,
            generations: dynamicGenerations,
        };
    }
}

export const homeService = new HomeService();
