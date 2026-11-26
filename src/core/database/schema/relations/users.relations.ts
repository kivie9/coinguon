import { relations } from 'drizzle-orm';
import { users, auditLogs } from '../users';
import { members } from '../members';

export const usersRelations = relations(users, ({ one, many }) => ({
    member: one(members, {
        fields: [users.memberId],
        references: [members.id],
    }),
    auditLogs: many(auditLogs),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
    user: one(users, {
        fields: [auditLogs.userId],
        references: [users.id],
    }),
}));

