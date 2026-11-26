import React from 'react';
import { Metadata } from 'next';
import { LineageEvents } from '@/components/app/common/events/LineageEvents';
import { DesktopEventsExplorer } from '@/components/app/desktop/events/DesktopEventsExplorer';
import { ResponsiveView } from '@/components/common/ResponsiveView';
import { CLAN_CONFIG } from '@/config/clanConfig';
import { eventService } from '@/services/eventService';
import { getServerAuth } from '@/utils/auth';

export const metadata: Metadata = {
    title: `Lịch Giỗ Chạp & Sự Kiện Tộc | ${CLAN_CONFIG.name}`,
    description: 'Lịch tế tổ, giỗ chạp các cụ tiền nhân và sự kiện khuyến học dòng tộc.',
};

export default async function EventsPage() {
    const auth = await getServerAuth();
    // Mặc định Khách (Guest) xem sự kiện mẫu, Đăng nhập xem CSDL thực tế
    const eventsData = await eventService.getEventsFullData(auth.isGuest);

    return (
        <ResponsiveView
            mobile={<LineageEvents initialEvents={eventsData.events} />}
            desktop={<DesktopEventsExplorer initialData={eventsData} />}
        />
    );
}
