import {
    sqliteTable,
    text,
    integer,
    index,
} from 'drizzle-orm/sqlite-core';
import { members } from './members';

/**
 * Bảng Tài khoản người dùng (users) - Xác thực qua Auth.js v5 + Cloudflare D1 (SQLite)
 */
export const users = sqliteTable(
    'users',
    {
        id: integer('id').primaryKey({ autoIncrement: true }),
        memberId: integer('member_id').references(() => members.id, { onDelete: 'set null' }),
        email: text('email').notNull().unique(),
        passwordHash: text('password_hash'), // Định dạng pbkdf2_sha256$<iterations>$<saltHex>$<hashHex>
        phone: text('phone').unique(),
        fullName: text('full_name').notNull(),
        avatarUrl: text('avatar_url'),
        role: text('role').default('MEMBER').notNull(), // 'SUPER_ADMIN' | 'CLAN_ADMIN' | 'BRANCH_ADMIN' | 'MEMBER'
        status: text('status').default('ACTIVE').notNull(), // 'ACTIVE' | 'LOCKED' | 'PENDING'
        lastLoginAt: integer('last_login_at', { mode: 'timestamp' }),
        createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
        updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
    },
    (table) => [
        index('idx_users_email').on(table.email),
        index('idx_users_phone').on(table.phone),
        index('idx_users_member_id').on(table.memberId),
    ]
);

/**
 * Bảng Nhật ký kiểm toán phả ký (audit_logs)
 */
export const auditLogs = sqliteTable(
    'audit_logs',
    {
        id: integer('id').primaryKey({ autoIncrement: true }),
        userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
        action: text('action').notNull(), // 'INSERT' | 'UPDATE' | 'DELETE'
        entityName: text('entity_name').notNull(), // 'members' | 'relationships' | 'funds'
        entityId: integer('entity_id').notNull(),
        oldValues: text('old_values', { mode: 'json' }),
        newValues: text('new_values', { mode: 'json' }),
        ipAddress: text('ip_address'),
        createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
    },
    (table) => [
        index('idx_audit_logs_entity').on(table.entityName, table.entityId),
        index('idx_audit_logs_created_at').on(table.createdAt),
    ]
);

export type UserItem = typeof users.$inferSelect;
export type NewUserItem = typeof users.$inferInsert;

export type AuditLogItem = typeof auditLogs.$inferSelect;
export type NewAuditLogItem = typeof auditLogs.$inferInsert;
