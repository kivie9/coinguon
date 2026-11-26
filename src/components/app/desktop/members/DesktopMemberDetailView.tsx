'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Share2,
    Calendar,
    Award,
    MapPin,
    Heart,
    User,
    Printer,
    GitFork,
    BookOpen,
    Image as ImageIcon,
    Moon,
} from 'lucide-react';
import { MemberDto } from '@/types/memberType';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { triggerHaptic } from '@/utils/haptics';
import { useClan } from '@/components/providers/ClanProvider';

interface DesktopMemberDetailViewProps {
    member: MemberDto;
    onBack?: () => void;
}

export const DesktopMemberDetailView = ({
    member,
    onBack,
}: DesktopMemberDetailViewProps) => {
    const { clan } = useClan();
    const [activeTab, setActiveTab] = useState<'bio' | 'children' | 'honors' | 'photos'>('bio');

    const handleShare = () => {
        triggerHaptic('light');
        if (typeof window !== 'undefined') {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
            }
            toast.success('Đã sao chép liên kết!', {
                description: `Đã sao chép liên kết hồ sơ của ${member.fullName} vào bộ nhớ tạm.`,
            });
        }
    };

    const handlePrint = () => {
        if (typeof window !== 'undefined') {
            window.print();
        }
    };

    const isDeceased = !member.isAlive;

    return (
        <div className="flex flex-col gap-6 w-full text-on-surface">
            {/* 1. TOP BREADCRUMB & NAVIGATION BAR */}
            <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-2xl">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBack}
                        className="inline-flex items-center gap-1.5 min-h-10 px-3.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-primary transition-colors duration-150 cursor-pointer"
                    >
                        <ArrowLeft className="size-4" aria-hidden="true" />
                        <span>Trở về danh sách</span>
                    </Button>

                    <nav aria-label="Đường dẫn" className="hidden sm:flex items-center gap-1.5 text-xs text-on-surface-variant pl-2">
                        <Link href="/" className="hover:text-primary transition-colors duration-150">Trang Chủ</Link>
                        <span>/</span>
                        <Link href="/members" className="hover:text-primary transition-colors duration-150">Phả Hệ Dòng Tộc</Link>
                        <span>/</span>
                        <span className="font-semibold text-primary truncate max-w-xs">{member.fullName}</span>
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handlePrint}
                        className="inline-flex items-center gap-1.5 min-h-10 px-3.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-on-surface transition-colors duration-150 cursor-pointer"
                        title="In trích lục phả ký"
                    >
                        <Printer className="size-4 text-secondary" aria-hidden="true" />
                        <span>In Phả Ký</span>
                    </Button>

                    <Button
                        size="sm"
                        onClick={handleShare}
                        className="inline-flex items-center gap-1.5 min-h-10 px-4 rounded-lg bg-primary text-on-primary hover:bg-primary-container text-xs font-semibold transition-colors duration-150 cursor-pointer"
                        title="Chia sẻ hồ sơ"
                    >
                        <Share2 className="size-4" aria-hidden="true" />
                        <span>Chia Sẻ</span>
                    </Button>
                </div>
            </div>

            {/* 2. BỐ CỤC 12 CỘT */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start w-full min-w-0">
                {/* CỘT TRÁI */}
                <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-6 sticky top-20 w-full min-w-0">
                    <div className="p-6 bg-surface-container-lowest rounded-2xl flex flex-col items-center text-center">
                        <div className="size-24 rounded-2xl bg-surface-container-low overflow-hidden mb-4">
                            {member.avatarUrl ? (
                                <img
                                    src={member.avatarUrl}
                                    alt={member.fullName}
                                    className="size-full object-cover"
                                />
                            ) : (
                                <div className="size-full bg-secondary/12 flex items-center justify-center text-secondary">
                                    <User className="size-12" aria-hidden="true" />
                                </div>
                            )}
                        </div>

                        <p className="text-xs font-bold uppercase text-secondary tabular-nums">
                            Đời thứ {member.generationNumber} • {member.roleTitle || 'Thành viên dòng họ'}
                        </p>

                        <h2 className="font-serif text-xl font-bold text-primary mt-1 text-balance">
                            {member.fullName}
                        </h2>
                        {member.courtesyName && (
                            <p className="text-sm text-secondary italic font-medium mt-0.5">
                                {member.courtesyName.startsWith('(') ? member.courtesyName : `(${member.courtesyName})`}
                            </p>
                        )}

                        <div className="mt-3">
                            <span
                                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg ${
                                    isDeceased
                                        ? 'bg-surface-container-high text-on-surface-variant'
                                        : 'bg-emerald-700/12 text-emerald-800 dark:text-emerald-300'
                                }`}
                            >
                                <span className={`size-2 rounded-full ${isDeceased ? 'bg-outline' : 'bg-emerald-600'}`} aria-hidden="true" />
                                {isDeceased ? 'Đã quy tiên' : 'Hiện còn sống'}
                            </span>
                        </div>

                        <div className="w-full mt-6 pt-5 border-t border-outline-variant/25 flex flex-col gap-3.5 text-left text-sm">
                            <div className="flex items-start gap-2.5">
                                <Calendar className="size-4 text-secondary shrink-0 mt-0.5" aria-hidden="true" />
                                <div>
                                    <span className="text-xs text-on-surface-variant block">Sinh thời:</span>
                                    <span className="font-medium text-on-surface tabular-nums">
                                        {member.birthdaySolar || 'Chưa rõ năm sinh'}
                                        {member.birthdayLunar && ` (${member.birthdayLunar} Âm lịch)`}
                                    </span>
                                </div>
                            </div>

                            {isDeceased && (
                                <div className="flex items-start gap-2.5">
                                    <Moon className="size-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                                    <div>
                                        <span className="text-xs text-on-surface-variant block">Ngày kỵ nhật (Giỗ họ):</span>
                                        <span className="font-bold text-primary tabular-nums">
                                            {member.deathDayLunar ? `${member.deathDayLunar} Âm lịch` : 'Chưa cập nhật'}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start gap-2.5">
                                <MapPin className="size-4 text-secondary shrink-0 mt-0.5" aria-hidden="true" />
                                <div>
                                    <span className="text-xs text-on-surface-variant block">
                                        {isDeceased ? 'Nơi an táng / Mộ phần:' : 'Nơi cư trú hiện tại:'}
                                    </span>
                                    <span className="font-medium text-on-surface">
                                        {member.burialPlace || member.residence || 'Nghĩa trang Dòng tộc, Từ đường bản tộc'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <Award className="size-4 text-secondary shrink-0 mt-0.5" aria-hidden="true" />
                                <div>
                                    <span className="text-xs text-on-surface-variant block">Chi phái:</span>
                                    <span className="font-medium text-on-surface">
                                        {member.branch || clan.branchName}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Khối Hôn Phối */}
                    <div className="p-5 bg-surface-container-lowest rounded-2xl">
                        <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/25">
                            <Heart className="size-4 text-primary" aria-hidden="true" />
                            <h3 className="font-serif font-bold text-sm text-primary uppercase">
                                Hôn Phối (Chính Thất)
                            </h3>
                        </div>

                        <div className="mt-3.5 flex items-center gap-3.5">
                            <div className="size-12 rounded-xl bg-surface-container-low shrink-0 overflow-hidden">
                                {member.spouseAvatarUrl ? (
                                    <img
                                        src={member.spouseAvatarUrl}
                                        alt={member.spouse || 'Hôn phối'}
                                        className="size-full object-cover"
                                    />
                                ) : (
                                    <div className="size-full bg-primary/10 flex items-center justify-center text-primary">
                                        <User className="size-6" aria-hidden="true" />
                                    </div>
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="font-serif font-bold text-sm text-on-surface truncate">
                                    {member.spouse || 'Cụ Bà Trần Thị Lụa'}
                                </p>
                                <p className="text-xs text-secondary font-medium">
                                    {member.spouseLifeStatus || 'Đã tạ thế quy tiên'}
                                </p>
                                {member.spouseDeathDayLunar && (
                                    <p className="text-xs text-on-surface-variant mt-0.5 tabular-nums">
                                        Giỗ: {member.spouseDeathDayLunar}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI */}
                <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-6 w-full min-w-0">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 p-1.5 bg-surface-container-low rounded-xl w-full">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveTab('bio')}
                            className={`w-full min-h-10 px-2.5 rounded-lg text-xs font-bold transition-colors duration-150 cursor-pointer flex items-center justify-center gap-1.5 min-w-0 ${
                                activeTab === 'bio'
                                    ? 'bg-primary text-on-primary hover:bg-primary hover:text-on-primary'
                                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                            }`}
                        >
                            <BookOpen className="size-3.5 shrink-0" aria-hidden="true" />
                            <span className="truncate">Tiểu Sử &amp; Phả Ký</span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveTab('children')}
                            className={`w-full min-h-10 px-2.5 rounded-lg text-xs font-bold transition-colors duration-150 cursor-pointer flex items-center justify-center gap-1.5 min-w-0 tabular-nums ${
                                activeTab === 'children'
                                    ? 'bg-primary text-on-primary hover:bg-primary hover:text-on-primary'
                                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                            }`}
                        >
                            <GitFork className="size-3.5 shrink-0" aria-hidden="true" />
                            <span className="truncate">Hậu Duệ ({member.childrenList?.length || 3})</span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveTab('honors')}
                            className={`w-full min-h-10 px-2.5 rounded-lg text-xs font-bold transition-colors duration-150 cursor-pointer flex items-center justify-center gap-1.5 min-w-0 ${
                                activeTab === 'honors'
                                    ? 'bg-primary text-on-primary hover:bg-primary hover:text-on-primary'
                                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                            }`}
                        >
                            <Award className="size-3.5 shrink-0" aria-hidden="true" />
                            <span className="truncate">Công Đức &amp; Vinh Danh</span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveTab('photos')}
                            className={`w-full min-h-10 px-2.5 rounded-lg text-xs font-bold transition-colors duration-150 cursor-pointer flex items-center justify-center gap-1.5 min-w-0 tabular-nums ${
                                activeTab === 'photos'
                                    ? 'bg-primary text-on-primary hover:bg-primary hover:text-on-primary'
                                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                            }`}
                        >
                            <ImageIcon className="size-3.5 shrink-0" aria-hidden="true" />
                            <span className="truncate">Tư Liệu ({member.photosList?.length || 4})</span>
                        </Button>
                    </div>

                    {activeTab === 'bio' && (
                        <div className="p-6 sm:p-7 bg-surface-container-lowest rounded-2xl space-y-5">
                            <div>
                                <h3 className="font-serif font-bold text-lg text-primary flex items-center gap-2 text-balance">
                                    <BookOpen className="size-5 text-secondary" aria-hidden="true" />
                                    <span>Lược Sử &amp; Văn Bia Gia Tộc</span>
                                </h3>
                                <p className="text-xs text-on-surface-variant mt-1">
                                    Trích yếu từ Gia Phả Cổ Bản lưu trữ tại {clan.ancestralHall.shortName}
                                </p>
                            </div>

                            <div className="p-5 bg-surface-container-low rounded-xl text-on-surface text-sm sm:text-base leading-relaxed font-serif space-y-3 text-pretty">
                                {member.bio ? (
                                    <p className="whitespace-pre-line">{member.bio}</p>
                                ) : (
                                    <p className="italic text-on-surface-variant">
                                        Sinh thời cụ là bậc hiền đức mẫu mực, suốt đời tận tâm phụng sự gia tộc, khuyến khích con cháu học hành thành tài, giữ vẹn nếp nhà gia phong. Cụ có công lớn trong việc khai hoang lập ấp, tôn tạo từ đường và duy trì lệ tế tổ thường niên.
                                    </p>
                                )}
                            </div>

                            <div className="p-5 bg-surface-container-low rounded-xl space-y-1.5">
                                <h4 className="font-serif font-bold text-sm text-secondary flex items-center gap-2">
                                    <MapPin className="size-4" aria-hidden="true" />
                                    <span>Nguyên Quán &amp; Nơi Khởi Tổ</span>
                                </h4>
                                <p className="text-sm text-on-surface-variant leading-relaxed text-pretty">
                                    {member.ancestralOrigin || `${clan.ancestralHall.address}. Chi phái di cư lập nghiệp kế thừa từ thế kỷ thứ 18.`}
                                </p>
                            </div>

                            <div className="p-5 bg-primary/8 rounded-xl space-y-1.5">
                                <h4 className="font-serif font-bold text-sm text-primary">
                                    Lời Huấn Thị Gia Phong
                                </h4>
                                <p className="text-sm text-on-surface-variant italic leading-relaxed text-pretty">
                                    &ldquo;Mộc hữu bản, thủy hữu nguyên. Làm người phải lấy chữ Hiếu làm đầu, lấy chữ Đức làm trọng, lấy chữ Trí để tiến thân, không phụ công lao trời biển của tiền nhân.&rdquo;
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'children' && (
                        <div className="p-6 sm:p-7 bg-surface-container-lowest rounded-2xl space-y-5">
                            <div>
                                <h3 className="font-serif font-bold text-lg text-primary flex items-center gap-2 text-balance">
                                    <GitFork className="size-5 text-secondary" aria-hidden="true" />
                                    <span>Danh Sách Con Cháu Trực Hệ Kế Thừa</span>
                                </h3>
                                <p className="text-xs text-on-surface-variant mt-1">
                                    Các bậc hậu duệ đời kế tiếp theo thứ tự trưởng thứ trong tông tộc
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(member.childrenList && member.childrenList.length > 0
                                    ? member.childrenList
                                    : [
                                          { id: 101, fullName: 'Lê Văn Phúc', role: 'Trưởng nam', birthYear: 1930, residence: 'Từ Đường Đại Tôn', childrenCount: 3 },
                                          { id: 102, fullName: 'Lê Văn Thọ', role: 'Thứ nam', birthYear: 1935, residence: 'Hải Dương', childrenCount: 4 },
                                          { id: 103, fullName: 'Lê Thị Bình', role: 'Thứ nữ', birthYear: 1942, residence: 'Hà Nội', childrenCount: 2 },
                                      ]
                                ).map((child, idx) => (
                                    <div
                                        key={child.id || idx}
                                        className="p-4 rounded-xl bg-surface-container-low flex items-start gap-3"
                                    >
                                        <div className="size-9 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 tabular-nums">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-serif font-bold text-base text-primary">
                                                {child.fullName}
                                            </h4>
                                            {child.role && (
                                                <p className="text-xs font-semibold text-secondary mt-0.5">
                                                    {child.role}
                                                </p>
                                            )}
                                            <div className="mt-2 text-xs text-on-surface-variant space-y-0.5 tabular-nums">
                                                <p>Sinh năm: {child.birthYear || 'Chưa rõ'}</p>
                                                <p>Nơi ở: {child.residence || 'Bản tộc'}</p>
                                                <p>Hậu duệ: {child.childrenCount || 0} con</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'honors' && (
                        <div className="p-6 sm:p-7 bg-surface-container-lowest rounded-2xl space-y-5">
                            <div>
                                <h3 className="font-serif font-bold text-lg text-primary flex items-center gap-2 text-balance">
                                    <Award className="size-5 text-secondary" aria-hidden="true" />
                                    <span>Bằng Khen, Tuyên Dương &amp; Đóng Góp</span>
                                </h3>
                                <p className="text-xs text-on-surface-variant mt-1">
                                    Ghi nhận cống hiến cho gia tộc, từ đường và xã hội
                                </p>
                            </div>

                            <div className="space-y-3">
                                {(member.honorsList && member.honorsList.length > 0
                                    ? member.honorsList
                                    : [
                                          { id: 1, title: 'Bảng Vàng Khởi Sáng Dòng Tộc', description: 'Có công quy tập mồ mả tổ tiên và phục dựng văn tự tộc ước cổ.', year: '1975' },
                                          { id: 2, title: 'Bằng Tuyên Dương Đại Thọ 80 Tuổi', description: 'Được toàn thể bà con nội ngoại mừng thượng thọ ngũ đại đồng đường.', year: '1982' },
                                          { id: 3, title: 'Công Đức Trùng Tu Từ Đường', description: 'Đóng góp hoành phi câu đối sơn son thếp vàng cho gian thờ chính.', year: '1980' },
                                      ]
                                ).map((honor) => (
                                    <div
                                        key={honor.id}
                                        className="p-4 rounded-xl bg-surface-container-low flex items-start gap-3.5"
                                    >
                                        <div className="size-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                                            <Award className="size-5" aria-hidden="true" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <h4 className="font-serif font-bold text-sm text-primary">
                                                    {honor.title}
                                                </h4>
                                                {honor.year && (
                                                    <span className="text-xs font-semibold text-secondary tabular-nums shrink-0">
                                                        Năm {honor.year}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mt-1 text-pretty">
                                                {honor.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'photos' && (
                        <div className="p-6 sm:p-7 bg-surface-container-lowest rounded-2xl space-y-5">
                            <div>
                                <h3 className="font-serif font-bold text-lg text-primary flex items-center gap-2 text-balance">
                                    <ImageIcon className="size-5 text-secondary" aria-hidden="true" />
                                    <span>Album Tư Liệu &amp; Kỷ Vật Lịch Sử</span>
                                </h3>
                                <p className="text-xs text-on-surface-variant mt-1">
                                    Hình ảnh ngày giỗ tổ, mộ phần và bút tích lưu truyền
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {(member.photosList && member.photosList.length > 0
                                    ? member.photosList
                                    : [
                                          { id: 1, url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600', caption: 'Lễ dâng hương Giỗ Tổ tại Từ Đường', year: '1980' },
                                          { id: 2, url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600', caption: 'Khu lăng mộ tổ tiền bối Đồi Thọ Vực', year: '1984' },
                                          { id: 3, url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600', caption: 'Gia phả thủ bút chữ Hán Nôm', year: '1972' },
                                          { id: 4, url: 'https://images.unsplash.com/photo-1524863479829-916d8e77f114?q=80&w=600', caption: 'Đại gia đình chụp ảnh mừng đại thọ', year: '1982' },
                                      ]
                                ).map((photo) => (
                                    <div
                                        key={photo.id}
                                        className="rounded-xl overflow-hidden bg-surface-container-low flex flex-col"
                                    >
                                        <div className="h-44 w-full overflow-hidden bg-surface-container">
                                            <img
                                                src={photo.url}
                                                alt={photo.caption}
                                                className="size-full object-cover"
                                            />
                                        </div>
                                        <div className="p-3.5">
                                            <p className="text-sm font-semibold text-on-surface line-clamp-1">
                                                {photo.caption}
                                            </p>
                                            {photo.year && (
                                                <p className="text-xs text-secondary mt-0.5 tabular-nums">
                                                    Tư liệu năm {photo.year}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
