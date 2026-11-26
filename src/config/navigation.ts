import {
    Users,
    GitFork,
    CalendarDays,
    BookOpen,
    Landmark,
    Newspaper,
    type LucideIcon,
} from 'lucide-react';

export interface NavItemConfig {
    id: string;
    href: string;
    label: string;
    subtitle?: string;
    icon: LucideIcon;
    iconColorClass?: string;
    iconBgClass?: string;
}

export interface NavSectionConfig {
    id: string;
    title: string;
    items: NavItemConfig[];
}

export const PUBLIC_NAV_ITEMS = [
    {
        id: 'home',
        href: '/',
        label: 'Tổng quan',
        shortLabel: 'Dòng Tộc',
        icon: Landmark,
    },
    {
        id: 'members',
        href: '/members',
        label: 'Phả hệ & Thành viên',
        shortLabel: 'Phả Hệ',
        icon: Users,
    },
    {
        id: 'events',
        href: '/events',
        label: 'Lịch giỗ chạp',
        shortLabel: 'Giỗ Chạp',
        icon: CalendarDays,
    },
    {
        id: 'profile',
        href: '/profile',
        label: 'Tư liệu & Hồ sơ',
        shortLabel: 'Hồ Sơ',
        icon: BookOpen,
    },
] as const;

/** Alias tương thích ngược */
export const MAIN_NAV_ITEMS = PUBLIC_NAV_ITEMS;

export const DRAWER_NAV_SECTIONS: NavSectionConfig[] = [
    {
        id: 'genealogy',
        title: 'Tra cứu & Phả hệ',
        items: [
            {
                id: 'member-list',
                href: '/members',
                label: 'Danh sách thành viên',
                subtitle: 'Xem theo thế hệ & chi phái',
                icon: Users,
                iconBgClass: 'bg-primary/10',
                iconColorClass: 'text-primary',
            },
            {
                id: 'tree-view',
                href: '/members?view=tree',
                label: 'Cây phả hệ đồ (Tree)',
                subtitle: 'Sơ đồ trực quan các nhánh',
                icon: GitFork,
                iconBgClass: 'bg-secondary/15',
                iconColorClass: 'text-secondary',
            },
            {
                id: 'death-anniversaries',
                href: '/events',
                label: 'Lịch ngày giỗ & Lễ tiết',
                subtitle: 'Âm lịch các ngày giỗ trong năm',
                icon: CalendarDays,
                iconBgClass: 'bg-secondary/15',
                iconColorClass: 'text-secondary',
            },
        ],
    },
    {
        id: 'archive',
        title: 'Tư liệu dòng tộc',
        items: [
            {
                id: 'news-archive',
                href: '/news',
                label: 'Bản tin & Tộc sự',
                subtitle: 'Tin tức việc họ, khuyến học và di sản',
                icon: Newspaper,
                iconBgClass: 'bg-primary/10',
                iconColorClass: 'text-primary',
            },
            {
                id: 'charter',
                href: '/profile',
                label: 'Tộc ước & Lời tựa',
                subtitle: 'Quy định và nề nếp gia phong',
                icon: BookOpen,
                iconBgClass: 'bg-surface-container-high',
                iconColorClass: 'text-primary',
            },
            {
                id: 'ancestral-temple',
                href: '/',
                label: 'Nhà Thờ Tổ & Từ Đường',
                subtitle: 'Lịch sử và kiến trúc nhà thờ',
                icon: Landmark,
                iconBgClass: 'bg-surface-container-high',
                iconColorClass: 'text-secondary',
            },
        ],
    },
];

