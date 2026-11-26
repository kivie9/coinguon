import { useState, useMemo, useEffect } from 'react';
import { MemberDto } from '@/types/memberType';
import { matchesBranch, matchesSearchQuery } from '@/utils/memberUtils';

export type BranchFilter = 'all' | 'chi2' | 'chitruong' | 'daure';
export type GenFilter = number | 'all';

export function useMemberFilter(members: MemberDto[]) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBranch, setSelectedBranch] = useState<BranchFilter>('all');
    const [selectedGen, setSelectedGen] = useState<GenFilter>('all');

    // Tự động nhận diện thế hệ được chọn từ URL (vd: /members?gen=2 hoặc /members?generation=2)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const genParam = params.get('gen') || params.get('generation');
            if (genParam) {
                const parsed = parseInt(genParam, 10);
                if (!isNaN(parsed)) {
                    setSelectedGen(parsed);
                }
            }
        }
    }, []);

    // Danh sách thế hệ xuất hiện trong dữ liệu (hoàn toàn động từ CSDL / API, không hardcode)
    const availableGens = useMemo(() => {
        const set = new Set<number>();
        members.forEach((m) => {
            if (m.generationNumber) set.add(m.generationNumber);
        });
        return Array.from(set).sort((a, b) => a - b);
    }, [members]);

    // Thống kê nam / nữ trên toàn bộ danh sách
    const stats = useMemo(() => {
        let male = 0;
        let female = 0;
        members.forEach((m) => {
            if (m.gender === 'Female') female++;
            else male++;
        });
        return { male, female, total: members.length };
    }, [members]);

    // Bộ lọc đa tiêu chí: Từ khóa + Chi nhánh + Đời thế hệ
    const filteredMembers = useMemo(() => {
        return members.filter((m) => {
            // 1. Lọc theo từ khóa tìm kiếm
            if (!matchesSearchQuery(m, searchQuery)) return false;

            // 2. Lọc theo Chi nhánh
            if (!matchesBranch(m, selectedBranch)) return false;

            // 3. Lọc theo Đời
            if (selectedGen !== 'all' && m.generationNumber !== selectedGen) return false;

            return true;
        });
    }, [members, searchQuery, selectedBranch, selectedGen]);

    // Gom nhóm thành viên theo từng Đời
    const groupedByGen = useMemo(() => {
        const groups: { [gen: number]: MemberDto[] } = {};
        filteredMembers.forEach((m) => {
            const gen = m.generationNumber || 1;
            if (!groups[gen]) groups[gen] = [];
            groups[gen].push(m);
        });
        return groups;
    }, [filteredMembers]);

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedBranch('all');
        setSelectedGen('all');
    };

    return {
        searchQuery,
        setSearchQuery,
        selectedBranch,
        setSelectedBranch,
        selectedGen,
        setSelectedGen,
        availableGens,
        stats,
        filteredMembers,
        groupedByGen,
        resetFilters,
    };
}

