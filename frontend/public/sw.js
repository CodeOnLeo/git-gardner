const CACHE_NAME = 'git-gardener-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // API 요청이나 외부 도메인 요청은 Service Worker에서 처리하지 않음
  const url = new URL(event.request.url);
  
  // 외부 API 도메인이거나 API 엔드포인트인 경우 Service Worker 무시
  if (url.hostname !== self.location.hostname ||
      url.pathname.includes('/authenticated') ||
      url.pathname.includes('/auth/token') ||
      url.pathname.includes('/graphql') ||
      url.pathname.includes('/oauth2') ||
      url.hostname.includes('railway.app') ||
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('github.com')) {
    // Service Worker가 개입하지 않고 네트워크로 바로 요청
    return;
  }

  // 정적 리소스만 캐시 처리
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
      .catch(() => {
        // 네트워크 오류 시에도 Service Worker에서 처리하지 않음
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});