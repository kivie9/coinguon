import { MemberDto } from '@/types/memberType';
import { NewMember } from '@/core/database/schema';
import { apiFetch } from './apiClient';

/**
 * Gọi API GET /api/members để lấy danh sách thành viên
 */
export async function fetchMembersApi(params?: {
    generation?: number;
    search?: string;
}): Promise<MemberDto[]> {
    try {
        const searchParams = new URLSearchParams();
        if (params?.generation) searchParams.set('generation', String(params.generation));
        if (params?.search) searchParams.set('search', params.search);

        const query = searchParams.toString();
        const url = `/api/members${query ? `?${query}` : ''}`;

        const res = await apiFetch(url, { cache: 'no-store' });
        if (!res.ok) return [];
        const json = await res.json();
        return json.data || [];
    } catch (error) {
        console.error('Lỗi khi fetchMembersApi:', error);
        return [];
    }
}

/**
 * Gọi API GET /api/members/[id] để lấy hồ sơ chi tiết một thành viên
 */
export async function fetchMemberByIdApi(id: number): Promise<MemberDto | null> {
    try {
        const res = await apiFetch(`/api/members/${id}`, { cache: 'no-store' });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data || null;
    } catch (error) {
        console.error(`Lỗi khi fetchMemberByIdApi(${id}):`, error);
        return null;
    }
}

/**
 * Gọi API POST /api/members để tạo mới thành viên
 */
export async function createMemberApi(data: Partial<NewMember>): Promise<{ success: boolean; data?: unknown; message?: string }> {
    try {
        const res = await apiFetch('/api/members', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await res.json();
    } catch (error) {
        console.error('Lỗi khi createMemberApi:', error);
        return { success: false, message: 'Lỗi mạng khi kết nối tới máy chủ.' };
    }
}

/**
 * Gọi API PUT /api/members/[id] để cập nhật thông tin thành viên
 */
export async function updateMemberApi(id: number, data: Partial<NewMember>): Promise<{ success: boolean; data?: unknown; message?: string }> {
    try {
        const res = await apiFetch(`/api/members/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await res.json();
    } catch (error) {
        console.error(`Lỗi khi updateMemberApi(${id}):`, error);
        return { success: false, message: 'Lỗi mạng khi kết nối tới máy chủ.' };
    }
}

/**
 * Gọi API DELETE /api/members/[id] để xoá thành viên
 */
export async function deleteMemberApi(id: number): Promise<{ success: boolean; message?: string }> {
    try {
        const res = await apiFetch(`/api/members/${id}`, {
            method: 'DELETE',
        });
        return await res.json();
    } catch (error) {
        console.error(`Lỗi khi deleteMemberApi(${id}):`, error);
        return { success: false, message: 'Lỗi mạng khi kết nối tới máy chủ.' };
    }
}

/**
 * Gọi API GET /api/relationships để tính toán vai vế
 */
export async function checkRelationshipApi(fromId: number, toId: number): Promise<string> {
    try {
        const res = await apiFetch(`/api/relationships?from=${fromId}&to=${toId}`);
        const json = await res.json();
        return json.title || 'Đang cập nhật vai vế...';
    } catch (error) {
        console.error('Lỗi khi checkRelationshipApi:', error);
        return 'Lỗi tra cứu vai vế';
    }
}

/**
 * Gọi API GET /api/members/generations để lấy danh sách các đời/thế hệ động từ CSDL
 */
export async function fetchGenerationsApi(): Promise<{
    generations: number[];
    stats: Array<{ generation: number; roman: string; title: string; badge: string; count: number }>;
}> {
    try {
        const res = await apiFetch('/api/members/generations', { cache: 'no-store' });
        if (!res.ok) return { generations: [], stats: [] };
        const json = await res.json();
        return json.data || { generations: [], stats: [] };
    } catch (error) {
        console.error('Lỗi khi fetchGenerationsApi:', error);
        return { generations: [], stats: [] };
    }
}

