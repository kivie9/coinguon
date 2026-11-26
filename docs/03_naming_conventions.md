# QUY TẮC ĐỊNH NGHĨA VÀ CẤU TRÚC THƯ MỤC (V5 - ĐA THIẾT BỊ & PHÂN CHIA COMPONENT)

## 1. Quy tắc phân chia Component theo thiết bị & chức năng

Dự án có 2 luồng thiết kế riêng biệt:
1. **Mobile & Tablet:** Tối ưu tương tác chạm (Touch, Gestures, Bottom Navigation, Touch Target >= 48px).
2. **PC, Laptop & Desktop:** Tối ưu chuột & bàn phím, tận dụng không gian ngang, thanh bên Sidebar, bố cục lưới rộng.

Để đảm bảo code rõ ràng, có tổ chức, các component được phân tách cụ thể:

* **`src/components/ui/`**: Các primitive component từ `shadcn/ui` (`button.tsx`, `card.tsx`, `badge.tsx`, `dialog.tsx`, `input.tsx`, `label.tsx`).
* **`src/components/common/`**: Các component dùng chung giữa mọi nền tảng (ví dụ: `LunarDateBadge.tsx`, `DeviceSwitchButton.tsx`).
* **`src/components/layout/`**: Các khung layout theo thiết bị (`MobileLayout.tsx`, `DesktopLayout.tsx`, `ResponsiveLayout.tsx`, `BottomNav.tsx`).
* **`src/components/mobile/`**: Các component chuyên dụng cho **Mobile & Tablet** (`MobileMemberCard.tsx`, `MobileHeader.tsx`).
* **`src/components/desktop/`**: Các component chuyên dụng cho **PC, Laptop & Desktop** (`DesktopMemberCard.tsx`, `DesktopHeader.tsx`).
* **`src/features/`**: Tổ chức theo tính năng nghiệp vụ (ví dụ: `features/members/`, `features/genealogy/`).
  * `features/members/components/MemberCardAdaptive.tsx`
  * `features/members/components/MemberList.tsx`

---

## 2. Cấu trúc thư mục chi tiết

```text
src/
├── app/                      # Next.js App Router (Pages, Layout, Server Actions)
│   ├── actions/              # Server Actions ("use server")
│   ├── globals.css           # Tailwind CSS v4 + theme variables
│   ├── layout.tsx            # Root layout bọc DeviceProvider
│   └── page.tsx              # Trang chủ sử dụng ResponsiveLayout & MemberList
├── components/
│   ├── common/               # Component dùng chung giữa mọi thiết bị
│   │   ├── DeviceSwitchButton.tsx
│   │   └── LunarDateBadge.tsx
│   ├── desktop/              # Component dành riêng cho PC, Laptop, Desktop
│   │   ├── DesktopHeader.tsx
│   │   └── DesktopMemberCard.tsx
│   ├── layout/               # Khung sườn giao diện
│   │   ├── BottomNav.tsx     # Điều hướng đáy cho Mobile/Tablet
│   │   ├── DesktopLayout.tsx # Layout màn hình rộng
│   │   ├── MobileLayout.tsx  # Layout màn hình cảm ứng di động
│   │   └── ResponsiveLayout.tsx # Bộ chuyển layout tự thích ứng
│   ├── mobile/               # Component dành riêng cho Mobile, Tablet
│   │   ├── MobileHeader.tsx
│   │   └── MobileMemberCard.tsx
│   └── ui/                   # Primitive UI components (shadcn)
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       └── label.tsx
├── features/                 # Tính năng theo module nghiệp vụ
│   └── members/
│       └── components/
│           ├── MemberCardAdaptive.tsx
│           └── MemberList.tsx
├── hooks/
│   └── useDevice.tsx         # Hook & Context nhận diện thiết bị đa yếu tố
├── lib/
│   └── utils.ts              # Helper cn() cho Tailwind/shadcn
├── utils/
│   └── deviceDetector.ts     # Thuật toán nhận diện phần cứng, cảm ứng, UA, pointer
├── proxy.ts                  # Server-side proxy/middleware nhận diện thiết bị
└── core/                     # Database, Drizzle ORM, Base Repository & Service
```

---

## 3. Cơ chế kiểm tra thiết bị đa yếu tố (Multi-factor Device Detection)

Không chỉ kiểm tra theo chiều rộng màn hình (width) mà kết hợp:
1. **Server-side (Next.js Proxy/Middleware):** Phân tích `User-Agent` (`device.type` trong `next/server`), gắn `x-device-group` header và cookie `device_group` để Server Components SSR đúng giao diện, loại bỏ hiện tượng giật giật (layout shift / hydration flicker).
2. **Phần cứng cảm ứng:** `navigator.maxTouchPoints > 0` và `ontouchstart in window`.
3. **Loại con trỏ:** CSS Media Query `(pointer: coarse)` (ngón tay/cảm ứng) và `(hover: hover)` (chuột máy tính).
4. **Kích thước & Góc nhìn:** `window.innerWidth`, orientation (`portrait`/`landscape`).
5. **Chế độ ép buộc (Manual Override):** Cho phép người dùng chuyển đổi thủ công giữa Mobile/Tablet và Desktop mode thông qua `DeviceSwitchButton`.
