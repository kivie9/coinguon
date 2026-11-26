'use client';

import React from 'react';
import { Landmark, CheckCircle2 } from 'lucide-react';
import { HOME_FAMILY_RULES } from '@/components/app/common/home/homeData';
import { useClan } from '@/components/providers/ClanProvider';

export const DesktopFamilyRules = () => {
    const { clan } = useClan();
    return (
        <section className="bg-surface-container-lowest rounded-2xl p-6 lg:p-7 flex flex-col gap-5 select-none">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded-lg bg-secondary/12 text-secondary flex items-center justify-center shrink-0">
                        <Landmark className="size-4.5" aria-hidden="true" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-primary text-balance">
                        Nề Nếp Gia Phong &amp; Lời Tựa Tiền Nhân
                    </h3>
                </div>
                <span className="text-xs font-semibold text-secondary shrink-0 tabular-nums">
                    4 Trụ cột tộc ước
                </span>
            </div>

            <p className="text-sm text-on-surface-variant leading-relaxed text-pretty">
                Trải qua hơn hai thế kỷ thăng trầm lịch sử, tiền nhân {clan.name} luôn răn dạy con cháu giữ trọn đạo hiếu, hòa thuận cùng dòng, chăm lo tu thân lập nghiệp để rạng danh tổ tông.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {HOME_FAMILY_RULES.map((rule, idx) => (
                    <div
                        key={idx}
                        className="p-4 rounded-xl bg-surface-container-low flex items-start gap-3"
                    >
                        <CheckCircle2 className="size-4.5 text-secondary shrink-0 mt-0.5" aria-hidden="true" />
                        <div>
                            <h4 className="font-bold text-on-surface">{rule.title}</h4>
                            <p className="text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed text-pretty">
                                {rule.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
