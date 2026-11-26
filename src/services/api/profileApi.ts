import { ClanStats, ClanCommittee, ClanLiaisonBranch } from '@/types/clanType';
import { apiFetch } from './apiClient';

export interface LineageProfileDto {
    stats: ClanStats;
    leader: {
        fullName: string;
        title: string;
        phone: string;
        avatarUrl: string;
        branch: string;
        term: string;
        generation?: string;
        bio?: string;
    };
    committees: ClanCommittee[];
    liaisonBranches: ClanLiaisonBranch[];
    ancestralHall: {
        name: string;
        address: string;
        foundedYear: string;
        area: string;
        ranking: string;
    };
    documents: Array<{
        id: string;
        title: string;
        description: string;
        updatedAt: string;
    }>;
}

/**
 * Lấy hồ sơ tư liệu dòng tộc từ API /api/profile
 */
export async function fetchProfileApi(): Promise<LineageProfileDto | null> {
    try {
        const res = await apiFetch('/api/profile', { cache: 'no-store' });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data || null;
    } catch (err) {
        console.error('Lỗi khi fetchProfileApi:', err);
        return null;
    }
}
