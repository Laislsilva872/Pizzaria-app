const CACHE = "bella-notte-v2";

const ARQUIVOS = [
  "./",
  "./index.html",
  "./style.css",
  "./cardapio.js",
  "./script.js",
  "./manifest.json",
  "./img/logo.jpeg",
  "./img/banner.png",
  "./img/icon-192.png",
  "./img/icon-512.png",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
];

// Guarda os arquivos principais. Se algum falhar, os outros continuam.
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return Promise.all(
        ARQUIVOS.map(function (url) {
          return cache.add(url).catch(function () {});
        })
      );
    })
  );
  self.skipWaiting();
});

// Apaga caches de versões antigas.
self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (nomes) {
      return Promise.all(
        nomes.filter(function (n) { return n !== CACHE; })
             .map(function (n) { return caches.delete(n); })
      );
    })
  );
  self.clients.claim();
});

// Responde do cache; se não tiver, busca na rede e guarda para a próxima vez.
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;

  e.respondWith(
    caches.match(e.request).then(function (guardado) {
      if (guardado) return guardado;

      return fetch(e.request).then(function (resposta) {
        if (resposta && (resposta.status === 200 || resposta.type === "opaque")) {
          const copia = resposta.clone();
          caches.open(CACHE).then(function (cache) { cache.put(e.request, copia); });
        }
        return resposta;
      }).catch(function () {
        if (e.request.mode === "navigate") return caches.match("./index.html");
      });
    })
  );
});