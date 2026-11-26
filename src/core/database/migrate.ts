import { config } from 'dotenv';
config({ path: '.env.local' });

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { hasCloudflareD1Http, sqliteUrl } from './dbStatus';

export async function runMigrate() {
    if (hasCloudflareD1Http) {
        console.log('🔄 Đang đẩy migration lên Cloudflare D1 qua drizzle-kit...');
        execSync('npx drizzle-kit migrate', { stdio: 'inherit' });
        console.log('✅ Migration Cloudflare D1 thành công!');
        return;
    }

    if (sqliteUrl.startsWith('file:')) {
        const dbPath = sqliteUrl.replace(/^file:/, '');
        const dir = path.dirname(path.resolve(dbPath));
        fs.mkdirSync(dir, { recursive: true });
    }

    console.log(`🔄 Đang chạy SQLite migration tới ${sqliteUrl}...`);
    const client = createClient({ url: sqliteUrl });
    const db = drizzle(client);

    try {
        await migrate(db, { migrationsFolder: './drizzle' });
        console.log('✅ Migration SQLite đã chạy thành công! Toàn bộ bảng đã sẵn sàng.');
    } catch (error) {
        console.error('❌ Lỗi khi thực thi migration:', error);
        process.exit(1);
    } finally {
        client.close();
    }
}

if (process.argv[1]?.endsWith('migrate.ts')) {
    runMigrate();
}
