# [TASK - CHỜ TRIỂN KHAI] CHẾ ĐỘ NGOẠI TUYẾN (OFFLINE MODE) & THÔNG BÁO ĐẨY (WEB PUSH)

> **Trạng thái:** `PENDING / ON HOLD` (Chờ kích hoạt theo yêu cầu)  
> **Mục tiêu:** Cung cấp trải nghiệm xem gia phả ngoại tuyến khi về quê mất sóng và gửi thông báo nhắc ngày giỗ âm lịch đến điện thoại con cháu.

---

## 1. Mô tả yêu cầu (Requirements)

### A. Chế độ Ngoại tuyến (Offline Mode)
1. **Bối cảnh:** Khi con cháu về quê họp họ, viếng nghĩa trang dòng họ hoặc nhà thờ tổ vùng sâu/vùng xa, sóng 4G/WiFi thường yếu hoặc mất kết nối hoàn toàn.
2. **Kỳ vọng:**
   - Ứng dụng vẫn mở lên bình thường mà không báo "Không có kết nối Internet" của trình duyệt.
   - Toàn bộ cây gia phả, danh sách thành viên, tiểu sử và hình ảnh đã từng xem trước đó được tự động lưu vào bộ nhớ cục bộ (IndexedDB / Cache Storage).
   - Khi có mạng trở lại, tự động đồng bộ ngầm các thay đổi.

### B. Thông báo Đẩy (Web Push Notifications)
1. **Nhắc nhở ngày giỗ Âm lịch:**
   - Thông báo trước 3 ngày và đúng ngày: *"Còn 3 ngày nữa đến ngày giỗ Cụ Khởi Tổ Nguyễn Văn Quang (15/08 Âm lịch)"*.
2. **Thông báo sự kiện dòng họ:**
   - Nhắc nhở lịch họp họ đầu xuân, tảo mộ tiết Thanh Minh, mừng thọ các cụ cao niên.

---

## 2. Kiến trúc kỹ thuật đề xuất (Technical Architecture)

### 1. Service Worker & Caching (PWA Offline)
* **Thư viện đề xuất:** `@serwist/next` (kế thừa hiện đại của `next-pwa`, tương thích hoàn toàn Next.js 16 và App Router).
* **Chiến lược Cache:**
  * **Static Assets (CSS, JS, Fonts):** `CacheFirst` (Lưu cache vĩnh viễn, cập nhật khi có build hash mới).
  * **Dữ liệu thành viên & cây gia phả:** `StaleWhileRevalidate` (Hiển thị ngay dữ liệu cache ngoại tuyến, đồng thời tải bản mới nhất ngầm từ Supabase).
  * **Hình ảnh (Chân dung cụ tổ, văn tự cổ):** `CacheFirst` với giới hạn dung lượng 50MB.

### 2. Lưu trữ dữ liệu Offline với IndexedDB
* **Thư viện:** `idb` hoặc `dexie.js`.
* Lưu danh sách thành viên đã tải vào IndexedDB để hỗ trợ tìm kiếm và tra cứu vai vế ngay cả khi offline.

### 3. Web Push Notifications
* **Chuẩn:** W3C Push API + Notification API.
* **Giao thức:** VAPID Keys (`web-push` npm package trên Node.js backend).
* **Lưu Subscription:** Tạo bảng `push_subscriptions` trong cơ sở dữ liệu Drizzle:
  ```typescript
  export const pushSubscriptions = pgTable('push_subscriptions', {
    id: serial('id').primaryKey(),
    endpoint: text('endpoint').notNull().unique(),
    p256dh: text('p256dh').notNull(),
    auth: text('auth').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  });
  ```
* **Cronjob nhắc giỗ:** Chạy hàng ngày lúc 06:00 sáng kiểm tra ngày âm lịch hôm nay và 3 ngày tới qua thư viện `lunar-javascript` đã cài sẵn trong dự án.

---

## 3. Danh sách công việc khi kích hoạt (Checklist)

- [ ] Cài đặt `@serwist/next` và cấu hình Service Worker trong `next.config.ts`.
- [ ] Thiết lập trang fallback offline: `src/app/offline.tsx`.
- [ ] Tạo bảng `push_subscriptions` trong `src/core/database/schema.ts` và chạy `npm run db`.
- [ ] Viết Server Action xin quyền thông báo (`Notification.requestPermission()`) và lưu VAPID subscription.
- [ ] Viết cronjob hoặc API route gửi thông báo nhắc giỗ âm lịch hàng ngày.

