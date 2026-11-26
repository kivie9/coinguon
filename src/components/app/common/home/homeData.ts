export interface HomeNewsItem {
    id: string;
    tag: string;
    tagColor: 'primary' | 'secondary';
    title: string;
    summary: string;
    fullSummary?: string;
    content?: string[];
    time: string;
    author: string;
    imageUrl: string;
    initialLikes: number;
    initialComments: number;
}

export interface FamilyRuleItem {
    title: string;
    description: string;
}

export interface AncestralTempleInfo {
    name: string;
    address: string;
    manager: string;
    phone: string;
}

export const HOME_EVENT_SPOTLIGHT = {
    badge: 'Đại Lễ Giỗ Tổ Chi II',
    title: 'Đại Lễ Giỗ Tổ Chi II & Họp Mặt Khai Xuân Ất Tỵ',
    lunarDate: '15/01 Âm lịch (Chính lễ Giờ Thìn)',
    location: 'Từ Đường Đại Tôn • Làng Mộ Trạch, Hải Dương',
    attendees: 'Toàn thể con cháu nội ngoại & dâu rể',
    invitation: 'Kính mời các cụ, các bác và toàn thể huynh đệ tề tựu đông đủ dâng hương tưởng niệm tiền nhân, đón nhận lộc xuân và thụ hưởng phúc lành gia tộc.',
    daysRemaining: 5,
};

export const HOME_UPCOMING_ANNIVERSARY = {
    name: 'Cụ Cố Khảo Lê Văn Khải',
    generation: 'Đời Thứ IV • Chi Trưởng Khảo',
    shortGeneration: 'Đời IV',
    lunarDate: '18 tháng Giêng Âm lịch',
    location: 'Từ Đường Chi II',
    assignedBranch: 'Chi Giáp',
};

export const HOME_FUND_DATA = {
    title: 'Quỹ Trùng Tu & Khuyến Học Ất Tỵ',
    desktopTitle: 'Quỹ Trùng Tu & Khuyến Học',
    percent: 84,
    balance: '168.500.000 đ',
    bankAccount: '1903.8888.9999',
    bankName: 'Vietcombank',
    accountName: 'Ban Trị Sự Từ Đường Chi II',
};

export const HOME_FAMILY_RULES: FamilyRuleItem[] = [
    {
        title: 'Hiếu kính phụ mẫu & Phụng thờ tổ tiên',
        description: 'Trọn đạo làm con, giữ gìn ngày kỵ nhật và phần mộ tổ phụ chu đáo, trang nghiêm.',
    },
    {
        title: 'Khuyến học hiếu đạo & Khổ luyện thành tài',
        description: 'Nuôi dưỡng chí hướng học tập cho thế hệ trẻ, động viên con cháu noi gương khoa cử tiền bối.',
    },
    {
        title: 'Đồng tâm tương trợ & Giúp đỡ gia cảnh',
        description: 'Lá lành đùm lá rách, tương trợ bà con trong họ khi gặp hoạn nạn, ốm đau hay hiếu hỷ.',
    },
    {
        title: 'Minh bạch tộc sự & Gìn giữ gia phả',
        description: 'Ghi chép chính xác thế thứ, cập nhật sinh tử kịp thời, giữ gìn phả bản nguyên vẹn muôn đời.',
    },
];

export const HOME_ANCESTRAL_TEMPLE: AncestralTempleInfo = {
    name: 'Từ Đường Đại Tôn Chi II',
    address: 'Làng Mộ Trạch, Xã Tân Hồng, Huyện Bình Giang, Tỉnh Hải Dương',
    manager: 'Ông Lê Văn Thành - Trưởng Chi',
    phone: '0912.345.678',
};

export const HOME_NEWS_ITEMS: HomeNewsItem[] = [
    {
        id: 'news-1',
        tag: 'Khuyến Học',
        tagColor: 'primary',
        title: 'Vinh danh 12 Tân Cử nhân & Thạc sĩ Đời thứ VIII xuất sắc',
        summary: 'Hội đồng Gia tộc trao bằng khen và quỹ khuyến học Lê Tộc cho các con cháu đạt thành tích cao trong năm vừa qua...',
        fullSummary: 'Hội đồng Gia tộc trao bằng khen và quỹ khuyến học Lê Tộc cho các con cháu đạt thành tích cao trong kỳ thi quốc gia và học vị quốc tế niên khóa vừa qua. Tuyên dương tinh thần hiếu học kế thừa truyền thống hiếu học của cha ông.',
        content: [
            'Sáng ngày 14 tháng Giêng, tại Từ Đường Đại Tôn Chi II, Hội Đồng Gia Tộc đã long trọng tổ chức Lễ Tuyên Dương và Trao Quỹ Khuyến Học Lê Tộc niên khóa 2024 - 2025 nhằm biểu dương tinh thần nỗ lực vươn lên trong học tập của thế hệ trẻ.',
            'Trong năm học vừa qua, con cháu thế hệ thứ VIII và thứ IX đã gặt hái nhiều thành quả rực rỡ với 12 tân cử nhân tốt nghiệp loại giỏi, 3 thạc sĩ xuất sắc tại các trường đại học danh tiếng trong và ngoài nước, cùng hàng chục cháu học sinh đạt giải cao tại các kỳ thi quốc gia và cấp tỉnh.',
            'Phát biểu tại buổi lễ, Đại diện Ban Trị Sự cùng các bậc cao niên đã trao tặng bằng khen danh dự và các suất học bổng tài năng, đồng thời căn dặn các cháu tiếp tục trau dồi đạo đức, rèn luyện tri thức để cống hiến cho xã hội, làm rạng danh dòng dõi tổ tiên Lê Tộc muôn đời.'
        ],
        time: 'Hôm qua',
        author: 'Ban Khuyến Học',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0eR8VXnRXXT4EvR0FysnTiSUHG7VFbtAmYNnAlYq__OXPsb1ziAiQFrcEzuz-TB2N18xpB3W5O1rXIkAhA4f6oLU0SSc49c0OLEHm62Eg_UU6OA-XuuOAAvj-Cx0WWRUdmII72p682K8vvYeAx6Qkd-Uzcu2pOdLCureNoB61cvayuLzdXbf3Ccam5mE0QvFxuXHYba5QTFng6IFAny9y3atQcUNOGO5f5pU-ixGf',
        initialLikes: 48,
        initialComments: 14,
    },
    {
        id: 'news-2',
        tag: 'Trùng Tu Di Sản',
        tagColor: 'secondary',
        title: 'Hoàn thành hạng mục tôn tạo Giếng Ngọc & Cổng Tam Quan',
        summary: 'Công trình kiến thiết Từ Đường Chi II đã hoàn thiện nghiệm thu chuẩn bị trước thềm Giỗ Tổ. Kính mời toàn thể quý con cháu về chiêm bái...',
        fullSummary: 'Công trình kiến thiết Từ Đường Chi II đã hoàn thiện nghiệm thu chuẩn bị trước thềm Giỗ Tổ. Kính mời toàn thể quý con cháu gần xa về chiêm bái di tích và dâng hương tri nhân công đức tổ tiên.',
        content: [
            'Trải qua hơn 6 tháng thi công cẩn trọng và chuẩn mực dưới sự giám sát chặt chẽ của Ban Kiến Thiết Từ Đường, công trình đại trùng tu Giếng Ngọc phong thủy và phục dựng Cổng Tam Quan đã chính thức hoàn thành nghiệm thu mỹ mãn.',
            'Giếng Ngọc cổ nghìn năm được khơi thông long mạch, ốp đá xanh tự nhiên chạm khắc tinh xảo họa tiết mây cuộn truyền thống. Cổng Tam Quan được dựng bằng gỗ lim nguyên khối vững chãi, mái ngói mũi hài thanh thoát giữ trọn vẹn nét trang nghiêm, cổ kính lưu truyền qua bao thế hệ.',
            'Công trình hoàn thành kịp thời để chuẩn bị cho Đại Lễ Giỗ Tổ đầu xuân Ất Tỵ, là thành quả từ sự chung tay góp sức, đồng lòng công đức chí tình của con cháu nội ngoại trên khắp mọi miền tổ quốc và kiều bào ở hải ngoại.'
        ],
        time: '3 ngày trước',
        author: 'Ban Kiến Thiết',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8dQflCjMj02AAszImvKwvsopybIoanRQqldpIsWOr18AXrVRNvSPYFopG9cp7PPxRtbDottVG5FWeq_Ts6SJ-ObqMTMCujWmhzqb043_js0vmUcaFt-HgZ088e3CLQk1tqY4unkmuPor9W8g_IzQKSa-9k_LRfeMvKII5Sd2atlHBjPSzBNIo5jPVb6Xz7rW5-Gj2MEPscMsuD4CovuxlVcy6PVmbapNHn19Qj8dl',
        initialLikes: 35,
        initialComments: 19,
    },
    {
        id: 'news-3',
        tag: 'Văn Hóa Dòng Tộc',
        tagColor: 'primary',
        title: 'Phát hành cuốn Gia Phả Kỷ Yếu & Thế Thứ Toàn Tộc 2025',
        summary: 'Tài liệu lưu truyền ghi chép lịch sử khởi tổ, công trạng các bậc tiền bối và danh sách đinh bộ các chi phái cập nhật mới nhất...',
        fullSummary: 'Tài liệu lưu truyền ghi chép lịch sử khởi tổ, công trạng các bậc tiền bối và danh sách đinh bộ các chi phái cập nhật mới nhất. Quý con cháu có thể đăng ký nhận ấn bản hoặc xem bản điện tử.',
        content: [
            'Hội Đồng Gia Tộc trân trọng thông báo đã hoàn tất biên soạn, thẩm định và xuất bản cuốn "Gia Phả Kỷ Yếu & Thế Thứ Toàn Tộc 2025" sau hơn 2 năm đối chiếu các văn bia cổ, sắc phong triều Nguyễn và điền dã thực tế.',
            'Ấn phẩm dày hơn 300 trang gồm 3 phần trọng tâm: Lịch sử khai hoang lập ấp của Tiền Hiền Thủy Tổ từ thế kỷ XVIII, tiểu sử công đức các vị danh nhân tiền bối, và lược đồ thế thứ phân định rõ ràng các thế hệ từ Đời I đến Đời VIII.',
            'Toàn bộ tư liệu đã được số hóa đồng bộ lên hệ thống trực tuyến này. Quý con cháu có thể đăng ký nhận bản in lưu truyền gia đình tại Từ Đường hoặc tra cứu chi tiết phả hệ trên ứng dụng bất kỳ lúc nào.'
        ],
        time: '5 ngày trước',
        author: 'Hội Đồng Gia Tộc',
        imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600',
        initialLikes: 62,
        initialComments: 28,
    },
    {
        id: 'news-4',
        tag: 'Gia Quy & Phong Tục',
        tagColor: 'secondary',
        title: 'Khai mạc Khóa Bồi Dưỡng Chữ Hán Nôm & Gia Quy Dòng Tộc',
        summary: 'Ban Trị Sự phối hợp cùng các bậc túc nho khai giảng lớp học đọc hiểu gia phả cổ và tìm hiểu nề nếp gia phong cho con cháu...',
        fullSummary: 'Ban Trị Sự phối hợp cùng các bậc túc nho khai giảng lớp học đọc hiểu gia phả cổ, chữ Hán Nôm và tìm hiểu phong tục phụng thờ cho con cháu thế hệ thứ VIII và IX trong toàn tộc.',
        content: [
            'Nhằm giúp con cháu thế hệ trẻ hiểu sâu sắc về cội nguồn, ý nghĩa các hoành phi câu đối và có thể tự tra cứu các bản gia phả Hán Nôm nguyên bản, Ban Trị Sự Từ Đường Chi II đã chính thức khai mạc Khóa Bồi Dưỡng Chữ Hán Nôm & Gia Huấn Dòng Tộc niên khóa 2025.',
            'Lớp học được tổ chức vào các ngày cuối tuần tại gian Hậu đường, do các bậc túc nho uyên bác và chuyên gia Hán Nôm trong dòng họ trực tiếp truyền dạy. Nội dung khóa học bao gồm nhận diện tự dạng các bộ thủ cơ bản, đọc dịch các đoạn gia huấn cổ, văn tế tổ tiên và nghi thức dâng hương tế lễ chuẩn mực.',
            'Ngay trong ngày đầu khai giảng, lớp học đã thu hút hơn 30 con cháu từ lứa tuổi học sinh, sinh viên đến các thanh niên trưởng thành tham dự với tinh thần hăng say, góp phần giữ gìn mạch nguồn văn hóa truyền thống dòng tộc.'
        ],
        time: '1 tuần trước',
        author: 'Ban Văn Hóa',
        imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop',
        initialLikes: 41,
        initialComments: 16,
    },
    {
        id: 'news-5',
        tag: 'Trùng Tu Di Sản',
        tagColor: 'secondary',
        title: 'Lễ Thượng Lương khánh thành Nhà Tả Vu & Hữu Vu Từ Đường',
        summary: 'Hai dãy nhà Tả Vu và Hữu Vu đã hoàn thiện khung gỗ lim vững chãi, sẵn sàng đón tiếp con cháu các chi phái về bái tổ...',
        fullSummary: 'Hai dãy nhà Tả Vu và Hữu Vu đã hoàn thiện khung gỗ lim vững chãi, hoàn thành nghi lễ Thượng Lương cẩn cáo tổ tiên, sẵn sàng đón tiếp con cháu các chi phái về tế lễ đầu xuân.',
        content: [
            'Vào giờ Hoàng Đạo sáng ngày mùng 8 tháng Chạp, Ban Trị Sự Từ Đường Chi II đã trang trọng tổ chức Đại Lễ Thượng Lương hai dãy nhà Tả Vu và Hữu Vu trong khuôn viên Từ Đường dòng tộc.',
            'Công trình được dựng hoàn toàn bằng gỗ lim tự nhiên theo kiến trúc truyền thống Bắc Bộ, mái ngói vảy rồng thanh thoát, kết hợp hành lang lát gạch Bát Tràng tráng men cổ. Không gian này được quy hoạch làm nơi tiếp đón quý bà con, trưng bày gia bảo và chuẩn bị cỗ tế trong các dịp đại lễ.',
            'Đây là công trình thế kỷ ghi dấu sự đồng tâm nhất trí của toàn thể con cháu nội ngoại và các mạnh thường quân, thể hiện lòng thành kính tri ân công đức tổ tông.'
        ],
        time: '2 tuần trước',
        author: 'Ban Kiến Thiết',
        imageUrl: 'https://images.unsplash.com/photo-1548625361-125032541c9b?q=80&w=600&auto=format&fit=crop',
        initialLikes: 53,
        initialComments: 21,
    },
    {
        id: 'news-6',
        tag: 'Gia Quy & Phong Tục',
        tagColor: 'primary',
        title: 'Gặp mặt Dâu Hiền Rể Thảo & Mừng Thọ các cụ cao niên đầu xuân',
        summary: 'Hoạt động ý nghĩa kết nối tình thân gia tộc, tri ân công lao vun vén của các nàng dâu, chàng rể và chúc thọ các bậc cao niên...',
        fullSummary: 'Hoạt động ý nghĩa kết nối tình thân gia tộc, tri ân công lao vun vén của các nàng dâu, chàng rể và chúc thọ các bậc cao niên từ 70 đến 95 tuổi.',
        content: [
            'Nhân dịp chuẩn bị đón tết cổ truyền, Chi Hội Phụ Nữ Dòng Tộc phối hợp cùng Ban Khánh Tiết tổ chức buổi tọa đàm "Dâu Hiền Rể Thảo - Nền Tảng Hạnh Phúc Gia Tộc" và mừng thọ các cụ thượng thọ.',
            'Buổi lễ diễn ra trong không khí đầm ấm, thân tình. Ban Trị Sự đã trao khánh vàng chúc thọ cho 6 cụ cao niên đạt tuổi 70, 80 và 90 tuổi, kính chúc các cụ trường thọ an khang, là chỗ dựa tinh thần vững chãi cho con cháu.',
            'Đồng thời, hội nghị cũng biểu dương các gia đình dâu hiền rể thảo tiêu biểu đã có nhiều đóng góp trong việc phụng dưỡng cha mẹ, chăm sóc hương hỏa gia tiên và tích cực tham gia công việc dòng họ.'
        ],
        time: '3 tuần trước',
        author: 'Ban Khánh Tiết',
        imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=600&auto=format&fit=crop',
        initialLikes: 39,
        initialComments: 12,
    },
    {
        id: 'news-7',
        tag: 'Khuyến Học',
        tagColor: 'primary',
        title: 'Thành lập Quỹ Hỗ Trợ Khởi Nghiệp Thanh Niên Lê Tộc',
        summary: 'Sáng kiến từ các doanh nhân thành đạt trong dòng họ nhằm trợ vốn và cố vấn hướng nghiệp cho thế hệ trẻ tự lập vươn lên...',
        fullSummary: 'Sáng kiến từ các doanh nhân thành đạt trong dòng họ nhằm trợ vốn không lãi suất và cố vấn hướng nghiệp cho thế hệ trẻ tự lập vươn lên làm giàu chính đáng.',
        content: [
            'Hội Doanh Nhân Lê Tộc vừa chính thức công bố ra mắt "Quỹ Hỗ Trợ Khởi Nghiệp Thanh Niên" với nguồn vốn ban đầu hơn 500 triệu đồng được đóng góp bởi các doanh nhân thành đạt trong họ.',
            'Quỹ hướng tới việc hỗ trợ vốn vay ưu đãi không lãi suất, kết nối mạng lưới đối tác và cử các chuyên gia, doanh nhân đi trước trực tiếp cố vấn cho các dự án khởi nghiệp khả thi của con cháu.',
            'Đây là bước tiến đột phá thể hiện tinh thần "thương yêu tương trợ, dìu dắt lẫn nhau", giúp con cháu thế hệ thứ VIII và IX có bệ phóng vững chắc vươn ra biển lớn.'
        ],
        time: '1 tháng trước',
        author: 'Hội Doanh Nhân Tộc',
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop',
        initialLikes: 67,
        initialComments: 31,
    },
    {
        id: 'news-8',
        tag: 'Văn Hóa Dòng Tộc',
        tagColor: 'secondary',
        title: 'Sưu tầm và phục chế thành công 03 Đạo Sắc Phong triều Nguyễn',
        summary: 'Bảo vật quý giá phong tặng tước vị và công trạng của các bậc tiền hiền đã được phục dựng và đưa về Từ Đường an vị...',
        fullSummary: 'Bảo vật quý giá phong tặng tước vị và công trạng của các bậc tiền hiền đã được phục chế chuyên nghiệp và đưa về Từ Đường an vị trang nghiêm.',
        content: [
            'Sau nhiều nỗ lực tìm kiếm và kết nối với các viện nghiên cứu Hán Nôm, Ban Cố Vấn Lịch Sử đã sưu tầm và phục chế thành công 03 đạo sắc phong quý giá từ thời các vua Tự Đức, Đồng Khánh và Khải Định ban cho các bậc tiền bối dòng họ.',
            'Các bản sắc phong được bồi biểu, xử lý chống ẩm mốc theo tiêu chuẩn bảo tàng quốc gia và đóng khung gỗ chạm trổ hoa văn rồng chầu mặt nguyệt mạ vàng sang trọng.',
            'Lễ rước sắc phong về an vị tại chính điện Từ Đường đã thu hút đông đảo bà con nội ngoại về tham dự, là niềm tự hào to lớn khẳng định bề dày truyền thống văn hiến của dòng tộc.'
        ],
        time: '1 tháng trước',
        author: 'Ban Cố Vấn Lịch Sử',
        imageUrl: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=600&auto=format&fit=crop',
        initialLikes: 88,
        initialComments: 45,
    },
];

export const HOME_GENERATIONS = [
    'Đời I',
    'Đời II',
    'Đời III',
    'Đời IV',
    'Đời V',
    'Đời VI',
    'Đời VII',
    'Đời VIII',
];

