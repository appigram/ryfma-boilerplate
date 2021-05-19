/* global self, caches, Response, Headers, fetch */
const HTMLToCache = '/'
const version = 'ryfma-v1.0.2'

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(version).then((cache) => {
    cache.add(HTMLToCache).then(self.skipWaiting())
  }))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(cacheNames.map((cacheName) => {
      if (version !== cacheName) return caches.delete(cacheName)
    }))).then(self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const requestToFetch = event.request.clone()
  event.respondWith(
    caches.match(event.request.clone()).then((cached) => {
      // We don't return cached HTML (except if fetch failed)
      if (cached) {
        const resourceType = cached.headers.get('content-type')
        // We only return non css/js/html cached response e.g images
        if (!hasHash(event.request.url) && !/text\/html/.test(resourceType)) {
          return cached
        }

        // If the CSS/JS didn't change since it's been cached, return the cached version
        if (hasHash(event.request.url) && hasSameHash(event.request.url, cached.url)) {
          return cached
        }
      }
      return fetch(requestToFetch).then((response) => {
        const clonedResponse = response.clone()
        const contentType = clonedResponse.headers.get('content-type')

        if (!clonedResponse || clonedResponse.status !== 200 || clonedResponse.type !== 'basic' ||
          /\/sockjs\//.test(event.request.url)) {
          return response
        }

        if (/html/.test(contentType)) {
          caches.open(version).then(cache => cache.put(HTMLToCache, clonedResponse))
        } else {
          // Delete old version of a file
          if (hasHash(event.request.url)) {
            caches.open(version).then(cache => cache.keys().then(keys => keys.forEach((asset) => {
              if (new RegExp(removeHash(event.request.url)).test(removeHash(asset.url))) {
                cache.delete(asset)
              }
            })))
          }

          if (event.request.method === 'GET') {
            caches.open(version).then(cache => cache.put(event.request, clonedResponse))
          }
        }
        return response
      }).catch(() => {
        if (hasHash(event.request.url)) return caches.match(event.request.url)
        // If the request URL hasn't been served from cache and isn't sockjs we suppose it's HTML
        else if (!/\/sockjs\//.test(event.request.url)) return caches.match(HTMLToCache)
        // Only for sockjs
        return new Response('No connection to the server', {
          status: 503,
          statusText: 'No connection to the server',
          headers: new Headers({ 'Content-Type': 'text/plain' })
        })
      })
    })
  )
})

self.addEventListener('push', event => {
  const serverData = event.data.json()
  console.log('Got push', serverData)
  const title = 'Новый пост от ' + serverData.userName
  const badge = 'https://cdn.ryfma.com/defaults/icons/favicon-196x196.png'
  const body = serverData.postExcerpt
  const icon = serverData.userImage || 'https://cdn.ryfma.com/defaults/icons/favicon-196x196.png'
  const tag = 'webpush-user-post'
  const data = {
    time: new Date(Date.now()).toString(),
    url: `${serverData.postLink}?utm_source=r_webpush&r_tId=${serverData.userId}&r_fId=${serverData.userId}&r_pId=${serverData.postId}`
  }

  self.registration.showNotification(title, {
    body: body,
    icon: icon,
    badge: badge,
    tag: tag,
    data: data,
    renotify: true,
    requireInteraction: true,
    vibrate: [200, 100, 200, 100, 200, 100, 200]
  })
})

self.addEventListener('notificationclick', event => {
  /* if (!event.action) {
    // Was a normal notification click
    console.log('Notification Click.')
    return
  } */

  const notificationData = event.notification.data

  /* switch (event.action) {
    case 'read-action':
      console.log('User read action.')
      break
    default:
      console.log(`Unknown action clicked: '${event.action}'`)
      break
  } */

  const urlToOpen = new URL(notificationData.url, self.location.origin).href

  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then((windowClients) => {
    let matchingClient = null

    for (let i = 0; i < windowClients.length; i++) {
      const windowClient = windowClients[i]
      if (windowClient.url === urlToOpen) {
        matchingClient = windowClient
        break
      }
    }

    if (matchingClient) {
      return matchingClient.focus()
    } else {
      return clients.openWindow(urlToOpen)
    }
  })
  event.waitUntil(promiseChain)
})

function removeHash (element) {
  if (typeof element === 'string') return element.split('?hash=')[0]
}

function hasHash (element) {
  if (typeof element === 'string') return /\?hash=.*/.test(element)
}

function hasSameHash (firstUrl, secondUrl) {
  if (typeof firstUrl === 'string' && typeof secondUrl === 'string') {
    return /\?hash=(.*)/.exec(firstUrl)[1] === /\?hash=(.*)/.exec(secondUrl)[1]
  }
}

// Service worker created by Ilan Schemoul alias NitroBAY as a specific Service Worker for Meteor
// Please see https://github.com/NitroBAY/meteor-service-worker for the official project source
