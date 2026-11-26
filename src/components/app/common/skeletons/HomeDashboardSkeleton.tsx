import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const HomeDashboardSkeleton = () => {
    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="rounded-2xl p-6 lg:p-8 bg-surface-container-low flex flex-col gap-4">
                <Skeleton className="h-4 w-48 rounded" />
                <Skeleton className="h-9 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-1/2 rounded" />

                <div className="grid grid-cols-3 lg:grid-cols-4 gap-3 py-3">
                    <Skeleton className="h-12 rounded-xl" />
                    <Skeleton className="h-12 rounded-xl" />
                    <Skeleton className="h-12 rounded-xl" />
                    <Skeleton className="hidden lg:block h-12 rounded-xl" />
                </div>

                <div className="flex items-center gap-3">
                    <Skeleton className="h-11 w-36 rounded-xl" />
                    <Skeleton className="h-11 w-44 rounded-xl" />
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="p-4 rounded-xl bg-surface-container-lowest flex flex-col items-center gap-2.5"
                    >
                        <Skeleton className="size-11 rounded-xl" />
                        <Skeleton className="h-4 w-20 rounded" />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 flex flex-col gap-4">
                    <Skeleton className="h-6 w-48 rounded-md" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Skeleton className="h-56 rounded-2xl" />
                        <Skeleton className="h-56 rounded-2xl" />
                    </div>
                </div>
                <div className="lg:col-span-4 flex flex-col gap-4">
                    <Skeleton className="h-48 rounded-2xl" />
                    <Skeleton className="h-40 rounded-2xl" />
                </div>
            </div>
        </div>
    );
};
