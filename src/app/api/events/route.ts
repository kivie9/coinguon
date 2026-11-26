import { NextRequest } from 'next/server';
import { eventService, CORE_CLAN_EVENTS, INITIAL_RITUALS_DATA, INITIAL_CONTACTS_DATA } from '@/services/eventService';
import { getAuthenticatedUser } from '@/utils/auth';
import { apiSuccess, apiError } from '@/utils/apiResponse';

export async function GET(request: NextRequest) {
    try {
        const auth = await getAuthenticatedUser(request);

        let eventsData;
        if (auth.isGuest) {
            // Chế độ Khách: Sử dụng dữ liệu Mock
            eventsData = {
                events: [...CORE_CLAN_EVENTS],
                featuredEvent: CORE_CLAN_EVENTS[0],
                rituals: [...INITIAL_RITUALS_DATA],
                contacts: [...INITIAL_CONTACTS_DATA],
                stats: {
                    totalEvents: CORE_CLAN_EVENTS.length,
                    anniversariesCount: 0,
                    festivalsCount: CORE_CLAN_EVENTS.filter((e) => e.category === 'FESTIVAL').length,
                },
            };
        } else {
            // Đã đăng nhập: Sử dụng dữ liệu CSDL thực tế
            eventsData = await eventService.getEventsFullData();
        }

        return apiSuccess(eventsData, undefined, 200, {
            isGuest: auth.isGuest,
            role: auth.role,
            dataSource: auth.isGuest ? 'mock' : 'live',
        });
    } catch (error) {
        console.error('Lỗi khi tải danh sách sự kiện:', error);
        return apiError('Không thể tải danh sách sự kiện', 500);
    }
}
