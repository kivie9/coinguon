import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import { drizzle as drizzleProxy } from 'drizzle-orm/sqlite-proxy';
import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import * as schema from './schema';
import {
    isDbEnabled,
    hasCloudflareD1Http,
    sqliteUrl,
    DatabaseDisabledError,
} from './dbStatus';

export type AppDatabase = BaseSQLiteDatabase<'async', unknown, typeof schema>;
type D1Binding = Parameters<typeof drizzleD1>[0];

declare global {
    var __coinguon_sqlite_client: unknown | undefined;
    var __coinguon_local_db: AppDatabase | undefined;
    var __coinguon_http_db: AppDatabase | undefined;
}

/**
 * Tạo Drizzle instance cho Cloudflare D1 Binding (khi chạy trên Cloudflare Workers).
 */
export function createD1Database(d1Binding: D1Binding): AppDatabase {
    return drizzleD1(d1Binding, { schema }) as unknown as AppDatabase;
}

/**
 * Thử lấy D1 binding `env.DB` từ Cloudflare Workers runtime context (OpenNext).
 */
function tryGetCloudflareD1Database(): AppDatabase | null {
    try {
        const ctx = getCloudflareContext();
        const d1 = (ctx?.env as { DB?: D1Binding } | undefined)?.DB;
        if (d1) {
            return createD1Database(d1);
        }
    } catch {
        // Không chạy trong Cloudflare Workers runtime (đang chạy local Node.js / CLI)
    }
    return null;
}

/**
 * Tạo Drizzle instance kết nối tới Cloudflare D1 qua HTTP API (khi chạy Node.js có CLOUDFLARE_D1_TOKEN).
 */
function getD1HttpDatabase(): AppDatabase {
    if (globalThis.__coinguon_http_db) {
        return globalThis.__coinguon_http_db;
    }

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID!;
    const databaseId = process.env.CLOUDFLARE_DATABASE_ID!;
    const apiToken = process.env.CLOUDFLARE_D1_TOKEN!;
    const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/raw`;

    const instance = drizzleProxy(
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

    globalThis.__coinguon_http_db = instance;
    return instance;
}

/**
 * Tạo Drizzle instance kết nối SQLite cục bộ (chỉ load động trên Node.js local để không đóng gói native libsql vào Worker).
 */
function getLocalSqliteDatabase(): AppDatabase {
    if (globalThis.__coinguon_local_db) {
        return globalThis.__coinguon_local_db;
    }

    // Dùng require động để bundler Workers không kéo native @libsql/client vào bundle edge
    const dynamicRequire = eval('require') as NodeRequire;
    const fs = dynamicRequire('node:fs') as typeof import('node:fs');
    const path = dynamicRequire('node:path') as typeof import('node:path');
    const { createClient } = dynamicRequire('@libsql/client') as typeof import('@libsql/client');
    const { drizzle: drizzleLibsql } = dynamicRequire('drizzle-orm/libsql') as typeof import('drizzle-orm/libsql');

    if (sqliteUrl.startsWith('file:')) {
        const dbPath = sqliteUrl.replace(/^file:/, '');
        fs.mkdirSync(path.dirname(path.resolve(dbPath)), { recursive: true });
    }

    if (!globalThis.__coinguon_sqlite_client) {
        globalThis.__coinguon_sqlite_client = createClient({
            url: sqliteUrl,
        });
    }

    const instance = drizzleLibsql(
        globalThis.__coinguon_sqlite_client as ReturnType<typeof createClient>,
        { schema }
    ) as unknown as AppDatabase;

    globalThis.__coinguon_local_db = instance;
    return instance;
}

function resolveActiveDb(): AppDatabase {
    if (!isDbEnabled) {
        throw new DatabaseDisabledError();
    }

    // 1. Ưu tiên Cloudflare D1 Binding khi chạy trên Cloudflare Workers
    const d1Db = tryGetCloudflareD1Database();
    if (d1Db) {
        return d1Db;
    }

    // 2. Kết nối Cloudflare D1 qua HTTP API nếu cấu hình đủ 3 biến CLOUDFLARE_*
    if (hasCloudflareD1Http) {
        return getD1HttpDatabase();
    }

    // 3. Fallback SQLite cục bộ cho môi trường dev/CLI trên Node.js
    return getLocalSqliteDatabase();
}

/**
 * Proxy phân giải CSDL động theo từng request:
 * - Trên Cloudflare Workers: dùng trực tiếp binding env.DB (coinguon-db)
 * - Trên Node.js / local dev: dùng D1 HTTP API hoặc SQLite file:./data/coinguon-db.db
 */
export const db: AppDatabase = new Proxy({} as AppDatabase, {
    get(_target, prop, receiver) {
        const active = resolveActiveDb();
        const value = Reflect.get(active, prop, receiver);
        return typeof value === 'function' ? value.bind(active) : value;
    },
});

export { schema };
