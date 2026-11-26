import React from 'react';
import { Metadata } from 'next';
import { NewsListPage } from '@/components/app/common/news/NewsListPage';
import { CLAN_CONFIG } from '@/config/clanConfig';

export const metadata: Metadata = {
    title: `Bản Tin Di Sản & Tộc Sự | ${CLAN_CONFIG.name}`,
    description: `Tin tức tộc sự, sự kiện khuyến học, trùng tu di sản và việc họ từ Ban Trị Sự Từ Đường ${CLAN_CONFIG.name}.`,
};

export default function NewsPage() {
    return <NewsListPage />;
}

