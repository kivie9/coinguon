import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { eq } from 'drizzle-orm';
import { db } from '@/core/database/dataSource';
import { users } from '@/core/database/schema';
import { verifyPassword } from '@/utils/password';
import type { UserRole, UserStatus } from '@/types/userType';

declare module 'next-auth' {
    interface User {
        dbId?: number;
        role?: UserRole;
        status?: UserStatus;
        memberId?: number | null;
        phone?: string | null;
    }
    interface Session {
        user: {
            id: string;
            dbId: number;
            email: string;
            name: string;
            image?: string | null;
            role: UserRole;
            status: UserStatus;
            memberId: number | null;
            phone: string | null;
        };
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    trustHost: true,
    secret: process.env.AUTH_SECRET || 'coinguon-dev-secret-change-in-production',
    session: {
        strategy: 'jwt',
        maxAge: 60 * 60 * 24 * 7, // 7 ngày
    },
    pages: {
        signIn: '/login',
    },
    providers: [
        Credentials({
            name: 'Email & Mật khẩu',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Mật khẩu', type: 'password' },
            },
            async authorize(credentials) {
                const email = String(credentials?.email || '').trim().toLowerCase();
                const password = String(credentials?.password || '');

                if (!email || !password) {
                    return null;
                }

                try {
                    const dbUser = await db.query.users.findFirst({
                        where: eq(users.email, email),
                    });

                    if (!dbUser || dbUser.status === 'LOCKED') {
                        return null;
                    }

                    const valid = await verifyPassword(password, dbUser.passwordHash);
                    if (!valid) {
                        return null;
                    }

                    await db
                        .update(users)
                        .set({ lastLoginAt: new Date(), updatedAt: new Date() })
                        .where(eq(users.id, dbUser.id))
                        .catch(() => {});

                    return {
                        id: String(dbUser.id),
                        dbId: dbUser.id,
                        email: dbUser.email,
                        name: dbUser.fullName,
                        image: dbUser.avatarUrl,
                        role: dbUser.role as UserRole,
                        status: dbUser.status as UserStatus,
                        memberId: dbUser.memberId,
                        phone: dbUser.phone,
                    };
                } catch (err) {
                    console.error('Lỗi xác thực Auth.js Credentials:', err);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.dbId = user.dbId ?? Number(user.id);
                token.role = user.role || 'MEMBER';
                token.status = user.status || 'ACTIVE';
                token.memberId = user.memberId ?? null;
                token.phone = user.phone ?? null;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = String(token.dbId ?? token.sub ?? '');
                session.user.dbId = Number(token.dbId ?? token.sub ?? 0);
                session.user.role = (token.role as UserRole) || 'MEMBER';
                session.user.status = (token.status as UserStatus) || 'ACTIVE';
                session.user.memberId = (token.memberId as number | null) ?? null;
                session.user.phone = (token.phone as string | null) ?? null;
            }
            return session;
        },
    },
});
