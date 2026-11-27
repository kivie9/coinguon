'use client';

import React from 'react';
import {
    BookOpen,
    Award,
    Star,
    Verified,
    Medal,
} from 'lucide-react';
import { MemberDto } from '@/types/memberType';
import { ReadAloudButton } from '@/components/common/ReadAloudButton';

interface MemberBioTabProps {
    member: MemberDto;
}

export const MemberBioTab = ({ member }: MemberBioTabProps) => {
    const honorsList = member.honorsList || [];
    const speakText =
        member.bio ||
        `${member.fullName}, ${member.roleTitle || ''}. Thành viên Lê Tộc Đại Tôn.`;

    return (
        <section className="space-y-4 md:space-y-6 select-none">
            <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <BookOpen className="size-5 text-primary shrink-0" aria-hidden="true" />
                        <h3 className="font-serif text-base font-bold text-on-surface truncate">
                            Tiểu Sử &amp; Cống Hiến Gia Tộc
                        </h3>
                    </div>
                    {member.bio && <ReadAloudButton text={speakText} label="Nghe đọc tiểu sử" />}
                </div>

                <div className="text-sm sm:text-base text-on-surface leading-relaxed space-y-3 font-serif text-pretty">
                    <p className="whitespace-pre-line leading-relaxed">
                        {member.bio || (
                            <span className="text-on-surface-variant italic font-sans text-sm">
                                Chưa cập nhật tiểu sử chi tiết cho thành viên này trong cơ sở dữ liệu phả hệ.
                            </span>
                        )}
                    </p>
                </div>

                {honorsList.length > 0 && (
                    <div className="border-t border-outline-variant/25 pt-4 space-y-3">
                        <h4 className="text-sm font-bold text-on-surface flex items-center gap-1.5">
                            <Award className="size-4 text-secondary shrink-0" aria-hidden="true" />
                            <span>Khen Thưởng &amp; Chức Vụ Gia Tộc</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {honorsList.map((honor) => (
                                <div
                                    key={honor.id}
                                    className="flex items-start gap-2.5 text-xs bg-surface-container-low p-3.5 rounded-xl min-w-0"
                                >
                                    {honor.badgeType === 'medal' ? (
                                        <Medal className="size-4 text-secondary shrink-0 mt-0.5" aria-hidden="true" />
                                    ) : honor.badgeType === 'verified' ? (
                                        <Verified className="size-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                                    ) : (
                                        <Star className="size-4 text-secondary shrink-0 mt-0.5" aria-hidden="true" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-1">
                                            <span className="font-semibold text-sm text-on-surface truncate">
                                                {honor.title}
                                            </span>
                                            {honor.year && (
                                                <span className="text-xs text-secondary font-semibold shrink-0 tabular-nums">
                                                    {honor.year}
                                                </span>
                                            )}
                                        </div>
                                        {honor.description && (
                                            <p className="text-on-surface-variant text-xs mt-1 leading-relaxed break-words text-pretty">
                                                {honor.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};
