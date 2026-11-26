# Hướng Dẫn Vận Hành Cloudflare D1, Migration & Deploy Workers (`coinguon`)

Tài liệu ghi nhận quy trình chuẩn cho hạ tầng dự án **Cội Nguồn (`coinguon`)** sử dụng **Next.js 16 + OpenNext + Cloudflare Workers + Cloudflare D1 (`coinguon-db`) + Auth.js v5**.

---

## 1. Thông Tin Hạ Tầng

| Thành phần | Giá trị |
|---|---|
| Tên Worker | `coinguon` |
| URL Production | `https://coinguon.devcloudly.workers.dev` |
| Cloudflare D1 Database | `coinguon-db` (vùng **APAC**) |
| D1 Database ID | `4bc393f3-e6fe-4780-8a5e-773e70906ca5` |
| Binding trong Worker | `DB` (`wrangler.jsonc`) |
| Thư mục SQL Migration | `drizzle/` |
| Xác thực | Auth.js v5 (`next-auth@beta`, JWT cookie + PBKDF2-SHA256) |

---

## 2. Phát Triển Cục Bộ (Local Development)

Mặc định trên máy cá nhân, ứng dụng kết nối SQLite cục bộ tại `file:./data/coinguon-db.db` (đồng bộ schema 100% với Cloudflare D1):

```bash
# 1. Tạo bảng (migration) và nạp dữ liệu mẫu 10 đời Họ Lê + 4 tài khoản Auth.js
npm run db setup

# 2. Chạy server dev
npm run dev
```

**4 tài khoản mẫu (mật khẩu lấy từ biến môi trường `SEED_DEFAULT_PASSWORD` trong `.env.local` khi chạy seed):**
- `admin@coinguon.vn` (`SUPER_ADMIN`)
- `quantri@coinguon.vn` (`CLAN_ADMIN`)
- `chicuong@coinguon.vn` (`BRANCH_ADMIN`)
- `thanhvien@coinguon.vn` (`MEMBER`)

---

## 3. Quy Trình Sửa Schema & Chạy Migration D1 (Quan Trọng)

Mỗi khi bạn thêm/sửa/xóa bảng hoặc cột trong `src/core/database/schema/*`:

### Bước 1: Sinh file SQL migration mới
```bash
npx drizzle-kit generate
```
Lệnh này sẽ tạo file `.sql` mới trong thư mục `drizzle/`.

### Bước 2: Áp dụng migration lên local và Cloudflare D1 (remote)
```bash
# Áp dụng cho SQLite cục bộ (local dev)
npm run db migrate

# Áp dụng cho Cloudflare D1 production (remote)
npx wrangler d1 migrations apply coinguon-db --remote
```

> **Lưu ý quan trọng:**
> Khi deploy bằng tay (`npm run cf:deploy`) hoặc deploy tự động qua Git, **bắt buộc** phải chạy `npx wrangler d1 migrations apply coinguon-db --remote` sau khi có file migration mới trong `drizzle/`, nếu không code mới chạy trên Workers sẽ lỗi thiếu bảng/cột trên D1.
> Bạn có thể gộp thẳng bước này vào **Deploy command** trên Cloudflare Workers Builds (xem mục 4).

---

## 4. Kết Nối Git Để Tự Động Deploy (Cloudflare Workers Builds)

### Chuẩn bị trong repository
- Đảm bảo file `.npmrc` ở thư mục gốc có dòng `legacy-peer-deps=true` (tránh xung đột peer dependency giữa `next@16` và `next-auth@beta` khi Cloudflare chạy `npm ci`).
- Không commit `.env.local`, `data/`, `.open-next/`, `.wrangler/` (đã có sẵn trong `.gitignore`).

### Cấu hình trên Cloudflare Dashboard
Vào **Workers & Pages → `coinguon` → Settings → Build → Connect Git Repository** và điền:

- **Production branch:** `main`
- **Root directory:** `/` (để trống)
- **Build command:**
  ```bash
  npx opennextjs-cloudflare build
  ```
- **Deploy command** *(tự động chạy D1 migration trước khi deploy bản Worker mới)*:
  ```bash
  npx wrangler d1 migrations apply coinguon-db --remote && npx opennextjs-cloudflare deploy
  ```

### Biến môi trường & Secrets
- Binding `DB -> coinguon-db` và biến `DB_ENABLED="true"` đã khai báo sẵn trong `wrangler.jsonc`.
- Secret `AUTH_SECRET` được lưu bảo mật trên Cloudflare Worker (không lưu trong Git). Nếu cần xoay (rotate) secret mới:
  ```bash
  npx wrangler secret put AUTH_SECRET
  ```

---

## 5. Các Lệnh Thao Tác Nhanh

```bash
# Build & deploy thủ công lên Cloudflare Workers
npm run cf:deploy

# Kiểm tra nhanh dữ liệu thực trên Cloudflare D1
npx wrangler d1 execute coinguon-db --remote --command "SELECT COUNT(*) AS total_members FROM members;"

# Xem danh sách migration đã áp dụng trên Cloudflare D1
npx wrangler d1 migrations list coinguon-db --remote
```
