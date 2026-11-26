import { config } from 'dotenv';
config({ path: '.env.local' });

import fs from 'node:fs';
import path from 'node:path';
import { eq } from 'drizzle-orm';
import { db } from './dataSource';
import { sqliteUrl, hasCloudflareD1Http } from './dbStatus';
import { buildLeFamily } from './data/leFamilyData';
import { hashPassword } from '@/utils/password';
import {
    clans,
    branches,
    ancestralHalls,
    members,
    relationships,
    memberHonors,
    memberMedia,
    clanDocuments,
    events,
    eventRitualSteps,
    eventOrganizers,
    funds,
    fundTransactions,
    newsArticles,
    newsComments,
    users,
} from './schema';

function chunkArray<T>(items: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < items.length; i += size) {
        chunks.push(items.slice(i, i + size));
    }
    return chunks;
}

export async function runSeed() {
    if (!hasCloudflareD1Http && sqliteUrl.startsWith('file:')) {
        const dbPath = sqliteUrl.replace(/^file:/, '');
        fs.mkdirSync(path.dirname(path.resolve(dbPath)), { recursive: true });
    }

    console.log(
        `🌱 Đang khởi tạo dữ liệu mẫu 10 đời Lê Tộc (${hasCloudflareD1Http ? 'Cloudflare D1' : sqliteUrl})...`
    );

    try {
        console.log('🧹 [1/7] Đang làm sạch dữ liệu cũ theo thứ tự ràng buộc khóa ngoại...');
        await db.delete(newsComments);
        await db.delete(newsArticles);
        await db.delete(fundTransactions);
        await db.delete(funds);
        await db.delete(eventOrganizers);
        await db.delete(eventRitualSteps);
        await db.delete(events);
        await db.delete(clanDocuments);
        await db.delete(memberMedia);
        await db.delete(memberHonors);
        await db.delete(relationships);
        await db.delete(users);
        await db.delete(members);
        await db.delete(ancestralHalls);
        await db.delete(branches);
        await db.delete(clans);

        // ====================================================================
        // 1. DÒNG HỌ, TỪ ĐƯỜNG & CHI PHÁI
        // ====================================================================
        console.log('🏛️ [2/7] Khởi tạo thông tin Dòng họ (Clans), Chi phái & Từ đường...');
        const [clan] = await db
            .insert(clans)
            .values({
                code: 'le-toc-dai-ton',
                name: 'Lê Tộc Đại Tôn',
                shortName: 'Lê Tộc',
                hanNomName: '黎',
                slogan: 'Vinh Quy Bái Tổ • Uống Nước Nhớ Nguồn',
                subSlogan: 'Cội Nguồn Linh Thiêng • Vạn Đời Thịnh Vượng',
                motto: 'Cây có cội mới nở cành xanh ngọn, Nước có nguồn mới biển rộng sông sâu. Con cháu nhớ ơn tiên tổ dốc lòng thờ phụng, giữ trọn đạo hiếu gia phong.',
                foundedYear: 1428,
                description: 'Lê Tộc Đại Tôn phát tích từ vùng đất địa linh nhân kiệt Mộ Trạch, Hải Dương. Trải qua hàng trăm năm thăng trầm lịch sử, con cháu muôn phương luôn phát huy truyền thống hiếu học, phụng sự quốc gia và gìn giữ nề nếp gia phong tổ huấn.',
                logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQIAaErrxDElCuX9927Iuu76rLjkLQNbcbakx8LT8THdfYhuwwcMCrAzfocJ_KqSPoBKIdTEdJB1ZF0xIVjvAabfKyZ1rYfT3lgSQq8Mm0jGjpg7kHyE0OY8-E-i7QGDEtIJkCul_pU2RbsER1KI84gz4-akAWpyA5kHNoa5h0HGLSYekNAen5bRc_0-KsmcOEPpQxwkywbqhhXaH0mBHzzTpUUilyNlKiX5l8s4Js',
                footerCopyright: '© 2026 Lê Tộc Đại Tôn. Bảo lưu mọi quyền phả ký gia tộc.',
            })
            .returning();

        const [branch1] = await db
            .insert(branches)
            .values({
                clanId: clan.id,
                name: 'Chi Trưởng',
                branchTitle: 'Chi Trưởng Đại Tôn',
                branchFullTitle: 'Lê Tộc Đại Tôn • Chi Trưởng',
                ancestralPlace: 'Làng Mộ Trạch, Bình Giang, Hải Dương',
                contactInfo: '0912.345.678 (Ông Lê Văn Khang)',
                orderIndex: 1,
            })
            .returning();

        const [branch2] = await db
            .insert(branches)
            .values({
                clanId: clan.id,
                name: 'Chi 2',
                branchTitle: 'Lê Tộc Chi II (Bản Tộc)',
                branchFullTitle: 'Lê Tộc Đại Tôn • Chi II',
                ancestralPlace: 'Từ Đường Chi II, Mộ Trạch, Hải Dương',
                contactInfo: '0988.765.432 (Ông Lê Văn Thịnh)',
                orderIndex: 2,
            })
            .returning();

        const [branch3] = await db
            .insert(branches)
            .values({
                clanId: clan.id,
                name: 'Chi 3',
                branchTitle: 'Lê Tộc Chi III',
                branchFullTitle: 'Lê Tộc Đại Tôn • Chi III',
                ancestralPlace: 'Mộ Trạch, Bình Giang, Hải Dương',
                contactInfo: '0912.111.222 (Chi III)',
                orderIndex: 3,
            })
            .returning();

        await db.insert(ancestralHalls).values({
            clanId: clan.id,
            name: 'Từ Đường Đại Tôn Chi II',
            shortName: 'Từ Đường Chi II',
            address: 'Làng Mộ Trạch, Xã Tân Hồng, Huyện Bình Giang, Tỉnh Hải Dương',
            province: 'Hải Dương',
            foundedYear: 1850,
            ranking: 'Di tích Lịch sử - Văn hóa Dòng họ',
            structure: 'Tiền đường 5 gian gỗ lim, Hậu cung 3 gian, Tả vu & Hữu vu ngói mũi hài cổ kính',
            mapsQueryUrl: 'https://maps.google.com/?q=Mo+Trach+Hai+Duong',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDklX2EE9agY1YPrvAoW1cxMVncSVZxg9F5602tTRjQae1gVWLJa0xxQrydZt-PhHVEhxAdb9lDsk5JE05K3bSYsuqHbHuExxaLoIa4iJkVhwe_9J_kNump0anZ6G_DXEbBpGCWitd11oACfd_VGmRkBedV0k5RW8vrr3DrBiSMkX3fuAh53b8__C87-viwzUR-wmyyDHI34w21Qp39-hhGiwL2-QsBY96cnqk1K8r9',
            managerName: 'Cụ Lê Văn Khang',
            managerPhone: '0912.345.678',
        });

        // ====================================================================
        // 2. THÀNH VIÊN GIA PHẢ 10 ĐỜI (sinh từ buildLeFamily)
        // ====================================================================
        console.log('👥 [3/7] Khởi tạo thành viên gia phả 10 đời...');
        const branchIdByIndex: Record<number, number> = {
            1: branch1.id,
            2: branch2.id,
            3: branch3.id,
        };

        const family = buildLeFamily();
        const dbIdByKey = new Map<string, number>();
        const generationList = Array.from(new Set(family.people.map((p) => p.generation))).sort(
            (a, b) => a - b
        );

        for (const gen of generationList) {
            const genPeople = family.people.filter((p) => p.generation === gen);
            for (const batch of chunkArray(genPeople, 20)) {
                const inserted = await db
                    .insert(members)
                    .values(
                        batch.map((p) => ({
                            clanId: clan.id,
                            branchId: branchIdByIndex[p.branchIndex],
                            fullName: p.fullName,
                            courtesyName: p.courtesyName,
                            gender: p.gender,
                            generationNumber: p.generation,
                            roleTitle: p.roleTitle,
                            duties: p.duties,
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
                            bio: p.bio,
                            birthOrder: p.birthOrder,
                            fatherId: p.fatherKey ? dbIdByKey.get(p.fatherKey) ?? null : null,
                            motherId: p.motherKey ? dbIdByKey.get(p.motherKey) ?? null : null,
                        }))
                    )
                    .returning({ id: members.id });
                inserted.forEach((row, i) => dbIdByKey.set(batch[i].key, row.id));
            }
        }

        // Liên kết vợ chồng (spouse_id)
        for (const p of family.people) {
            if (p.spouseKey) {
                await db
                    .update(members)
                    .set({ spouseId: dbIdByKey.get(p.spouseKey)! })
                    .where(eq(members.id, dbIdByKey.get(p.key)!));
            }
        }
        console.log(`   ✅ Đã nạp ${family.people.length} thành viên thuộc ${generationList.length} đời.`);

        const idOf = (key: string) => ({ id: dbIdByKey.get(key)! });
        const cuToOng = idOf(family.anchors.founder);
        const ongPhuc = idOf(family.anchors.truongChi);
        const ongKhang = idOf(family.anchors.tocTruong);
        const ongThinh = idOf(family.anchors.phoBanTriSu);
        const anhMinh = idOf(family.anchors.chauDichTon);
        const youngScholar =
            family.people.find(
                (p) =>
                    p.isAlive &&
                    p.gender === 'Male' &&
                    p.generation === 10 &&
                    p.key !== family.anchors.chauDichTon
            ) ?? family.people.find((p) => p.key === family.anchors.chauDichTon)!;
        const anhTuanAnh = idOf(youngScholar.key);

        await db.update(branches).set({ leaderId: ongKhang.id }).where(eq(branches.id, branch1.id));
        await db.update(branches).set({ leaderId: ongThinh.id }).where(eq(branches.id, branch2.id));

        // ====================================================================
        // 3. MỐI QUAN HỆ PHẢ HỆ (RELATIONSHIPS)
        // ====================================================================
        console.log('🔗 [4/7] Thiết lập đồ thị Mối quan hệ gia phả (Relationships)...');
        const relationRows: (typeof relationships.$inferInsert)[] = [];
        for (const p of family.people) {
            const self = dbIdByKey.get(p.key)!;
            if (p.spouseKey && p.gender === 'Male') {
                const spouse = dbIdByKey.get(p.spouseKey)!;
                relationRows.push(
                    { personId: self, relatedPersonId: spouse, type: 'SPOUSE', marriageOrder: 1 },
                    { personId: spouse, relatedPersonId: self, type: 'SPOUSE', marriageOrder: 1 }
                );
            }
            if (p.fatherKey) {
                relationRows.push({
                    personId: dbIdByKey.get(p.fatherKey)!,
                    relatedPersonId: self,
                    type: 'PARENT_CHILD',
                    orderInFamily: p.birthOrder,
                });
            }
            if (p.motherKey) {
                relationRows.push({
                    personId: dbIdByKey.get(p.motherKey)!,
                    relatedPersonId: self,
                    type: 'PARENT_CHILD',
                    orderInFamily: p.birthOrder,
                });
            }
        }
        for (const batch of chunkArray(relationRows, 40)) {
            await db.insert(relationships).values(batch);
        }

        // ====================================================================
        // 4. DI ẢNH, KHEN THƯỞNG & TƯ LIỆU (HONORS & MEDIA)
        // ====================================================================
        console.log('🏆 [5/7] Khởi tạo Bằng khen công đức & Album di ảnh...');
        await db.insert(memberHonors).values([
            {
                memberId: cuToOng.id,
                title: 'Khai Sơn Phá Thạch',
                description: 'Có công khai điền lập ấp và quy tập từ đường tổ tiên Mộ Trạch.',
                year: '1920',
                badgeType: 'star',
            },
            {
                memberId: cuToOng.id,
                title: 'Bản Tộc Thượng Tôn',
                description: 'Sắc phong Tiền Nhân Khởi Tổ Lê Tộc Đại Tôn Chi II.',
                year: '1945',
                badgeType: 'verified',
            },
            {
                memberId: ongPhuc.id,
                title: 'Bằng Tuyên Dương Công Đức Dòng Họ',
                description: 'Hội đồng Gia tộc trao tặng trong Đại lễ Tế Tổ vì công lao lưu giữ gia phả.',
                year: '2002',
                badgeType: 'star',
            },
            {
                memberId: ongKhang.id,
                title: 'Kỷ Niệm Chương "Vì Sự Nghiệp Khuyến Học"',
                description: 'Do Trung ương Hội Khuyến học Việt Nam trao tặng.',
                year: '2018',
                badgeType: 'medal',
            },
            {
                memberId: anhTuanAnh.id,
                title: 'Giải Nhất Quốc Gia Môn Lịch Sử',
                description: 'Kỳ thi Học sinh giỏi Quốc gia niên khóa 2024–2025. Bảng Vàng Lê Tộc.',
                year: '2025',
                badgeType: 'medal',
            },
        ]);

        await db.insert(memberMedia).values([
            {
                memberId: cuToOng.id,
                mediaType: 'photo',
                url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQIAaErrxDElCuX9927Iuu76rLjkLQNbcbakx8LT8THdfYhuwwcMCrAzfocJ_KqSPoBKIdTEdJB1ZF0xIVjvAabfKyZ1rYfT3lgSQq8Mm0jGjpg7kHyE0OY8-E-i7QGDEtIJkCul_pU2RbsER1KI84gz4-akAWpyA5kHNoa5h0HGLSYekNAen5bRc_0-KsmcOEPpQxwkywbqhhXaH0mBHzzTpUUilyNlKiX5l8s4Js',
                caption: 'Chân dung Cụ Khởi Tổ Lê Văn Quang phục chế sơn mài',
                year: '1940',
                isPortrait: true,
                sortOrder: 1,
            },
            {
                memberId: ongKhang.id,
                mediaType: 'photo',
                url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDklX2EE9agY1YPrvAoW1cxMVncSVZxg9F5602tTRjQae1gVWLJa0xxQrydZt-PhHVEhxAdb9lDsk5JE05K3bSYsuqHbHuExxaLoIa4iJkVhwe_9J_kNump0anZ6G_DXEbBpGCWitd11oACfd_VGmRkBedV0k5RW8vrr3DrBiSMkX3fuAh53b8__C87-viwzUR-wmyyDHI34w21Qp39-hhGiwL2-QsBY96cnqk1K8r9',
                caption: 'Lễ dâng hương tế tổ và khai xuân Ất Tỵ tại Từ đường',
                year: '2025',
                isPortrait: false,
                sortOrder: 2,
            },
        ]);

        await db.insert(clanDocuments).values([
            {
                clanId: clan.id,
                title: 'Lê Tộc Phả Ký Toàn Tập (Bản Nôm Cổ)',
                description: 'Bản dịch chữ Quốc ngữ từ bản phả ký chữ Nôm niên hiệu Tự Đức thứ 3.',
                tag: 'Phả ký cổ',
                fileUrl: '/documents/pha-ky-le-toc.pdf',
                publishedYear: 1850,
            },
            {
                clanId: clan.id,
                title: 'Tộc Ước & Quy Ước Gia Phong Chi II',
                description: 'Quy ước gìn giữ nề nếp gia phong, khuyến học khuyến tài và hiếu hỷ họ tộc.',
                tag: 'Tộc ước',
                fileUrl: '/documents/toc-uoc-2020.pdf',
                publishedYear: 2020,
            },
        ]);

        // ====================================================================
        // 5. SỰ KIỆN, KỴ NHẬT & NGHI THỨC (EVENTS & RITUALS)
        // ====================================================================
        console.log('📅 [6/7] Khởi tạo Sự kiện dòng họ, Kỵ nhật & Lễ hội...');
        const [event1] = await db
            .insert(events)
            .values({
                clanId: clan.id,
                title: 'Đại Lễ Giỗ Tổ Chi II & Khai Xuân Ất Tỵ',
                category: 'FESTIVAL',
                eventDateSolar: '2025-02-12',
                eventDateLunar: '15 tháng Giêng (ÂL)',
                timeStart: '07:30',
                location: 'Từ Đường Đại Tôn • Làng Mộ Trạch, Hải Dương',
                roleAudience: 'Toàn thể con cháu nội ngoại & Dâu rể',
                description: 'Đại lễ giỗ tổ thường niên lớn nhất của dòng tộc. Kính mời toàn thể con cháu nội ngoại gần xa tề tựu đông đủ dâng hương tri ân tổ tiên, nhận lộc xuân và thụ hưởng phúc lành dòng họ.',
                status: 'UPCOMING',
                isFeatured: true,
            })
            .returning();

        await db.insert(events).values({
            clanId: clan.id,
            title: 'Lễ Tuyên Dương Khuyến Học & Trao Học Bổng Lê Tộc',
            category: 'EDUCATION',
            eventDateSolar: '2025-02-11',
            eventDateLunar: '14 tháng Giêng (ÂL)',
            timeStart: '09:00',
            location: 'Gian Tiền Đường • Từ Đường Đại Tôn',
            roleAudience: 'Ban Khuyến Học & Các cháu học sinh giỏi, sinh viên đỗ đạt',
            description: 'Biểu dương tân cử nhân, thạc sĩ và học sinh giỏi các cấp có thành tích xuất sắc, tiếp nối truyền thống hiếu học rạng danh tổ tông.',
            status: 'UPCOMING',
            isFeatured: false,
        });

        await db.insert(eventRitualSteps).values([
            {
                eventId: event1.id,
                stepNumber: 1,
                timeScheduled: '07:30',
                title: 'Lễ Khởi Sự & Nghênh Đón',
                description: 'Ban khánh tiết chỉnh túc y phục truyền thống, nghênh đón bà con nội ngoại các chi xa gần về dâng hương kính tổ.',
            },
            {
                eventId: event1.id,
                stepNumber: 2,
                timeScheduled: '09:00',
                title: 'Đại Tế Chính & Dâng Chúc Văn',
                description: 'Cụ Tộc Trưởng chủ trì đăng đàn dâng hương, xướng đọc chúc văn tưởng nhớ công đức tổ tiên khai sáng cơ đồ.',
            },
            {
                eventId: event1.id,
                stepNumber: 3,
                timeScheduled: '10:30',
                title: 'Tuyên Dương & Quỹ Khuyến Học',
                description: 'Trao bằng khen danh dự và học bổng khuyến tài cho con cháu đỗ đạt, đạt thành tích cao trong học tập niên khóa.',
            },
            {
                eventId: event1.id,
                stepNumber: 4,
                timeScheduled: '11:30',
                title: 'Thụ Lộc Họ Tộc & Bữa Cơm Đoàn Viên',
                description: 'Toàn thể gia quyến dự bữa cơm thân mật tại gian Tả Vu & Hữu Vu, gắn kết tình đoàn kết ruột thịt đồng tông.',
            },
        ]);

        await db.insert(eventOrganizers).values([
            {
                eventId: event1.id,
                name: 'Cụ Lê Văn Khang',
                role: 'Trưởng Ban Tổ Chức • Tộc Trưởng',
                phone: '0912.345.678',
            },
            {
                eventId: event1.id,
                name: 'Ông Lê Văn Thịnh',
                role: 'Phụ Trách Hậu Cần & Khánh Tiết',
                phone: '0988.765.432',
            },
        ]);

        // ====================================================================
        // 6. QUỸ DÒNG HỌ, BẢN TIN & 4 TÀI KHOẢN AUTH.JS (MẬT KHẨU: 123456)
        // ====================================================================
        console.log('💰 [7/7] Khởi tạo Quỹ dòng họ, Bản tin & Tài khoản Auth.js...');
        const [fund1] = await db
            .insert(funds)
            .values({
                clanId: clan.id,
                code: 'quy-tu-tao-tu-duong',
                name: 'Quỹ Tôn Tạo & Trùng Tu Từ Đường',
                description: 'Quyên góp kinh phí bảo tồn di tích lăng mộ tiền nhân và tôn tạo gian hậu cung từ đường.',
                targetAmount: 200000000,
                currentBalance: 168500000,
                bankName: 'Ngân hàng Quân Đội (MB Bank)',
                bankAccount: '8888.1902.9999',
                accountHolder: 'LE VAN PHUC - TRUONG CHI',
                donationSyntax: 'LETOC [HOTEN] [CHI] DONGGOP',
                status: 'ACTIVE',
            })
            .returning();

        await db.insert(fundTransactions).values([
            {
                fundId: fund1.id,
                memberId: ongPhuc.id,
                transactionCode: 'TX-101',
                type: 'INCOME',
                title: 'Công đức tôn tạo lăng mộ Thủy Tổ',
                amount: 10000000,
                contributorName: 'Lê Văn Phúc',
                branchName: 'Chi Trưởng',
                transactionDate: '2026-10-28',
                note: 'Góp công đức đợt 2',
            },
            {
                fundId: fund1.id,
                memberId: ongThinh.id,
                transactionCode: 'TX-102',
                type: 'INCOME',
                title: 'Đóng góp hương hỏa thường niên 2026',
                amount: 2000000,
                contributorName: 'Lê Văn Thịnh',
                branchName: 'Chi 2',
                transactionDate: '2026-10-20',
                note: 'Đóng quỹ đinh thường niên',
            },
            {
                fundId: fund1.id,
                transactionCode: 'TX-103',
                type: 'EXPENSE',
                title: 'Chi mua sắm lễ vật ngày Giỗ Tổ',
                amount: 8500000,
                contributorName: 'Ban Khánh Tiết',
                branchName: 'Ban Trị Sự',
                transactionDate: '2026-10-15',
                note: 'Chi phí mua trầu cau, hoa quả, cỗ bàn tế lễ',
            },
        ]);

        const [article1] = await db
            .insert(newsArticles)
            .values({
                clanId: clan.id,
                title: 'Đại Lễ Khánh Thành Trùng Tu Nhà Thờ Tổ Chi II Thành Công Viên Mãn',
                slug: 'dai-le-khanh-thanh-trung-tu-nha-tho-to-chi-ii',
                tag: 'Thông báo',
                tagColor: 'primary',
                summary: 'Sáng ngày 15 tháng Giêng, Hội đồng Gia tộc cùng hàng trăm bà con nội ngoại gần xa đã tề tựu trang nghiêm dự lễ khánh thành tôn tạo Từ đường đại tông.',
                content: 'Trải qua hơn 6 tháng thi công cẩn trọng dưới sự giám sát của các nghệ nhân làng nghề cổ truyền, công trình đại trùng tu Nhà Thờ Tổ Chi II đã chính thức hoàn thiện với quy mô 5 gian tiền đường gỗ lim vững chãi, mái ngói mũi hài thanh thoát và phục chế hoàn chỉnh các bức đại tự, hoành phi câu đối sơn son thếp vàng.',
                authorName: 'Ban Trị Sự Lê Tộc',
                viewsCount: 342,
                likesCount: 56,
                commentsCount: 12,
                isPinned: true,
            })
            .returning();

        await db.insert(newsComments).values([
            {
                articleId: article1.id,
                authorName: 'Lê Văn Thành',
                authorBranch: 'Chi II • Đời thứ 8',
                content: 'Con cháu phương xa chúc mừng dòng họ! Từ đường khang trang uy nghiêm làm ấm lòng bà con kiều bào.',
            },
            {
                articleId: article1.id,
                authorName: 'Lê Thị Bích Ngọc',
                authorBranch: 'Chi Trưởng • Đời thứ 9',
                content: 'Tự hào truyền thống dòng họ Lê Tộc Đại Tôn!',
            },
        ]);

        const defaultPasswordHash = await hashPassword('123456');

        await db.insert(users).values([
            {
                memberId: ongKhang.id,
                email: 'admin@coinguon.vn',
                passwordHash: defaultPasswordHash,
                phone: '0912345678',
                fullName: 'Cụ Lê Văn Khang (Tộc Trưởng)',
                role: 'SUPER_ADMIN',
                status: 'ACTIVE',
            },
            {
                memberId: ongThinh.id,
                email: 'quantri@coinguon.vn',
                passwordHash: defaultPasswordHash,
                phone: '0988765432',
                fullName: 'Ông Lê Văn Thịnh (Trưởng Ban Khánh Tiết)',
                role: 'CLAN_ADMIN',
                status: 'ACTIVE',
            },
            {
                memberId: ongPhuc.id,
                email: 'chicuong@coinguon.vn',
                passwordHash: defaultPasswordHash,
                phone: '0912111222',
                fullName: 'Cụ Lê Văn Phúc (Trưởng Chi 2)',
                role: 'BRANCH_ADMIN',
                status: 'ACTIVE',
            },
            {
                memberId: anhMinh.id,
                email: 'thanhvien@coinguon.vn',
                passwordHash: defaultPasswordHash,
                phone: '0977888999',
                fullName: 'Lê Văn Minh (Hậu duệ Đích Tôn)',
                role: 'MEMBER',
                status: 'ACTIVE',
            },
        ]);

        console.log('\n🎉 [HOÀN TẤT] Seed 10 đời Lê Tộc & 4 tài khoản Auth.js (mật khẩu: 123456) thành công!');
    } catch (error) {
        console.error('❌ Lỗi khi khởi tạo seed data:', error);
        process.exit(1);
    }
}

if (process.argv[1]?.endsWith('seed.ts')) {
    runSeed().then(() => process.exit(0));
}
