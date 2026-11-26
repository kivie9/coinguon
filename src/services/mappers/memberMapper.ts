import { Member } from '@/core/database/schema';
import { buildLeFamily } from '@/core/database/data/leFamilyData';
import { MemberDto, MemberChildDto, MemberHonorDto, MemberPhotoDto } from '@/types/memberType';

/**
 * Tạo danh sách con cháu trực hệ theo thế hệ và nhân thân thành viên
 */
function getMemberChildrenMock(memberId: number, cleanName: string, gen: number): MemberChildDto[] {
    if (cleanName.includes('Quang') || cleanName.includes('Lụa')) {
        return [
            { id: 101, fullName: 'Lê Văn Phúc', role: 'Trưởng nam', birthYear: 1930, residence: 'Từ Đường Đại Tôn', childrenCount: 3 },
            { id: 102, fullName: 'Lê Văn Thọ', role: 'Thứ nam', birthYear: 1935, residence: 'Hải Dương', childrenCount: 4 },
            { id: 103, fullName: 'Lê Thị Bình', role: 'Thứ nữ', birthYear: 1942, residence: 'Hà Nội', childrenCount: 2 },
        ];
    }
    if (cleanName.includes('Phúc') || cleanName.includes('Mai')) {
        return [
            { id: 201, fullName: 'Lê Văn Khang', role: 'Trưởng nam', birthYear: 1958, residence: 'Hà Nội', childrenCount: 2 },
            { id: 202, fullName: 'Lê Văn Thịnh', role: 'Thứ nam', birthYear: 1966, residence: 'Hải Dương', childrenCount: 3 },
        ];
    }
    if (cleanName.includes('Khang') || cleanName.includes('Hoa')) {
        return [
            { id: 301, fullName: 'Lê Văn Minh', role: 'Trưởng nam', birthYear: 1988, residence: 'Hà Nội', childrenCount: 2 },
            { id: 302, fullName: 'Lê Thùy Linh', role: 'Thứ nữ', birthYear: 1993, residence: 'Hải Dương', childrenCount: 1 },
        ];
    }
    if (cleanName.includes('Minh')) {
        return [
            { id: 401, fullName: 'Lê Tuấn Anh', role: 'Đích tôn', birthYear: 2007, residence: 'Hà Nội (ĐH Bách Khoa)', childrenCount: 0 },
        ];
    }
    if (gen <= 2) {
        return [
            { id: memberId * 10 + 1, fullName: 'Lê Văn Hùng', role: 'Trưởng nam', birthYear: 1960 + gen * 5, residence: 'Hà Nội', childrenCount: 2 },
            { id: memberId * 10 + 2, fullName: 'Lê Thị Lan', role: 'Thứ nữ', birthYear: 1963 + gen * 5, residence: 'Hải Dương', childrenCount: 2 },
        ];
    }
    return [];
}

/**
 * Tạo danh sách khen thưởng, tuyên dương công đức
 */
function getMemberHonorsMock(memberId: number, cleanName: string, roleTitle: string, gen: number): MemberHonorDto[] {
    if (cleanName.includes('Quang') || cleanName.includes('Lụa')) {
        return [
            { id: 1, title: 'Khai Sơn Phá Thạch', description: 'Có công khai điền lập ấp và quy tập từ đường tổ tiên.', year: '1920', badgeType: 'star' },
            { id: 2, title: 'Bản Tộc Thượng Tôn', description: 'Sắc phong Tiền Nhân Khởi Tổ Lê Tộc Chi II.', year: '1945', badgeType: 'verified' },
        ];
    }
    if (cleanName.includes('Phúc') || roleTitle.includes('Tộc Trưởng') || roleTitle.includes('Trưởng Chi')) {
        return [
            { id: 11, title: 'Kỷ niệm chương "Vì sự nghiệp Khuyến học"', description: 'Do Trung ương Hội Khuyến học Việt Nam trao tặng.', year: '2018', badgeType: 'medal' },
            { id: 12, title: 'Bằng Tuyên Dương Công Đức Dòng Họ', description: 'Hội đồng Gia tộc Họ Lê Toàn Quốc trao tặng trong Đại lễ Tế Tổ.', year: '2022', badgeType: 'star' },
            { id: 13, title: 'Phó Chủ Tịch Hội Đồng Trưởng Lão', description: 'Nhiệm kỳ 2015 – nay tại Từ Đường Chi II.', year: '2015', badgeType: 'verified' },
        ];
    }
    if (cleanName.includes('Tuấn Anh')) {
        return [
            { id: 21, title: 'Giải Nhất Quốc Gia Môn Lịch Sử', description: 'Kỳ thi Học sinh giỏi Quốc gia niên khóa 2024–2025.', year: '2025', badgeType: 'medal' },
            { id: 22, title: 'Bảng Vàng Khuyến Học Lê Tộc', description: 'Hội đồng Gia tộc vinh danh và trao học bổng Hoa Trạng Nguyên.', year: '2025', badgeType: 'star' },
        ];
    }
    if (cleanName.includes('Trung') || cleanName.includes('Thịnh')) {
        return [
            { id: 31, title: 'Huy hiệu Trùng Tu Di Sản Từ Đường', description: 'Chỉ đạo hoàn thành tôn tạo Giếng Ngọc & Cổng Tam Quan.', year: '2024', badgeType: 'verified' },
        ];
    }
    return [
        { id: memberId * 10, title: 'Thành viên Tộc Ước Gương Mẫu', description: 'Gìn giữ nề nếp gia phong và tích cực tham gia việc họ.', year: '2023', badgeType: 'star' },
    ];
}

/**
 * Tạo danh sách hình ảnh di cảo tư liệu gia đình
 */
function getMemberPhotosMock(memberId: number, cleanName: string, gen: number): MemberPhotoDto[] {
    return [
        {
            id: memberId * 10 + 1,
            url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDklX2EE9agY1YPrvAoW1cxMVncSVZxg9F5602tTRjQae1gVWLJa0xxQrydZt-PhHVEhxAdb9lDsk5JE05K3bSYsuqHbHuExxaLoIa4iJkVhwe_9J_kNump0anZ6G_DXEbBpGCWitd11oACfd_VGmRkBedV0k5RW8vrr3DrBiSMkX3fuAh53b8__C87-viwzUR-wmyyDHI34w21Qp39-hhGiwL2-QsBY96cnqk1K8r9',
            caption: `Lễ tế tự và dâng hương tại Từ đường Chi II`,
            year: gen <= 2 ? '1985' : '2023',
        },
        {
            id: memberId * 10 + 2,
            url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzOYzNqcFuvng-6gO4E5ltnm_N7bLloLHYYIoUpSOQ3xPSxZdizj4CR_O3TpRTczbRyrp1ak3-s8LfsQlUhS981nmvOjQ3h7xUQeiW3TIl0C2PFD6RfTgfpTZJpGhEszqRfffxeQry5xicG4b7Cl9dNDboUgs988iWi0yVvp2jb9IfMzH_-GCFdxvt7_04MAfyUlXicNmH6G6dGgUjixusQBl2ivvCKWRCYRI58ZD1',
            caption: 'Nghi thức tế tổ Thanh Minh tại Hải Dương',
            year: '2022',
        },
        {
            id: memberId * 10 + 3,
            url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBp8Xe3r77525zUxrlQjVbZsgU5QhvnarKDgM4h3JWw1smQs16Rz0eUS6aOXN__D0Z0Nl6MLuLbam6p6j29ioFzl1lnc8RcbUBX_C9-6M3EdKKLHh-9RpMYfZoVF6NKIKZjnkIpoBHmOxRmOYsNIswdfav-ET5mBKa_Z8OSw5djQ5mbYp79JUnz3CWJ6hi3Uv7iX2JiL2PGay5iG1RxKsP9cen4ziMBUujCZj_Um791',
            caption: 'Bằng khen Khuyến học Gia tộc trao tặng',
            year: '2020',
        },
        {
            id: memberId * 10 + 4,
            url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpzYIj8lB6gsWfoMlKzfjlHMxG6w57xadqM-M9S6-IMcMhYdjgAn1CE6hkuGAqVsidnUtU9YCcFM9CODdwXHFJWLzNUvKdgKOV5gG5oWPKH2mpAUtQM3Weph5T4l72SWjBAMGMnpyNwMlsTzw_aSPGAO7R-0hHFOWQpmwIbIlBzYWfmDVkRQP-ptr7z0lS1k8K35O8koHc04yG2wwWExVKLOS_3q5m0wPL97kyqtw0',
            caption: 'Con cháu sum họp chúc thọ đầu xuân',
            year: '2024',
        },
    ];
}

/**
 * Hàm chuyên trách: Chuyển đổi bản ghi CSDL (Member) sang DTO hiển thị (MemberDto)
 * Tự động trích xuất tự hiệu, chức danh, phân định vai vế và địa điểm an táng/cư trú
 */
export interface MemberRelations {
    spouse?: Member | null;
    children?: Member[];
    /** Số con của từng người (theo id) để hiển thị "Hậu duệ: n con" */
    childCounts?: Map<number, number>;
}

function birthYearOf(m: Member): number | undefined {
    const y = m.birthdaySolar ? parseInt(String(m.birthdaySolar).slice(0, 4), 10) : NaN;
    return Number.isNaN(y) ? undefined : y;
}

function describeChild(c: Member, counts?: Map<number, number>, isFirstOfGender = false): MemberChildDto {
    let role: string;
    if (c.gender === 'Female') {
        role = isFirstOfGender ? 'Trưởng nữ' : 'Con gái';
    } else {
        role = isFirstOfGender ? 'Trưởng nam' : 'Thứ nam';
    }
    return {
        id: c.id,
        fullName: c.fullName,
        role,
        birthYear: birthYearOf(c),
        residence: c.residence || c.burialPlace || undefined,
        childrenCount: counts?.get(c.id) ?? 0,
    };
}

/**
 * Chuyển toàn bộ danh sách thành viên sang DTO, dùng quan hệ thật (cha/mẹ/phối ngẫu)
 * thay vì suy đoán theo tên.
 */
export function enrichAllMembers(list: Member[]): MemberDto[] {
    const byId = new Map<number, Member>();
    const childrenOf = new Map<number, Member[]>();
    list.forEach((m) => byId.set(m.id, m));
    list.forEach((m) => {
        if (m.fatherId && byId.has(m.fatherId)) {
            const arr = childrenOf.get(m.fatherId) || [];
            arr.push(m);
            childrenOf.set(m.fatherId, arr);
        }
    });
    const childCounts = new Map<number, number>();
    list.forEach((m) => {
        const own = m.gender === 'Female' && m.spouseId ? childrenOf.get(m.spouseId) : childrenOf.get(m.id);
        childCounts.set(m.id, own?.length || 0);
    });

    return list.map((m) => {
        const spouse = m.spouseId ? byId.get(m.spouseId) || null : null;
        const kids = (m.gender === 'Female' && spouse ? childrenOf.get(spouse.id) : childrenOf.get(m.id)) || [];
        const sorted = [...kids].sort((a, b) => (a.birthOrder || 0) - (b.birthOrder || 0));
        return enrichMemberData(m, { spouse, children: sorted, childCounts });
    });
}

export function enrichMemberData(m: Member, rel?: MemberRelations): MemberDto {
    let cleanName = m.fullName;
    let roleTitle = '';
    let courtesyName = '';

    // Trích xuất chức danh từ dấu ngoặc đơn nếu có: e.g. "Lê Văn Quang (Cụ Khởi Tổ)"
    const matchParen = m.fullName.match(/^(.*?)\s*\((.*?)\)$/);
    if (matchParen) {
        cleanName = matchParen[1].trim();
        const parenContent = matchParen[2].trim();
        if (parenContent.toLowerCase().startsWith('tự ') || parenContent.toLowerCase().startsWith('hiệu ')) {
            courtesyName = `(${parenContent})`;
        } else {
            roleTitle = parenContent;
        }
    }

    // Nếu chưa có chức danh, tự suy luận danh xưng tôn kính theo đời & vai vế
    if (!roleTitle) {
        if (!m.isAlive) {
            if (m.generationNumber === 1) {
                roleTitle = m.gender === 'Female' ? 'Cụ Bà Khởi Tổ' : 'Cụ Khởi Tổ';
            } else if (m.generationNumber === 2) {
                roleTitle = m.gender === 'Female' ? 'Cụ Cố Tỷ' : 'Cụ Cố Khảo';
            } else {
                roleTitle = m.gender === 'Female' ? 'Tiền Nhân Nữ' : 'Tiền Nhân';
            }
        } else {
            if (m.generationNumber <= 2) {
                roleTitle = m.gender === 'Female' ? 'Cụ Bà Thượng Thọ' : 'Cụ Cao Niên';
            } else if (m.generationNumber === 3) {
                roleTitle = m.gender === 'Female' ? 'Dâu Hiền Bản Tộc' : 'Trưởng Lão Chi Tộc';
            } else {
                roleTitle = m.gender === 'Female' ? 'Hậu Duệ Gái' : 'Hậu Duệ Đích Tôn';
            }
        }
    }

    // Tự hiệu mặc định cho tiền nhân nếu chưa có
    if (!courtesyName && !m.isAlive) {
        if (cleanName.includes('Quang')) courtesyName = '(Tự Đức Quang)';
        else if (cleanName.includes('Lụa')) courtesyName = '(Hiệu Từ Thục)';
        else if (cleanName.includes('Phúc')) courtesyName = '(Tự Phúc Thành)';
        else if (cleanName.includes('Mai')) courtesyName = '(Hiệu Ý Đức)';
        else if (cleanName.includes('Thọ')) courtesyName = '(Tự Vĩnh Thọ)';
    }

    // Xác định icon huy hiệu trên Avatar
    let badgeType: MemberDto['badgeType'] = 'candle';
    if (!m.isAlive) {
        badgeType = m.gender === 'Female' ? 'flower' : 'candle';
    } else {
        if (roleTitle.includes('Trưởng họ') || roleTitle.includes('Tộc Trưởng') || roleTitle.includes('Trưởng Chi')) {
            badgeType = 'shield';
        } else if (m.generationNumber <= 2) {
            badgeType = 'heart';
        } else if (m.generationNumber >= 4) {
            badgeType = cleanName.includes('Tuấn Anh') ? 'trophy' : 'star';
        } else {
            badgeType = 'heart';
        }
    }

    // Nơi an táng hoặc nơi cư trú
    let burialPlace: string | null = null;
    let residence: string | null = null;
    if (!m.isAlive) {
        burialPlace = m.generationNumber === 1 
            ? 'Đồi Thọ Vực, Nghĩa trang Tộc'
            : 'Khu Lăng Mộ Cố, Nghĩa trang Bản Tộc';
    } else {
        residence = m.generationNumber <= 3 
            ? 'Từ Đường Chi Bản (Thôn Thượng)'
            : 'Hà Nội';
    }

    // Chi nhánh
    let branch = m.branchId === 3 ? 'Chi Trưởng Đại Tôn' : m.branchId === 4 ? 'Chi 2 (Bản tộc)' : 'Chi 2 (Bản tộc)';
    if (m.generationNumber === 1 || roleTitle.includes('Khởi Tổ') || roleTitle.includes('Trưởng Chi') || roleTitle.includes('Trưởng họ')) {
        branch = 'Chi Trưởng Đại Tôn';
    } else if (m.fullName.includes('Thứ Chi')) {
        branch = 'Chi 2 (Bản tộc)';
    }
    if (rel) {
        branch = m.branchId === 1 ? 'Chi Trưởng Đại Tôn' : m.branchId === 2 ? 'Chi 2 (Bản tộc)' : `Chi ${m.branchId ?? 2}`;
    }

    // Hôn phối & Trạng thái sinh tử của phối ngẫu
    let spouse: string | null = null;
    let spouseLifeStatus: string | null = null;
    let spouseDeathDayLunar: string | null = null;
    let spouseAvatarUrl: string | null = null;

    if (cleanName.includes('Quang')) {
        spouse = 'Chánh thất: Cụ Bà Trần Thị Lụa';
        spouseLifeStatus = 'Đã tạ thế';
        spouseDeathDayLunar = '10/03 Âm lịch';
        spouseAvatarUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4eR84D9HjBTr-B0UNripV7u1DnLX1GDymRHZEC24paARQNIPp8or4cSw5_pimuGRz4nVeKqWHg7t3TYzL8Hp9NU6vwhAV2z5D_PNs1JeNdyt2Ni4o1CVwmp7_UlZvGh7kALc9DKomTGlmZP-36_PPq5k69AwtEFPj2urXbHw55rybySq1urLXJ37mANPJLd29gjSLRUOB9XrqCSkGzrJBtkqdnow8XNFbFkdS4fzR';
    } else if (cleanName.includes('Lụa')) {
        spouse = 'Phối ngẫu: Cụ Khởi Tổ Lê Văn Quang';
        spouseLifeStatus = 'Đã tạ thế';
        spouseDeathDayLunar = '15/08 Âm lịch';
    } else if (cleanName.includes('Phúc')) {
        spouse = 'Chính thất: Cụ Bà Phạm Thị Mai';
        spouseLifeStatus = 'Đã tạ thế (2003)';
        spouseDeathDayLunar = '20/09 Âm lịch';
    } else if (cleanName.includes('Khang')) {
        spouse = 'Phu nhân: Vũ Thị Hoa';
        spouseLifeStatus = 'Đương thời';
    } else if (cleanName.includes('Minh')) {
        spouse = 'Hiền thê: Trần Thu Trang';
        spouseLifeStatus = 'Đương thời';
    }

    if (rel) {
        const sp = rel.spouse;
        if (sp) {
            const label = m.gender === 'Female' ? 'Phu quân' : 'Chính thất';
            const honorific = !sp.isAlive ? (sp.gender === 'Female' ? 'Cụ Bà ' : 'Cụ ') : '';
            spouse = `${label}: ${honorific}${sp.fullName}`;
            const deathYear = sp.deathDateSolar ? String(sp.deathDateSolar).slice(0, 4) : '';
            spouseLifeStatus = sp.isAlive ? 'Đương thời' : `Đã tạ thế${deathYear ? ` (${deathYear})` : ''}`;
            spouseDeathDayLunar = !sp.isAlive && sp.deathDayLunar ? `${sp.deathDayLunar} Âm lịch` : null;
            spouseAvatarUrl = sp.avatarUrl || null;
        } else {
            spouse = null;
            spouseLifeStatus = null;
            spouseDeathDayLunar = null;
            spouseAvatarUrl = null;
        }
    }

    // Trách nhiệm / Ghi chú
    let duties: string | null = null;
    if (roleTitle.includes('Trưởng họ') || roleTitle.includes('Tộc Trưởng')) {
        duties = 'Trưởng Ban Trị Sự Từ Đường Tộc';
    } else if (cleanName.includes('Minh')) {
        duties = 'Cháu đích tôn • Phụ trách số hóa gia phả';
    } else if (cleanName.includes('Tuấn Anh')) {
        duties = 'Giải Nhất QG Lịch Sử • Bảng Vàng Khuyến Học 2025';
    } else if (cleanName.includes('Thịnh')) {
        duties = 'Phụ trách Trùng tu Lăng Mộ Gia Tộc';
    }

    // Avatar mặc định cao cấp
    const avatarUrl = m.gender === 'Female'
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4eR84D9HjBTr-B0UNripV7u1DnLX1GDymRHZEC24paARQNIPp8or4cSw5_pimuGRz4nVeKqWHg7t3TYzL8Hp9NU6vwhAV2z5D_PNs1JeNdyt2Ni4o1CVwmp7_UlZvGh7kALc9DKomTGlmZP-36_PPq5k69AwtEFPj2urXbHw55rybySq1urLXJ37mANPJLd29gjSLRUOB9XrqCSkGzrJBtkqdnow8XNFbFkdS4fzR'
        : 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQIAaErrxDElCuX9927Iuu76rLjkLQNbcbakx8LT8THdfYhuwwcMCrAzfocJ_KqSPoBKIdTEdJB1ZF0xIVjvAabfKyZ1rYfT3lgSQq8Mm0jGjpg7kHyE0OY8-E-i7QGDEtIJkCul_pU2RbsER1KI84gz4-akAWpyA5kHNoa5h0HGLSYekNAen5bRc_0-KsmcOEPpQxwkywbqhhXaH0mBHzzTpUUilyNlKiX5l8s4Js';

    const childrenList = rel
        ? (() => {
              const seen = new Set<string>();
              return (rel.children || []).map((c) => {
                  const g = c.gender === 'Female' ? 'F' : 'M';
                  const first = !seen.has(g);
                  seen.add(g);
                  return describeChild(c, rel.childCounts, first);
              });
          })()
        : getMemberChildrenMock(m.id, cleanName, m.generationNumber);
    const honorsList = getMemberHonorsMock(m.id, cleanName, roleTitle, m.generationNumber);
    const photosList = getMemberPhotosMock(m.id, cleanName, m.generationNumber);

    const finalRoleTitle = m.roleTitle || roleTitle;
    const finalCourtesyName = m.courtesyName || courtesyName;
    const finalBurialPlace = m.burialPlace || burialPlace;
    const finalResidence = m.residence || residence;
    const finalDuties = m.duties || duties;
    const finalAvatarUrl = m.avatarUrl || avatarUrl;
    const finalPhone = m.phone || '0912.345.678';
    const finalOrigin = m.ancestralOrigin || 'Làng Mộ Trạch, Xã Tân Hồng, Huyện Bình Giang, Tỉnh Hải Dương';

    return {
        id: m.id,
        fullName: cleanName,
        gender: m.gender,
        birthdaySolar: m.birthdaySolar,
        birthdayLunar: m.birthdayLunar,
        deathDayLunar: m.deathDayLunar,
        isAlive: m.isAlive,
        generationNumber: m.generationNumber,
        bio: m.bio || `Thành viên đời thứ ${m.generationNumber} của Lê Tộc Đại Tôn. Tích cực tham gia phụng dưỡng tiên tổ và gìn giữ nề nếp gia phong.`,
        roleTitle: finalRoleTitle,
        courtesyName: finalCourtesyName,
        burialPlace: finalBurialPlace,
        residence: finalResidence,
        branch,
        spouse,
        spouseLifeStatus,
        spouseDeathDayLunar,
        spouseAvatarUrl,
        duties: finalDuties,
        avatarUrl: finalAvatarUrl,
        badgeType,
        phone: finalPhone,
        ancestralOrigin: finalOrigin,
        childrenList,
        honorsList,
        photosList,
    };
}

/**
 * Bản lưu trữ dữ liệu dòng họ dự phòng (fallback khi CSDL chưa có dữ liệu)
 */
export function getSampleHeritageMembers(): MemberDto[] {
    return enrichAllMembers(getSampleHeritageRecords());
}

/**
 * Bản ghi thành viên mẫu 10 đời (sinh từ buildLeFamily) dùng khi chưa có CSDL.
 */
export function getSampleHeritageRecords(): Member[] {
    const { people } = buildLeFamily();
    const idByKey = new Map<string, number>();
    people.forEach((p, i) => idByKey.set(p.key, i + 1));
    const now = new Date();

    return people.map((p, i) => ({
        id: i + 1,
        clanId: 1,
        branchId: p.branchIndex,
        fullName: p.fullName,
        courtesyName: p.courtesyName,
        gender: p.gender,
        generationNumber: p.generation,
        roleTitle: p.roleTitle,
        duties: p.duties,
        avatarUrl: null,
        isAlive: p.isAlive,
        birthdaySolar: p.birthdaySolar,
        birthdayLunar: p.birthdayLunar,
        deathDateSolar: p.deathDateSolar,
        deathDayLunar: p.deathDayLunar,
        burialPlace: p.burialPlace,
        residence: p.residence,
        ancestralOrigin: p.ancestralOrigin,
        phone: p.phone,
        email: p.email,
        academicLevel: p.academicLevel,
        career: null,
        bio: p.bio,
        badgeType: null,
        fatherId: p.fatherKey ? idByKey.get(p.fatherKey) ?? null : null,
        motherId: p.motherKey ? idByKey.get(p.motherKey) ?? null : null,
        spouseId: p.spouseKey ? idByKey.get(p.spouseKey) ?? null : null,
        birthOrder: p.birthOrder,
        deletedAt: null,
        createdAt: now,
        updatedAt: now,
    })) as Member[];
}
