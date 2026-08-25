const CACHE_NAME = "rayo-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/inicio.html",
  "/inicio_admin.html",
  "/password.html",

  // CSS
  "/css/index.css",
  "/css/inicio.css",
  "/css/password.css",

  // JS principales
  "/js/index.js",
  "/js/password.js",
  "/js/estadisticas.js",

  // JS admin
  "/js/admin/api_jugadores.js",
  "/js/admin/api_partidos.js",
  "/js/admin/inicio.js",

  // JS user
  "/js/user/api_jugadores.js",
  "/js/user/api_partidos.js",
  "/js/user/inicio.js",

  // Imágenes
  "/img/logo-ig.png",
  "/img/escudo_Rayo_Hortaleza.jpeg",
  "/img/escudo.png",
];

// Instalar SW y cachear archivos
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activar SW
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
});

// Interceptar peticiones
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
