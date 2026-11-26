'use client';

import React, { useState, useEffect } from 'react';
import { useDevice } from '@/hooks/useDevice';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Download,
    Share,
    PlusSquare,
    CheckCircle2,
    Smartphone,
    Monitor,
    AlertTriangle,
    MoreVertical,
} from 'lucide-react';
import { triggerHaptic } from '@/utils/haptics';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PwaInstallButtonProps {
    variant?: 'default' | 'outline' | 'ghost';
    size?: 'default' | 'sm' | 'lg';
    className?: string;
    showText?: boolean;
}

export const PwaInstallButton = ({
    variant = 'ghost',
    size = 'sm',
    className = '',
    showText = true,
}: PwaInstallButtonProps) => {
    const { isIOS, isAndroid } = useDevice();
    const [mounted, setMounted] = useState(false);
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isSecure, setIsSecure] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setMounted(true);
        setIsSecure(window.isSecureContext);

        const isStandalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as unknown as { standalone?: boolean }).standalone === true;
        setIsInstalled(isStandalone);

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setInstallPrompt(e as BeforeInstallPromptEvent);
        };

        const handleAppInstalled = () => {
            setIsInstalled(true);
            setInstallPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    if (!mounted || isInstalled) {
        return null;
    }

    const handleInstallClick = async () => {
        triggerHaptic('medium');

        if (installPrompt) {
            try {
                await installPrompt.prompt();
                const choiceResult = await installPrompt.userChoice;
                if (choiceResult.outcome === 'accepted') {
                    setIsInstalled(true);
                    setInstallPrompt(null);
                    return;
                }
            } catch (err) {
                console.warn('Lỗi khi mở hộp thoại cài đặt:', err);
            }
        }

        setShowModal(true);
    };

    return (
        <>
            <Button
                variant={variant}
                size={size}
                onClick={handleInstallClick}
                aria-label={showText ? undefined : 'Cài đặt ứng dụng Cội Nguồn'}
                className={`min-h-10 font-semibold rounded-lg bg-surface-container text-primary hover:bg-surface-container-high border-0 transition-colors duration-150 cursor-pointer ${className}`}
                title="Cài đặt ứng dụng Cội Nguồn như một App độc lập"
            >
                <Download className={`size-4 shrink-0 text-primary ${showText ? 'mr-1.5' : ''}`} aria-hidden="true" />
                {showText && <span>Cài đặt ứng dụng</span>}
            </Button>

            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="max-w-md bg-surface border-0 rounded-2xl p-6 text-on-surface max-h-[90dvh] overflow-y-auto">
                    <DialogHeader className="text-left space-y-2">
                        <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            {isIOS || isAndroid ? <Smartphone className="size-6" aria-hidden="true" /> : <Monitor className="size-6" aria-hidden="true" />}
                        </div>
                        <DialogTitle className="font-serif text-xl font-bold text-primary text-balance">
                            Cài đặt ứng dụng Cội Nguồn
                        </DialogTitle>
                        <DialogDescription className="text-sm text-on-surface-variant text-pretty">
                            Cài đặt để mở ứng dụng toàn màn hình độc lập, dễ bấm và không vướng thanh địa chỉ trình duyệt.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="my-3 space-y-3">
                        {isIOS && (
                            <>
                                <div className="flex items-start gap-3 p-4 bg-surface-container-low rounded-xl">
                                    <div className="size-7 rounded-full bg-primary text-on-primary font-bold text-xs flex items-center justify-center shrink-0 tabular-nums">
                                        1
                                    </div>
                                    <div>
                                        <p className="font-bold text-on-surface text-sm">
                                            Bấm nút <span className="text-primary">Chia sẻ</span> (Share)
                                        </p>
                                        <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1.5">
                                            (Biểu tượng <Share className="size-4 inline text-secondary" aria-hidden="true" /> ở thanh công cụ dưới Safari)
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-surface-container-low rounded-xl">
                                    <div className="size-7 rounded-full bg-primary text-on-primary font-bold text-xs flex items-center justify-center shrink-0 tabular-nums">
                                        2
                                    </div>
                                    <div>
                                        <p className="font-bold text-on-surface text-sm">
                                            Chọn <span className="text-primary">&quot;Thêm vào Màn hình chính&quot;</span>
                                        </p>
                                        <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1.5">
                                            (<PlusSquare className="size-4 inline text-on-surface-variant" aria-hidden="true" /> &quot;Add to Home Screen&quot;)
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}

                        {isAndroid && (
                            <>
                                <div className="flex items-start gap-3 p-4 bg-surface-container-low rounded-xl">
                                    <div className="size-7 rounded-full bg-primary text-on-primary font-bold text-xs flex items-center justify-center shrink-0 tabular-nums">
                                        1
                                    </div>
                                    <div>
                                        <p className="font-bold text-on-surface text-sm">
                                            Bấm menu 3 chấm <MoreVertical className="size-4 inline text-on-surface-variant" aria-hidden="true" /> góc trên cùng
                                        </p>
                                        <p className="text-xs text-on-surface-variant mt-1">
                                            Trên trình duyệt Chrome, Cốc Cốc hoặc Samsung Internet.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-surface-container-low rounded-xl">
                                    <div className="size-7 rounded-full bg-primary text-on-primary font-bold text-xs flex items-center justify-center shrink-0 tabular-nums">
                                        2
                                    </div>
                                    <div>
                                        <p className="font-bold text-on-surface text-sm">
                                            Chọn mục <span className="text-primary">&quot;Cài đặt ứng dụng&quot;</span>
                                        </p>
                                        <p className="text-xs text-on-surface-variant mt-1">
                                            Ứng dụng sẽ được cài trực tiếp vào màn hình điện thoại.
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}

                        {!isIOS && !isAndroid && (
                            <>
                                <div className="flex items-start gap-3 p-4 bg-surface-container-low rounded-xl">
                                    <div className="size-7 rounded-full bg-primary text-on-primary font-bold text-xs flex items-center justify-center shrink-0 tabular-nums">
                                        1
                                    </div>
                                    <div>
                                        <p className="font-bold text-on-surface text-sm">
                                            Nhìn vào góc phải thanh địa chỉ (URL)
                                        </p>
                                        <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1.5">
                                            Nhấp vào biểu tượng <Download className="size-4 inline text-primary" aria-hidden="true" /> <strong>Cài đặt ứng dụng</strong>.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-surface-container-low rounded-xl">
                                    <div className="size-7 rounded-full bg-primary text-on-primary font-bold text-xs flex items-center justify-center shrink-0 tabular-nums">
                                        2
                                    </div>
                                    <div>
                                        <p className="font-bold text-on-surface text-sm">
                                            Hoặc mở Menu (⋮) &rarr; <span className="text-primary">&quot;Cài đặt Cội Nguồn...&quot;</span>
                                        </p>
                                        <p className="text-xs text-on-surface-variant mt-1">
                                            Sau khi cài, ứng dụng mở ra cửa sổ độc lập trên màn hình máy tính.
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}

                        {!isSecure && (
                            <div className="p-3.5 bg-secondary/12 rounded-xl text-on-surface text-xs space-y-1">
                                <div className="flex items-center gap-1.5 font-bold text-secondary">
                                    <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
                                    <span>Lưu ý khi chạy qua mạng LAN nội bộ (HTTP):</span>
                                </div>
                                <p className="text-xs text-on-surface-variant leading-relaxed text-pretty">
                                    Trình duyệt yêu cầu <strong>HTTPS</strong> hoặc <strong>localhost</strong> để cài đặt WebAPK tự động. Khi triển khai lên tên miền chính thức có HTTPS, tính năng cài đặt sẽ hoạt động trọn vẹn.
                                </p>
                            </div>
                        )}

                        <div className="p-3.5 bg-surface-container rounded-xl flex items-center gap-2.5 text-on-surface text-xs font-medium">
                            <CheckCircle2 className="size-4 text-primary shrink-0" aria-hidden="true" />
                            <span>Sau khi cài, biểu tượng Cội Nguồn hiển thị ngay trên màn hình chính.</span>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="default"
                            className="w-full min-h-11 text-sm font-semibold bg-primary hover:bg-primary-container text-on-primary rounded-xl cursor-pointer transition-colors duration-150"
                            onClick={() => setShowModal(false)}
                        >
                            Đã hiểu
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
