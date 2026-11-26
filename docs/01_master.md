Đây là bản tài liệu tổng hợp toàn diện (Master Document) để bạn bắt đầu xây dựng hệ thống Gia phả số tại Việt Nam. Tài liệu này được tối ưu cho đối tượng người cao tuổi và khả năng mở rộng từ Web sang App.

---

# TÀI LIỆU THIẾT KẾ HỆ THỐNG GIA PHẢ SỐ (VIETNAMESE FAMILY TREE)

## 1. PHÂN TÍCH CHỨC NĂNG (REQUIREMENTS)

| Nhóm chức năng | Chi tiết tính năng | Ưu tiên cho người già |
| --- | --- | --- |
| **Quản lý cốt lõi** | Thêm/Sửa/Xóa thành viên, kết nối quan hệ (vợ chồng, con cái, con nuôi). | Cực cao |
| **Số hóa tư liệu** | Lưu trữ ảnh cũ, video, bản quét sắc phong, văn tự cổ. | Cao |
| **Tâm linh & Sự kiện** | Thông báo ngày giỗ (Âm lịch), nhắc nhở họp họ, sơ đồ mộ phần. | Cực cao |
| **Vai vế thông minh** | Chọn 2 người ngẫu nhiên để biết cách xưng hô đúng. | Cao |
| **Phân quyền** | Admin (Trưởng họ) chỉnh sửa; Thành viên xem & bình luận. | Trung bình |

---

## 2. THIẾT KẾ HỆ THỐNG (ARCHITECTURE)

* **Mô hình:** Client-Server (RESTful API).
* **Công nghệ đề xuất:**
* **Backend:** Node.js (Express) hoặc Python (FastAPI) - Xử lý logic xưng hô phức tạp.
* **Database:** PostgreSQL (Sử dụng *Recursive CTE* để truy vấn cây) hoặc Neo4j (Graph Database).
* **Frontend Web:** Next.js (Tối ưu SEO và tốc độ tải trang).
* **Mobile App (Giai đoạn 2):** Flutter hoặc React Native (Dùng chung Logic với Web).



---

## 3. THIẾT KẾ DỮ LIỆU (ERD - ENTITY RELATIONSHIP DIAGRAM)

### Các bảng chính (Schema):

1. **Members:** `id`, `full_name`, `gender`, `birthday_lunar`, `death_day_lunar`, `is_alive`, `generation_number`, `bio`.
2. **Relationships:** `id`, `person_id`, `related_person_id`, `type` (cha-con, vợ-chồng, con-nuôi), `order_in_family` (thứ bậc anh em).
3. **Media:** `id`, `member_id`, `file_url`, `type` (image/video/document).
4. **Events:** `id`, `title`, `lunar_month`, `lunar_day`, `member_id` (liên kết ngày giỗ).

---

## 4. LOGIC XỬ LÝ XƯNG HÔ (RELATIONSHIP LOGIC)

**Nên xử lý tại: Backend.**

* **Quy trình:** 1.  Dùng SQL Recursive tìm **Tổ tiên chung gần nhất (LCA)**.
2.  Tính toán khoảng cách đời giữa người A và B so với LCA.
3.  Xét giới tính và thứ bậc (anh/em của bố/mẹ) để áp bộ quy tắc tiếng Việt.
* **Ví dụ Code Logic (Pseudo-code):**
```python
if dist_A == 2 and dist_B == 1:
    if B_gender == 'Male' and B_is_older_than_A_parent:
        return "Bác"
    elif B_gender == 'Male' and not B_is_older_than_A_parent:
        return "Chú/Cậu"

```



---

## 5. THIẾT KẾ GIAO DIỆN (UI/UX CHO NGƯỜI CAO TUỔI)

### Nguyên tắc thiết kế:

* **Thị giác:** Font chữ tối thiểu **18px**, độ tương phản cao (đen trên nền kem/trắng). Tránh dùng icon đơn độc, luôn đi kèm chữ (Ví dụ: `[🔍 Tìm kiếm]`).
* **Tương tác:** Nút bấm lớn ($44 \times 44$ pixels), không dùng các thao tác phức tạp như vuốt (swipe) hay nhấn giữ (long press).
* **Tính năng đặc thù:**
* **Chế độ Âm lịch:** Luôn hiển thị song song ngày Dương và ngày Âm.
* **Audio Guide:** Nút loa để nghe kể về tiểu sử cụ tổ thay vì đọc.



### Wireframe gợi ý:

* **Màn hình Cây:** Sử dụng các thẻ (Cards) lớn xếp chồng theo chiều dọc thay vì sơ đồ mạng nhện quá dày đặc.
* **Màn hình Tra cứu xưng hô:** Giao diện 2 cột: [Người A] <---> [Người B] => [Kết quả: B là Ông Chú của A].

---

## 6. LỘ TRÌNH THỰC HIỆN (ROADMAP)

1. **Tháng 1:** Thiết kế DB PostgreSQL và API cơ bản (CRUD thành viên).
2. **Tháng 2:** Xây dựng Web Dashboard đơn giản, nhập liệu dữ liệu mẫu của dòng họ.
3. **Tháng 3:** Viết thuật toán tìm LCA và Logic xưng hô.
4. **Tháng 4:** Tối ưu UI cho người già dựa trên phản hồi thực tế.
5. **Tháng 5+:** Đóng gói thành App di động (Flutter).

---

**Bước tiếp theo tôi có thể làm cho bạn:** > Bạn có muốn tôi viết một đoạn **Script SQL (PostgreSQL)** để tạo các bảng dữ liệu này và một câu lệnh mẫu để truy vấn tìm "Tổ tiên chung" không?