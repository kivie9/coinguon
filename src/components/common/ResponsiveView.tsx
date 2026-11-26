'use client';

import React, { ReactNode } from 'react';
import { useDevice } from '@/hooks/useDevice';

export interface ResponsiveViewProps {
    mobile: ReactNode;
    tablet?: ReactNode;
    desktop: ReactNode;
}

/**
 * Component hiển thị giao diện theo nhóm thiết bị:
 * - Mobile Phone (điện thoại)
 * - Tablet (máy tính bảng iPad / Android hoặc khi test size tablet trên PC)
 * - Desktop (máy tính để bàn / laptop)
 */
export function ResponsiveView({ mobile, tablet, desktop }: ResponsiveViewProps) {
    const { isDesktop, isTablet, isTouch, isIPad } = useDevice();

    const isRealDesktop = isDesktop && !isTablet && !isIPad && !isTouch;

    if (isRealDesktop) {
        return <>{desktop}</>;
    }

    if (isTablet && tablet) {
        return <>{tablet}</>;
    }

    return <>{mobile}</>;
}

