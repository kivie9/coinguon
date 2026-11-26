/**
 * Trạng thái kết nối CSDL (Cloudflare D1 / SQLite local).
 * Đặt DB_ENABLED=false trong .env.local để chạy hoàn toàn bằng dữ liệu dự phòng.
 */
export const hasCloudflareD1Http =
    !!process.env.CLOUDFLARE_ACCOUNT_ID &&
    !!process.env.CLOUDFLARE_DATABASE_ID &&
    !!process.env.CLOUDFLARE_D1_TOKEN;

export const sqliteUrl = process.env.SQLITE_URL || 'file:./data/coinguon-db.db';

export const isDbEnabled = process.env.DB_ENABLED !== 'false';

export class DatabaseDisabledError extends Error {
    constructor() {
        super('Cơ sở dữ liệu đang tắt (DB_ENABLED=false).');
        this.name = 'DatabaseDisabledError';
    }
}

/**
 * Ghi cảnh báo khi phải dùng dữ liệu dự phòng; im lặng nếu CSDL được tắt có chủ đích.
 */
export function warnDbFallback(message: string, err: unknown): void {
    if (err instanceof DatabaseDisabledError) return;
    console.warn(message, err);
}
