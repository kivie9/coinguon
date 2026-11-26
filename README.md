# Cội Nguồn (`coinguon`)

**Cội Nguồn** là nền tảng gia phả số lưu giữ phả ký, thế thứ 10 đời, lịch kỵ nhật âm lịch, quỹ hương hỏa – khuyến học và bản tin dòng tộc (**Lê Tộc Đại Tôn**). Ứng dụng được thiết kế theo phong cách **Flat UI** tối giản, độ tương phản cao, chữ rõ ràng để thân thiện với cả người lớn tuổi lẫn thế hệ trẻ trên cả điện thoại (PWA) và máy tính.

- **Bản trực tuyến:** https://coinguon.devcloudly.workers.dev

---

## Tính năng chính

- **Phả hệ & Sổ đinh bộ 10 đời:** Tra cứu thành viên theo đời (Đời I → Đời X), chi phái, trạng thái sinh/tử, tự hiệu, hôn phối, danh sách con cháu trực hệ, bằng khen và tư liệu ảnh.
- **Sự kiện & Kỵ nhật Âm lịch:** Tự động quy đổi lịch âm – dương, đếm ngược đại lễ giỗ tổ, danh sách ngày giỗ tiền nhân, nghi thức tế lễ và ban khánh tiết.
- **Quỹ Hương hỏa & Khuyến học:** Theo dõi tồn quỹ công khai, lịch sử thu – chi công đức và thông tin chuyển khoản.
- **Bản tin & Hồ sơ Dòng tộc:** Lưu trữ gia quy, tộc ước, sắc phong, thông tin Từ đường (chỉ đường Google Maps) và ban liên lạc con cháu xa quê.
- **Trang Quản trị (Admin CMS) phân quyền 4 cấp:** `SUPER_ADMIN`, `CLAN_ADMIN`, `BRANCH_ADMIN`, `MEMBER` — quản lý nhân khẩu, sự kiện, quỹ họ và tài khoản người dùng.
- **PWA (Progressive Web App):** Hỗ trợ cài đặt trực tiếp lên màn hình chính điện thoại/máy tính.

---

## Công nghệ sử dụng

- **Framework:** Next.js 16 (App Router, Turbopack), React 19, TypeScript 5
- **Giao diện:** Tailwind CSS v4, `@base-ui/react`, `shadcn/ui`, `lucide-react`
- **Cơ sở dữ liệu:** Cloudflare D1 (SQLite) + Drizzle ORM (`drizzle-orm/sqlite-core`), SQLite cục bộ (`@libsql/client`) cho môi trường dev
- **Xác thực:** Auth.js v5 (`next-auth@beta`) với JWT cookie và băm mật khẩu Web Crypto `PBKDF2-SHA256`
- **Triển khai:** Cloudflare Workers qua `@opennextjs/cloudflare` & Wrangler 4

---

## Cài đặt & Chạy cục bộ

### 1. Cài đặt gói phụ thuộc
```bash
npm install
```

### 2. Cấu hình biến môi trường
Sao chép `.env.local.example` thành `.env.local` và điền các giá trị cục bộ:
```bash
cp .env.local.example .env.local
```
Tối thiểu cần khai báo:
- `SQLITE_URL="file:./data/coinguon-db.db"`
- `AUTH_SECRET` (chuỗi bí mật tối thiểu 32 ký tự)
- `SEED_DEFAULT_PASSWORD` (mật khẩu dùng khi chạy lệnh seed tài khoản mẫu)

### 3. Khởi tạo CSDL & Chạy dev server
```bash
# Chạy migration (17 bảng) và nạp dữ liệu mẫu 10 đời (145 thành viên + 4 tài khoản)
npm run db setup

# Khởi động máy chủ phát triển
npm run dev
```
Mở http://localhost:3000 trên trình duyệt.

---

## Lệnh thường dùng

| Lệnh | Mô tả |
|---|---|
| `npm run dev` | Chạy Next.js dev server |
| `npm run build` | Build bản production Next.js |
| `npm run db setup` | Chạy SQLite migration + nạp dữ liệu mẫu 10 đời |
| `npm run db generate` | Sinh file SQL migration mới trong `drizzle/` |
| `npm run db migrate` | Áp dụng migration lên CSDL cục bộ |
| `npm run db seed` | Nạp lại dữ liệu mẫu |
| `npm run cf:build` | Build gói Cloudflare Workers bằng OpenNext |
| `npm run cf:deploy` | Build và deploy trực tiếp lên Cloudflare Workers |

---

## Tài liệu kỹ thuật

- [Kiến trúc tổng thể](docs/01_master.md)
- [Quy chuẩn lập trình](docs/02_coding_rule.md)
- [Quy ước đặt tên](docs/03_naming_conventions.md)
- [Cấu trúc thư mục](docs/04_project_structure.md)
- [Hướng dẫn Cloudflare D1, Migration & Deploy Workers](docs/05_cloudflare_d1_deploy.md)
