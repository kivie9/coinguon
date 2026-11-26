'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type NavigationTab = 'clan' | 'tree' | 'events' | 'profile';

interface NavigationContextType {
    activeTab: NavigationTab;
    setActiveTab: (tab: NavigationTab) => void;
    menuOpen: boolean;
    setMenuOpen: (open: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType>({
    activeTab: 'clan',
    setActiveTab: () => {},
    menuOpen: false,
    setMenuOpen: () => {},
});

export const NavigationProvider = ({
    children,
    initialTab = 'clan',
}: {
    children: ReactNode;
    initialTab?: NavigationTab;
}) => {
    const [activeTab, setActiveTabState] = useState<NavigationTab>(initialTab);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    // Đồng bộ tab từ URL search params khi load trên client
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const tabParam = params.get('tab') as NavigationTab;
            if (tabParam && ['clan', 'tree', 'events', 'profile'].includes(tabParam)) {
                setActiveTabState(tabParam);
            }
        }
    }, []);

    const setActiveTab = (tab: NavigationTab) => {
        setActiveTabState(tab);
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('tab', tab);
            window.history.replaceState(null, '', url.pathname + url.search);
        }
    };

    return (
        <NavigationContext.Provider
            value={{ activeTab, setActiveTab, menuOpen, setMenuOpen }}
        >
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => useContext(NavigationContext);
