import { ClanDto } from '@/types/clanType';

export const INITIAL_CLAN_DATA: ClanDto = {
    id: 'clan-le-dai-ton-chi-2',
    name: 'Lê Tộc Đại Tôn',
    shortName: 'Lê Tộc',
    hanNomName: '黎',
    branchName: 'Chi 2 Bản Tộc',
    branchTitle: 'Bản Tộc Chi II',
    branchFullTitle: 'Lê Tộc Đại Tôn • Bản Tộc Chi II',
    slogan: 'Không Gian Dòng Tộc & Nhà Thờ Tổ',
    subSlogan: 'Chi 2 Bản Tộc • Không Gian Dòng Tộc & Nhà Thờ Tổ',
    motto: 'Cây có cội mới trổ cành xanh lá • Nước có nguồn mới biển rộng sông sâu',
    description: 'Bản tộc ngàn năm kế thừa thế thứ, gia quy huấn điều, bảo tồn di sản Hán Nôm nguyên bản và kết nối các chi phái con cháu khắp muôn phương.',
    memberExplorerTitle: 'Sổ Đinh Bộ & Cây Phả Hệ Đại Tôn',
    memberExplorerSubtitle: 'Tra cứu phả ký, danh vị thế thứ, ngày kỵ nhật và dòng dõi trực hệ kế thừa từ Thủy Khởi Tổ đến các bậc hậu duệ hiện thời.',

    stats: {
        foundedYear: 1820,
        generationsCount: 10,
        totalRegistrations: 342,
        scholarsCount: 12,
        yearsText: '200+',
    },

    committees: [
        {
            id: 'com-1',
            name: 'Ban Khánh Tiết',
            role: 'Phụ trách nghi lễ tế tự',
            icon: 'users',
        },
        {
            id: 'com-2',
            name: 'Ban Khuyến Học',
            role: 'Khen thưởng tiến sĩ, cử nhân',
            icon: 'award',
        },
        {
            id: 'com-3',
            name: 'Ban Thư Ký Phả Ký',
            role: 'Ghi chép đinh bộ tân sinh',
            icon: 'scroll',
        },
    ],

    liaisonBranches: [
        {
            id: 'liaison-hn',
            region: 'Khu vực Hà Nội',
            familiesCount: '120+ hộ gia đình',
            contactInfo: 'Ông Lê Văn Hải (Chi II) • 0983.123.456',
        },
        {
            id: 'liaison-sg',
            region: 'Khu vực Miền Nam',
            familiesCount: '85+ hộ gia đình',
            contactInfo: 'Ông Lê Hữu Minh (Chi IV) • 0903.654.321',
        },
        {
            id: 'liaison-overseas',
            region: 'Hải Ngoại',
            familiesCount: 'Bắc Mỹ & Châu Âu',
            contactInfo: 'Email: lienlac@letoc.vn',
        },
    ],

    ancestralHall: {
        name: 'Từ Đường Lê Tộc Đại Tôn Chi II',
        shortName: 'Từ Đường Bản Tộc',
        address: 'Làng Mộ Trạch, Xã Tân Hồng, Huyện Bình Giang, Tỉnh Hải Dương',
        province: 'Hải Dương',
        foundedYear: 1820,
        foundedYearText: 'Năm 1820 (Hơn 200 năm)',
        area: '850 m²',
        ranking: 'Di tích Lịch sử - Văn hóa cấp Tỉnh',
        structure: 'Kiến trúc chữ Đinh (丁) truyền thống, 5 gian tiền tế, 3 gian hậu cung',
        mapsQueryUrl: 'https://www.google.com/maps/search/?api=1&query=L%C3%A0ng+M%E1%BB%99+Tr%E1%BA%A1ch%2C+T%C3%A2n+H%E1%BB%93ng%2C+B%C3%ACnh+Giang%2C+H%E1%BA%A3i+D%C6%B0%C6%A1ng',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8dQflCjMj02AAszImvKwvsopybIoanRQqldpIsWOr18AXrVRNvSPYFopG9cp7PPxRtbDottVG5FWeq_Ts6SJ-ObqMTMCujWmhzqb043_js0vmUcaFt-HgZ088e3CLQk1tqY4unkmuPor9W8g_IzQKSa-9k_LRfeMvKII5Sd2atlHBjPSzBNIo5jPVb6Xz7rW5-Gj2MEPscMsuD4CovuxlVcy6PVmbapNHn19Qj8dl',
    },

    donation: {
        bankName: 'Vietcombank (VCB)',
        accountNumber: '1903.8888.9999',
        accountNumberClean: '190388889999',
        accountHolder: 'Ban Trị Sự Từ Đường Chi II',
        syntax: '[Họ Tên] - Cong duc',
        description: 'Quỹ khuyến học & Trùng tu từ đường',
    },

    contact: {
        leader: {
            fullName: 'Ông Lê Văn Phúc',
            role: 'Tộc Trưởng Đại Tôn • Trưởng Ban Trị Sự',
            generation: 'Đời thứ IX',
            term: 'Nhiệm kỳ 2020 – 2025',
            phone: '0912.345.678',
            email: 'lienlac@letoc.vn',
            avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhD95LL-OQe99m7PQ9haTWkRmmZhB2THTEjlzFt0iJyLEdpxZXCd2VwuEGG73kT-Y3zTbqflobAOrTSsFAqiN0l68wYwzdCzitcXmOfQvYkjRhAecgLDLTVnpQwZFUmsmoJyPeLoWxXH53RqSxG0gQwfGM_ruc0v8D8EcP2DDnbcithbPlVU-L_AqaPWczEZKMc8D6Kq6qkd8TPs0B_zhSgu_ltxSTOUej4TMfvdmp',
            branch: 'Chi Trưởng Đại Tôn',
            bio: 'Thay mặt Hội đồng Gia tộc phụ trách điều hành mọi công tác kỵ nhật, hương hỏa tổ tiên, gìn giữ từ đường và điều phối quỹ tương thân tương ái, khuyến học khuyến tài cho con cháu trong toàn tộc.',
        },
        hotline: '0912.345.678',
        email: 'lienlac@letoc.vn',
        hnContact: 'Ông Lê Văn Hải (Chi II) • 0983.123.456',
        sgContact: 'Ông Lê Hữu Minh (Chi IV) • 0903.654.321',
    },

    documents: [
        {
            id: 'doc-1',
            title: 'Tộc Ước & Hương Hỏa Bản Tộc',
            description: 'Quy chuẩn ứng xử, đạo hiếu phụng dưỡng và trách nhiệm con cháu.',
            updatedAt: 'Khai xuân Giáp Thìn 2024',
        },
        {
            id: 'doc-2',
            title: 'Gia Phả Chi II • Bản Khắc Mộc Bản Triều Tự Đức',
            description: 'Bản số hóa lưu trữ nguyên văn chữ Nôm và bản dịch Quốc ngữ.',
            updatedAt: 'Nghiệm thu Viện Hán Nôm',
        },
        {
            id: 'doc-3',
            title: 'Quy Chế Quỹ Khuyến Học & Trùng Tu',
            description: 'Nguyên tắc công khai minh bạch tài chính và khen thưởng học sinh giỏi.',
            updatedAt: 'Ban hành niên khóa 2024–2025',
        },
    ],

    systemName: 'Cội Nguồn',
    copyright: 'Cội Nguồn • Lê Tộc Đại Tôn • Bản quyền lưu hành nội bộ',
    copyrightFull: 'Lê Tộc Đại Tôn • Bản quyền lưu hành nội bộ dòng tộc',
    footerCopyright: `© ${new Date().getFullYear()} Cội Nguồn — Hệ Thống Gia Phả Dòng Tộc`,
};

