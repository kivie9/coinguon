'use client';

import React from 'react';
import {
    Calendar,
    Users,
    CalendarX,
    ChevronRight,
    Landmark,
    MapPin,
    Heart,
} from 'lucide-react';
import { MemberDto } from '@/types/memberType';
import { Button } from '@/components/ui/button';
import { DEFAULT_MEMBER_AVATAR } from '@/constants/memberConstants';

interface MemberPersonalTabProps {
    member: MemberDto;
    onViewTree: () => void;
}

export const MemberPersonalTab = ({
    member,
    onViewTree,
}: MemberPersonalTabProps) => {
    const childrenList = member.childrenList || [];

    return (
        <section className="space-y-4 select-none">
            {/* 1. Ngày sinh & Niên đại */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                    <Calendar className="size-5 text-primary shrink-0" aria-hidden="true" />
                    <h3 className="font-serif text-base font-bold text-on-surface truncate">
                        Ngày Tháng Năm Sinh
                    </h3>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm tabular-nums">
                    <div className="bg-surface-container-low p-3.5 rounded-xl min-w-0">
                        <span className="text-secondary block mb-0.5 text-xs font-medium">Dương lịch:</span>
                        <span className="font-bold text-on-surface text-base truncate block">
                            {member.birthdaySolar
                                ? new Date(member.birthdaySolar).toLocaleDateString('vi-VN')
                                : 'Chưa cập nhật'}
                        </span>
                    </div>
                    <div className="bg-surface-container-low p-3.5 rounded-xl min-w-0">
                        <span className="text-secondary block mb-0.5 text-xs font-medium">Âm lịch:</span>
                        <span className="font-bold text-on-surface text-base truncate block">
                            {member.birthdayLunar
                                ? `${member.birthdayLunar} (ÂL)`
                                : 'Chưa cập nhật'}
                        </span>
                    </div>
                </div>
            </div>

            {/* 2. Hôn Phối */}
            {member.spouse ? (
                <div className="bg-surface-container-lowest rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                            <Heart className="size-5 text-primary shrink-0" aria-hidden="true" />
                            <h3 className="font-serif text-base font-bold text-on-surface truncate">
                                Hôn Phối (Chính Thất)
                            </h3>
                        </div>
                        {member.spouseLifeStatus && (
                            <span className="text-xs text-on-surface-variant font-medium shrink-0">
                                {member.spouseLifeStatus}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl min-w-0">
                        <div className="size-14 rounded-xl overflow-hidden shrink-0 bg-surface-container">
                            <img
                                alt="Chân dung Phối ngẫu"
                                className="size-full object-cover"
                                src={member.spouseAvatarUrl || DEFAULT_MEMBER_AVATAR}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-serif font-bold text-base text-on-surface truncate">
                                {member.spouse}
                            </h4>
                            <p className="text-xs text-secondary mt-0.5 truncate">
                                {member.spouseLifeStatus === 'Đã tạ thế' ? 'Đã tạ thế quy tiên' : 'Phối ngẫu gia tộc'}
                            </p>
                            {member.spouseDeathDayLunar && (
                                <p className="mt-1.5 text-xs text-primary flex items-center gap-1 font-semibold tabular-nums">
                                    <CalendarX className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
                                    <span>Kỵ nhật: {member.spouseDeathDayLunar}</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            ) : null}

            {/* 3. Hậu Duệ Trực Hệ */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <Users className="size-5 text-primary shrink-0" aria-hidden="true" />
                        <h3 className="font-serif text-base font-bold text-on-surface truncate">
                            Hậu Duệ Trực Hệ
                        </h3>
                    </div>
                    <span className="text-xs font-semibold text-secondary shrink-0 tabular-nums">
                        {childrenList.length} Con trực hệ
                    </span>
                </div>

                {childrenList.length === 0 ? (
                    <div className="p-4 text-center text-sm text-on-surface-variant bg-surface-container-low rounded-xl">
                        Chưa có dữ liệu con cháu trực hệ trong hồ sơ.
                    </div>
                ) : (
                    <div className="space-y-2">
                        {childrenList.map((child, idx) => (
                            <div
                                key={child.id}
                                className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low gap-3 min-w-0"
                            >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className="size-8 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center font-bold text-xs shrink-0 tabular-nums">
                                        {idx + 1}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold text-on-surface truncate">
                                            {child.fullName} {child.role ? `(${child.role})` : ''}
                                        </p>
                                        <p className="text-xs text-on-surface-variant truncate tabular-nums">
                                            {child.birthYear ? `Sinh ${child.birthYear}` : ''}
                                            {child.residence ? ` • ${child.residence}` : ''}
                                            {child.childrenCount ? ` • ${child.childrenCount} con` : ''}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="size-4 text-outline shrink-0" aria-hidden="true" />
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-between bg-surface-container p-3.5 rounded-xl text-sm">
                    <span className="text-secondary font-medium truncate">Cây trực hệ các đời:</span>
                    <Button
                        variant="link"
                        size="xs"
                        onClick={onViewTree}
                        className="text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer h-auto p-0 shrink-0 text-sm"
                    >
                        <span>Xem trên phả đồ</span>
                        <ChevronRight className="size-4" aria-hidden="true" />
                    </Button>
                </div>
            </div>

            {/* 4. Quê quán & Nơi cư trú */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                    <Landmark className="size-5 text-primary shrink-0" aria-hidden="true" />
                    <h3 className="font-serif text-base font-bold text-on-surface truncate">
                        Nguyên Quán &amp; Cư Trú
                    </h3>
                </div>
                <div className="space-y-3 text-sm">
                    {member.ancestralOrigin && (
                        <div className="flex gap-3 items-start">
                            <Landmark className="size-4.5 text-secondary shrink-0 mt-0.5" aria-hidden="true" />
                            <div className="min-w-0 flex-1">
                                <p className="font-bold text-on-surface">Từ đường gốc:</p>
                                <p className="text-on-surface-variant break-words">{member.ancestralOrigin}</p>
                            </div>
                        </div>
                    )}
                    <div className="flex gap-3 items-start">
                        <MapPin className="size-4.5 text-secondary shrink-0 mt-0.5" aria-hidden="true" />
                        <div className="min-w-0 flex-1">
                            <p className="font-bold text-on-surface">
                                {member.isAlive ? 'Nơi cư trú hiện tại:' : 'Nơi an táng:'}
                            </p>
                            <p className="text-on-surface-variant break-words">
                                {member.residence || member.burialPlace || 'Từ Đường Bản Tộc Chi II'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
