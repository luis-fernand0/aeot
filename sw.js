self.addEventListener('install', (e) => {
    // Simplesmente aguarda a instalação do Service Worker
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    // Ativa o Service Worker imediatamente
    self.clients.claim();
});