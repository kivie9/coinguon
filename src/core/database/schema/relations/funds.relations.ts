import { relations } from 'drizzle-orm';
import { funds, fundTransactions } from '../funds';
import { clans } from '../clans';
import { members } from '../members';

export const fundsRelations = relations(funds, ({ one, many }) => ({
    clan: one(clans, {
        fields: [funds.clanId],
        references: [clans.id],
    }),
    transactions: many(fundTransactions),
}));

export const fundTransactionsRelations = relations(fundTransactions, ({ one }) => ({
    fund: one(funds, {
        fields: [fundTransactions.fundId],
        references: [funds.id],
    }),
    member: one(members, {
        fields: [fundTransactions.memberId],
        references: [members.id],
    }),
}));

