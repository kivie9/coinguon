export interface FundTransaction {
    id: string;
    type: 'INCOME' | 'EXPENSE';
    title: string;
    contributor: string;
    branch: string;
    amount: number;
    date: string;
    note: string;
}

export interface FundOverview {
    title: string;
    desktopTitle: string;
    targetAmount: number;
    currentAmount: number;
    balance: string;
    percent: number;
    bankAccount: string;
    bankName: string;
    accountName: string;
    transactionsCount: number;
}

export const INITIAL_FUND_TRANSACTIONS: FundTransaction[] = [
    {
        id: 'TX-101',
        type: 'INCOME',
        title: 'Công đức tôn tạo lăng mộ Thủy Tổ',
        contributor: 'Lê Văn Phúc',
        branch: 'Chi Trưởng',
        amount: 10000000,
        date: '28/10/2026',
        note: 'Góp công đức đợt 2',
    },
    {
        id: 'TX-102',
        type: 'INCOME',
        title: 'Đóng góp hương hỏa thường niên 2026',
        contributor: 'Lê Văn Toàn',
        branch: 'Chi Hai',
        amount: 2000000,
        date: '20/10/2026',
        note: 'Đóng quỹ đinh thường niên',
    },
    {
        id: 'TX-103',
        type: 'EXPENSE',
        title: 'Chi mua sắm lễ vật ngày Giỗ Tổ',
        contributor: 'Ban Khánh Tiết',
        branch: 'Ban Trị Sự',
        amount: 8500000,
        date: '15/10/2026',
        note: 'Chi phí mua trầu cau, hoa quả, cỗ bàn',
    },
    {
        id: 'TX-104',
        type: 'INCOME',
        title: 'Ủng hộ quỹ khuyến học gia tộc',
        contributor: 'Lê Thị Hoa',
        branch: 'Chi Ba',
        amount: 5000000,
        date: '10/10/2026',
        note: 'Trao thưởng các cháu đỗ đại học',
    },
    {
        id: 'TX-105',
        type: 'EXPENSE',
        title: 'Tu sửa mái ngói nhà thờ họ',
        contributor: 'Ban Quản Lý Di Tích',
        branch: 'Ban Trị Sự',
        amount: 12000000,
        date: '02/10/2026',
        note: 'Gia cố ngói mũi hài bị dột mùa mưa bão',
    },
];

