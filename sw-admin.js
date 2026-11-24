/**
 * Egypt Creative Control — Service Worker (sw-admin.js)
 * Lightweight, surgical mobile cache for Admin Dashboard
 */

const CACHE_NAME = 'ec-admin-cache-v2';

// Only precache essential admin shell files
const ADMIN_SHELL = [
  'admin-manifest.json',
  'apple-touch-icon.png',
  'favicon-32x32.png',
  'favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ADMIN_SHELL).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. DO NOT touch API requests, non-GET requests, or external resources
  if (url.pathname.includes('api.php') || event.request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // 2. DO NOT intercept public website pages or assets (index, main, app.css, uploads)
  const isDashboardOrAdmin = url.pathname.includes('dashboard') ||
                             url.pathname.includes('admin') ||
                             url.pathname.includes('admin-manifest') ||
                             url.pathname.includes('apple-touch-icon') ||
                             url.pathname.includes('favicon');

  if (!isDashboardOrAdmin) {
    return; // Pass through natively to browser
  }

  // 3. For HTML navigation (dashboard.html, admin.html), ALWAYS use Network-First
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // 4. For admin static assets (admin.css, dashboard.js, icons), Network-First with cache fallback
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Native Push Notifications
self.addEventListener('push', (event) => {
  let data = { title: 'Egypt Creative Alert', body: 'New lead arrived!' };
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {}

  const options = {
    body: data.body,
    icon: 'apple-touch-icon.png',
    badge: 'favicon-32x32.png',
    vibrate: [200, 100, 200],
    data: { url: 'dashboard.html?tab=inquiries' }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('dashboard.html') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('dashboard.html?tab=inquiries');
      }
    })
  );
});
