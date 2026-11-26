import { config } from 'dotenv';
config({ path: '.env.local' });

import fs from 'node:fs';
import path from 'node:path';
import { createClient, type Client } from '@libsql/client';
import { drizzle as drizzleLibsql } from 'drizzle-orm/libsql';
import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import { drizzle as drizzleProxy } from 'drizzle-orm/sqlite-proxy';
import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';
import * as schema from './schema';
import {
    isDbEnabled,
    hasCloudflareD1Http,
    sqliteUrl,
    DatabaseDisabledError,
} from './dbStatus';

export type AppDatabase = BaseSQLiteDatabase<'async', unknown, typeof schema>;

declare global {
    var __coinguon_sqlite_client: Client | undefined;
    var __coinguon_drizzle_db: AppDatabase | undefined;
}

/**
 * Tạo Drizzle instance cho Cloudflare D1 Binding (khi chạy trực tiếp trên Cloudflare Workers / OpenNext).
 */
export function createD1Database(d1Binding: Parameters<typeof drizzleD1>[0]): AppDatabase {
    return drizzleD1(d1Binding, { schema }) as unknown as AppDatabase;
}

/**
 * Tạo Drizzle instance kết nối tới Cloudflare D1 qua D1 HTTP API
 * (dùng khi chạy Next.js trên Node.js / Vercel / local nhưng vẫn trỏ về Cloudflare D1 thật).
 */
function createD1HttpDatabase(): AppDatabase {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID!;
    const databaseId = process.env.CLOUDFLARE_DATABASE_ID!;
    const apiToken = process.env.CLOUDFLARE_D1_TOKEN!;
    const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/raw`;

    return drizzleProxy(
        async (sql, params, method) => {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sql, params }),
            });

            if (!res.ok) {
                const body = await res.text().catch(() => '');
                throw new Error(`Cloudflare D1 HTTP error ${res.status}: ${body}`);
            }

            const json = (await res.json()) as {
                success: boolean;
                errors?: Array<{ message: string }>;
                result?: Array<{
                    results?: {
                        columns?: string[];
                        rows?: unknown[][];
                    };
                }>;
            };

            if (!json.success) {
                const msg = json.errors?.map((e) => e.message).join('; ') || 'D1 query failed';
                throw new Error(msg);
            }

            const rows = json.result?.[0]?.results?.rows ?? [];
            if (method === 'get') {
                return { rows: (rows[0] ?? []) as unknown[] };
            }
            return { rows: rows as unknown[][] };
        },
        { schema }
    ) as unknown as AppDatabase;
}

/**
 * Tạo Drizzle instance kết nối SQLite cục bộ (file:./data/coinguon-db.db) bằng @libsql/client.
 * Tự động tạo thư mục ./data nếu chưa có.
 */
function createLocalSqliteDatabase(): AppDatabase {
    if (sqliteUrl.startsWith('file:')) {
        const dbPath = sqliteUrl.replace(/^file:/, '');
        fs.mkdirSync(path.dirname(path.resolve(dbPath)), { recursive: true });
    }
    if (!globalThis.__coinguon_sqlite_client) {
        globalThis.__coinguon_sqlite_client = createClient({
            url: sqliteUrl,
        });
    }
    return drizzleLibsql(globalThis.__coinguon_sqlite_client, {
        schema,
    }) as unknown as AppDatabase;
}

const disabledDb = new Proxy({} as AppDatabase, {
    get() {
        throw new DatabaseDisabledError();
    },
});

function initDb(): AppDatabase {
    if (!isDbEnabled) {
        return disabledDb;
    }
    if (globalThis.__coinguon_drizzle_db) {
        return globalThis.__coinguon_drizzle_db;
    }

    const instance = hasCloudflareD1Http
        ? createD1HttpDatabase()
        : createLocalSqliteDatabase();

    if (process.env.NODE_ENV !== 'production') {
        globalThis.__coinguon_drizzle_db = instance;
    }
    return instance;
}

export const db: AppDatabase = initDb();
export { schema };
