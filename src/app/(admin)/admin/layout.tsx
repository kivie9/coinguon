import { Metadata } from 'next';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';

export const metadata: Metadata = {
    title: 'Quản Trị Phả Hệ | Gia Tộc Họ Lê',
    description: 'Hệ thống quản trị đinh bộ, phả ký và quỹ hương hỏa gia tộc.',
};

export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AdminLayout>{children}</AdminLayout>;
}

