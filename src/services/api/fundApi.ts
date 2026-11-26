import { FundOverview, FundTransaction } from '../fundService';
import { apiFetch } from './apiClient';

export interface FundsApiResponse {
    overview: FundOverview;
    transactions: FundTransaction[];
}

/**
 * Lấy dữ liệu tổng quan quỹ và lịch sử đóng góp từ API /api/funds
 */
export async function fetchFundsApi(): Promise<FundsApiResponse | null> {
    try {
        const res = await apiFetch('/api/funds', { cache: 'no-store' });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data || null;
    } catch (err) {
        console.error('Lỗi khi fetchFundsApi:', err);
        return null;
    }
}

