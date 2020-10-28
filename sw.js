const DYNAMIC_CACHE_NAME = 'smmus-mathe-dynamic-v1';
const ASSETS = ['./index.html', './style.css', './index.js'];

// install event
self.addEventListener('install', evt => {
    console.log('SW : [INSTALLED] : service worker');
    evt.waitUntil(
        /*caching static assets while installing */
        caches.open(DYNAMIC_CACHE_NAME).then(cache => {
            console.log('[CACHED]: all static assets');
            cache.addAll(ASSETS);
        })
    );
});

// activate event
self.addEventListener('activate', evt => {

    console.log('SW : [ACTIVATED] : service worker');

    /* deleting previously cached files while updating versions */
    evt.waitUntil(
        caches.keys().then(keys => {
            //console.log(keys);
            return Promise.all(keys
                .filter(key => key !== DYNAMIC_CACHE_NAME)
                .map(key => caches.delete(key))
            );
        })
    );

});

// fetch events
self.addEventListener('fetch', evt => {

    console.log('SW : [FETCH]: ', evt.request.url);

    evt.respondWith(
        fetch(evt.request)
            .then(fetched_response => {

                /*cache the response first and then return it*/
                return caches.open(DYNAMIC_CACHE_NAME).then(cache => {

                    /**caching a copy of the response*/
                    if (evt.request.url.includes('index.html') || evt.request.url.includes('v=') || evt.request.url.includes('i=')) {
                        cache.put(evt.request.url.split('?')[0], fetched_response.clone());
                    } else {
                        cache.put(evt.request.url, fetched_response.clone());
                    }

                    return fetched_response;
                })
            })
            .catch(function () {
                return caches.match(evt.request, { 'ignoreSearch': true });
            })
    );
});