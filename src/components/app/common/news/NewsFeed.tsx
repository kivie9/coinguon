'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, ChevronRight, Clock, Heart, MessageSquare, ChevronDown } from 'lucide-react';
import { triggerHaptic } from '@/utils/haptics';
import { Button } from '@/components/ui/button';
import { HOME_NEWS_ITEMS, HomeNewsItem } from '@/components/app/common/home/homeData';
import { NewsDetailModal } from '@/components/app/common/news/NewsDetailModal';

export interface NewsFeedProps {
    title?: string;
    viewAllHref?: string;
    items?: HomeNewsItem[];
    columns?: 2 | 3;
    maxInitialDisplay?: number;
    className?: string;
}

export const NewsFeed = ({
    title = 'Bản Tin Di Sản & Tộc Sự',
    viewAllHref = '/news',
    items = HOME_NEWS_ITEMS,
    columns = 2,
    maxInitialDisplay = 4,
    className = '',
}: NewsFeedProps) => {
    const [selectedNews, setSelectedNews] = useState<HomeNewsItem | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [showAll, setShowAll] = useState(false);

    const [likeMap, setLikeMap] = useState<Record<string, { count: number; liked: boolean }>>(() => {
        const initial: Record<string, { count: number; liked: boolean }> = {};
        items.forEach((item) => {
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

    const handleOpenNews = (item: HomeNewsItem) => {
        triggerHaptic('selection');
        setSelectedNews(item);
        setModalOpen(true);
    };

    const displayedItems = showAll ? items : items.slice(0, maxInitialDisplay);

    return (
        <section className={`flex flex-col gap-4 select-none ${className}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <BookOpen className="size-4 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-primary text-balance">
                        {title}
                    </h3>
                </div>

                <Link
                    href={viewAllHref}
                    onClick={() => triggerHaptic('selection')}
                    className="text-xs sm:text-sm font-bold text-primary hover:text-primary-container flex items-center gap-1 cursor-pointer transition-colors duration-150"
                >
                    <span>Xem tất cả</span>
                    <ChevronRight className="size-4" aria-hidden="true" />
                </Link>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-2 ${columns === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-4 sm:gap-5`}>
                {displayedItems.map((item) => {
                    const likeState = likeMap[item.id] || { count: item.initialLikes, liked: false };
                    return (
                        <article
                            key={item.id}
                            onClick={() => handleOpenNews(item)}
                            className="bg-surface-container-lowest rounded-2xl overflow-hidden flex flex-col group cursor-pointer transition-colors duration-150 hover:bg-surface-container-low/40"
                        >
                            <div className="w-full h-44 sm:h-48 relative overflow-hidden bg-surface-container">
                                <img
                                    className="size-full object-cover"
                                    alt={item.title}
                                    src={item.imageUrl}
                                    loading="lazy"
                                />
                                <span
                                    className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-md ${
                                        item.tagColor === 'primary'
                                            ? 'bg-primary text-on-primary'
                                            : 'bg-secondary text-on-secondary'
                                    }`}
                                >
                                    {item.tag}
                                </span>
                            </div>

                            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
                                <div>
                                    <h4 className="font-serif font-bold text-base text-on-surface group-hover:text-primary transition-colors duration-150 leading-snug line-clamp-2 text-balance">
                                        {item.title}
                                    </h4>
                                    <p className="text-xs sm:text-sm text-on-surface-variant line-clamp-2 sm:line-clamp-3 leading-relaxed mt-2 text-pretty">
                                        {item.fullSummary || item.summary}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-outline-variant/25 text-xs text-on-surface-variant tabular-nums">
                                    <span className="flex items-center gap-1.5 truncate max-w-[160px] sm:max-w-none">
                                        <Clock className="size-3.5 text-secondary shrink-0" aria-hidden="true" />
                                        <span className="truncate">{item.time} • {item.author}</span>
                                    </span>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <button
                                            type="button"
                                            onClick={(e) => toggleLike(item.id, e)}
                                            aria-label={`Thích bài viết ${item.title}`}
                                            className={`flex items-center gap-1 text-xs transition-colors duration-150 p-1 -m-1 rounded cursor-pointer ${
                                                likeState.liked
                                                    ? 'text-primary font-bold'
                                                    : 'text-on-surface-variant hover:text-primary'
                                            }`}
                                        >
                                            <Heart
                                                className={`size-3.5 ${
                                                    likeState.liked ? 'fill-primary text-primary' : ''
                                                }`}
                                                aria-hidden="true"
                                            />
                                            <span>{likeState.count}</span>
                                        </button>
                                        <span className="flex items-center gap-1 text-xs text-on-surface-variant">
                                            <MessageSquare className="size-3.5" aria-hidden="true" />
                                            <span>{item.initialComments}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            {items.length > maxInitialDisplay && (
                <div className="flex justify-center pt-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            triggerHaptic('light');
                            setShowAll(!showAll);
                        }}
                        className="rounded-xl min-h-10 px-5 text-xs sm:text-sm font-semibold text-primary bg-surface-container-low hover:bg-surface-container transition-colors duration-150 cursor-pointer flex items-center gap-1.5 tabular-nums"
                    >
                        <span>{showAll ? 'Thu gọn bớt tin tức' : `Xem thêm ${items.length - maxInitialDisplay} bản tin khác`}</span>
                        <ChevronDown className={`size-4 text-primary transition-transform duration-150 ${showAll ? 'rotate-180' : ''}`} aria-hidden="true" />
                    </Button>
                </div>
            )}

            <NewsDetailModal
                item={selectedNews}
                open={modalOpen}
                onOpenChange={setModalOpen}
                isLiked={selectedNews ? (likeMap[selectedNews.id]?.liked || false) : false}
                likeCount={selectedNews ? (likeMap[selectedNews.id]?.count ?? selectedNews.initialLikes) : undefined}
                onToggleLike={toggleLike}
            />
        </section>
    );
};
