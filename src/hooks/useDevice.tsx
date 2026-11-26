'use client';

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { DeviceInfo, DeviceGroup, DeviceType, getClientDeviceInfo } from '@/utils/deviceDetector';

const defaultDeviceInfo: DeviceInfo = {
    deviceType: 'desktop',
    deviceGroup: 'desktop',
    isMobile: false,
    isPhone: false,
    isTablet: false,
    isDesktop: true,
    isTouch: false,
};

const DeviceContext = createContext<DeviceInfo>(defaultDeviceInfo);

export function DeviceProvider({
    children,
    initialGroup,
    initialType,
}: {
    children: ReactNode;
    initialGroup?: DeviceGroup;
    initialType?: DeviceType;
}) {
    // Khởi tạo state khớp 100% với giá trị SSR từ server để tránh hydration mismatch
    const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
        const isMobileGroup = initialGroup === 'mobile';
        const isTablet = initialType === 'tablet';
        const isMobile = isMobileGroup && !isTablet;
        return {
            deviceType: initialType || (isMobileGroup ? 'mobile' : 'desktop'),
            deviceGroup: initialGroup || 'desktop',
            isMobile,
            isPhone: isMobile,
            isTablet,
            isDesktop: !isMobileGroup,
            isTouch: isMobileGroup,
        };
    });

    useEffect(() => {
        const update = () => {
            const current = getClientDeviceInfo();
            setDeviceInfo((prev) => {
                if (
                    prev.deviceType === current.deviceType &&
                    prev.deviceGroup === current.deviceGroup &&
                    prev.isTablet === current.isTablet &&
                    prev.isMobile === current.isMobile &&
                    prev.isDesktop === current.isDesktop &&
                    prev.width === current.width
                ) {
                    return prev;
                }
                return current;
            });
        };

        // Cập nhật ngay khi mount để đảm bảo đồng bộ kích thước cửa sổ hiện tại
        update();

        // Lắng nghe resize & xoay màn hình (orientationchange)
        window.addEventListener('resize', update, { passive: true });
        window.addEventListener('orientationchange', update, { passive: true });

        return () => {
            window.removeEventListener('resize', update);
            window.removeEventListener('orientationchange', update);
        };
    }, []);

    return (
        <DeviceContext.Provider value={deviceInfo}>
            {children}
        </DeviceContext.Provider>
    );
}

/**
 * Hook truy xuất thông tin thiết bị (mobile vs tablet vs desktop)
 */
export function useDevice(): DeviceInfo {
    const context = useContext(DeviceContext);
    if (!context) {
        throw new Error('useDevice must be used within a DeviceProvider');
    }
    return context;
}
