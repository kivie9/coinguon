import { relations } from 'drizzle-orm';
import { newsArticles, newsComments } from '../news';
import { clans } from '../clans';

export const newsArticlesRelations = relations(newsArticles, ({ one, many }) => ({
    clan: one(clans, {
        fields: [newsArticles.clanId],
        references: [clans.id],
    }),
    comments: many(newsComments),
}));

export const newsCommentsRelations = relations(newsComments, ({ one }) => ({
    article: one(newsArticles, {
        fields: [newsComments.articleId],
        references: [newsArticles.id],
    }),
}));

