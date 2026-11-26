'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, Heart, Share2, Check, X, ShieldCheck, ArrowLeft, Landmark } from 'lucide-react';
import { triggerHaptic } from '@/utils/haptics';
import { toast } from '@/components/ui/sonner';
import { HomeNewsItem } from '@/components/app/common/home/homeData';

interface NewsDetailModalProps {
    item: HomeNewsItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isLiked?: boolean;
    likeCount?: number;
    onToggleLike?: (id: string) => void;
}

export const NewsDetailModal = ({
    item,
    open,
    onOpenChange,
    isLiked = false,
    likeCount,
    onToggleLike,
}: NewsDetailModalProps) => {
    const [copied, setCopied] = useState(false);

    if (!item) return null;

    const count = likeCount !== undefined ? likeCount : item.initialLikes;

    const handleShare = () => {
        triggerHaptic('medium');
        if (typeof window !== 'undefined') {
            if (navigator.share) {
                navigator.share({
                    title: item.title,
                    text: item.summary,
                    url: window.location.href,
                }).catch(() => {});
            } else {
                navigator.clipboard?.writeText(window.location.href);
                setCopied(true);
                toast.success('Đã sao chép liên kết bản tin!', {
                    description: 'Bạn có thể chia sẻ liên kết này đến con cháu trong dòng họ.',
                });
                setTimeout(() => setCopied(false), 2500);
            }
        }
    };

    const handleLikeClick = () => {
        triggerHaptic('light');
        onToggleLike?.(item.id);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                className="!fixed !inset-0 !top-0 !left-0 !translate-x-0 !translate-y-0 !w-screen !h-dvh !max-w-none !max-h-none !m-0 !p-0 !rounded-none !border-none !gap-0 !ring-0 bg-surface text-on-surface flex flex-col overflow-hidden outline-none z-50 sm:!max-w-none"
            >
                <header className="sticky top-0 z-30 h-15 sm:h-16 px-4 sm:px-6 md:px-8 bg-surface-container-lowest border-b border-outline-variant/25 flex items-center justify-between gap-3 shrink-0">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onOpenChange(false)}
                            className="inline-flex items-center gap-1.5 min-h-10 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-semibold text-xs sm:text-sm cursor-pointer transition-colors duration-150"
                        >
                            <ArrowLeft className="size-4 text-primary" aria-hidden="true" />
                            <span>Quay lại</span>
                        </Button>

                        <div className="hidden md:flex items-center gap-2 text-xs text-on-surface-variant pl-2">
                            <span className="font-serif font-bold text-primary uppercase">
                                Lê Tộc Đại Tôn
                            </span>
                            <span>•</span>
                            <span>Bản Tin Di Sản &amp; Tộc Sự</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 tabular-nums">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLikeClick}
                            className={`inline-flex items-center gap-1.5 min-h-10 px-3 rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                                isLiked
                                    ? 'bg-primary/12 text-primary'
                                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                            }`}
                        >
                            <Heart className={`size-4 ${isLiked ? 'fill-current text-primary' : 'text-secondary'}`} aria-hidden="true" />
                            <span>{count}</span>
                            <span className="hidden sm:inline">Cung kính</span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleShare}
                            className="inline-flex items-center gap-1.5 min-h-10 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold cursor-pointer transition-colors duration-150"
                            title="Chia sẻ bản tin"
                        >
                            {copied ? <Check className="size-4 text-emerald-700" aria-hidden="true" /> : <Share2 className="size-4 text-secondary" aria-hidden="true" />}
                            <span className="hidden sm:inline">{copied ? 'Đã sao chép' : 'Chia sẻ'}</span>
                        </Button>

                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="size-10 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface flex items-center justify-center transition-colors duration-150 cursor-pointer"
                            aria-label="Đóng bài viết"
                        >
                            <X className="size-4.5" aria-hidden="true" />
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto select-text">
                    <article className="max-w-3xl xl:max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 space-y-6 sm:space-y-8">
                        <DialogHeader className="space-y-4 text-left">
                            <div className="flex items-center gap-2.5 flex-wrap text-xs tabular-nums">
                                <span className="px-3 py-1 rounded-md bg-secondary/15 text-secondary font-bold uppercase">
                                    {item.tag}
                                </span>
                                <span className="text-outline">•</span>
                                <span className="font-medium text-on-surface-variant flex items-center gap-1">
                                    <Clock className="size-3.5 text-secondary" aria-hidden="true" />
                                    {item.time}
                                </span>
                                <span className="text-outline">•</span>
                                <span className="text-on-surface-variant">
                                    3 phút đọc
                                </span>
                            </div>

                            <DialogTitle className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-primary leading-tight text-balance">
                                {item.title}
                            </DialogTitle>
                            <DialogDescription className="sr-only">
                                {item.summary}
                            </DialogDescription>

                            <div className="flex items-center justify-between py-4 border-y border-outline-variant/25 flex-wrap gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold font-serif text-base shrink-0">
                                        {item.author.charAt(0) || 'L'}
                                    </div>
                                    <div>
                                        <span className="font-bold text-on-surface text-sm sm:text-base block">
                                            {item.author}
                                        </span>
                                        <span className="text-xs text-on-surface-variant block">
                                            Ban Biên Tập Kỷ Yếu &amp; Tộc Sự • Lê Tộc Đại Tôn Chi II
                                        </span>
                                    </div>
                                </div>

                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-secondary text-xs font-semibold">
                                    <ShieldCheck className="size-4 text-secondary shrink-0" aria-hidden="true" />
                                    <span>Tin tộc sự chính thống</span>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="space-y-2">
                            <div className="relative w-full rounded-2xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] bg-surface-container">
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="size-full object-cover"
                                />
                            </div>
                            <p className="text-xs text-on-surface-variant italic text-center px-2">
                                Hình ảnh: {item.title} — Lưu hành tại Từ Đường Đại Tôn Chi II.
                            </p>
                        </div>

                        <div className="p-5 sm:p-6 bg-surface-container-low rounded-2xl text-on-surface text-base sm:text-lg font-serif italic leading-relaxed text-pretty">
                            &ldquo;{item.fullSummary || item.summary}&rdquo;
                        </div>

                        <div className="space-y-5 text-on-surface text-base md:text-lg leading-relaxed text-pretty">
                            {item.content && item.content.length > 0 ? (
                                item.content.map((p, idx) => (
                                    <p key={idx}>{p}</p>
                                ))
                            ) : (
                                <>
                                    <p>
                                        Sáng ngày 14 tháng Giêng năm Ất Tỵ, tại Từ Đường Đại Tôn Chi II, Hội Đồng Gia Tộc đã long trọng tổ chức hội nghị và thông báo tộc sự trọng yếu. Đây là hoạt động thường niên quy tụ đông đảo các vị bô lão, đại diện các chi phái và con cháu nội ngoại gần xa tề tựu đông đủ để cùng nhìn lại những thành quả đạt được trong năm qua.
                                    </p>
                                    <p>
                                        Ban Trị Sự nhấn mạnh tầm quan trọng của việc bảo tồn gia phong, gắn kết thế hệ trẻ với cội nguồn tổ tiên thông qua hệ thống gia phả số. Toàn thể con cháu bày tỏ lòng biết ơn sâu sắc đối với công đức cao dày của các bậc tiền nhân đã khai cơ lập nghiệp, đồng thời cam kết tiếp tục đóng góp công sức xây dựng dòng tộc ngày càng hưng thịnh, rạng danh.
                                    </p>
                                    <p>
                                        Kính chúc toàn thể quý gia đình trong dòng họ một năm mới an khang thịnh vượng, phúc lộc song toàn, con cháu thành đạt và muôn đời thơm thảo nếp nhà xưa.
                                    </p>
                                </>
                            )}
                        </div>

                        <div className="bg-surface-container-low rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-on-surface-variant">
                            <div className="flex items-center gap-3.5">
                                <div className="size-11 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                                    <Landmark className="size-5 text-secondary" aria-hidden="true" />
                                </div>
                                <div>
                                    <p className="font-serif font-bold text-primary text-sm sm:text-base">
                                        Lê Tộc Đại Tôn • Bản Tộc Trùng Tu &amp; Khuyến Học
                                    </p>
                                    <p className="text-xs text-on-surface-variant mt-0.5">
                                        Phụng sự tổ tiên • Giữ trọn gia quy muôn đời
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-secondary uppercase">
                                Lưu hành nội bộ
                            </span>
                        </div>

                        <div className="pt-4 pb-16 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-outline-variant/25 tabular-nums">
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <Button
                                    variant="ghost"
                                    onClick={handleLikeClick}
                                    className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 min-h-11 px-5 rounded-xl text-sm font-semibold transition-colors duration-150 cursor-pointer ${
                                        isLiked
                                            ? 'bg-primary/12 text-primary'
                                            : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                                    }`}
                                >
                                    <Heart className={`size-4 ${isLiked ? 'fill-current text-primary' : 'text-secondary'}`} aria-hidden="true" />
                                    <span>{count} Cung kính</span>
                                </Button>

                                <Button
                                    variant="ghost"
                                    onClick={handleShare}
                                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 min-h-11 px-5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-sm font-semibold cursor-pointer transition-colors duration-150"
                                >
                                    {copied ? <Check className="size-4 text-emerald-700" aria-hidden="true" /> : <Share2 className="size-4 text-secondary" aria-hidden="true" />}
                                    <span>{copied ? 'Đã sao chép liên kết' : 'Chia sẻ bài viết'}</span>
                                </Button>
                            </div>

                            <Button
                                onClick={() => onOpenChange(false)}
                                className="w-full sm:w-auto min-h-11 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-sm font-semibold cursor-pointer transition-colors duration-150"
                            >
                                Đóng bài viết
                            </Button>
                        </div>
                    </article>
                </main>
            </DialogContent>
        </Dialog>
    );
};
