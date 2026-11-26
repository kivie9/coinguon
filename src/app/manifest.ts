import type { MetadataRoute } from 'next';
import { CLAN_CONFIG } from '@/config/clanConfig';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${CLAN_CONFIG.systemName} - ${CLAN_CONFIG.name}`,
    short_name: CLAN_CONFIG.systemName,
    description: 'Cội Nguồn — Hệ thống tra cứu gia phả số, cây dòng họ và ngày giỗ âm lịch',
    start_url: '/',
    id: '/',
    scope: '/',
    display: 'standalone',
    display_override: ['window-controls-overlay', 'standalone'],
    launch_handler: {
      client_mode: 'focus-existing',
    },
    background_color: '#f5f5f4', // Màu nền stone-100 ấm áp
    theme_color: '#991b1b',      // Tông đỏ truyền thống red-800
    orientation: 'any',
    categories: ['family', 'lifestyle', 'genealogy'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}

