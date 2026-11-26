'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Loader2, LogIn, ShieldCheck } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect') || '/';

    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const res = await login(email, password);
        if (res.success) {
            toast.success('Đăng nhập thành công! Đang chuyển hướng...');
            if (redirectUrl.startsWith('/')) {
                router.push(redirectUrl);
            } else {
                router.push('/');
            }
        }
        setSubmitting(false);
    };

    const fillAccount = (accEmail: string) => {
        setEmail(accEmail);
        setPassword('123456');
    };

    return (
        <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
                <div className="size-14 mx-auto rounded-2xl bg-primary flex items-center justify-center text-secondary-fixed font-serif font-bold text-2xl">
                    黎
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl text-primary font-bold text-balance">
                    Đăng Nhập Cội Nguồn
                </h1>
                <p className="text-sm text-on-surface-variant max-w-xs mx-auto leading-relaxed text-pretty">
                    Xác thực tài khoản để truy cập phả ký, danh sách kỵ nhật và không gian quản trị dòng tộc.
                </p>
            </div>

            <div className="p-3.5 bg-surface-container-low rounded-xl space-y-2.5">
                <p className="text-xs font-semibold text-on-surface-variant">
                    Chọn tài khoản mẫu để điền nhanh:
                </p>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => fillAccount('admin@coinguon.vn')}
                        className="text-left p-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container transition-colors duration-150 cursor-pointer group"
                    >
                        <span className="text-xs font-bold text-on-surface block group-hover:text-primary">Admin Tối Cao</span>
                        <span className="text-xs text-on-surface-variant truncate block">admin@coinguon.vn</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => fillAccount('quantri@coinguon.vn')}
                        className="text-left p-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container transition-colors duration-150 cursor-pointer group"
                    >
                        <span className="text-xs font-bold text-on-surface block group-hover:text-primary">Quản Trị Tộc</span>
                        <span className="text-xs text-on-surface-variant truncate block">quantri@coinguon.vn</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => fillAccount('chicuong@coinguon.vn')}
                        className="text-left p-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container transition-colors duration-150 cursor-pointer group"
                    >
                        <span className="text-xs font-bold text-on-surface block group-hover:text-primary">Trưởng Chi 2</span>
                        <span className="text-xs text-on-surface-variant truncate block">chicuong@coinguon.vn</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => fillAccount('thanhvien@coinguon.vn')}
                        className="text-left p-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container transition-colors duration-150 cursor-pointer group"
                    >
                        <span className="text-xs font-bold text-on-surface block group-hover:text-primary">Thành Viên</span>
                        <span className="text-xs text-on-surface-variant truncate block">thanhvien@coinguon.vn</span>
                    </button>
                </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="login-email" className="text-sm font-semibold text-on-surface">Địa chỉ Email</Label>
                    <div className="relative">
                        <Mail className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" aria-hidden="true" />
                        <Input
                            id="login-email"
                            type="email"
                            placeholder="name@coinguon.vn"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="pl-10 h-11 text-sm rounded-xl border-outline-variant/60 bg-surface"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="login-password" className="text-sm font-semibold text-on-surface">Mật khẩu</Label>
                        <span className="text-xs text-on-surface-variant tabular-nums">Mặc định: 123456</span>
                    </div>
                    <div className="relative">
                        <Lock className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" aria-hidden="true" />
                        <Input
                            id="login-password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="pl-10 h-11 text-sm rounded-xl border-outline-variant/60 bg-surface"
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full min-h-11 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-semibold text-sm mt-2 transition-colors duration-150 cursor-pointer gap-2"
                >
                    {submitting ? (
                        <>
                            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                            <span>Đang xác thực thông tin...</span>
                        </>
                    ) : (
                        <>
                            <LogIn className="size-4" aria-hidden="true" />
                            <span>Đăng Nhập Tài Khoản</span>
                        </>
                    )}
                </Button>
            </form>

            <div className="pt-3 border-t border-outline-variant/25 space-y-2 text-center text-sm">
                <p className="text-on-surface-variant">
                    Chưa có tài khoản dòng tộc?{' '}
                    <Link
                        href={`/register${redirectUrl !== '/' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
                        className="text-primary font-bold hover:underline"
                    >
                        Đăng ký thành viên ngay
                    </Link>
                </p>
                <div className="flex items-center justify-center gap-1.5 text-xs text-on-surface-variant pt-1">
                    <ShieldCheck className="size-4 text-secondary" aria-hidden="true" />
                    <span>Hệ thống bảo mật xác thực Auth.js (D1 SQLite)</span>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <div className="p-8 text-center bg-surface-container-lowest rounded-2xl">
                    <Loader2 className="size-6 animate-spin mx-auto text-primary mb-2" aria-hidden="true" />
                    <p className="text-sm text-on-surface-variant">Đang tải trang đăng nhập...</p>
                </div>
            }
        >
            <LoginForm />
        </Suspense>
    );
}
