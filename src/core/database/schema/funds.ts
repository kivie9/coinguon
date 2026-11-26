import {
    sqliteTable,
    text,
    integer,
    index,
} from 'drizzle-orm/sqlite-core';
import { clans } from './clans';
import { members } from './members';

/**
 * Bảng Danh mục các Quỹ gia tộc (funds) - SQLite / Cloudflare D1
 */
export const funds = sqliteTable(
    'funds',
    {
        id: integer('id').primaryKey({ autoIncrement: true }),
        clanId: integer('clan_id').references(() => clans.id, { onDelete: 'cascade' }),
        code: text('code').notNull().unique(),
        name: text('name').notNull(),
        description: text('description'),
        targetAmount: integer('target_amount').default(0).notNull(),
        currentBalance: integer('current_balance').default(0).notNull(),
        bankName: text('bank_name'),
        bankAccount: text('bank_account'),
        accountHolder: text('account_holder'),
        donationSyntax: text('donation_syntax'),
        qrCodeUrl: text('qr_code_url'),
        status: text('status').default('ACTIVE').notNull(),
        createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
        updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
    },
    (table) => [
        index('idx_funds_code').on(table.code),
    ]
);

/**
 * Bảng Lịch sử giao dịch Thu - Chi công đức (fund_transactions)
 */
export const fundTransactions = sqliteTable(
    'fund_transactions',
    {
        id: integer('id').primaryKey({ autoIncrement: true }),
        fundId: integer('fund_id')
            .notNull()
            .references(() => funds.id, { onDelete: 'cascade' }),
        memberId: integer('member_id').references(() => members.id, { onDelete: 'set null' }),
        transactionCode: text('transaction_code').unique(),
        type: text('type').notNull(), // 'INCOME' | 'EXPENSE'
        title: text('title').notNull(),
        amount: integer('amount').notNull(),
        contributorName: text('contributor_name').notNull(),
        branchName: text('branch_name'),
        transactionDate: text('transaction_date').notNull(), // ISO YYYY-MM-DD
        note: text('note'),
        receiptUrl: text('receipt_url'),
        createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
    },
    (table) => [
        index('idx_fund_tx_fund_id').on(table.fundId),
        index('idx_fund_tx_date').on(table.transactionDate),
        index('idx_fund_tx_type').on(table.type),
    ]
);

export type Fund = typeof funds.$inferSelect;
export type NewFund = typeof funds.$inferInsert;

export type FundTransactionItem = typeof fundTransactions.$inferSelect;
export type NewFundTransactionItem = typeof fundTransactions.$inferInsert;
