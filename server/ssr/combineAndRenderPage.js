import dbCache from '/server/config/redis'
import putCriticalCssToCache from '/server/ssr/putCriticalCssToCache'

async function combineAndRenderPage(sink, initData, staticContext, html, params) {
  let path = sink.request.url.path
  path = path?.split(/[?#]/)[0] // Remove query string and hash params
  const isMobile = params.settingsContext?.isMobile || false
  const isAMP = params.isAMP || false

  let cssPath = path
  if (path === '/') {
    cssPath = '_'
  } else if (path.includes('/p/')) {
    cssPath = '_post'
  } else if (path.includes('/u/')) {
    if (path.endsWith('/albums')) {
      cssPath = '_user_albums'
    } else if (path.endsWith('/all')) {
      cssPath = '_user_all'
    } else if (path.endsWith('/books')) {
      cssPath = '_user_books'
    } else if (path.endsWith('/followers') || path.endsWith('/following')) {
      cssPath = '_user_followers'
    } else {
      cssPath = '_user'
    }
  } else if (path.includes('/rhyme')) {
    cssPath = '_rhyme'
  } else if (path === '/best') {
    cssPath = '_best'
  } else if (path === '/hot') {
    cssPath = '_hot'
  } else if (path === '/picks') {
    cssPath = '_picks'
  } else if (path === '/live') {
    cssPath = '_live'
  } else if (path.includes('/tags/')) {
    cssPath = '_tags'
  } else if (path.includes('/books/')) {
    cssPath = '_books'
  } else if (path.includes('/f/')) {
    cssPath = '_fest'
  } else if (path.includes('/b/')) {
    cssPath = '_book'
  } else if (path.includes('/ch/')) {
    cssPath = '_chapter'
  } else if (path.includes('/d/')) {
    cssPath = '_duel'
  } else if (path.includes('/ask/')) {
    cssPath = '_ask'
  } else if (path.includes('/album/')) {
    cssPath = '_album'
  } else if (path.includes('/upgrade')) {
    cssPath = '_upgrade'
  } else if (path.includes('/login')) {
    cssPath = '_login'
  } else if (path.includes('/signup')) {
    cssPath = '_signup'
  } else if (path.includes('/search')) {
    cssPath = '_search'
  } else if (path.includes('/e/')) {
    cssPath = '_event'
  } else if (path.includes('/tagsmap')) {
    cssPath = '_tagsmap'
  } else if (path === '/coins') {
    cssPath = '_coins'
  } else if (path === '/blog') {
    cssPath = '_blog'
  } else if (path.includes('/blog/')) {
    cssPath = '_blog_post'
  }

  if (isMobile) {
    cssPath += '_min'
  }

  cssPath = 'css_cache' + cssPath.replace(/\//g, '_').replace(/-/g, '_')
  // console.log('cssPath: ', cssPath)
  let css = await dbCache.get(cssPath, true)
  // console.log('css: ', !!css)
  if (!css) {
    const checkRootCss = await dbCache.has('css_cache_')
    if (!checkRootCss) {
      console.log('Missing critical css')
      putCriticalCssToCache()
    }
  }

  // handle status code
  if (staticContext.status) {
    sink.setStatusCode(staticContext.status)
    if (staticContext.status === 404) {
      sink.setHeader('rfm-cache', 'SKIP');
      css = await dbCache.get('css_cache_404')
    } else if (staticContext.status === 301) {
      sink.redirect(`https://ryfma.com${staticContext.redirectTo}`)
    }
  }

  // console.log('helmet: ', initData.helmet)

  sink.appendToHead(initData.helmet.meta)
  sink.appendToHead(initData.helmet.title)
  sink.appendToHead(initData.helmet.link)

  if (css) {
    if (isAMP) {
      css = css.replace(/@(-moz-|-webkit-|-ms-)*keyframes\s(.*?){([0-9%a-zA-Z,\s.]*{(.*?)})*[\s\n]*}/g, "")
      sink.appendToHead(`<style amp-custom>${css}</style>`)
    } else {
      sink.appendToHead(`<style id='ssr-css'>${css}</style>`)
    }
  }

  if (isAMP) {
    sink.appendToHead(`<meta name="amp-google-client-id-api" content="googleanalytics">`)
    let ampScripts = ''
    ampScripts += `<script async custom-element="amp-analytics" src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"></script>`
    ampScripts += `<script async custom-element="amp-ad" src="https://cdn.ampproject.org/v0/amp-ad-0.1.js"></script>`
    if (path.includes('/p/') || path.includes('/rhyme/') || path.includes('/b/')) {
      ampScripts += `<script async custom-element="amp-social-share" src="https://cdn.ampproject.org/v0/amp-social-share-0.1.js"></script>`
    }
    if (path.includes('/p/') && html.includes('<iframe')) {
      ampScripts += `<script async custom-element="amp-youtube" src="https://cdn.ampproject.org/v0/amp-youtube-0.1.js"></script>`
    }
    if (path.includes('/rhyme/') && html.includes('<form')) {
      ampScripts += `<script async custom-element="amp-form" src="https://cdn.ampproject.org/v0/amp-form-0.1.js"></script>`
    }

    sink.appendToHead(ampScripts)

    // Conofigure scripts
    /* const triggersConfig = {
      "triggers": {
        "notBounce": {
          "on": "timer",
          "timerSpec": {
            "immediate": false, "interval": 15, "maxTimerLength": 14
          },
          "request": "notBounce"
        },
        /*"halfScroll": {
          "on": "scroll",
          "scrollSpec": {
            "verticalBoundaries": [50]
          },
          "request": "reachGoal",
          "vars": {
            "goalId": "halfScrollGoal"
          }
        },
        "partsScroll": {
          "on": "scroll",
          "scrollSpec": {
            "verticalBoundaries": [25, 90]
          },
          "request": "reachGoal",
          "vars": {
            "goalId": "partsScrollGoal"
          }
        },
        "trackScrollThrough": {
          "on": "amp-next-page-scroll",
          "request": "pageview"
        }
      }
    } */

    const googleAnalitycs = {
      "vars": { "account": "" },
      "triggers": {
        "trackPageview": {
          "on": "visible",
          "request": "pageview"
        },
        "notBounce": {
          "on": "timer",
          "timerSpec": {
            "immediate": false, "interval": 15, "maxTimerLength": 14
          },
          "request": "notBounce"
        },
      },
      "linkers": {
        "enabled": true
      }
    }
    const yandexAnalitycs = {
      "vars": { "counterId": "" },
      // ...triggersConfig
      "triggers": {
        "notBounce": {
          "on": "timer",
          "timerSpec": {
            "immediate": false, "interval": 15, "maxTimerLength": 14
          },
          "request": "notBounce"
        },
        "trackScrollThrough": {
          "on": "amp-next-page-scroll",
          "request": "pageview"
        }
      }
    }
    /* const alexaAnalitycs = {
      "vars": { "atrk_acct": "nKw6u1hNdI20fn", "domain": "ryfma.com" },
      ...triggersConfig
    } */

    let ampConfigs = ''
    ampConfigs += `<amp-analytics type="googleanalytics" class="i-amphtml-layout-fixed i-amphtml-layout-size-defined" style="width:1px;height:1px;" i-amphtml-layout="fixed"><script type="application/json">${JSON.stringify(googleAnalitycs)}</script></amp-analytics>`
    ampConfigs += `<amp-analytics type="metrika" class="i-amphtml-layout-fixed i-amphtml-layout-size-defined" style="width:1px;height:1px;" i-amphtml-layout="fixed"><script type="application/json">${JSON.stringify(yandexAnalitycs)}</script></amp-analytics>`
    // ampConfigs += `<amp-analytics type="alexametrics" class="i-amphtml-layout-fixed i-amphtml-layout-size-defined" style="width:1px;height:1px;" i-amphtml-layout="fixed"><script type="application/json">${JSON.stringify(alexaAnalitycs)}</script></amp-analytics>`

    sink.appendToBody(ampConfigs)
  } else {
    if (initData.i18n) {
      sink.appendToHead(`<script>window.__DETECTED_LOCALE__='${initData.locale}';window.__INITIAL_I18N_STORE__=${initData.i18n}</script>`)
    }

    let scriptTag = ''

    if (initData.user) {
      scriptTag += `<script defer>window.__USER_STATE__=${initData.user}</script>`

      // MS clarity
      /* scriptTag += `<script type="text/javascript" async>
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "4ny4ha3ltw");
      </script>` */
    }

    if (initData.apollo !== '{}') {
      scriptTag += `<script>window.__APOLLO_STATE__=${initData.apollo}</script>`
    }

    if (scriptTag) {
      sink.appendToBody(scriptTag)
    }
  }

  // TODO: remove later
  /* if (!isAMP) {
    <!-- Start Alexa Certify Javascript -->
      <script type="text/javascript" async>
      _atrk_opts = { atrk_acct:"nKw6u1hNdI20fn", domain:"ryfma.com",dynamic: true};
      (function() { var as = document.createElement('script'); as.type = 'text/javascript'; as.async = true; as.src = "https://certify-js.alexametrics.com/atrk.js"; var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(as, s); })();
      </script>
      <noscript><img src="https://certify.alexametrics.com/atrk.gif?account=nKw6u1hNdI20fn" style="display:none" height="1" width="1" alt="" /></noscript>
      <!-- End Alexa Certify Javascript -->
  } */

  sink.renderIntoElementById('react-root', html)
}

export default combineAndRenderPage
