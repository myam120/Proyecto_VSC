self.addEventListener('install', event => {
  console.log('Service Worker: Instalado');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker: Activado');
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response('Sin conexión, y no hay recurso en caché');
    })
  );
});
self.addEventListener("message", (event) => {
  const data = event.data;
  self.registration.showNotification(data.title, { body: data.body });
});
