// upup.sw.js

const CACHE_NAME = "mi-app-cache-v2";
const BASE = ""; // la app está en raíz, así que no necesitas subcarpeta

// Archivos a cachear
const urlsToCache = [
  `${BASE}/index.html`,
  `${BASE}/offline.html`,
  `${BASE}/upup.sw.js`,
  `${BASE}/upup.js`,
  `${BASE}/css/styles.css`,
  `${BASE}/icons/ru-128.png`,
  `${BASE}/icons/ru-144.png`,
  `${BASE}/icons/ru-192.png`,
  `${BASE}/icons/ru-512.png`
];

// Instalación del Service Worker
self.addEventListener("install", event => {
  console.log("SW: Instalando...");
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const failed = [];
    for (const url of urlsToCache) {
      try {
        const resp = await fetch(url, { cache: "no-store" });
        if (!resp || !resp.ok) throw new Error(`HTTP ${resp ? resp.status : "no-response"}`);
        await cache.put(url, resp.clone());
        console.log("SW: Cached ->", url);
      } catch (err) {
        console.warn("SW: No se pudo cachear:", url, err);
        failed.push({ url, err: String(err) });
      }
    }
    if (failed.length) console.warn("SW: Archivos no cacheados:", failed);
  })());
});

// Activación del Service Worker
self.addEventListener("activate", event => {
  console.log("SW: Activado");
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => (key !== CACHE_NAME ? caches.delete(key) : null))
    ))
  );
});

// Estrategias de fetch
self.addEventListener("fetch", event => {
  // Para navegación (cuando el usuario abre páginas)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(resp => resp)
        .catch(() => caches.match(`${BASE}/offline.html`))
    );
    return;
  }

  // Para otros recursos: cache-first
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(networkResp => {
        return networkResp;
      }).catch(() => caches.match(`${BASE}/offline.html`));
    })
  );
});

// Escucha mensajes (ej. integración con UpUp)
self.addEventListener("message", event => {
  console.log("SW: Mensaje recibido:", event.data);
  if (event.source && event.data) {
    event.source.postMessage({ status: "ok" });
  }
});
