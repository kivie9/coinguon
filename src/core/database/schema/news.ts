import {
    sqliteTable,
    text,
    integer,
    index,
} from 'drizzle-orm/sqlite-core';
import { clans } from './clans';

/**
 * Bảng Bản tin & Bài viết dòng họ (news_articles) - SQLite / Cloudflare D1
 */
export const newsArticles = sqliteTable(
    'news_articles',
    {
        id: integer('id').primaryKey({ autoIncrement: true }),
        clanId: integer('clan_id').references(() => clans.id, { onDelete: 'cascade' }),
        title: text('title').notNull(),
        slug: text('slug').notNull().unique(),
        tag: text('tag').notNull(),
        tagColor: text('tag_color').default('primary'),
        summary: text('summary').notNull(),
        content: text('content').notNull(),
        thumbnailUrl: text('thumbnail_url'),
        authorName: text('author_name').default('Ban Trị Sự'),
        viewsCount: integer('views_count').default(0).notNull(),
        likesCount: integer('likes_count').default(0).notNull(),
        commentsCount: integer('comments_count').default(0).notNull(),
        isPinned: integer('is_pinned', { mode: 'boolean' }).default(false).notNull(),
        publishedAt: integer('published_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
        createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
        updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
    },
    (table) => [
        index('idx_news_published_at').on(table.publishedAt),
        index('idx_news_tag').on(table.tag),
        index('idx_news_slug').on(table.slug),
    ]
);

/**
 * Bảng Bình luận bản tin (news_comments)
 */
export const newsComments = sqliteTable(
    'news_comments',
    {
        id: integer('id').primaryKey({ autoIncrement: true }),
        articleId: integer('article_id')
            .notNull()
            .references(() => newsArticles.id, { onDelete: 'cascade' }),
        authorName: text('author_name').notNull(),
        authorBranch: text('author_branch'),
        content: text('content').notNull(),
        createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
    },
    (table) => [
        index('idx_news_comments_article_id').on(table.articleId),
    ]
);

export type NewsArticle = typeof newsArticles.$inferSelect;
export type NewNewsArticle = typeof newsArticles.$inferInsert;

export type NewsCommentItem = typeof newsComments.$inferSelect;
export type NewNewsCommentItem = typeof newsComments.$inferInsert;
