'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { triggerHaptic } from '@/utils/haptics';
import { cn } from '@/utils/cn';

interface SpeechRecognitionEventLike {
    results: {
        [index: number]: {
            [index: number]: {
                transcript: string;
            };
        };
    };
}

interface SpeechRecognitionInstance {
    lang: string;
    interimResults: boolean;
    maxAlternatives: number;
    onresult: ((event: SpeechRecognitionEventLike) => void) | null;
    onerror: ((event: { error?: string }) => void) | null;
    onend: (() => void) | null;
    start: () => void;
    stop: () => void;
}

interface VoiceSearchButtonProps {
    onResult: (transcript: string) => void;
    className?: string;
}

/**
 * Nút tìm kiếm bằng giọng nói tiếng Việt (Web Speech API) giúp người cao tuổi
 * tìm tên người thân mà không cần gõ phím có dấu.
 */
export function VoiceSearchButton({ onResult, className }: VoiceSearchButtonProps) {
    const [supported, setSupported] = useState(false);
    const [listening, setListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const w = window as unknown as {
                SpeechRecognition?: new () => SpeechRecognitionInstance;
                webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
            };
            setSupported(Boolean(w.SpeechRecognition || w.webkitSpeechRecognition));
        }
        return () => {
            recognitionRef.current?.stop();
        };
    }, []);

    if (!supported) return null;

    const handleToggle = () => {
        triggerHaptic('medium');

        if (listening && recognitionRef.current) {
            recognitionRef.current.stop();
            setListening(false);
            return;
        }

        const w = window as unknown as {
            SpeechRecognition?: new () => SpeechRecognitionInstance;
            webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
        };
        const SpeechRecognitionCtor = w.SpeechRecognition || w.webkitSpeechRecognition;
        if (!SpeechRecognitionCtor) return;

        try {
            const recognition = new SpeechRecognitionCtor();
            recognition.lang = 'vi-VN';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onresult = (event) => {
                const spoken = event.results?.[0]?.[0]?.transcript?.trim();
                if (spoken) {
                    onResult(spoken);
                    toast.success(`Đã nhận diện: "${spoken}"`);
                }
            };

            recognition.onerror = (event) => {
                if (event.error === 'not-allowed') {
                    toast.error('Vui lòng cấp quyền micro cho trình duyệt để tìm kiếm bằng giọng nói.');
                } else if (event.error !== 'aborted') {
                    toast.error('Không nghe rõ, bạn vui lòng thử nói lại.');
                }
                setListening(false);
            };

            recognition.onend = () => {
                setListening(false);
            };

            recognitionRef.current = recognition;
            recognition.start();
            setListening(true);
            toast.info('Đang lắng nghe... Hãy đọc tên thành viên cần tìm.');
        } catch {
            setListening(false);
            toast.error('Không thể khởi động micro trên thiết bị này.');
        }
    };

    return (
        <button
            type="button"
            onClick={handleToggle}
            aria-label={listening ? 'Dừng tìm kiếm giọng nói' : 'Tìm kiếm bằng giọng nói'}
            title={listening ? 'Đang lắng nghe — bấm để dừng' : 'Bấm để nói tên cần tìm'}
            className={cn(
                'inline-flex items-center justify-center gap-1.5 min-h-11 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-150 cursor-pointer shrink-0',
                listening
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-low hover:bg-surface-container text-primary',
                className
            )}
        >
            {listening ? (
                <>
                    <MicOff className="size-4 shrink-0" aria-hidden="true" />
                    <span className="hidden sm:inline">Đang nghe...</span>
                </>
            ) : (
                <>
                    <Mic className="size-4 shrink-0" aria-hidden="true" />
                    <span className="hidden sm:inline">Nói để tìm</span>
                </>
            )}
        </button>
    );
}
