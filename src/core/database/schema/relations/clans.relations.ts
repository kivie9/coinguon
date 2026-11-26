import { relations } from 'drizzle-orm';
import { clans, branches, ancestralHalls, clanDocuments } from '../clans';
import { members } from '../members';
import { events } from '../events';
import { funds } from '../funds';
import { newsArticles } from '../news';

export const clansRelations = relations(clans, ({ many }) => ({
    branches: many(branches),
    ancestralHalls: many(ancestralHalls),
    members: many(members),
    events: many(events),
    funds: many(funds),
    documents: many(clanDocuments),
    articles: many(newsArticles),
}));

export const branchesRelations = relations(branches, ({ one, many }) => ({
    clan: one(clans, {
        fields: [branches.clanId],
        references: [clans.id],
    }),
    leader: one(members, {
        fields: [branches.leaderId],
        references: [members.id],
    }),
    members: many(members),
}));

export const ancestralHallsRelations = relations(ancestralHalls, ({ one }) => ({
    clan: one(clans, {
        fields: [ancestralHalls.clanId],
        references: [clans.id],
    }),
}));

export const clanDocumentsRelations = relations(clanDocuments, ({ one }) => ({
    clan: one(clans, {
        fields: [clanDocuments.clanId],
        references: [clans.id],
    }),
}));

