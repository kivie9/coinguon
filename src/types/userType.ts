export type UserRole = 'SUPER_ADMIN' | 'CLAN_ADMIN' | 'BRANCH_ADMIN' | 'MEMBER' | 'GUEST';

export type UserStatus = 'ACTIVE' | 'LOCKED' | 'PENDING';

export interface UserProfileDto {
    id: number;
    email: string | null;
    phone: string | null;
    fullName: string;
    avatarUrl: string | null;
    role: UserRole;
    status: UserStatus;
    memberId: number | null;
    lastLoginAt: string | null;
    createdAt: string;
    // Thông tin thành viên phả hệ liên kết (nếu có)
    linkedMember?: {
        id: number;
        fullName: string;
        generationNumber: number;
        roleTitle: string | null;
        branchTitle: string | null;
    } | null;
}

export interface AuthSessionResponse {
    user: UserProfileDto | null;
    role: UserRole;
    isAuthenticated: boolean;
    isGuest: boolean;
    isAdmin: boolean;
    isSuperAdmin: boolean;
}

