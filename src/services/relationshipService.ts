import { MemberDto } from '@/types/memberType';

export class RelationshipService {
    /**
     * Tính toán danh xưng vai vế giữa 2 thành viên
     */
    getRelationshipTitle(personA: MemberDto, personB: MemberDto): string {
        const genDiff = (personB.generationNumber || 1) - (personA.generationNumber || 1);

        if (genDiff === 0) {
            return personA.id === personB.id ? 'Chính mình' : 'Anh em đồng bối (cùng thế hệ)';
        } else if (genDiff === 1) {
            return personA.gender === 'Female' ? 'Mẹ / Cô / Bác gái' : 'Cha / Bác / Chú';
        } else if (genDiff === 2) {
            return personA.gender === 'Female' ? 'Bà nội / Bà ngoại' : 'Ông nội / Ông ngoại';
        } else if (genDiff >= 3) {
            return personA.gender === 'Female' ? 'Cụ Bà Tiền Nhân' : 'Cụ Ông Tiền Nhân';
        } else if (genDiff === -1) {
            return personA.gender === 'Female' ? 'Con gái' : 'Con trai';
        } else if (genDiff === -2) {
            return 'Cháu nội / Cháu ngoại';
        } else {
            return 'Hậu duệ chắt / chút';
        }
    }
}

export const relationshipService = new RelationshipService();

