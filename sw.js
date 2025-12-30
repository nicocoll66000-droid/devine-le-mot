// Nom de votre cache. Changez la version (v1, v2, etc.) après chaque mise à jour majeure.
const CACHE_NAME = 'devinemot-pwa-v1';

// Liste des URL à mettre en cache immédiatement lors de l'installation
const urlsToCache = [
  './', // Racine de l'application
  'index.html',
  'app.js',
  'style.css', 
  '/manifest.json',
  'tictac.mp3', 
  'bomb.mp3', 
  // 🚨 IMPORTANT : N'oubliez pas vos icônes (ex: /icons/icon-192x192.png)
];

// Événement 'install' : le service worker met en cache les fichiers
self.addEventListener('install', event => {
  console.log('[Service Worker] Installation...');
  // Attend que tous les fichiers soient ajoutés au cache
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Mise en cache des ressources.');
        return cache.addAll(urlsToCache);
      })
  );
});

// Événement 'fetch' : intercepte les requêtes réseau
self.addEventListener('fetch', event => {
  // Répond avec la ressource mise en cache si elle est disponible
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - retourne la version en cache
        if (response) {
          return response;
        }
        // Pas de cache - effectue la requête réseau
        return fetch(event.request);
      })
  );
});

// Événement 'activate' : nettoie les anciens caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activation...');
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Supprime les vieux caches
            console.log('[Service Worker] Suppression du vieux cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
