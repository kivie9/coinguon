'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/providers/AuthProvider';
import { Lock, Mail, User, Loader2 } from 'lucide-react';

interface AuthModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
    const { login, signup } = useAuth();
    const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        if (mode === 'LOGIN') {
            const res = await login(email, password);
            if (res.success) {
                onOpenChange(false);
            }
        } else {
            const res = await signup(email, password, fullName);
            if (res.success) {
                setMode('LOGIN');
            }
        }
        setSubmitting(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-6 bg-surface border-0 rounded-2xl">
                <DialogHeader className="text-center sm:text-center pb-2">
                    <div className="size-12 mx-auto rounded-xl bg-primary flex items-center justify-center mb-2 text-secondary-fixed font-serif font-bold text-xl">
                        黎
                    </div>
                    <DialogTitle className="font-serif text-xl sm:text-2xl text-primary font-bold text-balance">
                        {mode === 'LOGIN' ? 'Đăng Nhập Cội Nguồn' : 'Đăng Ký Thành Viên'}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-on-surface-variant mt-1 text-pretty">
                        {mode === 'LOGIN'
                            ? 'Xác thực tài khoản để xem phả ký, kỵ nhật và quỹ họ thực tế.'
                            : 'Tạo tài khoản thành viên để kết nối dòng họ và phụng dưỡng tiên tổ.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    {mode === 'SIGNUP' && (
                        <div className="space-y-1.5">
                            <Label htmlFor="auth-fullname" className="text-sm font-semibold text-on-surface">Họ và tên</Label>
                            <div className="relative">
                                <User className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" aria-hidden="true" />
                                <Input
                                    id="auth-fullname"
                                    type="text"
                                    placeholder="Ví dụ: Lê Văn Minh"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    className="pl-10 h-11 text-sm rounded-xl border-outline-variant/60 bg-surface-container-lowest"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <Label htmlFor="auth-email" className="text-sm font-semibold text-on-surface">Email</Label>
                        <div className="relative">
                            <Mail className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" aria-hidden="true" />
                            <Input
                                id="auth-email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="pl-10 h-11 text-sm rounded-xl border-outline-variant/60 bg-surface-container-lowest"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="auth-password" className="text-sm font-semibold text-on-surface">Mật khẩu</Label>
                        <div className="relative">
                            <Lock className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" aria-hidden="true" />
                            <Input
                                id="auth-password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="pl-10 h-11 text-sm rounded-xl border-outline-variant/60 bg-surface-container-lowest"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full min-h-11 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-semibold text-sm mt-2 transition-colors duration-150 cursor-pointer"
                    >
                        {submitting && <Loader2 className="size-4 animate-spin mr-1.5" aria-hidden="true" />}
                        {mode === 'LOGIN' ? 'Đăng Nhập Tài Khoản' : 'Hoàn Tất Đăng Ký'}
                    </Button>
                </form>

                <div className="text-center text-sm text-on-surface-variant pt-1">
                    {mode === 'LOGIN' ? (
                        <span>
                            Chưa có tài khoản?{' '}
                            <button
                                type="button"
                                onClick={() => setMode('SIGNUP')}
                                className="text-primary font-bold hover:underline cursor-pointer"
                            >
                                Đăng ký ngay
                            </button>
                        </span>
                    ) : (
                        <span>
                            Đã có tài khoản?{' '}
                            <button
                                type="button"
                                onClick={() => setMode('LOGIN')}
                                className="text-primary font-bold hover:underline cursor-pointer"
                            >
                                Đăng nhập
                            </button>
                        </span>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
