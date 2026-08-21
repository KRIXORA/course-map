// Service Worker — Course Map production
// Cache version: bump CACHE_NAME on every deploy so clients get fresh assets.
const CACHE_NAME = "course-map-v15";
const OFFLINE_URL = "offline.html";

const APP_SHELL = [
  "./",
  "index.html",
  "about-me.html",
  "offline.html",
  "404.html",
  "privacy.html",
  "css/style.css",
  "css/about.css",
  "js/script.js",
  "js/theme.js",
  "js/reveal.js",
  "js/premium.js",
  "js/advanced.js",
  "js/about-premium.js",
  "manifest.json",
  "assets/profile.webp",
  "assets/icons/pwa-192.png",
  "assets/icons/pwa-512.png",
  "assets/icons/pwa-512-maskable.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(APP_SHELL).catch((err) => {
        console.warn("[SW] Some shell assets failed to precache", err);
      })
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Navigation: network-first, fallback offline page
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((c) => c.put(event.request, copy));
          return response;
        })
        .catch(() =>
          caches.match(event.request).then((cached) => cached || caches.match(OFFLINE_URL))
        )
    );
    return;
  }

  // Static assets: cache-first, then network
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
