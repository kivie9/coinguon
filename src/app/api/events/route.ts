import { NextRequest } from 'next/server';
import { db } from '@/core/database/dataSource';
import { events } from '@/core/database/schema';
import { eventService, CORE_CLAN_EVENTS, INITIAL_RITUALS_DATA, INITIAL_CONTACTS_DATA } from '@/services/eventService';
import { getAuthenticatedUser } from '@/utils/auth';
import { recordAuditLog } from '@/utils/auditLog';
import { apiSuccess, apiBadRequest, apiForbidden, apiError } from '@/utils/apiResponse';

const VALID_CATEGORIES = ['ANNIVERSARY', 'FESTIVAL', 'EDUCATION', 'MEETING'];

export async function GET(request: NextRequest) {
    try {
        const auth = await getAuthenticatedUser(request);
        if (auth.isGuest) {
            return apiError('Vui lòng đăng nhập để xem lịch sự kiện & giỗ chạp.', 401);
        }

        const eventsData = await eventService.getEventsFullData(false);

        return apiSuccess(eventsData, undefined, 200, {
            isGuest: false,
            role: auth.role,
            dataSource: 'live',
        });
    } catch (error) {
        console.error('Lỗi khi tải danh sách sự kiện:', error);
        return apiError('Không thể tải danh sách sự kiện', 500);
    }
}

/**
 * POST /api/events
 * Tạo mới sự kiện / lễ tiết dòng họ lưu vào CSDL (Chỉ Quản Trị Viên)
 */
export async function POST(request: NextRequest) {
    try {
        const auth = await getAuthenticatedUser(request);
        if (auth.isGuest || (!auth.isAdmin && !auth.isSuperAdmin)) {
            return apiForbidden('Chỉ Quản Trị Viên mới có quyền tạo sự kiện dòng họ.');
        }

        const body = await request.json().catch(() => ({}));
        const title = String(body.title || '').trim();
        const location = String(body.location || '').trim() || 'Từ đường Gia tộc';
        const eventDateSolar = String(body.eventDateSolar || body.dateSolar || '').trim();
        const eventDateLunar = body.eventDateLunar || body.dateLunar ? String(body.eventDateLunar || body.dateLunar).trim() : null;
        const category = VALID_CATEGORIES.includes(body.category) ? body.category : 'FESTIVAL';

        if (!title || title.length < 3 || title.length > 200) {
            return apiBadRequest('Tên sự kiện phải từ 3 đến 200 ký tự.');
        }

        // Chuẩn hóa ngày dương lịch sang ISO YYYY-MM-DD nếu cần
        let isoDate = new Date().toISOString().split('T')[0];
        if (/^\d{4}-\d{2}-\d{2}$/.test(eventDateSolar)) {
            isoDate = eventDateSolar;
        } else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(eventDateSolar)) {
            const [d, m, y] = eventDateSolar.split('/');
            isoDate = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
        }

        const clan = await db.query.clans.findFirst();

        const [created] = await db
            .insert(events)
            .values({
                clanId: clan?.id ?? null,
                title,
                category,
                eventDateSolar: isoDate,
                eventDateLunar,
                location: location.slice(0, 250),
                roleAudience: String(body.roleAudience || body.role || 'Toàn thể con cháu').trim().slice(0, 200),
                description: body.description ? String(body.description).trim().slice(0, 2000) : null,
                status: String(body.status || 'UPCOMING'),
                isFeatured: Boolean(body.isFeatured ?? body.featured ?? false),
            })
            .returning();

        await recordAuditLog({
            userId: auth.user?.id,
            action: 'INSERT',
            entityName: 'events',
            entityId: created.id,
            newValues: { title: created.title, eventDateSolar: created.eventDateSolar, category: created.category },
            request,
        });

        return apiSuccess(created, 'Đã thêm sự kiện dòng họ vào cơ sở dữ liệu.', 201);
    } catch (error) {
        console.error('Lỗi POST /api/events:', error);
        return apiError('Không thể tạo sự kiện mới.', 500);
    }
}
