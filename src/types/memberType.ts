export interface MemberChildDto {
    id: number;
    fullName: string;
    role: string; // "Trưởng nam", "Thứ nữ", "Thứ nam", "Út nam"
    birthYear?: number | string;
    residence?: string;
    childrenCount?: number;
}

export interface MemberHonorDto {
    id: number;
    title: string;
    description: string;
    year?: string;
    badgeType?: 'star' | 'medal' | 'verified';
}

export interface MemberPhotoDto {
    id: number;
    url: string;
    caption: string;
    year: string;
}

export interface MemberDto {
    id: number;
    fullName: string;
    gender?: string | null;
    birthdaySolar?: string | null;
    birthdayLunar?: string | null;
    deathDayLunar?: string | null;
    isAlive: boolean;
    generationNumber: number;
    bio?: string | null;
    // Các thuộc tính mở rộng cho giao diện dòng tộc
    courtesyName?: string | null; // Tự hiệu, tên chữ (VD: Tự Phúc Minh, Hiệu Từ Thục, Tự Phúc An)
    roleTitle?: string | null; // Danh vị, vai vế (VD: Cụ Cố Khảo, Trưởng Chi 2, Tộc Trưởng)
    burialPlace?: string | null; // Nơi an táng
    residence?: string | null; // Nơi cư trú
    branch?: string | null; // Chi nhánh dòng tộc
    spouse?: string | null; // Hôn phối / Xuất thân
    spouseLifeStatus?: string | null; // "Đã tạ thế" | "Còn sống"
    spouseDeathDayLunar?: string | null; // Ngày kỵ nhật của phối ngẫu
    spouseAvatarUrl?: string | null; // Ảnh đại diện của phối ngẫu
    duties?: string | null; // Trách nhiệm dòng tộc / Ban trị sự / Bảng vàng
    avatarUrl?: string | null; // Đường dẫn ảnh đại diện
    phone?: string | null; // Số điện thoại
    badgeType?: 'candle' | 'flower' | 'shield' | 'heart' | 'star' | 'trophy';
    ancestralOrigin?: string | null; // Quê quán từ đường gốc (VD: Làng Mộ Trạch, Bình Giang, Hải Dương)
    childrenList?: MemberChildDto[]; // Danh sách con cháu trực hệ
    honorsList?: MemberHonorDto[]; // Bằng khen, tuyên dương công đức
    photosList?: MemberPhotoDto[]; // Album hình ảnh tư liệu kỷ niệm
}
