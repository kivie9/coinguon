import { apiFetch } from './apiClient';

export type EventCategory = 'ALL' | 'ANNIVERSARY' | 'FESTIVAL' | 'EDUCATION' | 'MEETING';

export interface EventRitualStep {
    step: number;
    time: string;
    title: string;
    description: string;
}

export interface EventContactPerson {
    name: string;
    role: string;
    phone: string;
}

export interface LineageEventDto {
    id: number;
    title: string;
    dateLunar: string;
    dateSolar: string;
    targetDate?: string;
    location: string;
    role: string;
    status: string;
    featured: boolean;
    category?: 'ANNIVERSARY' | 'FESTIVAL' | 'EDUCATION' | 'MEETING';
    description?: string;
    daysRemaining?: number;
}

export interface EventsApiResponse {
    events: LineageEventDto[];
    featuredEvent?: LineageEventDto;
    rituals: EventRitualStep[];
    contacts: EventContactPerson[];
    stats: {
        totalEvents: number;
        anniversariesCount: number;
        festivalsCount: number;
    };
}

/**
 * Lấy danh sách sự kiện dòng tộc từ API /api/events
 */
export async function fetchEventsApi(): Promise<LineageEventDto[]> {
    try {
        const res = await apiFetch('/api/events', { cache: 'no-store' });
        if (!res.ok) return [];
        const json = await res.json();
        if (Array.isArray(json.data)) {
            return json.data;
        }
        if (json.data && Array.isArray(json.data.events)) {
            return json.data.events;
        }
        return [];
    } catch (err) {
        console.error('Lỗi khi fetchEventsApi:', err);
        return [];
    }
}

/**
 * Lấy toàn bộ dữ liệu sự kiện, nghi thức và liên hệ ban khánh tiết từ API /api/events
 */
export async function fetchEventsFullApi(): Promise<EventsApiResponse | null> {
    try {
        const res = await apiFetch('/api/events', { cache: 'no-store' });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data || null;
    } catch (err) {
        console.error('Lỗi khi fetchEventsFullApi:', err);
        return null;
    }
}

