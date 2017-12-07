this.addEventListener('install', event => {
  // don't finish installing the worker until everything in the block is succesful
  event.waitUntil(
    caches.open('assets-v1')
      .then(cache => {
        return cache.addAll([
          '/',
          '/js/scripts.js',
          '/css/styles.css',
          '/assets/locked.svg',
          '/assets/unlocked.svg'
        ]); // end cache.addAll
      }) // end .then()
  ); // end waitUntil
});

this.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  ); // end respondWith
});
