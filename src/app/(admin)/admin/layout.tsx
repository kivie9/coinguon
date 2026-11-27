import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { getServerAuth } from '@/utils/auth';

export const metadata: Metadata = {
    title: 'Quản Trị Phả Hệ | Gia Tộc Họ Lê',
    description: 'Hệ thống quản trị đinh bộ, phả ký và quỹ hương hỏa gia tộc.',
};

export default async function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const auth = await getServerAuth();

    // Chưa đăng nhập -> tự động chuyển về trang đăng nhập
    if (auth.isGuest) {
        redirect('/login?redirect=/admin');
    }

    // Đã đăng nhập nhưng không có quyền quản trị
    if (!auth.isAdmin) {
        return (
            <div className="min-h-dvh bg-surface flex flex-col items-center justify-center p-4 antialiased text-on-surface">
                <div className="max-w-md w-full bg-surface-container-lowest rounded-2xl p-6 sm:p-8 text-center space-y-5">
                    <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                        <ShieldAlert className="size-7" aria-hidden="true" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-xl font-bold font-serif text-primary text-balance">
                            Không Có Quyền Quản Trị
                        </h1>
                        <p className="text-sm text-on-surface-variant leading-relaxed text-pretty">
                            Khu vực này dành riêng cho Ban Quản Trị dòng họ (Trưởng tộc, Trưởng chi) và Quản trị viên tối cao.
                        </p>
                    </div>

                    <div className="p-3.5 bg-surface-container-low rounded-xl text-left text-xs sm:text-sm text-on-surface-variant text-pretty">
                        Tài khoản hiện tại của bạn chưa được cấp quyền quản trị hệ thống. Vui lòng liên hệ Trưởng tộc hoặc Admin tối cao.
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-1.5 w-full min-h-11 px-4 bg-primary text-on-primary hover:bg-primary-container rounded-xl font-semibold text-sm transition-colors duration-150"
                        >
                            <ArrowLeft className="size-4" aria-hidden="true" />
                            <span>Trở về Trang Phả Hệ</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return <AdminLayout>{children}</AdminLayout>;
}
