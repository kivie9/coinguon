import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/core/database/dataSource';
import { events } from '@/core/database/schema';
import { getAuthenticatedUser } from '@/utils/auth';
import { recordAuditLog } from '@/utils/auditLog';
import { apiSuccess, apiBadRequest, apiForbidden, apiNotFound, apiError } from '@/utils/apiResponse';

interface Params {
    params: Promise<{ id: string }>;
}

const VALID_CATEGORIES = ['ANNIVERSARY', 'FESTIVAL', 'EDUCATION', 'MEETING'];

/**
 * PUT /api/events/[id]
 * Cập nhật sự kiện dòng họ (Chỉ Quản Trị Viên)
 */
export async function PUT(request: NextRequest, { params }: Params) {
    try {
        const auth = await getAuthenticatedUser(request);
        if (auth.isGuest || (!auth.isAdmin && !auth.isSuperAdmin)) {
            return apiForbidden('Chỉ Quản Trị Viên mới có quyền sửa sự kiện.');
        }

        const { id } = await params;
        const eventId = parseInt(id, 10);
        if (isNaN(eventId) || eventId <= 0) {
            return apiBadRequest('ID sự kiện không hợp lệ.');
        }

        const existing = await db.query.events.findFirst({ where: eq(events.id, eventId) });
        if (!existing) {
            return apiNotFound('Không tìm thấy sự kiện trong cơ sở dữ liệu (lưu ý: ngày kỵ nhật tự động sửa tại hồ sơ thành viên).');
        }

        const body = await request.json().catch(() => ({}));
        const updateData: Partial<typeof events.$inferInsert> = {
            updatedAt: new Date(),
        };

        if (body.title !== undefined) {
            const t = String(body.title).trim();
            if (t.length < 3 || t.length > 200) return apiBadRequest('Tên sự kiện phải từ 3 đến 200 ký tự.');
            updateData.title = t;
        }
        if (body.category !== undefined && VALID_CATEGORIES.includes(body.category)) {
            updateData.category = body.category;
        }
        if (body.eventDateSolar !== undefined || body.dateSolar !== undefined) {
            const raw = String(body.eventDateSolar || body.dateSolar || '').trim();
            if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
                updateData.eventDateSolar = raw;
            } else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(raw)) {
                const [d, m, y] = raw.split('/');
                updateData.eventDateSolar = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
            }
        }
        if (body.eventDateLunar !== undefined || body.dateLunar !== undefined) {
            const lunar = String(body.eventDateLunar ?? body.dateLunar ?? '').trim();
            updateData.eventDateLunar = lunar || null;
        }
        if (body.location !== undefined) {
            updateData.location = String(body.location).trim().slice(0, 250) || existing.location;
        }
        if (body.roleAudience !== undefined || body.role !== undefined) {
            updateData.roleAudience = String(body.roleAudience ?? body.role ?? '').trim().slice(0, 200);
        }
        if (body.description !== undefined) {
            updateData.description = body.description ? String(body.description).trim().slice(0, 2000) : null;
        }
        if (body.isFeatured !== undefined || body.featured !== undefined) {
            updateData.isFeatured = Boolean(body.isFeatured ?? body.featured);
        }

        const [updated] = await db
            .update(events)
            .set(updateData)
            .where(eq(events.id, eventId))
            .returning();

        await recordAuditLog({
            userId: auth.user?.id,
            action: 'UPDATE',
            entityName: 'events',
            entityId: eventId,
            oldValues: { title: existing.title, eventDateSolar: existing.eventDateSolar },
            newValues: { title: updated.title, eventDateSolar: updated.eventDateSolar },
            request,
        });

        return apiSuccess(updated, 'Cập nhật sự kiện thành công.');
    } catch (error) {
        console.error('Lỗi PUT /api/events/[id]:', error);
        return apiError('Không thể cập nhật sự kiện.', 500);
    }
}

/**
 * DELETE /api/events/[id]
 * Xóa sự kiện dòng họ (Chỉ Quản Trị Viên)
 */
export async function DELETE(request: NextRequest, { params }: Params) {
    try {
        const auth = await getAuthenticatedUser(request);
        if (auth.isGuest || (!auth.isAdmin && !auth.isSuperAdmin)) {
            return apiForbidden('Chỉ Quản Trị Viên mới có quyền xóa sự kiện.');
        }

        const { id } = await params;
        const eventId = parseInt(id, 10);
        if (isNaN(eventId) || eventId <= 0) {
            return apiBadRequest('ID sự kiện không hợp lệ.');
        }

        const existing = await db.query.events.findFirst({ where: eq(events.id, eventId) });
        if (!existing) {
            return apiNotFound('Không tìm thấy sự kiện cần xóa.');
        }

        await db.delete(events).where(eq(events.id, eventId));

        await recordAuditLog({
            userId: auth.user?.id,
            action: 'DELETE',
            entityName: 'events',
            entityId: eventId,
            oldValues: { title: existing.title },
            request,
        });

        return apiSuccess({ id: eventId }, 'Đã xóa sự kiện thành công.');
    } catch (error) {
        console.error('Lỗi DELETE /api/events/[id]:', error);
        return apiError('Không thể xóa sự kiện.', 500);
    }
}
