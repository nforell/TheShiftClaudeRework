/* The Shift — service worker. Makes the game installable and playable offline.
   Network first for pages, so beta players always get the newest build when they're online;
   the cached copy is only used when the network fails. Never touches analytics requests. */
const VERSION = '__VERSION__';
const CACHE = 'theshift-' + VERSION;
const CORE = ['/play/', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('theshift-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET') return;
  const fonts = u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com';
  if (u.origin !== self.location.origin && !fonts) return;
  if (fonts) {   // fonts never change: cache first
    e.respondWith(caches.open(CACHE).then((c) => c.match(r).then((hit) => hit || fetch(r).then((res) => { c.put(r, res.clone()); return res; }))));
    return;
  }
  const key = r.mode === 'navigate' && u.pathname.startsWith('/play') ? '/play/' : r;
  e.respondWith(fetch(r).then((res) => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(key, copy)); }
    return res;
  }).catch(() => caches.match(key).then((hit) => hit || caches.match('/play/'))));
});
