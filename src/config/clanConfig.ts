import { INITIAL_CLAN_DATA } from './clanData';

/**
 * Cấu hình thông tin dòng tộc & gia phả dùng chung toàn hệ thống.
 * Dữ liệu mặc định được đồng bộ từ INITIAL_CLAN_DATA trong clanService.
 * Dùng cho các file metadata tĩnh (layout, manifest) và fallback.
 * Đối với UI components, ưu tiên dùng hook `useClan()` từ ClanProvider
 * để tự động đồng bộ thời gian thực với Mock API / Database.
 */
export const CLAN_CONFIG = {
    // Thông tin cơ bản dòng tộc
    name: INITIAL_CLAN_DATA.name,
    shortName: INITIAL_CLAN_DATA.shortName,
    hanNomName: INITIAL_CLAN_DATA.hanNomName,
    branchName: INITIAL_CLAN_DATA.branchName,
    branchTitle: INITIAL_CLAN_DATA.branchTitle,
    branchFullTitle: INITIAL_CLAN_DATA.branchFullTitle,
    slogan: INITIAL_CLAN_DATA.slogan,
    subSlogan: INITIAL_CLAN_DATA.subSlogan,
    motto: INITIAL_CLAN_DATA.motto,
    description: INITIAL_CLAN_DATA.description,
    memberExplorerTitle: INITIAL_CLAN_DATA.memberExplorerTitle,
    memberExplorerSubtitle: INITIAL_CLAN_DATA.memberExplorerSubtitle,

    // Từ đường & Quần thể tâm linh
    ancestralHall: INITIAL_CLAN_DATA.ancestralHall,

    // Tài khoản công đức & Hương hỏa
    donation: INITIAL_CLAN_DATA.donation,

    // Đại diện Ban Trị Sự & Liên lạc
    contact: {
        leaderName: INITIAL_CLAN_DATA.contact.leader.fullName,
        leaderRole: INITIAL_CLAN_DATA.contact.leader.role,
        leaderTerm: INITIAL_CLAN_DATA.contact.leader.term,
        hotline: INITIAL_CLAN_DATA.contact.hotline,
        email: INITIAL_CLAN_DATA.contact.email,
        hnContact: INITIAL_CLAN_DATA.contact.hnContact,
        sgContact: INITIAL_CLAN_DATA.contact.sgContact,
    },

    // Bản quyền & Chú dẫn hệ thống
    systemName: INITIAL_CLAN_DATA.systemName,
    copyright: INITIAL_CLAN_DATA.copyright,
    copyrightFull: INITIAL_CLAN_DATA.copyrightFull,
    footerCopyright: INITIAL_CLAN_DATA.footerCopyright,
} as const;

export type ClanConfig = typeof CLAN_CONFIG;
