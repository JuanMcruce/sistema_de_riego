const CACHE_NAME = 'riego-shell-v1';
const SHELL_FILES = ['./index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Solo cacheamos el "shell" de la app (HTML/CSS/JS/íconos).
// Las llamadas a ThingSpeak siempre van a la red, nunca se cachean,
// para que los datos de sensores y comandos sean siempre en tiempo real.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return; // dejar pasar las llamadas a thingspeak.com

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
