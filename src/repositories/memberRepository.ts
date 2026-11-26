import { BaseRepository } from '@/core/base/baseRepository';
import { members, Member, NewMember } from '@/core/database/schema';
import { eq, and, isNull, asc } from 'drizzle-orm';

export class MemberRepository extends BaseRepository<typeof members, Member, NewMember> {
    constructor() {
        super(members);
    }

    /**
     * Truy vấn toàn bộ thành viên sắp xếp theo đời và ngày sinh
     */
    async findAllOrdered(): Promise<Member[]> {
        return await this.db
            .select()
            .from(members)
            .where(isNull(members.deletedAt))
            .orderBy(asc(members.generationNumber), asc(members.id));
    }

    /**
     * Truy vấn lấy danh sách thành viên theo đời (generation)
     */
    async findByGeneration(generationNumber: number): Promise<Member[]> {
        return await this.db
            .select()
            .from(members)
            .where(
                and(
                    eq(members.generationNumber, generationNumber),
                    isNull(members.deletedAt)
                )
            )
            .orderBy(asc(members.birthdaySolar));
    }

    /**
     * Truy vấn lấy thông tin thành viên kèm theo các mối quan hệ (vợ chồng, cha con...)
     */
    async findByIdWithRelations(id: number) {
        return await this.db.query.members.findFirst({
            where: and(eq(members.id, id), isNull(members.deletedAt)),
            with: {
                relationships: {
                    with: {
                        relatedPerson: true,
                    },
                },
                relatedRelationships: {
                    with: {
                        person: true,
                    },
                },
            },
        });
    }
}
