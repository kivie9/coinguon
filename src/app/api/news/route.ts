import { NextRequest } from 'next/server';
import { desc } from 'drizzle-orm';
import { db } from '@/core/database/dataSource';
import { newsArticles } from '@/core/database/schema';
import { getAuthenticatedUser } from '@/utils/auth';
import { recordAuditLog } from '@/utils/auditLog';
import { apiSuccess, apiBadRequest, apiForbidden, apiError } from '@/utils/apiResponse';

function slugify(text: string): string {
    return (
        text
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 80) +
        '-' +
        Date.now().toString(36)
    );
}

/**
 * GET /api/news
 * Lấy danh sách bản tin dòng họ
 */
export async function GET(request: NextRequest) {
    try {
        const auth = await getAuthenticatedUser(request);
        if (auth.isGuest) {
            return apiError('Vui lòng đăng nhập để xem bản tin dòng họ.', 401);
        }

        const articles = await db
            .select()
            .from(newsArticles)
            .orderBy(desc(newsArticles.isPinned), desc(newsArticles.publishedAt));

        return apiSuccess(articles);
    } catch (error) {
        console.error('Lỗi GET /api/news:', error);
        return apiError('Không thể tải danh sách bản tin.', 500);
    }
}

/**
 * POST /api/news
 * Đăng bài viết / thông báo dòng họ mới (Chỉ Quản Trị Viên)
 */
export async function POST(request: NextRequest) {
    try {
        const auth = await getAuthenticatedUser(request);
        if (auth.isGuest || (!auth.isAdmin && !auth.isSuperAdmin)) {
            return apiForbidden('Chỉ Quản Trị Viên mới có quyền đăng bản tin dòng họ.');
        }

        const body = await request.json().catch(() => ({}));
        const title = String(body.title || '').trim();
        const tag = String(body.tag || 'Thông báo').trim().slice(0, 50);
        const summary = String(body.summary || '').trim();
        const content = String(body.content || '').trim();

        if (!title || title.length < 3 || title.length > 200) {
            return apiBadRequest('Tiêu đề bài viết phải từ 3 đến 200 ký tự.');
        }
        if (!summary || summary.length > 500) {
            return apiBadRequest('Vui lòng nhập tóm tắt ngắn gọn (tối đa 500 ký tự).');
        }
        if (!content) {
            return apiBadRequest('Vui lòng nhập nội dung bài viết.');
        }

        const clan = await db.query.clans.findFirst();

        const [created] = await db
            .insert(newsArticles)
            .values({
                clanId: clan?.id ?? null,
                title,
                slug: slugify(title),
                tag,
                tagColor: String(body.tagColor || 'primary').slice(0, 30),
                summary,
                content,
                thumbnailUrl: body.thumbnailUrl ? String(body.thumbnailUrl).trim().slice(0, 500) : null,
                authorName: String(body.authorName || auth.user?.fullName || 'Ban Trị Sự').trim().slice(0, 100),
                isPinned: Boolean(body.isPinned),
            })
            .returning();

        await recordAuditLog({
            userId: auth.user?.id,
            action: 'INSERT',
            entityName: 'news_articles',
            entityId: created.id,
            newValues: { title: created.title, tag: created.tag, isPinned: created.isPinned },
            request,
        });

        return apiSuccess(created, 'Đăng bản tin mới thành công.', 201);
    } catch (error) {
        console.error('Lỗi POST /api/news:', error);
        return apiError('Không thể đăng bản tin mới.', 500);
    }
}
