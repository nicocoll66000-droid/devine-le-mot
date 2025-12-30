// Nom de votre cache. Incrémentez la version (v1, v2, etc.) après chaque mise à jour.
const CACHE_NAME = 'devinemot-pwa-v2'; // Version mise à jour pour inclure categories.json

// Liste des URL à mettre en cache immédiatement lors de l'installation
const urlsToCache = [
  './', 
  'index.html',
  'app.js',
  'style.css', 
  '/manifest.json',
  // 🚨 AJOUT DU FICHIER DE DONNÉES 🚨
  'categories.json', 
  'tictac.mp3', 
  'bomb.mp3', 
  // N'oubliez pas vos icônes (ex: /icons/icon-192x192.png)
];

// Événement 'install' : le service worker met en cache les fichiers
self.addEventListener('install', event => {
  console.log('[Service Worker] Installation...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Mise en cache des ressources.');
        return cache.addAll(urlsToCache);
      })
  );
});

// Événement 'fetch' : intercepte les requêtes réseau pour servir le cache
self.addEventListener('fetch', event => {
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

// Événement 'activate' : nettoie les anciens caches pour économiser de l'espace
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activation et nettoyage des anciens caches...');
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Si le cacheName n'est pas dans la liste blanche, il est supprimé
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[Service Worker] Suppression du vieux cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
