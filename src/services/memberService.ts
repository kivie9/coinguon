import { Member, NewMember } from '@/core/database/schema';
import { BaseService } from '@/core/base/baseService';
import { warnDbFallback } from '@/core/database/dbStatus';
import { MemberRepository } from '@/repositories/memberRepository';
import { MemberDto } from '@/types/memberType';
import { enrichAllMembers, getSampleHeritageMembers } from './mappers/memberMapper';
import { getRomanNumeral, getGenerationTitle } from '@/utils/memberUtils';

/**
 * MemberService: Tầng dịch vụ nghiệp vụ thành viên
 * Chỉ đảm nhận một trách nhiệm duy nhất (Single Responsibility):
 * Điều phối dữ liệu thành viên giữa Repository (CSDL) và tầng ứng dụng.
 */
export class MemberService extends BaseService<Member, NewMember> {
    constructor(private readonly memberRepo: MemberRepository) {
        super(memberRepo);
    }

    /**
     * Lấy toàn bộ danh sách thành viên dòng tộc (đã map sang DTO)
     */
    async getAllEnrichedMembers(): Promise<MemberDto[]> {
        try {
            const dbMembers = await this.memberRepo.findAllOrdered();
            if (dbMembers && dbMembers.length > 0) {
                return enrichAllMembers(dbMembers);
            }
        } catch (dbErr) {
            warnDbFallback('Chưa kết nối CSDL hoặc DB rỗng, sử dụng dữ liệu lưu trữ mẫu:', dbErr);
        }
        return getSampleHeritageMembers();
    }

    /**
     * Lấy thông tin một thành viên theo ID (hỗ trợ cả ID CSDL và index kế thừa)
     */
    async getMemberByIdEnriched(id: number): Promise<MemberDto | null> {
        const all = await this.getAllEnrichedMembers();
        const found = all.find((m) => m.id === id);
        if (found) return found;
        if (id >= 1 && id <= all.length) {
            return all[id - 1];
        }
        return null;
    }

    /**
     * Lấy danh sách thành viên theo đời thế hệ
     */
    async getMembersByGeneration(generation: number): Promise<MemberDto[]> {
        const all = await this.getAllEnrichedMembers();
        return all.filter((m) => m.generationNumber === generation);
    }

    /**
     * Lấy danh sách các đời/thế hệ thực tế đang có trong dữ liệu (sắp xếp tăng dần)
     */
    async getAvailableGenerations(): Promise<number[]> {
        const all = await this.getAllEnrichedMembers();
        const set = new Set<number>();
        all.forEach((m) => {
            if (m.generationNumber) set.add(m.generationNumber);
        });
        return Array.from(set).sort((a, b) => a - b);
    }

    /**
     * Lấy thông tin thống kê chi tiết theo từng thế hệ (danh xưng, số la mã, số lượng)
     */
    async getGenerationStats() {
        const all = await this.getAllEnrichedMembers();
        const genMap = new Map<number, number>();
        all.forEach((m) => {
            const gen = m.generationNumber || 1;
            genMap.set(gen, (genMap.get(gen) || 0) + 1);
        });

        return Array.from(genMap.keys())
            .sort((a, b) => a - b)
            .map((gen) => {
                const { title, badge } = getGenerationTitle(gen);
                return {
                    generation: gen,
                    roman: getRomanNumeral(gen),
                    title,
                    badge,
                    count: genMap.get(gen) || 0,
                };
            });
    }

    /**
     * Lấy thông tin chi tiết thành viên kèm quan hệ phả hệ
     */
    async getMemberProfile(id: number) {
        const member = await this.memberRepo.findByIdWithRelations(id);
        if (!member) throw new Error(`Không tìm thấy thành viên với ID #${id}`);
        return member;
    }

    /**
     * Tạo mới thành viên
     */
    async create(data: NewMember): Promise<Member> {
        return await this.memberRepo.create(data);
    }

    /**
     * Cập nhật thông tin thành viên
     */
    async update(id: number, data: Partial<NewMember>): Promise<Member | null> {
        return await this.memberRepo.update(id, data);
    }

    /**
     * Xóa thành viên theo ID
     */
    async delete(id: number): Promise<boolean> {
        try {
            await this.memberRepo.delete(id);
            return true;
        } catch {
            return false;
        }
    }
}

export const memberService = new MemberService(new MemberRepository());
