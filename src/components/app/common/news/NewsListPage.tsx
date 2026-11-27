'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
    BookOpen,
    Search,
    X,
    Clock,
    Heart,
    MessageSquare,
    Share2,
    ChevronRight,
    Newspaper,
    Award,
    Hammer,
    ScrollText,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HOME_NEWS_ITEMS, HomeNewsItem } from '@/components/app/common/home/homeData';
import { NewsDetailModal } from '@/components/app/common/news/NewsDetailModal';
import { triggerHaptic } from '@/utils/haptics';
import { toast } from '@/components/ui/sonner';
import { useClan } from '@/components/providers/ClanProvider';
import { apiFetch } from '@/services/api/apiClient';

interface DbNewsRow {
    id: number;
    title: string;
    tag: string;
    tagColor?: string | null;
    summary: string;
    content: string;
    thumbnailUrl?: string | null;
    authorName?: string | null;
    likesCount?: number;
    commentsCount?: number;
    publishedAt?: string;
}

export const NewsListPage = () => {
    const { clan } = useClan();
    const [newsItems, setNewsItems] = useState<HomeNewsItem[]>(HOME_NEWS_ITEMS);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string>('all');
    const [selectedNews, setSelectedNews] = useState<HomeNewsItem | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        let active = true;
        apiFetch('/api/news', { cache: 'no-store' })
            .then((res) => (res.ok ? res.json() : null))
            .then((json) => {
                if (!active || !Array.isArray(json?.data) || json.data.length === 0) return;
                const mapped: HomeNewsItem[] = (json.data as DbNewsRow[]).map((row) => ({
                    id: `db-${row.id}`,
                    tag: row.tag || 'Thông báo',
                    tagColor: row.tagColor === 'secondary' ? 'secondary' : 'primary',
                    title: row.title,
                    summary: row.summary,
                    fullSummary: row.summary,
                    content: row.content
                        .split(/\n+/)
                        .map((p) => p.trim())
                        .filter(Boolean),
                    time: row.publishedAt
                        ? new Intl.DateTimeFormat('vi-VN').format(new Date(row.publishedAt))
                        : 'Mới đăng',
                    author: row.authorName || 'Ban Trị Sự',
                    imageUrl: row.thumbnailUrl || HOME_NEWS_ITEMS[0].imageUrl,
                    initialLikes: row.likesCount ?? 0,
                    initialComments: row.commentsCount ?? 0,
                }));
                setNewsItems([...mapped, ...HOME_NEWS_ITEMS]);
            })
            .catch(() => {});
        return () => {
            active = false;
        };
    }, []);

    const [likeMap, setLikeMap] = useState<Record<string, { count: number; liked: boolean }>>(() => {
        const initial: Record<string, { count: number; liked: boolean }> = {};
        HOME_NEWS_ITEMS.forEach((item) => {
            initial[item.id] = { count: item.initialLikes, liked: false };
        });
        return initial;
    });

    const toggleLike = (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        triggerHaptic('light');
        setLikeMap((prev) => {
            const current = prev[id] || { count: 0, liked: false };
            const nextLiked = !current.liked;
            return {
                ...prev,
                [id]: {
                    count: nextLiked ? current.count + 1 : current.count - 1,
                    liked: nextLiked,
                },
            };
        });
    };

    const handleShare = (item: HomeNewsItem, e: React.MouseEvent) => {
        e.stopPropagation();
        triggerHaptic('medium');
        if (typeof window !== 'undefined') {
            if (navigator.share) {
                navigator
                    .share({
                        title: item.title,
                        text: item.summary,
                        url: window.location.href,
                    })
                    .catch(() => {});
            } else {
                navigator.clipboard?.writeText(window.location.href);
                toast.success('Đã sao chép liên kết bản tin!', {
                    description: `Đã lưu liên kết bài viết "${item.title}" vào bộ nhớ tạm.`,
                });
            }
        }
    };

    const handleOpenNews = (item: HomeNewsItem) => {
        triggerHaptic('selection');
        setSelectedNews(item);
        setModalOpen(true);
    };

    const categories = [
        { id: 'all', label: 'Tất cả', icon: Newspaper },
        { id: 'Khuyến Học', label: 'Khuyến Học', icon: Award },
        { id: 'Trùng Tu Di Sản', label: 'Trùng Tu Di Sản', icon: Hammer },
        { id: 'Văn Hóa Dòng Tộc', label: 'Văn Hóa Dòng Tộc', icon: ScrollText },
        { id: 'Gia Quy & Phong Tục', label: 'Gia Quy & Phong Tục', icon: Users },
    ];

    const filteredNews = useMemo(() => {
        return newsItems.filter((item) => {
            const matchesTag = selectedTag === 'all' || item.tag.toLowerCase() === selectedTag.toLowerCase();
            const q = searchQuery.toLowerCase().trim();
            const matchesQuery =
                !q ||
                item.title.toLowerCase().includes(q) ||
                item.summary.toLowerCase().includes(q) ||
                item.author.toLowerCase().includes(q) ||
                (item.content && item.content.some((c) => c.toLowerCase().includes(q)));
            return matchesTag && matchesQuery;
        });
    }, [newsItems, searchQuery, selectedTag]);

    const totalInteractions = useMemo(() => {
        return Object.values(likeMap).reduce((acc, curr) => acc + curr.count, 0) +
            HOME_NEWS_ITEMS.reduce((acc, curr) => acc + curr.initialComments, 0);
    }, [likeMap]);

    const featuredNews = selectedTag === 'all' && !searchQuery.trim() ? HOME_NEWS_ITEMS[0] : null;
    const regularNews = featuredNews ? filteredNews.filter((n) => n.id !== featuredNews.id) : filteredNews;

    return (
        <div className="flex flex-col gap-6 w-full text-on-surface">
            {/* 1. BREADCRUMB */}
            <div className="flex items-center justify-between text-xs text-on-surface-variant select-none">
                <nav aria-label="Đường dẫn" className="flex items-center gap-1.5 flex-wrap">
                    <Link href="/" className="hover:text-primary transition-colors duration-150">
                        Trang Chủ
                    </Link>
                    <span>/</span>
                    <span className="font-semibold text-primary">Bản Tin &amp; Tộc Sự</span>
                </nav>
                <span className="text-xs font-semibold text-secondary tabular-nums">
                    {HOME_NEWS_ITEMS.length} bài viết • {totalInteractions}+ tương tác
                </span>
            </div>

            {/* 2. HERO BANNER PHẲNG */}
            <div className="rounded-2xl bg-primary text-on-primary p-6 sm:p-8 select-none">
                <div className="flex flex-col gap-3 max-w-3xl">
                    <p className="text-secondary-fixed text-xs font-bold uppercase">
                        Ấn Bản Thông Tri Dòng Tộc
                    </p>

                    <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-on-primary leading-tight text-balance">
                        Bản Tin Di Sản &amp; Tộc Sự
                    </h1>

                    <p className="text-sm text-on-primary/85 leading-relaxed text-pretty">
                        Kênh thông tin chính thức ghi nhận các hoạt động việc họ, đại lễ tế tổ thường niên, khuyến học khuyến tài và trùng tu di sản Từ Đường {clan.name}.
                    </p>
                </div>
            </div>

            {/* 3. TOOLBAR: TÌM KIẾM & BỘ LỌC */}
            <div className="flex flex-col gap-3.5 bg-surface-container-lowest p-4 sm:p-5 rounded-2xl select-none">
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary">
                        <Search className="size-4 text-secondary" aria-hidden="true" />
                    </div>
                    <input
                        type="text"
                        aria-label="Tìm kiếm bài viết"
                        placeholder="Tìm kiếm bài viết theo tiêu đề, tác giả, nội dung sự kiện..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-11 pl-10 pr-10 bg-surface text-on-surface text-sm rounded-xl border border-outline-variant/60 placeholder:text-outline focus:outline-none focus:border-primary transition-colors duration-150"
                    />
                    {searchQuery && (
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => setSearchQuery('')}
                            aria-label="Xóa tìm kiếm"
                            className="absolute inset-y-0 right-0 my-auto mr-3 text-outline hover:text-primary transition-colors duration-150 cursor-pointer"
                        >
                            <X className="size-4" aria-hidden="true" />
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = selectedTag === cat.id;
                        return (
                            <Button
                                key={cat.id}
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    triggerHaptic('selection');
                                    setSelectedTag(cat.id);
                                }}
                                className={`min-h-9 px-3.5 rounded-lg text-xs font-semibold shrink-0 transition-colors duration-150 cursor-pointer flex items-center gap-1.5 tabular-nums ${
                                    isSelected
                                        ? 'bg-primary text-on-primary hover:bg-primary hover:text-on-primary'
                                        : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'
                                }`}
                            >
                                <Icon className="size-3.5" aria-hidden="true" />
                                <span>{cat.label}</span>
                                {cat.id === 'all' && (
                                    <span className="opacity-80">({HOME_NEWS_ITEMS.length})</span>
                                )}
                            </Button>
                        );
                    })}
                </div>
            </div>

            {/* 4. SPOTLIGHT FEATURED ARTICLE */}
            {featuredNews && (
                <div
                    onClick={() => handleOpenNews(featuredNews)}
                    className="group bg-surface-container-lowest rounded-2xl overflow-hidden cursor-pointer select-none grid grid-cols-1 lg:grid-cols-12 items-stretch"
                >
                    <div className="lg:col-span-7 h-56 sm:h-72 lg:h-full relative overflow-hidden bg-surface-container">
                        <img
                            src={featuredNews.imageUrl}
                            alt={featuredNews.title}
                            className="size-full object-cover"
                        />
                        <span className="absolute top-4 left-4 px-3 py-1 rounded-md text-xs font-bold bg-primary text-on-primary">
                            Tiêu Điểm • {featuredNews.tag}
                        </span>
                    </div>

                    <div className="lg:col-span-5 p-6 sm:p-7 md:p-8 flex flex-col justify-between gap-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2.5 text-xs text-on-surface-variant tabular-nums">
                                <span className="font-semibold text-primary">{featuredNews.author}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Clock className="size-3.5 text-secondary" aria-hidden="true" />
                                    {featuredNews.time}
                                </span>
                            </div>

                            <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary group-hover:text-primary-container transition-colors duration-150 leading-snug text-balance">
                                {featuredNews.title}
                            </h2>

                            <p className="text-sm text-on-surface-variant line-clamp-3 leading-relaxed text-pretty">
                                {featuredNews.summary}
                            </p>
                        </div>

                        <div className="pt-4 border-t border-outline-variant/25 flex items-center justify-between tabular-nums">
                            <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                                <Button
                                    variant="ghost"
                                    size="xs"
                                    onClick={(e) => toggleLike(featuredNews.id, e)}
                                    className={`min-h-8 px-2.5 rounded-lg flex items-center gap-1.5 transition-colors duration-150 cursor-pointer ${
                                        likeMap[featuredNews.id]?.liked
                                            ? 'text-primary bg-primary/10 font-bold'
                                            : 'hover:text-primary'
                                    }`}
                                >
                                    <Heart
                                        className={`size-4 ${
                                            likeMap[featuredNews.id]?.liked ? 'fill-current' : ''
                                        }`}
                                        aria-hidden="true"
                                    />
                                    <span>{likeMap[featuredNews.id]?.count || featuredNews.initialLikes}</span>
                                </Button>

                                <div className="flex items-center gap-1">
                                    <MessageSquare className="size-4" aria-hidden="true" />
                                    <span>{featuredNews.initialComments}</span>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={(e) => handleShare(featuredNews, e)}
                                    aria-label="Chia sẻ bài viết tiêu điểm"
                                    className="size-8 rounded-lg hover:text-primary transition-colors duration-150 cursor-pointer"
                                    title="Chia sẻ"
                                >
                                    <Share2 className="size-4" aria-hidden="true" />
                                </Button>
                            </div>

                            <div className="inline-flex items-center gap-1 text-xs font-bold text-primary">
                                <span>Đọc toàn văn</span>
                                <ChevronRight className="size-4" aria-hidden="true" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 5. DANH SÁCH BÀI VIẾT */}
            {regularNews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 select-none">
                    {regularNews.map((item) => {
                        const likeState = likeMap[item.id] || { count: item.initialLikes, liked: false };
                        return (
                            <article
                                key={item.id}
                                onClick={() => handleOpenNews(item)}
                                className="bg-surface-container-lowest rounded-2xl overflow-hidden flex flex-col group cursor-pointer hover:bg-surface-container-low/40 transition-colors duration-150"
                            >
                                <div className="w-full h-48 relative overflow-hidden bg-surface-container">
                                    <img
                                        className="size-full object-cover"
                                        alt={item.title}
                                        src={item.imageUrl}
                                        loading="lazy"
                                    />
                                    <span
                                        className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-bold ${
                                            item.tagColor === 'primary'
                                                ? 'bg-primary text-on-primary'
                                                : 'bg-secondary text-on-secondary'
                                        }`}
                                    >
                                        {item.tag}
                                    </span>
                                </div>

                                <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs text-on-surface-variant tabular-nums">
                                            <span className="font-semibold text-primary">{item.author}</span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="size-3.5 text-secondary" aria-hidden="true" />
                                                {item.time}
                                            </span>
                                        </div>

                                        <h3 className="font-serif text-base font-bold text-on-surface group-hover:text-primary transition-colors duration-150 line-clamp-2 leading-snug text-balance">
                                            {item.title}
                                        </h3>

                                        <p className="text-xs sm:text-sm text-on-surface-variant line-clamp-2 leading-relaxed text-pretty">
                                            {item.summary}
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t border-outline-variant/25 flex items-center justify-between text-xs text-on-surface-variant tabular-nums">
                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="ghost"
                                                size="xs"
                                                onClick={(e) => toggleLike(item.id, e)}
                                                className={`min-h-8 px-2 rounded-lg flex items-center gap-1 transition-colors duration-150 cursor-pointer ${
                                                    likeState.liked
                                                        ? 'text-primary bg-primary/10 font-bold'
                                                        : 'hover:text-primary'
                                                }`}
                                            >
                                                <Heart
                                                    className={`size-3.5 ${
                                                        likeState.liked ? 'fill-current' : ''
                                                    }`}
                                                    aria-hidden="true"
                                                />
                                                <span>{likeState.count}</span>
                                            </Button>

                                            <div className="flex items-center gap-1">
                                                <MessageSquare className="size-3.5" aria-hidden="true" />
                                                <span>{item.initialComments}</span>
                                            </div>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="icon-xs"
                                            onClick={(e) => handleShare(item, e)}
                                            aria-label={`Chia sẻ bài viết ${item.title}`}
                                            className="size-8 rounded-lg hover:text-primary transition-colors duration-150 cursor-pointer"
                                            title="Chia sẻ bài viết"
                                        >
                                            <Share2 className="size-3.5" aria-hidden="true" />
                                        </Button>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            ) : (
                <div className="p-10 text-center bg-surface-container-lowest rounded-2xl text-on-surface-variant text-sm select-none">
                    <BookOpen className="size-10 text-secondary mx-auto mb-2" aria-hidden="true" />
                    <p className="font-serif font-bold text-primary text-lg text-balance">Không tìm thấy bài viết nào</p>
                    <p className="text-sm text-on-surface-variant mt-1 max-w-sm mx-auto text-pretty">
                        Không có bản tin nào khớp với từ khóa &ldquo;{searchQuery}&rdquo; trong chuyên mục đang chọn.
                    </p>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedTag('all');
                        }}
                        className="mt-4 min-h-10 px-4 rounded-xl bg-surface-container text-xs font-semibold text-primary hover:bg-surface-container-high transition-colors duration-150 cursor-pointer"
                    >
                        Đặt lại tất cả bộ lọc
                    </Button>
                </div>
            )}

            <NewsDetailModal
                item={selectedNews}
                open={modalOpen}
                onOpenChange={setModalOpen}
                isLiked={selectedNews ? likeMap[selectedNews.id]?.liked : false}
                likeCount={selectedNews ? likeMap[selectedNews.id]?.count : undefined}
                onToggleLike={toggleLike}
            />
        </div>
    );
};
