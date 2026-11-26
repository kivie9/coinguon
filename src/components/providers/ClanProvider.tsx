'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ClanDto } from '@/types/clanType';
import { INITIAL_CLAN_DATA } from '@/config/clanData';
import { fetchClanInfoApi, updateClanInfoApi } from '@/services/api/clanApi';

interface ClanContextType {
    clan: ClanDto;
    loading: boolean;
    refreshClan: () => Promise<void>;
    updateClan: (patch: Partial<ClanDto>) => Promise<ClanDto | null>;
}

const ClanContext = createContext<ClanContextType>({
    clan: INITIAL_CLAN_DATA,
    loading: false,
    refreshClan: async () => {},
    updateClan: async () => null,
});

interface ClanProviderProps {
    children: ReactNode;
    initialClan?: ClanDto;
}

export function ClanProvider({ children, initialClan }: ClanProviderProps) {
    const [clan, setClan] = useState<ClanDto>(initialClan || INITIAL_CLAN_DATA);
    const [loading, setLoading] = useState<boolean>(!initialClan);

    const refreshClan = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchClanInfoApi();
            if (data) {
                setClan(data);
            }
        } catch (error) {
            console.error('Lỗi khi làm mới thông tin dòng tộc:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateClan = useCallback(async (patch: Partial<ClanDto>): Promise<ClanDto | null> => {
        try {
            const updated = await updateClanInfoApi(patch);
            if (updated) {
                setClan(updated);
                return updated;
            }
            return null;
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin dòng tộc:', error);
            return null;
        }
    }, []);

    useEffect(() => {
        // Chỉ fetch từ API nếu chưa có initialClan từ Server
        if (!initialClan) {
            refreshClan();
        }
    }, [initialClan, refreshClan]);

    return (
        <ClanContext.Provider value={{ clan, loading, refreshClan, updateClan }}>
            {children}
        </ClanContext.Provider>
    );
}

/**
 * Hook tiện ích để lấy thông tin dòng tộc ở bất kỳ component nào trong ứng dụng.
 * Tự động đồng bộ với Mock API / Database.
 */
export function useClan() {
    const context = useContext(ClanContext);
    if (!context) {
        throw new Error('useClan phải được sử dụng bên trong ClanProvider');
    }
    return context;
}

