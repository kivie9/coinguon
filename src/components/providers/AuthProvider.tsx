'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { signIn, signOut } from 'next-auth/react';
import { apiFetch } from '@/services/api/apiClient';
import { UserRole, UserProfileDto } from '@/types/userType';
import { toast } from '@/components/ui/sonner';

interface AuthContextType {
    user: UserProfileDto | null;
    role: UserRole;
    loading: boolean;
    isLoading: boolean;
    isGuest: boolean;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
    signup: (email: string, pass: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    switchDemoRole: (role: UserRole) => void;
    refreshAuth: (showLoading?: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    role: 'GUEST',
    loading: true,
    isLoading: true,
    isGuest: true,
    isAdmin: false,
    isSuperAdmin: false,
    login: async () => ({ success: false }),
    signup: async () => ({ success: false }),
    logout: async () => {},
    switchDemoRole: () => {},
    refreshAuth: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfileDto | null>(null);
    const [role, setRole] = useState<UserRole>('GUEST');
    const [loading, setLoading] = useState(true);

    const refreshAuth = useCallback(async (showLoading = false) => {
        try {
            if (showLoading) setLoading(true);
            const res = await apiFetch('/api/auth/me', { cache: 'no-store' });
            if (res.ok) {
                const json = await res.json();
                if (json.data) {
                    setUser(json.data.user || null);
                    setRole(json.data.role || 'GUEST');
                }
            }
        } catch (err) {
            console.error('Lỗi khi tải thông tin xác thực:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshAuth(false);
    }, [refreshAuth]);

    const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
        try {
            setLoading(true);
            const result = await signIn('credentials', {
                email,
                password: pass,
                redirect: false,
            });

            if (result?.error || !result?.ok) {
                const msg = 'Email hoặc mật khẩu không chính xác (hoặc tài khoản đã bị khóa).';
                toast.error(msg);
                return { success: false, error: msg };
            }

            if (typeof window !== 'undefined') {
                localStorage.removeItem('coinguon_demo_role');
            }

            await refreshAuth(false);
            toast.success('Đăng nhập thành công! Chào mừng bạn quay trở lại.');
            return { success: true };
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Lỗi hệ thống khi đăng nhập.';
            toast.error(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const signup = async (email: string, pass: string, fullName: string): Promise<{ success: boolean; error?: string }> => {
        try {
            setLoading(true);
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: pass, fullName }),
            });
            const json = await res.json().catch(() => ({}));

            if (!res.ok || !json.success) {
                const msg = json.message || 'Đăng ký không thành công.';
                toast.error(msg);
                return { success: false, error: msg };
            }

            toast.success('Đăng ký thành công! Tài khoản đang chờ Ban Quản Trị phê duyệt.');
            return { success: true };
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Lỗi hệ thống khi đăng ký.';
            toast.error(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('coinguon_demo_role');
                sessionStorage.clear();
            }

            setUser(null);
            setRole('GUEST');

            await Promise.allSettled([
                signOut({ redirect: false }),
                fetch('/api/auth/logout', { method: 'POST' }),
            ]);

            toast.success('Đã đăng xuất thành công.');

            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        } catch (err) {
            console.error('Lỗi khi đăng xuất:', err);
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
    };

    const switchDemoRole = (newRole: UserRole) => {
        if (newRole === 'GUEST') {
            localStorage.removeItem('coinguon_demo_role');
            signOut({ redirect: false }).catch(() => {});
        } else {
            localStorage.setItem('coinguon_demo_role', newRole);
        }
        toast.info(`Đã chuyển sang chế độ: ${getRoleLabel(newRole)}`);
        refreshAuth();
    };

    const isGuest = role === 'GUEST';
    const isSuperAdmin = role === 'SUPER_ADMIN';
    const isAdmin = isSuperAdmin || role === 'CLAN_ADMIN' || role === 'BRANCH_ADMIN';

    return (
        <AuthContext.Provider
            value={{
                user,
                role,
                loading,
                isLoading: loading,
                isGuest,
                isAdmin,
                isSuperAdmin,
                login,
                signup,
                logout,
                switchDemoRole,
                refreshAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

export function getRoleLabel(role: UserRole): string {
    switch (role) {
        case 'SUPER_ADMIN':
            return 'Admin Tối Cao';
        case 'CLAN_ADMIN':
            return 'Quản Trị Dòng Họ';
        case 'BRANCH_ADMIN':
            return 'Quản Trị Chi Phái';
        case 'MEMBER':
            return 'Thành Viên Dòng Tộc';
        case 'GUEST':
        default:
            return 'Khách';
    }
}
