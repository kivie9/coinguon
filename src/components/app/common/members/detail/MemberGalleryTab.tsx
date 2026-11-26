'use client';

import React from 'react';
import { Camera, Plus, Image as ImageIcon } from 'lucide-react';
import { MemberDto } from '@/types/memberType';
import { triggerHaptic } from '@/utils/haptics';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';

interface MemberGalleryTabProps {
    member: MemberDto;
}

export const MemberGalleryTab = ({ member }: MemberGalleryTabProps) => {
    const photosList = member.photosList || [];

    const handleAddPhoto = () => {
        triggerHaptic('light');
        toast.info('Đóng góp tư liệu di ảnh', {
            description: 'Vui lòng chọn ảnh tư liệu hoặc kỷ niệm gia tộc để tải lên lưu trữ phả hệ.',
        });
    };

    return (
        <section className="space-y-4 select-none">
            <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Camera className="size-5 text-primary" aria-hidden="true" />
                        <h3 className="font-serif text-base font-bold text-on-surface">
                            Album Gia Tộc &amp; Tư Liệu
                        </h3>
                    </div>
                    <span className="text-xs text-secondary font-semibold tabular-nums">
                        {photosList.length} Tư liệu
                    </span>
                </div>

                {photosList.length === 0 ? (
                    <div className="p-8 text-center bg-surface-container-low rounded-xl flex flex-col items-center gap-2">
                        <ImageIcon className="size-8 text-outline" aria-hidden="true" />
                        <p className="text-sm text-on-surface-variant font-medium">Chưa có di ảnh tư liệu trong hồ sơ</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                        {photosList.map((photo) => (
                            <div
                                key={photo.id}
                                className="rounded-xl overflow-hidden bg-surface-container-low flex flex-col cursor-pointer"
                            >
                                <div className="aspect-4/3 w-full overflow-hidden bg-surface-container">
                                    <img
                                        src={photo.url}
                                        alt={photo.caption}
                                        className="size-full object-cover"
                                    />
                                </div>
                                <div className="p-2.5">
                                    <p className="text-xs font-semibold text-on-surface leading-snug line-clamp-2">
                                        {photo.caption}
                                    </p>
                                    {photo.year && (
                                        <span className="text-xs text-secondary mt-0.5 block font-medium tabular-nums">
                                            Năm {photo.year}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Button
                    variant="ghost"
                    onClick={handleAddPhoto}
                    className="w-full min-h-11 rounded-xl bg-surface-container hover:bg-surface-container-high text-sm font-semibold text-primary flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer"
                >
                    <Plus className="size-4" aria-hidden="true" />
                    <span>Đóng góp thêm hình ảnh / Tư liệu</span>
                </Button>
            </div>
        </section>
    );
};
