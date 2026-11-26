# TÀI LIỆU THIẾT KẾ HỆ THỐNG GIA PHẢ SỐ (CẬP NHẬT V3 - DRIZZLE & SHADCN)

## 1. TECHSTACK CHỈ ĐỊNH

Hệ thống sử dụng các công nghệ hiện đại nhất:

* **Frontend:** `Next.js 16` (App Router) - Giúp SEO tối ưu và tốc độ tải trang cực nhanh với Turbopack.
* **UI Components:** `shadcn/ui` + `TailwindCSS v4` - Thư viện component dễ tùy biến, linh hoạt, tạo UI có độ tương phản cao, phông chữ lớn và thân thiện với người cao tuổi.
* **Backend & Database:** `Supabase` (PostgreSQL + Auth + Storage) - Cung cấp Database thời gian thực và quản lý tài liệu, hình ảnh.
* **ORM:** `Drizzle ORM` - Siêu nhẹ, type-safe tối đa, hiệu năng cao, tương thích hoàn hảo với Serverless và Next.js App Router mà không phụ thuộc vào decorators hay reflect-metadata.

---

## 2. QUY TẮC VIẾT CODE (CODING RULES)

### A. Quy tắc về Dữ liệu (Drizzle ORM & Database)

1. **Strict Typing:** Mọi Schema phải được định nghĩa bằng Drizzle pgTable (`members`, `relationships`) với infer types (`Member`, `NewMember`). Không dùng `any`.
2. **Naming Convention:** Tên bảng dùng số nhiều (`members`, `relationships`), tên cột trong DB dùng `snake_case` (`full_name`, `birthday_solar`), thuộc tính TypeScript dùng `camelCase`.
3. **Migration:** Sử dụng `drizzle-kit` (`npm run db:generate`, `npm run db:push`, `npm run db:migrate`) để quản lý thay đổi schema cơ sở dữ liệu.
4. **Soft Delete:** Sử dụng cột `deleted_at` (`timestamp with time zone`) cho bảng `members`. Người già rất dễ xóa nhầm, chúng ta cần cơ chế khôi phục dữ liệu an toàn.

### B. Quy tắc Frontend (Next.js, shadcn & Tailwind)

1. **Component-Driven:** Sử dụng hệ sinh thái `shadcn/ui` (`Button`, `Card`, `Badge`, `Dialog`, `Input`, `Label`) kết hợp các custom component chuyên biệt (`MemberCard`, `RelationshipResult`).
2. **Accessibility (A11y) First:**
   * Sử dụng đơn vị `rem` để người dùng có thể phóng to chữ theo cài đặt trình duyệt.
   * Mọi ảnh phải có thẻ `alt` mô tả (ví dụ: "Ảnh cụ tổ Nguyễn Văn A").
   * Font chữ to rõ ràng, độ tương phản cao cho người già.
3. **Client vs Server Component:**
   * Dùng **Server Components** để fetch dữ liệu gia phả (tăng tốc độ).
   * Chỉ dùng **Client Components** cho các tính năng tương tác (Search, Sơ đồ cây động, Modal).
4. **Server-Side Database Operations (Bắt buộc):**
   * **TUYỆT ĐỐI KHÔNG** thao tác trực tiếp với Database từ Client Components.
   * Mọi thao tác đọc/ghi dữ liệu phải thông qua **Next.js Server Actions** (`"use server"`) hoặc Route Handlers.
   * Tuân thủ kiến trúc phân tầng: Component -> Server Action -> Service -> Repository -> Drizzle DB.

### C. Quy tắc Logic Xưng hô (Business Logic)

1. **Centralized Logic:** Toàn bộ logic tính vai vế nằm trong `src/services/` và `src/utils/`. Không viết logic này trực tiếp bên trong UI.
2. **Unit Test:** Viết test kiểm thử cho logic tính vai vế và các quan hệ gia phả.

---

## 3. CƠ SỞ DỮ LIỆU CHI TIẾT (DRIZZLE SCHEMA)

```typescript
// src/core/database/schema.ts
import { pgTable, serial, text, varchar, integer, boolean, timestamp, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const members = pgTable('members', {
    id: serial('id').primaryKey(),
    fullName: text('full_name').notNull(),
    gender: varchar('gender', { length: 10 }),
    birthdaySolar: date('birthday_solar'),
    birthdayLunar: varchar('birthday_lunar', { length: 20 }),
    deathDayLunar: varchar('death_day_lunar', { length: 20 }),
    isAlive: boolean('is_alive').default(true).notNull(),
    generationNumber: integer('generation_number').default(1).notNull(),
    bio: text('bio'),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const relationships = pgTable('relationships', {
    id: serial('id').primaryKey(),
    personId: integer('person_id').notNull().references(() => members.id, { onDelete: 'cascade' }),
    relatedPersonId: integer('related_person_id').notNull().references(() => members.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 20 }).notNull(), // 'PARENT_CHILD', 'SPOUSE', 'ADOPTED'
    orderInFamily: integer('order_in_family'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;
```

---

## 4. GIAO DIỆN (UI) CHO NGƯỜI GIÀ VỚI SHADCN & TAILWIND

* **Chữ:** `text-xl` hoặc `text-2xl` cho tiêu đề và tên cụ tổ.
* **Màu sắc:** `bg-stone-50` (nền giấy dịu mắt), `text-slate-900` (chữ đen đậm), `text-red-800` (tông màu gia phả truyền thống).
* **Nút bấm:** Kích thước lớn, min-h 48px trở lên (`py-6 h-auto`), viền rõ ràng, dễ bấm trên cả chuột và màn hình cảm ứng.
