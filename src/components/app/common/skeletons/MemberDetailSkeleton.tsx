import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const MemberDetailSkeleton = () => {
    return (
        <div className="relative flex min-h-dvh w-full flex-col bg-surface overflow-x-hidden text-on-surface items-center">
            <div className="w-full max-w-2xl lg:max-w-3xl flex flex-col min-h-dvh bg-surface">
                <header className="flex items-center justify-between px-4 py-3 bg-surface-container-lowest border-b border-outline-variant/25">
                    <Skeleton className="size-10 rounded-xl" />
                    <div className="flex flex-col items-center gap-1.5">
                        <Skeleton className="h-4 w-36 rounded-md" />
                        <Skeleton className="h-3 w-24 rounded-sm" />
                    </div>
                    <Skeleton className="size-10 rounded-xl" />
                </header>

                <div className="p-6 flex items-center gap-4 bg-surface-container-lowest">
                    <Skeleton className="size-20 rounded-2xl shrink-0" />
                    <div className="flex flex-col gap-2 flex-1">
                        <Skeleton className="h-4 w-32 rounded-md" />
                        <Skeleton className="h-6 w-52 rounded-md" />
                        <Skeleton className="h-4 w-40 rounded-md" />
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-2 px-4 py-3 bg-surface-container-low">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex flex-col items-center gap-1.5 p-2">
                            <Skeleton className="size-11 rounded-xl" />
                            <Skeleton className="h-3.5 w-14 rounded-sm" />
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-around px-4 py-2.5 border-b border-outline-variant/25">
                    <Skeleton className="h-9 w-28 rounded-lg" />
                    <Skeleton className="h-9 w-28 rounded-lg" />
                    <Skeleton className="h-9 w-28 rounded-lg" />
                </div>

                <main className="flex-1 p-4 space-y-4">
                    <div className="bg-surface-container-lowest p-5 rounded-2xl flex flex-col gap-3">
                        <Skeleton className="h-4 w-40 rounded" />
                        <div className="grid grid-cols-2 gap-3 pt-1">
                            <Skeleton className="h-14 rounded-xl" />
                            <Skeleton className="h-14 rounded-xl" />
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest p-5 rounded-2xl flex flex-col gap-3">
                        <Skeleton className="h-4 w-36 rounded" />
                        <Skeleton className="h-20 rounded-xl" />
                    </div>
                </main>
            </div>
        </div>
    );
};
