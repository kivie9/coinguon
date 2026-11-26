// Service Worker for Cội Nguồn PWA
const CACHE_NAME = 'coinguon-v1';

// Các tài nguyên tĩnh thiết yếu
const PRECACHE_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Precache failed for some assets:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch handler - Bắt buộc phải có để Chrome nhận diện là PWA có thể Cài Đặt (Installable)
self.addEventListener('fetch', (event) => {
  // Chỉ xử lý các request GET thông thường
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Bỏ qua các API route hoặc chrome extension
  if (url.pathname.startsWith('/api/') || url.protocol.startsWith('chrome-extension')) {
    return;
  }

  // Chiến lược: Network-first, fallback sang cache nếu mất mạng
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Nếu lấy được từ mạng, cập nhật cache cho trang tĩnh
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (url.pathname.startsWith('/icons/') || url.pathname === '/manifest.webmanifest')
        ) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Khi offline, trả về từ cache nếu có
        return caches.match(event.request);
      })
  );
});

