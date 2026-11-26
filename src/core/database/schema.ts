/**
 * Root Database Schema Export
 * Hệ thống Quản Lý Gia Phả & Dòng Họ (Cội Nguồn)
 *
 * Cấu trúc schema được chuẩn hóa và phân tách thành các module chuyên biệt:
 *  - schema/clans.ts     : Dòng họ (clans), Chi phái (branches), Từ đường (ancestral_halls), Sắc phong (clan_documents)
 *  - schema/members.ts   : Thành viên (members), Mối quan hệ đa chiều (relationships), Bằng khen (member_honors), Di ảnh (member_media)
 *  - schema/events.ts    : Sự kiện (events), Nghi thức tế lễ (event_ritual_steps), Ban khánh tiết (event_organizers)
 *  - schema/funds.ts     : Quỹ gia tộc (funds), Giao dịch công đức thu chi (fund_transactions)
 *  - schema/news.ts      : Bản tin dòng tộc (news_articles), Bình luận (news_comments)
 *  - schema/users.ts     : Tài khoản người dùng (users), Nhật ký kiểm toán (audit_logs)
 *  - schema/relations.ts : Toàn bộ định nghĩa quan hệ Drizzle Relations 2 chiều giữa các bảng
 */

export * from './schema/index';
