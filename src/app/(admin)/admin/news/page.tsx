'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Newspaper, PlusCircle, Pencil, Trash2, Pin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from '@/components/ui/table';
import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';
import { apiFetch } from '@/services/api/apiClient';

interface NewsArticleRow {
    id: number;
    title: string;
    tag: string;
    summary: string;
    content: string;
    authorName: string | null;
    isPinned: boolean;
    publishedAt: string;
}

export default function AdminNewsPage() {
    const [articles, setArticles] = useState<NewsArticleRow[]>([]);
    const [loading, setLoading] = useState(true);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<NewsArticleRow | null>(null);
    const [saving, setSaving] = useState(false);

    const [title, setTitle] = useState('');
    const [tag, setTag] = useState('Thông báo');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [authorName, setAuthorName] = useState('Ban Trị Sự');
    const [isPinned, setIsPinned] = useState(false);

    const [deletingItem, setDeletingItem] = useState<NewsArticleRow | null>(null);
    const [deleting, setDeleting] = useState(false);

    const loadNews = useCallback(async () => {
        try {
            setLoading(true);
            const res = await apiFetch('/api/news', { cache: 'no-store' });
            if (res.ok) {
                const json = await res.json();
                setArticles(json.data || []);
            }
        } catch {
            toast.error('Không thể tải danh sách bản tin.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadNews();
    }, [loadNews]);

    const openCreate = () => {
        setEditing(null);
        setTitle('');
        setTag('Thông báo');
        setSummary('');
        setContent('');
        setAuthorName('Ban Trị Sự');
        setIsPinned(false);
        setDialogOpen(true);
    };

    const openEdit = (item: NewsArticleRow) => {
        setEditing(item);
        setTitle(item.title);
        setTag(item.tag || 'Thông báo');
        setSummary(item.summary || '');
        setContent(item.content || '');
        setAuthorName(item.authorName || 'Ban Trị Sự');
        setIsPinned(Boolean(item.isPinned));
        setDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !summary.trim() || !content.trim()) {
            toast.error('Vui lòng nhập đầy đủ tiêu đề, tóm tắt và nội dung.');
            return;
        }
        try {
            setSaving(true);
            const url = editing ? `/api/news/${editing.id}` : '/api/news';
            const method = editing ? 'PUT' : 'POST';
            const res = await apiFetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim(),
                    tag,
                    summary: summary.trim(),
                    content: content.trim(),
                    authorName: authorName.trim() || 'Ban Trị Sự',
                    isPinned,
                }),
            });
            const json = await res.json();
            if (!res.ok || !json.success) {
                toast.error(json.message || 'Không thể lưu bài viết.');
                return;
            }
            toast.success(editing ? 'Đã cập nhật bản tin.' : 'Đã đăng bản tin mới.');
            setDialogOpen(false);
            await loadNews();
        } catch {
            toast.error('Lỗi kết nối khi lưu bản tin.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingItem) return;
        try {
            setDeleting(true);
            const res = await apiFetch(`/api/news/${deletingItem.id}`, { method: 'DELETE' });
            const json = await res.json();
            if (!res.ok || !json.success) {
                toast.error(json.message || 'Không thể xóa bài viết.');
                return;
            }
            toast.success('Đã xóa bài viết.');
            setDeletingItem(null);
            await loadNews();
        } catch {
            toast.error('Lỗi kết nối khi xóa bài viết.');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary flex items-center gap-2 text-balance">
                        <Newspaper className="size-6 text-secondary" aria-hidden="true" />
                        <span>Bản Tin &amp; Thông Báo Dòng Họ</span>
                    </h2>
                    <p className="text-sm text-on-surface-variant mt-0.5 text-pretty">
                        Đăng thông báo họp họ, tin hiếu hỷ, khuyến học và các quyết nghị của Ban Trị Sự.
                    </p>
                </div>

                <Button
                    onClick={openCreate}
                    className="min-h-11 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm shrink-0 cursor-pointer"
                >
                    <PlusCircle className="size-4 mr-2" aria-hidden="true" />
                    <span>Đăng Bản Tin Mới</span>
                </Button>
            </div>

            <Card className="bg-surface-container-lowest rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-surface-container-low border-b border-outline-variant/30">
                                <TableHead>Tiêu Đề</TableHead>
                                <TableHead className="w-32">Chuyên Mục</TableHead>
                                <TableHead className="w-36">Người Đăng</TableHead>
                                <TableHead className="w-32">Ngày Đăng</TableHead>
                                <TableHead className="text-right w-24">Thao Tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-on-surface-variant">
                                        Đang tải danh sách bản tin...
                                    </TableCell>
                                </TableRow>
                            ) : articles.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-on-surface-variant">
                                        Chưa có bản tin nào. Bấm &ldquo;Đăng Bản Tin Mới&rdquo; để bắt đầu.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                articles.map((item) => (
                                    <TableRow
                                        key={item.id}
                                        className="hover:bg-surface-container-low/60 border-b border-outline-variant/20 tabular-nums"
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {item.isPinned && (
                                                    <Pin className="size-3.5 text-secondary shrink-0" aria-label="Đã ghim" />
                                                )}
                                                <p className="font-serif font-bold text-sm text-on-surface">{item.title}</p>
                                            </div>
                                            <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">{item.summary}</p>
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex px-2.5 py-0.5 rounded-md text-xs font-semibold bg-secondary/12 text-secondary">
                                                {item.tag}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-xs text-on-surface-variant">
                                            {item.authorName || 'Ban Trị Sự'}
                                        </TableCell>
                                        <TableCell className="text-xs text-on-surface-variant">
                                            {item.publishedAt
                                                ? new Intl.DateTimeFormat('vi-VN').format(new Date(item.publishedAt))
                                                : '—'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="inline-flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Sửa bài ${item.title}`}
                                                    onClick={() => openEdit(item)}
                                                    className="size-8 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface cursor-pointer"
                                                >
                                                    <Pencil className="size-3.5" aria-hidden="true" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Xóa bài ${item.title}`}
                                                    onClick={() => setDeletingItem(item)}
                                                    className="size-8 rounded-lg bg-surface-container-low hover:bg-primary/10 text-primary cursor-pointer"
                                                >
                                                    <Trash2 className="size-3.5" aria-hidden="true" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Dialog Tạo / Sửa Bản Tin */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent size="xl" stickyLayout>
                    <DialogHeader>
                        <DialogTitle>
                            {editing ? 'Chỉnh Sửa Bản Tin Dòng Họ' : 'Soạn & Đăng Bản Tin Mới'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                        <DialogBody>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            <div className="md:col-span-12 space-y-1.5">
                                <Label htmlFor="newsTitle" className="text-sm font-semibold text-on-surface">
                                    Tiêu đề bài viết *
                                </Label>
                                <Input
                                    id="newsTitle"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ví dụ: Thông báo họp Hội đồng Gia tộc đầu xuân..."
                                    className="h-11 rounded-xl border-outline-variant/60 bg-surface-container-lowest text-sm"
                                />
                            </div>

                            <div className="md:col-span-4 space-y-1.5">
                                <Label htmlFor="newsTag" className="text-sm font-semibold text-on-surface">
                                    Chuyên mục
                                </Label>
                                <Select
                                    id="newsTag"
                                    aria-label="Chuyên mục bài viết"
                                    value={tag}
                                    onValueChange={setTag}
                                    options={[
                                        { value: 'Thông báo', label: 'Thông báo' },
                                        { value: 'Khuyến học', label: 'Khuyến học' },
                                        { value: 'Lễ tiết', label: 'Lễ tiết' },
                                        { value: 'Tin hiếu hỷ', label: 'Tin hiếu hỷ' },
                                        { value: 'Tu bổ từ đường', label: 'Tu bổ từ đường' },
                                    ]}
                                    className="min-h-11"
                                />
                            </div>

                            <div className="md:col-span-4 space-y-1.5">
                                <Label htmlFor="newsAuthor" className="text-sm font-semibold text-on-surface">
                                    Người đăng / Đơn vị
                                </Label>
                                <Input
                                    id="newsAuthor"
                                    value={authorName}
                                    onChange={(e) => setAuthorName(e.target.value)}
                                    className="h-11 rounded-xl border-outline-variant/60 bg-surface-container-lowest text-sm"
                                />
                            </div>

                            <div className="md:col-span-4 flex items-end">
                                <label className="flex items-center gap-2.5 w-full min-h-11 px-3.5 rounded-xl bg-surface-container-low text-sm font-medium text-on-surface cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isPinned}
                                        onChange={(e) => setIsPinned(e.target.checked)}
                                        className="size-4 accent-primary"
                                    />
                                    <span>Ghim lên đầu bảng tin</span>
                                </label>
                            </div>

                            <div className="md:col-span-12 space-y-1.5">
                                <Label htmlFor="newsSummary" className="text-sm font-semibold text-on-surface">
                                    Tóm tắt ngắn *
                                </Label>
                                <Input
                                    id="newsSummary"
                                    required
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                    placeholder="1–2 câu tóm lược nội dung chính..."
                                    className="h-11 rounded-xl border-outline-variant/60 bg-surface-container-lowest text-sm"
                                />
                            </div>

                            <div className="md:col-span-12 space-y-1.5">
                                <Label htmlFor="newsContent" className="text-sm font-semibold text-on-surface">
                                    Nội dung chi tiết *
                                </Label>
                                <textarea
                                    id="newsContent"
                                    required
                                    rows={8}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Nhập nội dung đầy đủ của thông báo..."
                                    className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-4 text-sm text-on-surface leading-relaxed"
                                />
                            </div>
                        </div>
                        </DialogBody>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setDialogOpen(false)}
                                className="min-h-11 px-5 rounded-xl bg-surface-container-low text-on-surface cursor-pointer"
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                disabled={saving}
                                className="min-h-11 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold cursor-pointer"
                            >
                                {saving ? 'Đang lưu...' : editing ? 'Lưu thay đổi' : 'Đăng bài'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog Xác nhận xóa */}
            <Dialog open={!!deletingItem} onOpenChange={(open) => !open && setDeletingItem(null)}>
                <DialogContent size="sm">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-lg font-bold text-primary">
                            Xác Nhận Xóa Bài Viết
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-on-surface-variant text-pretty">
                        Bạn có chắc chắn muốn xóa bản tin <strong className="text-on-surface">{deletingItem?.title}</strong>?
                    </p>
                    <DialogFooter className="pt-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setDeletingItem(null)}
                            className="min-h-10 px-4 rounded-xl bg-surface-container-low text-on-surface cursor-pointer"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="button"
                            disabled={deleting}
                            onClick={handleDelete}
                            className="min-h-10 px-5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold cursor-pointer"
                        >
                            {deleting ? 'Đang xóa...' : 'Xóa bài viết'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
