import { config } from 'dotenv';
config({ path: '.env.local' });

import { execSync } from 'child_process';
import { runMigrate } from '../src/core/database/migrate';
import { runSeed } from '../src/core/database/seed';

const command = process.argv[2] || 'setup';

async function main() {
    switch (command) {
        case 'migrate':
            await runMigrate();
            break;

        case 'seed':
            await runSeed();
            break;

        case 'setup':
            console.log('🚀 [COINGUON DB] Thiết lập cơ sở dữ liệu D1/SQLite (Migration + Seed + Auth.js users)...\n');
            await runMigrate();
            console.log('');
            await runSeed();
            console.log('\n🎉 [COINGUON DB] Toàn bộ cơ sở dữ liệu D1/SQLite và tài khoản Auth.js đã sẵn sàng!');
            break;

        case 'push':
            console.log('🚀 [COINGUON DB] Đẩy schema trực tiếp lên SQLite / D1...');
            execSync('npx drizzle-kit push', { stdio: 'inherit' });
            break;

        case 'generate':
            console.log('🚀 [COINGUON DB] Tạo file SQL migration mới từ schema SQLite/D1...');
            execSync('npx drizzle-kit generate', { stdio: 'inherit' });
            break;

        case 'studio':
            console.log('🚀 [COINGUON DB] Khởi chạy Drizzle Studio...');
            execSync('npx drizzle-kit studio', { stdio: 'inherit' });
            break;

        case 'help':
        default:
            console.log(`
=========================================
   COINGUON D1 / SQLITE DATABASE CLI
=========================================
Sử dụng: npm run db [subcommand]

Các lệnh hỗ trợ:
  - npm run db              : Chạy setup (migration + seed 10 đời + 4 tài khoản Auth.js)
  - npm run db setup        : Tương tự mặc định
  - npm run db migrate      : Chạy SQL migration vào SQLite local hoặc Cloudflare D1
  - npm run db seed         : Nạp dữ liệu mẫu 10 đời Họ Lê & 4 tài khoản đăng nhập
  - npm run db push         : Đẩy schema trực tiếp lên SQLite / D1
  - npm run db generate     : Sinh file SQL migration mới vào ./drizzle
  - npm run db studio       : Mở Drizzle Studio trực quan trên web
  - npm run db help         : Hiển thị bảng trợ giúp này
=========================================
            `);
            if (command !== 'help') {
                process.exit(1);
            }
            break;
    }
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('❌ Lỗi thực thi lệnh database:', err);
        process.exit(1);
    });
