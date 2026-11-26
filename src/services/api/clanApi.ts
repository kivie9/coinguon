import { ClanDto } from '@/types/clanType';
import { apiFetch } from './apiClient';

/**
 * Lấy toàn bộ thông tin dòng họ & cấu hình hệ thống từ API /api/clan
 */
export async function fetchClanInfoApi(): Promise<ClanDto | null> {
    try {
        const res = await apiFetch('/api/clan', { cache: 'no-store' });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data || null;
    } catch (err) {
        console.error('Lỗi khi fetchClanInfoApi:', err);
        return null;
    }
}

/**
 * Cập nhật cấu hình thông tin dòng tộc lên API /api/clan (Admin CMS)
 */
export async function updateClanInfoApi(patch: Partial<ClanDto>): Promise<ClanDto | null> {
    try {
        const res = await apiFetch('/api/clan', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patch),
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data || null;
    } catch (err) {
        console.error('Lỗi khi updateClanInfoApi:', err);
        return null;
    }
}

