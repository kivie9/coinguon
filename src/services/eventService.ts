import {
    LineageEventDto,
    EventRitualStep,
    EventContactPerson,
    EventsApiResponse,
} from './api/eventApi';
import { memberService } from './memberService';
import { getGenerationTitle } from '@/utils/memberUtils';
import { CLAN_CONFIG } from '@/config/clanConfig';
import { db } from '@/core/database/dataSource';
import { warnDbFallback } from '@/core/database/dbStatus';

export const INITIAL_RITUALS_DATA: EventRitualStep[] = [
    {
        step: 1,
        time: '07:30',
        title: 'Lễ Khởi Sự & Nghênh Đón',
        description: 'Ban khánh tiết chỉnh túc y phục truyền thống, nghênh đón bà con nội ngoại các chi xa gần về dâng hương kính tổ.',
    },
    {
        step: 2,
        time: '09:00',
        title: 'Đại Tế Chính & Dâng Chúc Văn',
        description: 'Cụ Tộc Trưởng chủ trì đăng đàn dâng hương, xướng đọc chúc văn tưởng nhớ công đức tổ tiên khai sáng cơ đồ.',
    },
    {
        step: 3,
        time: '10:30',
        title: 'Tuyên Dương & Quỹ Khuyến Học',
        description: 'Trao bằng khen danh dự và học bổng khuyến tài cho con cháu đỗ đạt, đạt thành tích cao trong học tập niên khóa.',
    },
    {
        step: 4,
        time: '11:30',
        title: 'Thụ Lộc Họ Tộc & Bữa Cơm Đoàn Viên',
        description: 'Toàn thể gia quyến dự bữa cơm thân mật tại gian Tả Vu & Hữu Vu, gắn kết tình đoàn kết ruột thịt đồng tông.',
    },
];

export const INITIAL_CONTACTS_DATA: EventContactPerson[] = [
    {
        name: CLAN_CONFIG.contact.leaderName,
        role: CLAN_CONFIG.contact.leaderRole,
        phone: CLAN_CONFIG.contact.hotline,
    },
    {
        name: 'Ông Lê Văn Khang',
        role: 'Trưởng Ban Liên Lạc Chi Tộc Hải Ngoại & Hà Nội',
        phone: '0988.765.432',
    },
    {
        name: 'Ông Lê Văn Thành',
        role: 'Trưởng Ban Khánh Tiết & Hậu Cần Tế Tự',
        phone: '0912.345.678',
    },
];

export const CORE_CLAN_EVENTS: LineageEventDto[] = [
    {
        id: 1,
        title: 'Đại Lễ Giỗ Tổ Chi II & Khai Xuân Ất Tỵ',
        dateLunar: '15 tháng Giêng (ÂL)',
        dateSolar: '12/02/2025',
        targetDate: '2025-02-12',
        location: 'Từ Đường Đại Tôn',
        role: 'Toàn thể con cháu nội ngoại & Dâu rể',
        status: 'Sắp diễn ra (Còn 5 ngày)',
        featured: true,
        category: 'FESTIVAL',
        description: 'Đại lễ giỗ tổ thường niên lớn nhất của dòng tộc. Kính mời toàn thể con cháu nội ngoại gần xa tề tựu đông đủ trước Từ Đường để dâng hương tri ân tiên tổ, nhận lộc xuân và thụ hưởng phúc lành dòng họ.',
        daysRemaining: 5,
    },
    {
        id: 2,
        title: 'Lễ Tuyên Dương Khuyến Học & Trao Học Bổng Lê Tộc',
        dateLunar: '14 tháng Giêng (ÂL)',
        dateSolar: '11/02/2025',
        targetDate: '2025-02-11',
        location: 'Gian Tiền Đường • Từ Đường Đại Tôn',
        role: 'Ban Khuyến Học chủ trì',
        status: 'Còn 4 ngày',
        featured: false,
        category: 'EDUCATION',
        description: 'Biểu dương 12 tân cử nhân, thạc sĩ và học sinh giỏi các cấp có thành tích xuất sắc, tiếp nối truyền thống hiếu học rạng danh tổ tông.',
        daysRemaining: 4,
    },
];

export class EventService {
    /**
     * Tạo danh sách sự kiện động: kết hợp Đại Lễ Dòng Tộc với các ngày kỵ nhật lấy động từ CSDL thành viên đã khuất
     */
    async getEvents(): Promise<LineageEventDto[]> {
        const fullData = await this.getEventsFullData();
        return fullData.events;
    }

    /**
     * Lấy toàn bộ dữ liệu sự kiện, kỵ nhật tổ tiên, nghi thức và danh sách ban khánh tiết từ CSDL/API
     * Hỗ trợ phân quyền: isGuest = true sẽ sử dụng toàn bộ dữ liệu mẫu
     */
    async getEventsFullData(isGuest = false): Promise<EventsApiResponse> {
        let clanEvents: LineageEventDto[] = [];
        let ritualsList: EventRitualStep[] = [...INITIAL_RITUALS_DATA];
        let contactsList: EventContactPerson[] = [...INITIAL_CONTACTS_DATA];

        // 1. Truy vấn các sự kiện dòng họ từ bảng events trong CSDL (chỉ khi không phải Khách)
        if (!isGuest) {
            try {
                const dbEventsData = await db.query.events.findMany({
                    with: {
                        ritualSteps: {
                            orderBy: (steps, { asc }) => [asc(steps.stepNumber)],
                        },
                        organizers: true,
                    },
                    orderBy: (events, { asc }) => [asc(events.eventDateSolar)],
                });

                if (dbEventsData && dbEventsData.length > 0) {
                    clanEvents = dbEventsData.map((e) => {
                        const eventDate = new Date(e.eventDateSolar);
                        const now = new Date();
                        const diffTime = eventDate.getTime() - now.getTime();
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        const daysRemaining = diffDays > 0 ? diffDays : 0;
                        const status = daysRemaining > 0 
                            ? `Sắp diễn ra (Còn ${daysRemaining} ngày)`
                            : daysRemaining === 0 ? 'Đang diễn ra hôm nay' : 'Đã diễn ra';

                        return {
                            id: e.id,
                            title: e.title,
                            dateLunar: e.eventDateLunar || '',
                            dateSolar: new Intl.DateTimeFormat('vi-VN').format(eventDate),
                            targetDate: e.eventDateSolar,
                            location: e.location,
                            role: e.roleAudience || 'Toàn thể con cháu nội ngoại & Dâu rể',
                            status,
                            featured: e.isFeatured,
                            category: (e.category as any) || 'FESTIVAL',
                            description: e.description || '',
                            daysRemaining,
                        };
                    });

                    // Lấy nghi thức & ban khánh tiết từ sự kiện tiêu biểu (featured) hoặc sự kiện đầu tiên
                    const featuredDbEvent = dbEventsData.find((e) => e.isFeatured) || dbEventsData[0];
                    if (featuredDbEvent?.ritualSteps && featuredDbEvent.ritualSteps.length > 0) {
                        ritualsList = featuredDbEvent.ritualSteps.map((s) => ({
                            step: s.stepNumber,
                            time: s.timeScheduled,
                            title: s.title,
                            description: s.description,
                        }));
                    }

                    if (featuredDbEvent?.organizers && featuredDbEvent.organizers.length > 0) {
                        contactsList = featuredDbEvent.organizers.map((o) => ({
                            name: o.name,
                            role: o.role,
                            phone: o.phone || '',
                        }));
                    }
                }
            } catch (dbErr) {
                warnDbFallback('Lỗi khi truy vấn sự kiện từ CSDL, sử dụng sự kiện dự phòng:', dbErr);
            }
        }

        if (clanEvents.length === 0) {
            clanEvents = [...CORE_CLAN_EVENTS];
        }

        // 2. Tự động trích xuất các ngày kỵ nhật từ CSDL thành viên đã khuất
        let memberAnniversaries: LineageEventDto[] = [];
        try {
            const allMembers = isGuest
                ? (await import('./mappers/memberMapper')).getSampleHeritageMembers()
                : await memberService.getAllEnrichedMembers();
            const deceasedMembers = allMembers
                .filter((m) => !m.isAlive && m.deathDayLunar)
                .sort((a, b) => b.generationNumber - a.generationNumber)
                .slice(0, 24);

            memberAnniversaries = deceasedMembers.map((m) => {
                const genTitle = getGenerationTitle(m.generationNumber);
                const lunarDateStr = m.deathDayLunar || '01/01';
                return {
                    id: 1000 + m.id,
                    title: `Kỵ Nhật ${m.fullName} (${genTitle.badge || `Đời ${m.generationNumber}`})`,
                    dateLunar: `${lunarDateStr} (ÂL)`,
                    dateSolar: lunarDateStr.includes('08') ? '15/09/2025' : lunarDateStr.includes('03') ? '08/04/2025' : '24/12/2025',
                    location: m.burialPlace || 'Từ Đường Đại Tôn',
                    role: m.branch ? `${m.branch} phụ trách tế tự` : 'Chi phái đảm trách hương hỏa',
                    status: 'Kỵ nhật truyền thống',
                    featured: false,
                    category: 'ANNIVERSARY',
                    description: `Ngày giỗ chính tuần tự kỷ niệm tiền nhân ${m.fullName}. Con cháu phụng dưỡng đèn nhang và dâng lễ vật kính cẩn.`,
                };
            });
        } catch (err) {
            console.warn('Không thể tải kỵ nhật từ CSDL thành viên, sử dụng dữ liệu mặc định:', err);
        }

        // Nếu CSDL rỗng hoặc chưa có kỵ nhật, dùng danh sách dự phòng
        if (memberAnniversaries.length === 0) {
            memberAnniversaries = [
                {
                    id: 101,
                    title: 'Kỵ Nhật Cụ Khởi Tổ Lê Văn Quang (Tiền Nhân)',
                    dateLunar: '15/08 (ÂL) • Tiết Trung Thu',
                    dateSolar: '05/10/2025',
                    location: 'Đồi Thọ Vực & Từ Đường Đại Tôn',
                    role: 'Đại Lễ Toàn Tộc',
                    status: 'Tháng 8 ÂL',
                    featured: false,
                    category: 'ANNIVERSARY',
                    description: 'Đại lễ kỵ nhật Cụ Thủy Khởi Tổ có công khai sáng dòng họ. Toàn thể các chi phái tề tựu bái tổ.',
                },
                {
                    id: 102,
                    title: 'Kỵ Nhật Cụ Bà Khởi Tổ Trần Thị Lụa (Tiền Nhân)',
                    dateLunar: '10/03 (ÂL)',
                    dateSolar: '07/04/2025',
                    location: 'Từ Đường Đại Tôn',
                    role: 'Ban Trị Sự & Hội Đồng Tộc Biểu',
                    status: 'Tháng 3 ÂL',
                    featured: false,
                    category: 'ANNIVERSARY',
                    description: 'Tế lễ Cụ Bà Khởi Tổ hiền đức mẫu mực, chăm lo nếp nhà gia phong đời thứ nhất.',
                },
                {
                    id: 103,
                    title: 'Kỵ Nhật Cụ Trưởng Chi Lê Văn Phúc (Đời II)',
                    dateLunar: '24/11 (ÂL)',
                    dateSolar: '13/01/2026',
                    location: 'Từ Đường Chi II',
                    role: 'Trưởng Chi phụ trách hương hỏa',
                    status: 'Tháng 11 ÂL',
                    featured: false,
                    category: 'ANNIVERSARY',
                    description: 'Lễ kỵ Cụ Trưởng Chi đời thứ hai có công gìn giữ từ đường và gia phả bản tộc.',
                },
            ];
        }

        const allEvents = [...clanEvents, ...memberAnniversaries];
        const featuredEvent = allEvents.find((e) => e.featured) || allEvents[0];

        return {
            events: allEvents,
            featuredEvent,
            rituals: ritualsList,
            contacts: contactsList,
            stats: {
                totalEvents: allEvents.length,
                anniversariesCount: allEvents.filter((e) => e.category === 'ANNIVERSARY').length,
                festivalsCount: allEvents.filter((e) => e.category === 'FESTIVAL').length,
            },
        };
    }

    async getEventById(id: number): Promise<LineageEventDto | null> {
        const events = await this.getEvents();
        return events.find((e) => e.id === id) || null;
    }
}

export const eventService = new EventService();


