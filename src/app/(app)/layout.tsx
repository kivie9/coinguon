import React from 'react';
import { redirect } from 'next/navigation';
import { AppLayout } from '@/components/app/common/layout/AppLayout';
import { getServerAuth } from '@/utils/auth';

export const dynamic = 'force-dynamic';

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const auth = await getServerAuth();

    // Dữ liệu gia phả chỉ dành riêng cho thành viên đã đăng nhập (không hiển thị cho người ngoài)
    if (auth.isGuest) {
        redirect('/login');
    }

    return <AppLayout>{children}</AppLayout>;
}
