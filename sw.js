// BudgetWise Service Worker - Production Safe
// Works for browser + installed PWA (GitHub Pages friendly)

const CACHE_VERSION = "v23";                 // bump ad ogni release
const CACHE_PREFIX = "budgetwise-cache-";
const CACHE_NAME = CACHE_PREFIX + "20260226" + CACHE_VERSION;

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  // IMPORTANT: cache keys WITHOUT querystring (see fetch handler below)
  "./app.js",
  "./license-system.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
];

// Normalize cache keys for versioned assets like app.js?v=...
// This prevents "old app.js" being served just because the querystring changed.
function getNormalizedCacheKey(request) {
  const url = new URL(request.url);
  const file = url.pathname.split("/").pop() || "";

  // Normalize ONLY the assets we version via querystring
  if (file === "app.js" || file === "license-system.js" || file === "style.css" || file === "index.html" || file === "manifest.json" || file === "icon-192.png" || file === "icon-512.png") {
    return new Request(url.origin + url.pathname, { method: "GET" });
  }

  return request;
}

// Utility: cache only same-origin http(s)
function isCacheableRequest(request) {
  try {
    const url = new URL(request.url);

    // Only http/https
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;

    // Only same-origin (avoid cdn/fonts/chrome-extension/etc.)
    if (url.origin !== self.location.origin) return false;

    // Only GET
    if (request.method !== "GET") return false;

    return true;
  } catch {
    return false;
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(CORE_ASSETS);
      await self.skipWaiting();
    })().catch(() => {})
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Remove old caches
      const keys = await caches.keys();
      await Promise.all(
        keys.map((k) => (k.startsWith(CACHE_PREFIX) && k !== CACHE_NAME ? caches.delete(k) : null))
      );

      await self.clients.claim();
    })().catch(() => {})
  );
});

// Strategy:
// - CORE assets: Stale-While-Revalidate (fast, updates in background)
// - Other same-origin GET: Network-First fallback cache
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (!isCacheableRequest(req)) return;

  const url = new URL(req.url);
  const file = url.pathname.split("/").pop() || "";
  const isCore =
    CORE_ASSETS.includes("./" + file) ||
    CORE_ASSETS.includes(url.pathname) ||
    file === "style.css" ||
    file === "app.js" ||
    file === "license-system.js" ||
    file === "manifest.json" ||
    file.startsWith("icon-");
  

   // 🔥 index.html: Network-First (evita “app vecchia” dopo release)
  const isIndex =
    url.pathname.endsWith("/index.html") ||
    url.pathname.endsWith("/") ||
    url.pathname === self.location.pathname; // safety

  if (isIndex) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        try {
          const res = await fetch(req);
          if (res && res.ok) cache.put(req, res.clone()).catch(() => {});
          return res;
        } catch {
          const cached = await cache.match(req);
          if (cached) return cached;
          return new Response("Offline", { status: 503 });
        }
      })()
    );
    return;
  }

  // ✅ CORE assets (css/js/icons/manifest): Stale-While-Revalidate
  if (isCore) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cacheKey = getNormalizedCacheKey(req);
        const cached = await cache.match(cacheKey);

        const fetchPromise = fetch(req)
          .then((res) => {
            if (res && res.ok) cache.put(cacheKey, res.clone()).catch(() => {});
            return res;
          })
          .catch(() => null);

        return cached || (await fetchPromise) || new Response("Offline", { status: 503 });
      })()
    );
    return;
  }

  // Network First for other requests
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const res = await fetch(req);
        if (res && res.ok) cache.put(req, res.clone()).catch(() => {});
        return res;
      } catch {
        const cached = await cache.match(req);
        if (cached) return cached;
        return new Response("Offline", { status: 503 });
      }
    })()
  );
});

// Optional: allow page to request immediate activation
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting().catch(() => {});
  }
});
