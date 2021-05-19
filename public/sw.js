// From https://github.com/VeliovGroup/Meteor-Files-Demos/blob/master/demo/public/sw.js

(function (self) {
  const CACHE_VERSION = '1.1.6'
  const CACHE_NAME = 'ryfma-v' + CACHE_VERSION
  const pages = [
    '/',
    `/sw.js?v=${CACHE_VERSION}`,
    'https://cdn.ryfma.com/defaults/icons/manifest.json'
  ]
  const origin = self.location.origin
  const RE = {
    method: /GET/i,
    static: /\.(?:png|jpe?g|css|js|json|gif|webm|webp|eot|svg|ttf|woff|woff2)(?:\?[a-zA-Z0-9-._~:/#\[\]@!$&'()*+,=]*)?$|(?:fonts\.googleapis\.com|gstatic\.com)/i,
    sockjs: /\/sockjs\//
  }

  function updateCoreCache () {
    return caches.open(CACHE_NAME)
      .then(cache => {
        // Make installation contingent on storing core cache items
        return cache.addAll(pages)
      })
  }

  // Remove old caches that don't match current version
  function clearCaches () {
    return caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (CACHE_VERSION.indexOf(key) === -1) {
          return caches.delete(key)
        }
      }))
    })
  }

  self.addEventListener('install', function (event) {
    event.waitUntil(
      updateCoreCache().then(() => self.skipWaiting())
    )
  })

  self.addEventListener('activate', event => {
    event.waitUntil(
      clearCaches().then(() => {
        return self.clients.claim()
      }))
  })

  self.addEventListener('fetch', function (event) {
    // self.clients.claim()
    if (event.request.url.indexOf('https') === 0 || event.request.url.indexOf('http') === 0) {
      if (RE.method.test(event.request.method) && !RE.sockjs.test(event.request.url)) {
        const req = event.request.clone()
        const uri = event.request.url.replace(origin, '')

        event.respondWith(fetch(req).then(function (response) {
          if (!!~pages.indexOf(uri) || RE.static.test(event.request.url)) {
            const resp = response.clone()
            caches.open(CACHE_NAME).then(function (cache) {
              try {
                cache.put(req, resp)
              } catch (err) {
                console.log(err)
              }
            })
          }
          return response
        }).catch(function () {
          // Network failed back to cache
          return caches.match(req).then(function (cached) {
            return cached || caches.match('/').catch(function () {
              return fetch(req)
            })
          }).catch(function () {
            return caches.match('/').catch(function () {
              return fetch(req)
            })
          })
        }))
      }
    }
  })

  self.addEventListener('push', event => {
    event.preventDefault()
    let serverData = {}
    if (event.data) {
      try {
        serverData = event.data.json()
      } catch (err) {
        console.log(err)
      }
    }
    console.log('Got push', serverData)
    if (serverData.postId) {
      const title = `Ryfma: ${serverData.postTitle ? serverData.postTitle : serverData.userName + ' опубликовала новый пост'}`
      const badge = 'https://cdn.ryfma.com/defaults/icons/favicon-196x196.png'
      const body = serverData.postExcerpt
      const icon = serverData.userImage || 'https://cdn.ryfma.com/defaults/icons/favicon-196x196.png'
      const tag = 'webpush-user-post'
      const data = {
        time: new Date(Date.now()).toString(),
        url: `${serverData.postLink}?utm_source=notification&utm_medium=webpush&utm_content=new_${serverData.type}&utm_campaign=${serverData.postId}`
      }

      self.registration.showNotification(title, {
        body: body,
        icon: icon,
        badge: badge,
        image: icon,
        tag: tag,
        data: data,
        renotify: true,
        requireInteraction: true,
        vibrate: [200, 100, 200, 100, 200, 100, 200]
      })
    } else if (serverData.roomId) {
      const title = 'Ryfma: Сообщение от ' + serverData.userName
      const badge = 'https://cdn.ryfma.com/defaults/icons/favicon-196x196.png'
      const body = serverData.roomExcerpt
      const icon = serverData.userImage || 'https://cdn.ryfma.com/defaults/icons/favicon-196x196.png'
      const tag = 'webpush-user-msg'
      const data = {
        time: new Date(Date.now()).toString(),
        url: `${serverData.roomLink}?utm_source=notification&utm_medium=webpush&utm_content=new_msg&utm_campaign=${serverData.userId}`
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
    } else if (serverData.giftId) {
      const title = serverData.giftTitle
      const badge = 'https://cdn.ryfma.com/defaults/icons/favicon-196x196.png'
      const body = serverData.giftExcerpt
      const icon = serverData.userImage || 'https://cdn.ryfma.com/defaults/icons/favicon-196x196.png'
      const tag = 'webpush-user-msg'
      const data = {
        time: new Date(Date.now()).toString(),
        url: `${serverData.giftLink}?giftId=${serverData.giftId}utm_source=notification&utm_medium=webpush&utm_content=new_gift&utm_campaign=${serverData.userId}`
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
    }
  })

  self.addEventListener('notificationclick', (event) => {
    event.preventDefault()
    console.log('WEBPUSH click')
    /* if (!event.action) {
      // Was a normal notification click
      console.log('Notification Click.')
      return
    } */

    const notificationData = event.notification.data
    console.log('notificationData: ', notificationData)

    /* switch (event.action) {
      case 'read-action':
        console.log('User read action.')
        break
      default:
        console.log(`Unknown action clicked: '${event.action}'`)
        break
    } */

    event.notification.close()

    const urlToOpen = new URL(notificationData.url, self.location.origin).href

    event.waitUntil(
      clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      }).then((clientList) => {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i]
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus()
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
      .catch(err => {
        console.log('Open push err: ', err)
      })
    )
  })

  self.addEventListener('pushsubscriptionchange', (event) => {
    console.log('Subscription expired')
    event.waitUntil(
      self.registration.pushManager.subscribe({ userVisibleOnly: true })
        .then((subscription) => {
          console.log('Subscribed after expiration', subscription.endpoint)
          const currUser = JSON.parse(window.localStorage.getItem('Meteor.currUser'))
          if (currUser) {
            return fetch('/push/subscribe', {
              method: 'POST',
              headers: {
                'Content-type': 'application/json'
              },
              body: JSON.stringify({
                _id: currUser._id,
                subscription
              })
            })
          }
        })
    )
  })
})(this)
