import React from 'react';
import { AppLayout } from '@/components/app/common/layout/AppLayout';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AppLayout>{children}</AppLayout>;
}

