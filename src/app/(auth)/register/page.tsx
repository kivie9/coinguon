'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, Phone, Loader2, UserPlus, ShieldCheck } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect') || '/';

    const { signup } = useAuth();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp!');
            return;
        }

        if (password.length < 6) {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự!');
            return;
        }

        setSubmitting(true);

        const res = await signup(email, password, fullName);
        if (res.success) {
            toast.success('Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay.');
            router.push(`/login${redirectUrl !== '/' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`);
        }
        setSubmitting(false);
    };

    return (
        <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
                <div className="size-14 mx-auto rounded-2xl bg-primary flex items-center justify-center text-secondary-fixed font-serif font-bold text-2xl">
                    黎
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl text-primary font-bold text-balance">
                    Đăng Ký Thành Viên
                </h1>
                <p className="text-sm text-on-surface-variant max-w-xs mx-auto leading-relaxed text-pretty">
                    Khởi tạo tài khoản thành viên để kết nối dòng tộc, phụng dưỡng tổ tiên và tra cứu phả đồ.
                </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="reg-fullname" className="text-sm font-semibold text-on-surface">Họ và tên đầy đủ</Label>
                    <div className="relative">
                        <User className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" aria-hidden="true" />
                        <Input
                            id="reg-fullname"
                            type="text"
                            placeholder="Ví dụ: Lê Văn Minh"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="pl-10 h-11 text-sm rounded-xl border-outline-variant/60 bg-surface"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="reg-email" className="text-sm font-semibold text-on-surface">Địa chỉ Email</Label>
                    <div className="relative">
                        <Mail className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" aria-hidden="true" />
                        <Input
                            id="reg-email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="pl-10 h-11 text-sm rounded-xl border-outline-variant/60 bg-surface"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="reg-phone" className="text-sm font-semibold text-on-surface">Số điện thoại (tùy chọn)</Label>
                    <div className="relative">
                        <Phone className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" aria-hidden="true" />
                        <Input
                            id="reg-phone"
                            type="tel"
                            placeholder="0912.xxx.xxx"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="pl-10 h-11 text-sm rounded-xl border-outline-variant/60 bg-surface tabular-nums"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="reg-password" className="text-sm font-semibold text-on-surface">Mật khẩu</Label>
                    <div className="relative">
                        <Lock className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" aria-hidden="true" />
                        <Input
                            id="reg-password"
                            type="password"
                            placeholder="Tối thiểu 6 ký tự"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="pl-10 h-11 text-sm rounded-xl border-outline-variant/60 bg-surface"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="reg-confirm" className="text-sm font-semibold text-on-surface">Xác nhận mật khẩu</Label>
                    <div className="relative">
                        <Lock className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" aria-hidden="true" />
                        <Input
                            id="reg-confirm"
                            type="password"
                            placeholder="Nhập lại mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                            <span>Đang khởi tạo tài khoản...</span>
                        </>
                    ) : (
                        <>
                            <UserPlus className="size-4" aria-hidden="true" />
                            <span>Hoàn Tất Đăng Ký</span>
                        </>
                    )}
                </Button>
            </form>

            <div className="pt-3 border-t border-outline-variant/25 space-y-2 text-center text-sm">
                <p className="text-on-surface-variant">
                    Đã có tài khoản thành viên?{' '}
                    <Link
                        href={`/login${redirectUrl !== '/' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
                        className="text-primary font-bold hover:underline"
                    >
                        Đăng nhập ngay
                    </Link>
                </p>
                <div className="flex items-center justify-center gap-1.5 text-xs text-on-surface-variant pt-1">
                    <ShieldCheck className="size-4 text-secondary" aria-hidden="true" />
                    <span>Dữ liệu dòng tộc được bảo mật và phân quyền nghiêm ngặt</span>
                </div>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense
            fallback={
                <div className="p-8 text-center bg-surface-container-lowest rounded-2xl">
                    <Loader2 className="size-6 animate-spin mx-auto text-primary mb-2" aria-hidden="true" />
                    <p className="text-sm text-on-surface-variant">Đang tải trang đăng ký...</p>
                </div>
            }
        >
            <RegisterForm />
        </Suspense>
    );
}
