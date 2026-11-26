/**
 * Các hằng số dùng chung trong hệ thống Gia Phả
 */

export const DEFAULT_MEMBER_AVATAR =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBQIAaErrxDElCuX9927Iuu76rLjkLQNbcbakx8LT8THdfYhuwwcMCrAzfocJ_KqSPoBKIdTEdJB1ZF0xIVjvAabfKyZ1rYfT3lgSQq8Mm0jGjpg7kHyE0OY8-E-i7QGDEtIJkCul_pU2RbsER1KI84gz4-akAWpyA5kHNoa5h0HGLSYekNAen5bRc_0-KsmcOEPpQxwkywbqhhXaH0mBHzzTpUUilyNlKiX5l8s4Js';

export const ROMAN_NUMERALS: readonly string[] = [
    '',
    'I',
    'II',
    'III',
    'IV',
    'V',
    'VI',
    'VII',
    'VIII',
    'IX',
    'X',
    'XI',
    'XII',
    'XIII',
    'XIV',
    'XV',
];

export interface BranchOption {
    id: 'all' | 'chi2' | 'chitruong' | 'daure';
    label: string;
}

export const BRANCH_OPTIONS: readonly BranchOption[] = [
    { id: 'all', label: 'Tất cả' },
    { id: 'chi2', label: 'Chi 2 (Bản tộc)' },
    { id: 'chitruong', label: 'Chi Trưởng' },
    { id: 'daure', label: 'Dâu / Rể' },
] as const;

