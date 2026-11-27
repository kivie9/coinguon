'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Menu,
    Bell,
    Globe,
    ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AdminSidebar } from './AdminSidebar';
import { UserMenu } from '@/components/auth/UserMenu';
import { FontSizeToggle } from '@/components/common/FontSizeToggle';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
    '/admin': {
        title: 'Tổng Quan Bảng Điều Khiển',
        subtitle: 'Thống kê tình hình nhân khẩu, phả ký và ngân quỹ dòng tộc',
    },
    '/admin/members': {
        title: 'Quản Lý Danh Sách Thành Viên',
        subtitle: 'Thêm mới, sửa đổi, tra cứu thông tin đinh bộ và các thế hệ',
    },
    '/admin/funds': {
        title: 'Quản Lý Quỹ Dòng Họ',
        subtitle: 'Theo dõi thu chi, đóng góp hương hỏa và xây dựng nhà thờ họ',
    },
    '/admin/events': {
        title: 'Quản Lý Sự Kiện & Giỗ Chạp',
        subtitle: 'Lập kế hoạch ngày giỗ tổ, lễ hội dòng họ và việc hiếu hỷ',
    },
    '/admin/news': {
        title: 'Quản Lý Tin Tức & Thông Báo',
        subtitle: 'Đăng tin họp họ, tuyên dương khuyến học và thông báo hiếu hỷ',
    },
    '/admin/clan': {
        title: 'Cài Đặt Thông Tin Dòng Họ',
        subtitle: 'Cập nhật tên đại tôn, tôn chỉ, thông tin từ đường và lời giới thiệu',
    },
    '/admin/users': {
        title: 'Quản Lý Người Dùng & Phân Quyền',
        subtitle: 'Kiểm soát tài khoản, duyệt thành viên mới và phân quyền quản trị',
    },
};

export function AdminHeader() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const currentPage = PAGE_TITLES[pathname] || {
        title: 'Trang Quản Trị',
        subtitle: 'Hệ thống quản lý phả hệ dòng tộc',
    };

    return (
        <header className="sticky top-0 z-30 h-16 bg-surface-container-lowest border-b border-outline-variant/25 px-4 md:px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="lg:hidden">
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger
                            render={
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Mở menu quản trị"
                                    className="size-10 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface"
                                >
                                    <Menu className="size-5" aria-hidden="true" />
                                </Button>
                            }
                        />
                        <SheetContent side="left" className="p-0 w-72 bg-tertiary border-0">
                            <AdminSidebar onCloseMobile={() => setMobileOpen(false)} />
                        </SheetContent>
                    </Sheet>
                </div>

                <div>
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-on-surface-variant">
                        <span>Quản trị</span>
                        <ChevronRight className="size-3" aria-hidden="true" />
                        <span className="text-primary font-semibold">{currentPage.title}</span>
                    </div>
                    <h1 className="font-serif text-base sm:text-lg font-bold text-primary leading-tight">
                        {currentPage.title}
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <FontSizeToggle compact />

                <Link
                    href="/"
                    className="hidden sm:inline-flex items-center gap-2 min-h-10 text-xs font-semibold px-3.5 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary transition-colors duration-150"
                >
                    <Globe className="size-4 text-secondary" aria-hidden="true" />
                    <span>Xem Trang Gia Phả</span>
                </Link>

                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Thông báo hệ thống"
                    className="relative size-10 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant"
                    title="Thông báo hệ thống"
                >
                    <Bell className="size-4.5" aria-hidden="true" />
                    <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-primary" aria-hidden="true" />
                </Button>

                <UserMenu />
            </div>
        </header>
    );
}
