import { MemberDto } from '@/types/memberType';
import { ROMAN_NUMERALS } from '@/constants/memberConstants';

/**
 * Lấy ký tự số La Mã theo thế hệ (ví dụ: 1 -> I, 6 -> VI)
 */
export function getRomanNumeral(gen: number): string {
    return ROMAN_NUMERALS[gen] || `${gen}`;
}

/**
 * Trả về danh xưng và huy hiệu đặc trưng theo từng Đời
 */
export function getGenerationTitle(gen: number): { title: string; badge: string } {
    const roman = getRomanNumeral(gen);
    switch (gen) {
        case 1:
            return { title: `Đời Thứ ${roman} • Tiền Nhân Tổ Tiên`, badge: 'Tiền Nhân' };
        case 2:
            return { title: `Đời Thứ ${roman} • Trưởng Lão Đương Thời`, badge: 'Trưởng Lão' };
        case 3:
            return { title: `Đời Thứ ${roman} • Trung Niên Dòng Tộc`, badge: 'Bản Tộc' };
        case 4:
            return { title: `Đời Thứ ${roman} • Hậu Duệ & Kế Thừa`, badge: 'Kế Thừa' };
        default:
            return { title: `Đời Thứ ${roman} • Thế Hệ Tiếp Nối`, badge: 'Hậu Duệ' };
    }
}

/**
 * Tính số tuổi dựa vào ngày sinh dương lịch
 */
export function calculateAge(birthdaySolar?: string | null, fallbackYear = 1948): number {
    if (!birthdaySolar) {
        const currentYear = new Date().getFullYear();
        return currentYear - fallbackYear;
    }
    const birthYear = new Date(birthdaySolar).getFullYear();
    const currentYear = new Date().getFullYear();
    return isNaN(birthYear) ? currentYear - fallbackYear : currentYear - birthYear;
}

/**
 * Kiểm tra thành viên có thuộc chi nhánh được chỉ định hay không
 */
export function matchesBranch(member: MemberDto, branch: 'all' | 'chi2' | 'chitruong' | 'daure'): boolean {
    if (branch === 'all') return true;

    const b = (member.branch || '').toLowerCase();
    const r = (member.roleTitle || '').toLowerCase();
    const s = (member.spouse || '').toLowerCase();

    if (branch === 'chi2') {
        return b.includes('chi 2') || b.includes('bản tộc') || r.includes('chi 2');
    }
    if (branch === 'chitruong') {
        return b.includes('trưởng') || r.includes('trưởng') || r.includes('đích tôn');
    }
    if (branch === 'daure') {
        return s.includes('dâu') || s.includes('phối') || r.includes('dâu') || r.includes('bà cả');
    }

    return true;
}

/**
 * Kiểm tra thành viên có khớp từ khóa tìm kiếm hay không
 */
export function matchesSearchQuery(member: MemberDto, query: string): boolean {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();

    return Boolean(
        member.fullName?.toLowerCase().includes(q) ||
        member.courtesyName?.toLowerCase().includes(q) ||
        member.roleTitle?.toLowerCase().includes(q) ||
        member.birthdaySolar?.includes(q) ||
        member.birthdayLunar?.includes(q) ||
        member.deathDayLunar?.includes(q) ||
        member.burialPlace?.toLowerCase().includes(q) ||
        member.residence?.toLowerCase().includes(q) ||
        member.branch?.toLowerCase().includes(q) ||
        member.bio?.toLowerCase().includes(q)
    );
}

