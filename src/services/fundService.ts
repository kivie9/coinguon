import { eq, or } from 'drizzle-orm';
import { db } from '@/core/database/dataSource';
import { warnDbFallback } from '@/core/database/dbStatus';
import { funds as fundsTable, fundTransactions as fundTxTable } from '@/core/database/schema';
import { FundTransaction, FundOverview, INITIAL_FUND_TRANSACTIONS } from '@/config/fundData';

export type { FundTransaction, FundOverview };
export { INITIAL_FUND_TRANSACTIONS };

let fundTransactionsStore: FundTransaction[] = [...INITIAL_FUND_TRANSACTIONS];

function formatDateVi(dateStr: string): string {
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) return dateStr;
    return new Intl.DateTimeFormat('vi-VN').format(parsed);
}

export class FundService {
    getTransactionsSync(): FundTransaction[] {
        return [...fundTransactionsStore];
    }

    async getTransactions(): Promise<FundTransaction[]> {
        try {
            const dbTxs = await db.query.fundTransactions.findMany({
                orderBy: (tx, { desc }) => [desc(tx.transactionDate), desc(tx.id)],
            });
            if (dbTxs && dbTxs.length > 0) {
                return dbTxs.map((t) => ({
                    id: t.transactionCode || `TX-${t.id}`,
                    type: t.type as 'INCOME' | 'EXPENSE',
                    title: t.title,
                    contributor: t.contributorName,
                    branch: t.branchName || 'Bản Tộc',
                    amount: Number(t.amount),
                    date: formatDateVi(t.transactionDate),
                    note: t.note || '',
                }));
            }
        } catch (dbErr) {
            warnDbFallback('Lỗi khi truy vấn giao dịch quỹ từ CSDL, dùng fallback store:', dbErr);
        }
        return this.getTransactionsSync();
    }

    getOverviewSync(): FundOverview {
        const totalIncome = fundTransactionsStore
            .filter((t) => t.type === 'INCOME')
            .reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = fundTransactionsStore
            .filter((t) => t.type === 'EXPENSE')
            .reduce((sum, t) => sum + t.amount, 0);

        const currentBalanceNumber = 168500000 + (totalIncome - totalExpense);
        const targetNumber = 200000000;
        const percent = Math.min(100, Math.max(0, Math.round((currentBalanceNumber / targetNumber) * 100)));

        return {
            title: 'Quỹ Trùng Tu & Khuyến Học Ất Tỵ',
            desktopTitle: 'Quỹ Trùng Tu & Khuyến Học',
            targetAmount: targetNumber,
            currentAmount: currentBalanceNumber,
            balance: new Intl.NumberFormat('vi-VN').format(currentBalanceNumber) + ' đ',
            percent,
            bankAccount: '1903.8888.9999',
            bankName: 'Vietcombank',
            accountName: 'Ban Trị Sự Từ Đường Chi II',
            transactionsCount: fundTransactionsStore.length,
        };
    }

    async getOverview(): Promise<FundOverview> {
        try {
            const fund = await db.query.funds.findFirst({
                with: {
                    transactions: {
                        orderBy: (tx, { desc }) => [desc(tx.transactionDate), desc(tx.id)],
                    },
                },
            });
            if (fund) {
                const totalIncome = fund.transactions
                    .filter((t) => t.type === 'INCOME')
                    .reduce((sum, t) => sum + Number(t.amount), 0);
                const totalExpense = fund.transactions
                    .filter((t) => t.type === 'EXPENSE')
                    .reduce((sum, t) => sum + Number(t.amount), 0);
                const currentBalanceNumber =
                    fund.transactions.length > 0 ? totalIncome - totalExpense : Number(fund.currentBalance) || 0;
                const targetNumber = Number(fund.targetAmount) || 200000000;
                const percent = Math.min(100, Math.max(0, Math.round((currentBalanceNumber / targetNumber) * 100)));

                return {
                    title: fund.name,
                    desktopTitle: `${fund.name} (Quỹ Đại Tôn)`,
                    targetAmount: targetNumber,
                    currentAmount: currentBalanceNumber,
                    balance: new Intl.NumberFormat('vi-VN').format(currentBalanceNumber) + ' đ',
                    percent,
                    bankAccount: fund.bankAccount || '1903.8888.9999',
                    bankName: fund.bankName || 'Vietcombank',
                    accountName: fund.accountHolder || 'Ban Trị Sự Từ Đường Chi II',
                    transactionsCount: fund.transactions.length,
                };
            }
        } catch (dbErr) {
            warnDbFallback('Lỗi khi truy vấn tổng quan quỹ từ CSDL, dùng fallback:', dbErr);
        }
        return this.getOverviewSync();
    }

    private async syncFundBalance(fundId: number): Promise<void> {
        try {
            const txs = await db.query.fundTransactions.findMany({
                where: eq(fundTxTable.fundId, fundId),
            });
            const balance = txs.reduce((acc, t) => acc + (t.type === 'INCOME' ? Number(t.amount) : -Number(t.amount)), 0);
            await db
                .update(fundsTable)
                .set({ currentBalance: balance, updatedAt: new Date() })
                .where(eq(fundsTable.id, fundId));
        } catch {
            // Bỏ qua nếu không đồng bộ được số dư cache
        }
    }

    addTransactionSync(tx: Omit<FundTransaction, 'id'>): FundTransaction {
        const nextId = `TX-${fundTransactionsStore.length + 101}`;
        const newTx = { ...tx, id: nextId };
        fundTransactionsStore.unshift(newTx);
        return newTx;
    }

    async addTransaction(tx: Omit<FundTransaction, 'id'>): Promise<FundTransaction & { dbId?: number }> {
        try {
            const fund = await db.query.funds.findFirst();
            if (fund) {
                const nextCode = `TX-${Date.now().toString().slice(-6)}`;
                const txDate = /^\d{4}-\d{2}-\d{2}$/.test(tx.date)
                    ? tx.date
                    : new Date().toISOString().split('T')[0];

                const [inserted] = await db
                    .insert(fundTxTable)
                    .values({
                        fundId: fund.id,
                        transactionCode: nextCode,
                        type: tx.type,
                        title: tx.title,
                        amount: tx.amount,
                        contributorName: tx.contributor,
                        branchName: tx.branch,
                        transactionDate: txDate,
                        note: tx.note,
                    })
                    .returning();

                if (inserted) {
                    await this.syncFundBalance(fund.id);
                    return {
                        id: inserted.transactionCode || `TX-${inserted.id}`,
                        dbId: inserted.id,
                        type: inserted.type as 'INCOME' | 'EXPENSE',
                        title: inserted.title,
                        contributor: inserted.contributorName,
                        branch: inserted.branchName || 'Bản Tộc',
                        amount: Number(inserted.amount),
                        date: formatDateVi(inserted.transactionDate),
                        note: inserted.note || '',
                    };
                }
            }
        } catch (dbErr) {
            warnDbFallback('Lỗi khi lưu giao dịch vào CSDL, dùng fallback sync:', dbErr);
        }
        return this.addTransactionSync(tx);
    }

    async updateTransaction(
        idOrCode: string,
        patch: Partial<Omit<FundTransaction, 'id'>>
    ): Promise<(FundTransaction & { dbId?: number }) | null> {
        try {
            const numericId = Number(idOrCode.replace(/^TX-/, ''));
            const whereClause =
                !isNaN(numericId) && /^\d+$/.test(idOrCode)
                    ? eq(fundTxTable.id, numericId)
                    : or(eq(fundTxTable.transactionCode, idOrCode), !isNaN(numericId) ? eq(fundTxTable.id, numericId) : eq(fundTxTable.transactionCode, idOrCode));

            const existing = await db.query.fundTransactions.findFirst({ where: whereClause });
            if (existing) {
                const updateValues: Partial<typeof fundTxTable.$inferInsert> = {};
                if (patch.type) updateValues.type = patch.type;
                if (patch.title !== undefined) updateValues.title = patch.title;
                if (patch.amount !== undefined) updateValues.amount = patch.amount;
                if (patch.contributor !== undefined) updateValues.contributorName = patch.contributor;
                if (patch.branch !== undefined) updateValues.branchName = patch.branch;
                if (patch.note !== undefined) updateValues.note = patch.note;
                if (patch.date && /^\d{4}-\d{2}-\d{2}$/.test(patch.date)) {
                    updateValues.transactionDate = patch.date;
                }

                const [updated] = await db
                    .update(fundTxTable)
                    .set(updateValues)
                    .where(eq(fundTxTable.id, existing.id))
                    .returning();

                if (updated) {
                    await this.syncFundBalance(updated.fundId);
                    return {
                        id: updated.transactionCode || `TX-${updated.id}`,
                        dbId: updated.id,
                        type: updated.type as 'INCOME' | 'EXPENSE',
                        title: updated.title,
                        contributor: updated.contributorName,
                        branch: updated.branchName || 'Bản Tộc',
                        amount: Number(updated.amount),
                        date: formatDateVi(updated.transactionDate),
                        note: updated.note || '',
                    };
                }
            }
        } catch (dbErr) {
            warnDbFallback('Lỗi khi cập nhật giao dịch quỹ trong CSDL:', dbErr);
        }

        // Fallback memory store
        const idx = fundTransactionsStore.findIndex((t) => t.id === idOrCode);
        if (idx >= 0) {
            fundTransactionsStore[idx] = { ...fundTransactionsStore[idx], ...patch };
            return fundTransactionsStore[idx];
        }
        return null;
    }

    async deleteTransaction(idOrCode: string): Promise<{ deleted: boolean; dbId?: number }> {
        try {
            const numericId = Number(idOrCode.replace(/^TX-/, ''));
            const whereClause =
                !isNaN(numericId) && /^\d+$/.test(idOrCode)
                    ? eq(fundTxTable.id, numericId)
                    : or(eq(fundTxTable.transactionCode, idOrCode), !isNaN(numericId) ? eq(fundTxTable.id, numericId) : eq(fundTxTable.transactionCode, idOrCode));

            const existing = await db.query.fundTransactions.findFirst({ where: whereClause });
            if (existing) {
                await db.delete(fundTxTable).where(eq(fundTxTable.id, existing.id));
                await this.syncFundBalance(existing.fundId);
                return { deleted: true, dbId: existing.id };
            }
        } catch (dbErr) {
            warnDbFallback('Lỗi khi xóa giao dịch quỹ trong CSDL:', dbErr);
        }

        const before = fundTransactionsStore.length;
        fundTransactionsStore = fundTransactionsStore.filter((t) => t.id !== idOrCode);
        return { deleted: fundTransactionsStore.length < before };
    }
}

export const fundService = new FundService();
