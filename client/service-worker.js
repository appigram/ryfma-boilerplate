const CACHE_VERSION = '1.1.8'

const updateReady = () => {
  // At this point, registration has taken place. The service worker will not
  // handle requests until this page and any other instances of this page
  // (in other tabs, etc.) have been closed/reloaded.
  const ok = confirm('Доступна новая версия приложения, нужно перезагрузить страницу.') // eslint-disable-line
  if (ok) {
    window.location.reload(true)
  }
}

const trackInstalling = (worker) => {
  worker.addEventListener('statechange', () => {
    if (worker.state === 'installed') {
      updateReady()
    }
  })
}

// Register service worker
if ('serviceWorker' in navigator) {
  // Unregister ALL OLD service workers
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      if (registration.active) {
        if (registration.active.scriptURL !== `${window.origin}/sw.js?v=${CACHE_VERSION}`) {
          registration.unregister()
        }
      }
      // registration.unregister()
    }
  })

  navigator.serviceWorker.register(`/sw.js?v=${CACHE_VERSION}`, { scope: '/' })
    .then((reg) => {
      // If there is not controller, this page wasn't loaded via a service
      // worker, so they are looking at the latest version. In that case exit
      // early.
      if (!navigator.serviceWorker.controller) {
        console.log('no controller found')
        return
      }

      // If there is an updated service worker already waiting, call updateReady().
      if (reg.waiting) {
        console.log('waiting')
        updateReady()
        return
      }

      // If there is an updated worker installed, track it's progress. If it
      // becomes 'installed', call updateReady().
      if (reg.installing) {
        console.log('installing')
        trackInstalling(reg.installing)
        return
      }

      // Otherwise, listen for new installing workers arriving. If one arrives,
      // track its progress. If it becomes 'installed', call updateReady().
      reg.addEventListener('updateFound', () => {
        console.log('update found')
        trackInstalling(reg.installing)
      })

      console.log('service worker installed')
    })
    .catch(exc => (
      // Something went wrong during registration. The sw.js file might be
      // unavailable or contain a syntax error.
      console.info('serviceWorker registration failed', exc)
    ))
} else {
  console.log('the current browser doesn\'t support service workers.')
}

if ('storage' in navigator && 'estimate' in navigator.storage) {
  navigator.storage.estimate()
    .then((estimate) => {
      try {
        const usingCache = Math.floor(estimate.usage / 1024 / 1024)
        const quotaCache = Math.floor(estimate.quota / 1024 / 1024)
        if ((quotaCache - usingCache) < 30) {
          const cacheWhitelist = [`ryfma-v${CACHE_VERSION}`]
          caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
              if (cacheWhitelist.indexOf(key) === -1) {
                return caches.delete(key)
              }
            }))
          })
        }
      } catch (err) {
        console.log('err: ', err)
      }
      // console.log(`Using ${Math.floor(estimate.usage / 1024 / 1024)} out of ${Math.floor(estimate.quota / 1024 / 1024)} MBytes.`)
    })
}

/* if (!navigator.serviceWorker) return
/* window.addEventListener('load', function() {
  // Have service work trim caches
  if (navigator.serviceWorker.controller != null) {
    navigator.serviceWorker.controller.postMessage({'command': 'trimCaches'});
  }
})

console.log('Registering service worker')

// Unregister ALL OLD service workers
navigator.serviceWorker.getRegistrations().then((registrations) => {
  for (const registration of registrations) {
    if (registration.active) {
      if (registration.active.scriptURL !== 'https://ryfma.com/sw.js?v=1.0.24') {
        registration.unregister()
      }
    }
    // registration.unregister()
  }
})

if ('storage' in navigator && 'estimate' in navigator.storage) {
  navigator.storage.estimate()
    .then((estimate) => {
      try {
        const usingCache = Math.floor(estimate.usage / 1024 / 1024)
        const quotaCache = Math.floor(estimate.quota / 1024 / 1024)
        if ((quotaCache - usingCache) < 30) {
          const cacheWhitelist = ['ryfma-v1.0.24']
          caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
              if (cacheWhitelist.indexOf(key) === -1) {
                return caches.delete(key)
              }
            }))
          })
        }
      } catch (err) {
        console.log('err: ', err)
      }
      // console.log(`Using ${Math.floor(estimate.usage / 1024 / 1024)} out of ${Math.floor(estimate.quota / 1024 / 1024)} MBytes.`)
    })
}

navigator.serviceWorker
  .register('/sw.js?v=1.0.24', { scope: '/' })
  .then(req => {
    // req.update()
    console.log('ServiceWorker registration success', req)
  })
  .catch(err => {
    console.error('ServiceWorker registration failed: ', err)
  }) */
