# THIẾT LẬP CẤU TRÚC MÃ NGUỒN (DRIZZLE ORM & REPOSITORY / SERVICE PATTERN)

Dự án tuân thủ kiến trúc phân tầng: **Repository & Service Pattern** kết hợp cùng **Next.js Server Actions** và **Drizzle ORM**.

---

## 1. Cấu trúc thư mục (Project Structure)

```text
src/
├── app/              # Next.js App Router (Actions & Pages)
├── components/       # Components phân theo trách nhiệm & thiết bị:
│   ├── common/       # Dùng chung (LunarDateBadge, DeviceSwitchButton)
│   ├── desktop/      # Chuyên biệt cho PC, Laptop & Desktop
│   ├── layout/       # Khung layout (ResponsiveLayout, DesktopLayout, MobileLayout, BottomNav)
│   ├── mobile/       # Chuyên biệt cho Mobile & Tablet
│   └── ui/           # Primitive UI shadcn (button, card, badge, dialog, input, label)
├── features/         # Module theo nghiệp vụ (members, genealogy)
├── hooks/            # Hooks (useDevice)
├── proxy.ts          # Server Proxy / Middleware nhận diện thiết bị đa yếu tố
├── core/
│   ├── base/         # Các class Base (BaseRepository, BaseService)
│   └── database/     # Cấu hình Drizzle ORM, connection pool & Schemas
├── lib/              # Tiện ích bổ trợ cho shadcn (utils.ts)
├── repositories/     # Các class kế thừa BaseRepository
├── services/         # Các class kế thừa BaseService
└── types/            # TypeScript DTOs & Interfaces
```

---

## 2. Base Repository với Drizzle ORM

```typescript
// src/core/base/baseRepository.ts
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { PgColumn, PgTable } from 'drizzle-orm/pg-core';
import { eq, and, isNull, SQL } from 'drizzle-orm';
import { db } from '@/core/database/dataSource';
import * as schema from '@/core/database/schema';

export interface IdentifiableTable {
    id: PgColumn;
    deletedAt?: PgColumn;
    updatedAt?: PgColumn;
}

export abstract class BaseRepository<
    TTable extends PgTable & IdentifiableTable,
    TSelect extends Record<string, unknown>,
    TInsert extends Record<string, unknown>
> {
    constructor(
        protected readonly table: TTable,
        protected readonly database: NodePgDatabase<typeof schema> = db
    ) {}

    protected get db(): NodePgDatabase<typeof schema> {
        return this.database;
    }

    async findAll(): Promise<TSelect[]> { ... }
    async findById(id: number): Promise<TSelect | null> { ... }
    async create(data: TInsert): Promise<TSelect> { ... }
    async update(id: number, data: Partial<TInsert>): Promise<TSelect | null> { ... }
    async delete(id: number): Promise<void> { ... }
}
```

---

## 3. Triển khai MemberRepository với Drizzle

```typescript
// src/repositories/memberRepository.ts
import { BaseRepository } from '@/core/base/baseRepository';
import { members, Member, NewMember } from '@/core/database/schema';
import { eq, and, isNull, asc } from 'drizzle-orm';

export class MemberRepository extends BaseRepository<typeof members, Member, NewMember> {
    constructor() {
        super(members);
    }

    async findByGeneration(generationNumber: number): Promise<Member[]> {
        return await this.db
            .select()
            .from(members)
            .where(
                and(
                    eq(members.generationNumber, generationNumber),
                    isNull(members.deletedAt)
                )
            )
            .orderBy(asc(members.birthdaySolar));
    }

    async findByIdWithRelations(id: number) {
        return await this.db.query.members.findFirst({
            where: and(eq(members.id, id), isNull(members.deletedAt)),
            with: {
                relationships: {
                    with: {
                        relatedPerson: true,
                    },
                },
                relatedRelationships: {
                    with: {
                        person: true,
                    },
                },
            },
        });
    }
}
```

---

## 4. Quản lý cơ sở dữ liệu với 1 lệnh duy nhất (`npm run db`)

Dự án gom toàn bộ tác vụ cơ sở dữ liệu vào một CLI Runner duy nhất tại `scripts/db.ts`:

```bash
npm run db              # Chạy setup (migration + seed) mặc định
npm run db setup        # Chạy migration và nạp seed data
npm run db migrate      # Chỉ chạy migration SQL vào DB
npm run db seed         # Chỉ nạp dữ liệu mẫu gia phả
npm run db push         # Đẩy trực tiếp schema lên DB
npm run db generate     # Tạo file migration SQL mới
npm run db studio       # Mở Drizzle Studio trực quan trên web
npm run db help         # Hiển thị bảng hướng dẫn lệnh
```
