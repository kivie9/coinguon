import { db } from '@/core/database/dataSource';
import { warnDbFallback } from '@/core/database/dbStatus';
import { fundTransactions as fundTxTable } from '@/core/database/schema';
import { FundTransaction, FundOverview, INITIAL_FUND_TRANSACTIONS } from '@/config/fundData';

export type { FundTransaction, FundOverview };
export { INITIAL_FUND_TRANSACTIONS };

let fundTransactionsStore: FundTransaction[] = [...INITIAL_FUND_TRANSACTIONS];

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
                    date: new Intl.DateTimeFormat('vi-VN').format(new Date(t.transactionDate)),
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
        const percent = Math.min(100, Math.round((currentBalanceNumber / targetNumber) * 100));

        return {
            title: 'Quỹ Trùng Tu & Khuyến Học Ất Tỵ',
            desktopTitle: 'Quỹ Trùng Tu & Khuyến Học',
            targetAmount: targetNumber,
            currentAmount: currentBalanceNumber,
            balance: new Intl.NumberFormat('vi-VN').format(currentBalanceNumber) + ' đ',
            percent: percent,
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
                const currentBalanceNumber = Number(fund.currentBalance) || (totalIncome - totalExpense);
                const targetNumber = Number(fund.targetAmount) || 200000000;
                const percent = Math.min(100, Math.round((currentBalanceNumber / targetNumber) * 100));

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

    addTransactionSync(tx: Omit<FundTransaction, 'id'>): FundTransaction {
        const nextId = `TX-${fundTransactionsStore.length + 101}`;
        const newTx = { ...tx, id: nextId };
        fundTransactionsStore.unshift(newTx);
        return newTx;
    }

    async addTransaction(tx: Omit<FundTransaction, 'id'>): Promise<FundTransaction> {
        try {
            const fund = await db.query.funds.findFirst();
            if (fund) {
                const nextCode = `TX-${Date.now().toString().slice(-4)}`;
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
                        transactionDate: new Date().toISOString().split('T')[0],
                        note: tx.note,
                    })
                    .returning();

                if (inserted) {
                    return {
                        id: inserted.transactionCode || `TX-${inserted.id}`,
                        type: inserted.type as 'INCOME' | 'EXPENSE',
                        title: inserted.title,
                        contributor: inserted.contributorName,
                        branch: inserted.branchName || 'Bản Tộc',
                        amount: Number(inserted.amount),
                        date: new Intl.DateTimeFormat('vi-VN').format(new Date(inserted.transactionDate)),
                        note: inserted.note || '',
                    };
                }
            }
        } catch (dbErr) {
            warnDbFallback('Lỗi khi lưu giao dịch vào CSDL, dùng fallback sync:', dbErr);
        }
        return this.addTransactionSync(tx);
    }
}

export const fundService = new FundService();
