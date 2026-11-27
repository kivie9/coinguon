import { eq } from 'drizzle-orm';
import { ClanDto } from '@/types/clanType';
import { db } from '@/core/database/dataSource';
import { clans, ancestralHalls } from '@/core/database/schema';
import { warnDbFallback } from '@/core/database/dbStatus';
import { INITIAL_CLAN_DATA } from '@/config/clanData';

export { INITIAL_CLAN_DATA };

// In-memory mock database store (sẵn sàng chuyển đổi sang Database/ORM khi nối DB)
let clanDataStore: ClanDto = { ...INITIAL_CLAN_DATA };

export class ClanService {
    /**
     * Lấy toàn bộ thông tin cấu hình dòng tộc từ CSDL
     */
    async getClanInfo(): Promise<ClanDto> {
        try {
            const clanRecord = await db.query.clans.findFirst({
                with: {
                    branches: {
                        orderBy: (b, { asc }) => [asc(b.orderIndex)],
                    },
                    ancestralHalls: true,
                    documents: true,
                },
            });

            if (clanRecord) {
                const hall = clanRecord.ancestralHalls?.[0];
                const primaryBranch = clanRecord.branches?.[1] || clanRecord.branches?.[0];

                return {
                    ...clanDataStore,
                    id: String(clanRecord.id),
                    name: clanRecord.name || clanDataStore.name,
                    shortName: clanRecord.shortName || clanDataStore.shortName,
                    hanNomName: clanRecord.hanNomName || clanDataStore.hanNomName,
                    branchName: primaryBranch?.name || clanDataStore.branchName,
                    branchTitle: primaryBranch?.branchTitle || clanDataStore.branchTitle,
                    branchFullTitle: primaryBranch?.branchFullTitle || clanDataStore.branchFullTitle,
                    slogan: clanRecord.slogan || clanDataStore.slogan,
                    subSlogan: clanRecord.subSlogan || clanDataStore.subSlogan,
                    motto: clanRecord.motto || clanDataStore.motto,
                    description: clanRecord.description || clanDataStore.description,
                    stats: {
                        ...clanDataStore.stats,
                        foundedYear: clanRecord.foundedYear || clanDataStore.stats.foundedYear,
                    },
                    ancestralHall: hall
                        ? {
                              name: hall.name,
                              shortName: hall.shortName || hall.name,
                              address: hall.address,
                              province: hall.province || 'Hải Dương',
                              foundedYear: hall.foundedYear || 1820,
                              foundedYearText: `Năm ${hall.foundedYear || 1820}`,
                              area: '850 m²',
                              ranking: hall.ranking || 'Di tích Lịch sử - Văn hóa Dòng họ',
                              structure: hall.structure || clanDataStore.ancestralHall.structure,
                              mapsQueryUrl: hall.mapsQueryUrl || clanDataStore.ancestralHall.mapsQueryUrl,
                              imageUrl: hall.imageUrl || clanDataStore.ancestralHall.imageUrl,
                          }
                        : clanDataStore.ancestralHall,
                    liaisonBranches:
                        clanRecord.branches && clanRecord.branches.length > 0
                            ? clanRecord.branches.map((b) => ({
                                  id: `branch-${b.id}`,
                                  region: b.name,
                                  familiesCount: '100+ hộ gia đình',
                                  contactInfo: b.contactInfo || `${b.branchTitle}`,
                              }))
                            : clanDataStore.liaisonBranches,
                    documents:
                        clanRecord.documents && clanRecord.documents.length > 0
                            ? clanRecord.documents.map((d) => ({
                                  id: `doc-${d.id}`,
                                  title: d.title,
                                  description: d.description || '',
                                  updatedAt: String(d.publishedYear || '2024'),
                                  fileUrl: d.fileUrl,
                                  tag: d.tag || undefined,
                              }))
                            : clanDataStore.documents,
                    footerCopyright: clanRecord.footerCopyright || clanDataStore.footerCopyright,
                };
            }
        } catch (dbErr) {
            warnDbFallback('Lỗi khi truy vấn thông tin dòng tộc từ CSDL, dùng fallback:', dbErr);
        }
        return { ...clanDataStore };
    }

    /**
     * Cập nhật thông tin dòng tộc (dành cho Trang Quản Trị Admin CMS).
     * Khi hoàn thiện database:
     * e.g.: return await prisma.clan.update(...)
     */
    async updateClanInfo(patch: Partial<ClanDto>): Promise<ClanDto> {
        clanDataStore = {
            ...clanDataStore,
            ...patch,
            stats: {
                ...clanDataStore.stats,
                ...(patch.stats || {}),
            },
            committees: patch.committees || clanDataStore.committees,
            liaisonBranches: patch.liaisonBranches || clanDataStore.liaisonBranches,
            ancestralHall: {
                ...clanDataStore.ancestralHall,
                ...(patch.ancestralHall || {}),
            },
            donation: {
                ...clanDataStore.donation,
                ...(patch.donation || {}),
            },
            contact: {
                ...clanDataStore.contact,
                ...(patch.contact || {}),
                leader: {
                    ...clanDataStore.contact.leader,
                    ...(patch.contact?.leader || {}),
                },
            },
        };

        // Lưu đồng bộ xuống bảng clans & ancestral_halls trong CSDL nếu khả dụng
        try {
            const existingClan = await db.query.clans.findFirst({
                with: { ancestralHalls: true },
            });
            if (existingClan) {
                const clanUpdate: Partial<typeof clans.$inferInsert> = {
                    updatedAt: new Date(),
                };
                if (patch.name !== undefined) clanUpdate.name = patch.name;
                if (patch.shortName !== undefined) clanUpdate.shortName = patch.shortName;
                if (patch.hanNomName !== undefined) clanUpdate.hanNomName = patch.hanNomName;
                if (patch.slogan !== undefined) clanUpdate.slogan = patch.slogan;
                if (patch.subSlogan !== undefined) clanUpdate.subSlogan = patch.subSlogan;
                if (patch.motto !== undefined) clanUpdate.motto = patch.motto;
                if (patch.description !== undefined) clanUpdate.description = patch.description;
                if (patch.footerCopyright !== undefined) clanUpdate.footerCopyright = patch.footerCopyright;
                if (patch.stats?.foundedYear !== undefined) clanUpdate.foundedYear = patch.stats.foundedYear;

                await db.update(clans).set(clanUpdate).where(eq(clans.id, existingClan.id));

                const hall = existingClan.ancestralHalls?.[0];
                if (hall && patch.ancestralHall) {
                    const hallUpdate: Partial<typeof ancestralHalls.$inferInsert> = {
                        updatedAt: new Date(),
                    };
                    if (patch.ancestralHall.name !== undefined) hallUpdate.name = patch.ancestralHall.name;
                    if (patch.ancestralHall.address !== undefined) hallUpdate.address = patch.ancestralHall.address;
                    if (patch.ancestralHall.province !== undefined) hallUpdate.province = patch.ancestralHall.province;
                    if (patch.ancestralHall.ranking !== undefined) hallUpdate.ranking = patch.ancestralHall.ranking;
                    await db.update(ancestralHalls).set(hallUpdate).where(eq(ancestralHalls.id, hall.id));
                }
            }
        } catch (dbErr) {
            warnDbFallback('Lỗi khi lưu thông tin dòng tộc xuống CSDL:', dbErr);
        }

        return this.getClanInfo();
    }
}

export const clanService = new ClanService();
