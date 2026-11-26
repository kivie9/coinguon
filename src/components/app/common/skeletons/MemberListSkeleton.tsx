import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const MemberListSkeleton = () => {
    return (
        <div className="flex flex-col gap-5 w-full">
            <div className="bg-surface-container-lowest p-3.5 rounded-2xl flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-11 flex-1 rounded-xl" />
                    <Skeleton className="h-11 w-28 rounded-xl" />
                </div>
                <div className="flex items-center gap-2 overflow-hidden pt-1">
                    <Skeleton className="h-8 w-20 rounded-lg shrink-0" />
                    <Skeleton className="h-8 w-24 rounded-lg shrink-0" />
                    <Skeleton className="h-8 w-20 rounded-lg shrink-0" />
                    <Skeleton className="h-8 w-24 rounded-lg shrink-0" />
                </div>
            </div>

            <div className="block lg:hidden flex flex-col gap-4">
                <div className="flex items-center justify-between px-1">
                    <Skeleton className="h-4 w-44 rounded-md" />
                    <Skeleton className="h-4 w-16 rounded-md" />
                </div>

                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="p-3.5 rounded-xl bg-surface-container-lowest flex items-center justify-between gap-3"
                    >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Skeleton className="size-11 rounded-full shrink-0" />
                            <div className="flex flex-col gap-2 flex-1 min-w-0">
                                <Skeleton className="h-4 w-36 rounded-md" />
                                <Skeleton className="h-3.5 w-44 rounded-sm" />
                            </div>
                        </div>
                        <Skeleton className="size-6 rounded-md shrink-0" />
                    </div>
                ))}
            </div>

            <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className="rounded-2xl bg-surface-container-lowest p-5 flex flex-col gap-4"
                    >
                        <div className="flex items-start gap-4">
                            <Skeleton className="size-12 rounded-xl shrink-0" />
                            <div className="flex flex-col gap-2 flex-1 min-w-0">
                                <Skeleton className="h-5 w-3/4 rounded-md" />
                                <Skeleton className="h-4 w-1/2 rounded-md" />
                            </div>
                        </div>
                        <div className="space-y-2 pt-2">
                            <Skeleton className="h-3.5 w-full rounded" />
                            <Skeleton className="h-3.5 w-4/5 rounded" />
                        </div>
                        <div className="flex items-center justify-between pt-3">
                            <Skeleton className="h-4 w-24 rounded" />
                            <Skeleton className="h-9 w-24 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
