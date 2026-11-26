import { apiFetch } from './apiClient';

export interface HomeDataResponse {
    eventSpotlight: {
        badge: string;
        title: string;
        lunarDate: string;
        location: string;
        attendees: string;
        invitation: string;
        daysRemaining: number;
    };
    upcomingAnniversary: {
        name: string;
        generation: string;
        shortGeneration: string;
        lunarDate: string;
        location: string;
        assignedBranch: string;
    };
    fundData: {
        title: string;
        desktopTitle: string;
        percent: number;
        balance: string;
        bankAccount: string;
        bankName: string;
        accountName: string;
    };
    familyRules: Array<{
        title: string;
        description: string;
    }>;
    newsItems: Array<{
        id: string;
        tag: string;
        tagColor: 'primary' | 'secondary';
        title: string;
        summary: string;
        fullSummary?: string;
        time: string;
        author: string;
        imageUrl: string;
        initialLikes: number;
        initialComments: number;
    }>;
    ancestralTemple: {
        name: string;
        address: string;
        manager: string;
        phone: string;
    };
    generations: string[];
}

/**
 * Lấy dữ liệu tổng hợp cho trang chủ từ API /api/home
 */
export async function fetchHomeDataApi(): Promise<HomeDataResponse | null> {
    try {
        const res = await apiFetch('/api/home', { cache: 'no-store' });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data || null;
    } catch (err) {
        console.error('Lỗi khi fetchHomeDataApi:', err);
        return null;
    }
}

