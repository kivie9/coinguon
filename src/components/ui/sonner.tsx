'use client';

import React from 'react';
import { Toaster as SonnerToaster, toast } from 'sonner';

type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

export const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <SonnerToaster
            position="top-center"
            richColors={false}
            toastOptions={{
                duration: 3500,
                classNames: {
                    toast:
                        'group toast w-full max-w-sm bg-surface text-on-surface border border-outline-variant/40 shadow-xl rounded-2xl p-3.5 flex items-center gap-3 font-sans select-none backdrop-blur-md',
                    title: 'text-sm font-bold text-on-surface leading-tight',
                    description: 'text-xs text-on-surface-variant mt-0.5 leading-snug',
                    actionButton:
                        'bg-primary text-on-primary font-semibold text-xs px-3 py-1.5 rounded-xl',
                    cancelButton:
                        'bg-surface-container text-on-surface font-semibold text-xs px-3 py-1.5 rounded-xl',
                    success:
                        '!bg-surface !border-secondary/40 !text-primary [&_[data-icon]]:text-secondary',
                    info: '!bg-surface !border-outline-variant/40 !text-primary [&_[data-icon]]:text-primary',
                    warning:
                        '!bg-surface !border-amber-500/40 !text-amber-900 [&_[data-icon]]:text-amber-600',
                    error: '!bg-surface !border-red-500/40 !text-red-900 [&_[data-icon]]:text-red-600',
                },
            }}
            {...props}
        />
    );
};

export { toast };

