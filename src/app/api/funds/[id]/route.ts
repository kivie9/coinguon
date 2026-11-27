import { NextRequest } from 'next/server';
import { fundService } from '@/services/fundService';
import { getAuthenticatedUser } from '@/utils/auth';
import { recordAuditLog } from '@/utils/auditLog';
import { apiSuccess, apiBadRequest, apiForbidden, apiNotFound, apiError } from '@/utils/apiResponse';

interface Params {
    params: Promise<{ id: string }>;
}

/**
 * PUT /api/funds/[id]
 * Sửa phiếu thu/chi (Chỉ Quản Trị Viên)
 */
export async function PUT(request: NextRequest, { params }: Params) {
    try {
        const auth = await getAuthenticatedUser(request);
        if (auth.isGuest || (!auth.isAdmin && !auth.isSuperAdmin)) {
            return apiForbidden('Chỉ Quản Trị Viên mới có quyền chỉnh sửa giao dịch quỹ.');
        }

        const { id } = await params;
        const body = await request.json().catch(() => ({}));

        const patch: Record<string, unknown> = {};
        if (body.type !== undefined) {
            if (body.type !== 'INCOME' && body.type !== 'EXPENSE') {
                return apiBadRequest('Loại giao dịch phải là INCOME hoặc EXPENSE.');
            }
            patch.type = body.type;
        }
        if (body.title !== undefined) {
            const t = String(body.title).trim();
            if (!t || t.length > 200) return apiBadRequest('Nội dung thu/chi không hợp lệ.');
            patch.title = t;
        }
        if (body.contributor !== undefined) {
            const c = String(body.contributor).trim();
            if (!c || c.length > 120) return apiBadRequest('Tên người/đơn vị không hợp lệ.');
            patch.contributor = c;
        }
        if (body.amount !== undefined) {
            const amt = Number(body.amount);
            if (!Number.isFinite(amt) || amt <= 0) return apiBadRequest('Số tiền phải lớn hơn 0.');
            patch.amount = Math.round(amt);
        }
        if (body.branch !== undefined) patch.branch = String(body.branch).trim().slice(0, 100);
        if (body.note !== undefined) patch.note = String(body.note).trim().slice(0, 500);
        if (body.date !== undefined) patch.date = String(body.date).trim();

        const updated = await fundService.updateTransaction(id, patch);
        if (!updated) {
            return apiNotFound('Không tìm thấy giao dịch quỹ cần sửa.');
        }

        await recordAuditLog({
            userId: auth.user?.id,
            action: 'UPDATE',
            entityName: 'fund_transactions',
            entityId: updated.dbId || 0,
            newValues: { code: updated.id, ...patch },
            request,
        });

        return apiSuccess(updated, 'Cập nhật phiếu thu/chi thành công.');
    } catch (error) {
        console.error('Lỗi PUT /api/funds/[id]:', error);
        return apiError('Không thể cập nhật giao dịch quỹ.', 500);
    }
}

/**
 * DELETE /api/funds/[id]
 * Xóa phiếu thu/chi (Chỉ Quản Trị Viên)
 */
export async function DELETE(request: NextRequest, { params }: Params) {
    try {
        const auth = await getAuthenticatedUser(request);
        if (auth.isGuest || (!auth.isAdmin && !auth.isSuperAdmin)) {
            return apiForbidden('Chỉ Quản Trị Viên mới có quyền xóa giao dịch quỹ.');
        }

        const { id } = await params;
        const result = await fundService.deleteTransaction(id);
        if (!result.deleted) {
            return apiNotFound('Không tìm thấy giao dịch quỹ cần xóa.');
        }

        await recordAuditLog({
            userId: auth.user?.id,
            action: 'DELETE',
            entityName: 'fund_transactions',
            entityId: result.dbId || 0,
            oldValues: { code: id },
            request,
        });

        return apiSuccess({ id }, 'Đã xóa giao dịch quỹ thành công.');
    } catch (error) {
        console.error('Lỗi DELETE /api/funds/[id]:', error);
        return apiError('Không thể xóa giao dịch quỹ.', 500);
    }
}
