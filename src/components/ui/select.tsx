'use client';

import * as React from 'react';
import { Select as BaseSelect } from '@base-ui/react/select';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface SelectOption {
    value: string;
    label: string;
}

interface CustomSelectProps {
    id?: string;
    value: string;
    onValueChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    'aria-label'?: string;
}

/**
 * Custom Select dùng @base-ui/react/select theo chuẩn Flat UI & Warm Heritage.
 * Tránh dropdown mặc định thô cứng của trình duyệt, hỗ trợ bàn phím và màn hình cảm ứng lớn.
 */
export function Select({
    id,
    value,
    onValueChange,
    options,
    placeholder = 'Chọn...',
    disabled = false,
    className,
    'aria-label': ariaLabel,
}: CustomSelectProps) {
    const selectedOption = options.find((o) => o.value === value);

    return (
        <BaseSelect.Root
            value={value}
            onValueChange={(next) => {
                if (next !== null && next !== undefined) {
                    onValueChange(String(next));
                }
            }}
            disabled={disabled}
        >
            <BaseSelect.Trigger
                id={id}
                aria-label={ariaLabel}
                className={cn(
                    'inline-flex w-full items-center justify-between gap-2 min-h-10 px-3.5 py-2 rounded-xl border border-outline-variant/60 bg-surface-container-lowest text-sm text-on-surface transition-colors duration-150 cursor-pointer',
                    'hover:border-primary/60 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/15',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    className
                )}
            >
                <span className={cn('truncate text-left', !selectedOption && 'text-on-surface-variant')}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <BaseSelect.Icon className="shrink-0 text-on-surface-variant">
                    <ChevronDown className="size-4" aria-hidden="true" />
                </BaseSelect.Icon>
            </BaseSelect.Trigger>

            <BaseSelect.Portal>
                <BaseSelect.Positioner sideOffset={6} align="start" className="z-[60]">
                    <BaseSelect.Popup
                        className={cn(
                            'min-w-[var(--anchor-width)] max-h-72 overflow-y-auto rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm p-1.5 text-sm text-on-surface outline-none'
                        )}
                    >
                        {options.map((opt) => (
                            <BaseSelect.Item
                                key={opt.value}
                                value={opt.value}
                                className={cn(
                                    'relative flex items-center justify-between gap-2 min-h-9 px-3 py-2 rounded-lg text-sm text-on-surface cursor-pointer select-none outline-none transition-colors duration-150',
                                    'data-[highlighted]:bg-surface-container-low data-[selected]:bg-primary/10 data-[selected]:text-primary data-[selected]:font-semibold'
                                )}
                            >
                                <BaseSelect.ItemText className="truncate">{opt.label}</BaseSelect.ItemText>
                                <BaseSelect.ItemIndicator className="shrink-0 text-primary">
                                    <Check className="size-4" aria-hidden="true" />
                                </BaseSelect.ItemIndicator>
                            </BaseSelect.Item>
                        ))}
                    </BaseSelect.Popup>
                </BaseSelect.Positioner>
            </BaseSelect.Portal>
        </BaseSelect.Root>
    );
}
