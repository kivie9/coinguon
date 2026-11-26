import { NextRequest } from 'next/server';
import { fundService } from '@/services/fundService';
import { getAuthenticatedUser } from '@/utils/auth';
import { apiSuccess, apiBadRequest, apiForbidden, apiError } from '@/utils/apiResponse';

/**
 * GET /api/funds
 * Lấy tổng quan quỹ dòng họ và lịch sử các giao dịch thu chi
 * - Khách: Xem dữ liệu Mock
 * - Đã đăng nhập: Xem số dư và giao dịch thực tế
 */
export async function GET(request: NextRequest) {
    try {
        const auth = await getAuthenticatedUser(request);

        let overview;
        let transactions;

        if (auth.isGuest) {
            overview = fundService.getOverviewSync();
            transactions = fundService.getTransactionsSync();
        } else {
            [overview, transactions] = await Promise.all([
                fundService.getOverview(),
                fundService.getTransactions(),
            ]);
        }

        return apiSuccess({ overview, transactions }, undefined, 200, {
            isGuest: auth.isGuest,
            role: auth.role,
            dataSource: auth.isGuest ? 'mock' : 'live',
        });
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu quỹ dòng họ:', error);
        return apiError('Không thể tải dữ liệu quỹ dòng họ', 500);
    }
}

/**
 * POST /api/funds
 * Ghi nhận đóng góp / thu chi quỹ mới
 */
export async function POST(request: NextRequest) {
    try {
        const auth = await getAuthenticatedUser(request);
        if (auth.isGuest) {
            return apiForbidden('Chế độ khách không thể tạo giao dịch. Vui lòng đăng nhập tài khoản.');
        }

        const body = await request.json();
        if (!body.title || !body.amount || !body.contributor || !body.type) {
            return apiBadRequest('Thiếu thông tin bắt buộc: title, amount, contributor, type');
        }

        const newTx = await fundService.addTransaction({
            type: body.type,
            title: body.title,
            contributor: body.contributor,
            branch: body.branch || 'Bản Tộc',
            amount: Number(body.amount),
            date: body.date || new Date().toISOString(),
            note: body.note || '',
        });

        return apiSuccess(newTx, 'Ghi nhận giao dịch quỹ thành công');
    } catch (error) {
        console.error('Lỗi khi tạo giao dịch quỹ:', error);
        return apiError('Không thể lưu giao dịch quỹ', 500);
    }
}

