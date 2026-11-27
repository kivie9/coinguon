import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/core/database/dataSource';
import { newsArticles } from '@/core/database/schema';
import { getAuthenticatedUser } from '@/utils/auth';
import { recordAuditLog } from '@/utils/auditLog';
import { apiSuccess, apiBadRequest, apiForbidden, apiNotFound, apiError } from '@/utils/apiResponse';

interface Params {
    params: Promise<{ id: string }>;
}

/**
 * PUT /api/news/[id]
 */
export async function PUT(request: NextRequest, { params }: Params) {
    try {
        const auth = await getAuthenticatedUser(request);
        if (auth.isGuest || (!auth.isAdmin && !auth.isSuperAdmin)) {
            return apiForbidden('Chỉ Quản Trị Viên mới có quyền sửa bản tin.');
        }

        const { id } = await params;
        const articleId = parseInt(id, 10);
        if (isNaN(articleId) || articleId <= 0) {
            return apiBadRequest('ID bài viết không hợp lệ.');
        }

        const existing = await db.query.newsArticles.findFirst({ where: eq(newsArticles.id, articleId) });
        if (!existing) {
            return apiNotFound('Không tìm thấy bài viết.');
        }

        const body = await request.json().catch(() => ({}));
        const updateData: Partial<typeof newsArticles.$inferInsert> = {
            updatedAt: new Date(),
        };

        if (body.title !== undefined) {
            const t = String(body.title).trim();
            if (t.length < 3 || t.length > 200) return apiBadRequest('Tiêu đề phải từ 3 đến 200 ký tự.');
            updateData.title = t;
        }
        if (body.tag !== undefined) updateData.tag = String(body.tag).trim().slice(0, 50) || existing.tag;
        if (body.summary !== undefined) updateData.summary = String(body.summary).trim().slice(0, 500);
        if (body.content !== undefined) updateData.content = String(body.content).trim();
        if (body.thumbnailUrl !== undefined) {
            updateData.thumbnailUrl = body.thumbnailUrl ? String(body.thumbnailUrl).trim().slice(0, 500) : null;
        }
        if (body.authorName !== undefined) updateData.authorName = String(body.authorName).trim().slice(0, 100);
        if (body.isPinned !== undefined) updateData.isPinned = Boolean(body.isPinned);

        const [updated] = await db
            .update(newsArticles)
            .set(updateData)
            .where(eq(newsArticles.id, articleId))
            .returning();

        await recordAuditLog({
            userId: auth.user?.id,
            action: 'UPDATE',
            entityName: 'news_articles',
            entityId: articleId,
            oldValues: { title: existing.title },
            newValues: { title: updated.title, isPinned: updated.isPinned },
            request,
        });

        return apiSuccess(updated, 'Cập nhật bài viết thành công.');
    } catch (error) {
        console.error('Lỗi PUT /api/news/[id]:', error);
        return apiError('Không thể cập nhật bài viết.', 500);
    }
}

/**
 * DELETE /api/news/[id]
 */
export async function DELETE(request: NextRequest, { params }: Params) {
    try {
        const auth = await getAuthenticatedUser(request);
        if (auth.isGuest || (!auth.isAdmin && !auth.isSuperAdmin)) {
            return apiForbidden('Chỉ Quản Trị Viên mới có quyền xóa bản tin.');
        }

        const { id } = await params;
        const articleId = parseInt(id, 10);
        if (isNaN(articleId) || articleId <= 0) {
            return apiBadRequest('ID bài viết không hợp lệ.');
        }

        const existing = await db.query.newsArticles.findFirst({ where: eq(newsArticles.id, articleId) });
        if (!existing) {
            return apiNotFound('Không tìm thấy bài viết cần xóa.');
        }

        await db.delete(newsArticles).where(eq(newsArticles.id, articleId));

        await recordAuditLog({
            userId: auth.user?.id,
            action: 'DELETE',
            entityName: 'news_articles',
            entityId: articleId,
            oldValues: { title: existing.title },
            request,
        });

        return apiSuccess({ id: articleId }, 'Đã xóa bài viết thành công.');
    } catch (error) {
        console.error('Lỗi DELETE /api/news/[id]:', error);
        return apiError('Không thể xóa bài viết.', 500);
    }
}
