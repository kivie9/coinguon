import { NextRequest } from 'next/server';
import { fundService } from '@/services/fundService';
import { getAuthenticatedUser } from '@/utils/auth';
import { recordAuditLog } from '@/utils/auditLog';
import { apiSuccess, apiBadRequest, apiForbidden, apiError } from '@/utils/apiResponse';

/**
 * GET /api/funds
 */
export async function GET(request: NextRequest) {
    try {
        const auth = await getAuthenticatedUser(request);
        if (auth.isGuest) {
            return apiError('Vui lòng đăng nhập để xem sổ quỹ dòng họ.', 401);
        }

        const [overview, transactions] = await Promise.all([
            fundService.getOverview(),
            fundService.getTransactions(),
        ]);

        return apiSuccess({ overview, transactions }, undefined, 200, {
            isGuest: false,
            role: auth.role,
            dataSource: 'live',
        });
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu quỹ dòng họ:', error);
        return apiError('Không thể tải dữ liệu quỹ dòng họ', 500);
    }
}

/**
 * POST /api/funds
 * Ghi nhận đóng góp / thu chi quỹ mới (Chỉ Quản Trị Viên)
 */
export async function POST(request: NextRequest) {
    try {
        const auth = await getAuthenticatedUser(request);
        if (auth.isGuest || (!auth.isAdmin && !auth.isSuperAdmin)) {
            return apiForbidden('Chỉ Quản Trị Viên mới có quyền lập phiếu thu/chi quỹ dòng họ.');
        }

        const body = await request.json().catch(() => ({}));
        const title = String(body.title || '').trim();
        const contributor = String(body.contributor || '').trim();
        const type = body.type === 'EXPENSE' ? 'EXPENSE' : body.type === 'INCOME' ? 'INCOME' : null;
        const amount = Number(body.amount);

        if (!title || title.length > 200) {
            return apiBadRequest('Nội dung thu/chi không hợp lệ (tối đa 200 ký tự).');
        }
        if (!contributor || contributor.length > 120) {
            return apiBadRequest('Vui lòng nhập tên người/đơn vị đóng góp hoặc nhận chi.');
        }
        if (!type) {
            return apiBadRequest('Loại giao dịch phải là INCOME hoặc EXPENSE.');
        }
        if (!Number.isFinite(amount) || amount <= 0 || amount > 100_000_000_000) {
            return apiBadRequest('Số tiền phải lớn hơn 0 và hợp lệ.');
        }

        const newTx = await fundService.addTransaction({
            type,
            title,
            contributor,
            branch: String(body.branch || 'Bản Tộc').trim().slice(0, 100),
            amount: Math.round(amount),
            date: body.date ? String(body.date).trim() : new Date().toISOString().split('T')[0],
            note: String(body.note || '').trim().slice(0, 500),
        });

        await recordAuditLog({
            userId: auth.user?.id,
            action: 'INSERT',
            entityName: 'fund_transactions',
            entityId: newTx.dbId || 0,
            newValues: { code: newTx.id, type: newTx.type, title: newTx.title, amount: newTx.amount },
            request,
        });

        return apiSuccess(newTx, 'Ghi nhận giao dịch quỹ thành công', 201);
    } catch (error) {
        console.error('Lỗi khi tạo giao dịch quỹ:', error);
        return apiError('Không thể lưu giao dịch quỹ', 500);
    }
}
