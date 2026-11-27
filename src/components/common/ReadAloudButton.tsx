'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { triggerHaptic } from '@/utils/haptics';
import { cn } from '@/utils/cn';

interface ReadAloudButtonProps {
    text: string;
    label?: string;
    className?: string;
}

/**
 * Nút Nghe Đọc tiếng Việt (Web Speech API) hỗ trợ Bắt đầu / Dừng đọc,
 * tốc độ chậm rãi (0.9) dễ nghe cho người cao tuổi.
 */
export function ReadAloudButton({
    text,
    label = 'Nghe đọc',
    className,
}: ReadAloudButtonProps) {
    const [speaking, setSpeaking] = useState(false);
    const [supported, setSupported] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            setSupported(true);
        }
        return () => {
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    if (!supported || !text.trim()) return null;

    const handleToggleSpeak = () => {
        triggerHaptic('medium');
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

        if (speaking) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
            return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'vi-VN';
        utterance.rate = 0.9;
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);

        setSpeaking(true);
        window.speechSynthesis.speak(utterance);
    };

    return (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleToggleSpeak}
            aria-label={speaking ? 'Dừng nghe đọc' : label}
            className={cn(
                'inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold min-h-10 px-3.5 rounded-xl transition-colors duration-150 cursor-pointer shrink-0',
                speaking
                    ? 'bg-primary text-on-primary hover:bg-primary-container'
                    : 'bg-secondary/12 text-secondary hover:bg-secondary/20',
                className
            )}
        >
            {speaking ? (
                <>
                    <Square className="size-3.5 fill-current" aria-hidden="true" />
                    <span>Dừng đọc</span>
                </>
            ) : (
                <>
                    <Volume2 className="size-4" aria-hidden="true" />
                    <span>{label}</span>
                </>
            )}
        </Button>
    );
}
