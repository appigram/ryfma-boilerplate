// import 'core-js/stable'

import '/server/api/apollo'
// import './config/register'
import './config/browserPolicy'
import './config/mongoIndexes'
import './config/webPush'
import './config'
import './emails'
import './accounts'
import './hooks'
import './methods'
// import './payments'
import './jobs'

// import './customQuery'
import './sendManualEmails'

// import './roles'
// import './cdn'

// Sitemap, Robots & Humans
// import './seo/humansTxt';
// import './seo/robotsTxt';
import './seo/sitemapXml'
// import './seo/turboRSSXML'
import './seo/turboAPIXML'
// import './mergeAccounts'
// import './mergeClassic'

// Meteor
// import { WebApp } from 'meteor/webapp'
import {
  onPageLoad
} from 'meteor/server-render'

import {
  Meteor
} from 'meteor/meteor'

import dbCache from '/server/config/redis'

import 'cross-fetch/polyfill'

import renderer from './ssr/renderer'
import prepareSSRData from './ssr/prepareSSRData'
import combineAndRenderPage from './ssr/combineAndRenderPage'
// import { generateCriticalCSS, joinCss } from './ssr/generateCriticalCSS'
import putCriticalCssToCache from './ssr/putCriticalCssToCache'

// Temproraly use legacy build
/* import { setMinimumBrowserVersions } from "meteor/modern-browsers"
setMinimumBrowserVersions({
  chrome: Infinity,
}) */

putCriticalCssToCache()

// Set html lang attribute
WebApp.addHtmlAttributeHook((req) => {
  let specType = 'WebPage'
  let specPrefix = 'website: https://ogp.me/ns/website#'

  const pathname = req.url.pathname || ''
  if (pathname.includes('/p/')) {
    specType = 'Article'
    specPrefix = 'profile: https://ogp.me/ns/profile# article: https://ogp.me/ns/article#'
  } else if (pathname.includes('/u/')) {
    specType = 'ProfilePage'
    specPrefix = 'article: https://ogp.me/ns/article# profile: https://ogp.me/ns/profile#'
  } else if (pathname.includes('/b/') || pathname.includes('/books/')) {
    specType = 'Book'
    specPrefix = 'book: https://ogp.me/ns/book# profile: https://ogp.me/ns/profile#'
  } else if (pathname.includes('/tags/') || pathname.includes('/f/')) {
    specPrefix += 'article: https://ogp.me/ns/article#'
  } else if (pathname.includes('/authors') || pathname.includes('/classic')) {
    specPrefix += 'profile: https://ogp.me/ns/profile#'
  } else if (pathname.includes('/fairytails')) {
    specPrefix += 'profile: https://ogp.me/ns/profile# article: https://ogp.me/ns/article#'
  }

  let htmlAttributes = {
    lang: 'ru',
    'xml:lang': 'ru',
    // itemscope: null,
    // itemtype: `https://schema.org/${specType}`,
    xmlns: 'http://www.w3.org/1999/xhtml',
    prefix: `og: https://ogp.me/ns# ${specPrefix} fb: https://ogp.me/ns/fb# ya: https://webmaster.yandex.ru/vocabularies/`
  }
  if (!!req.url.query?.hl) {
    htmlAttributes.lang = req.url.query.hl
    htmlAttributes['xml:lang'] = req.url.query.hl
  } else if (req.cookies.i18next) {
    htmlAttributes.lang = req.cookies.i18next
    htmlAttributes['xml:lang'] = req.cookies.i18next
  }

  if (!(pathname.includes('/p/') || pathname.includes('/u/') || pathname.includes('/b/'))) {
    htmlAttributes.itemscope = null
    htmlAttributes.itemtype = `https://schema.org/${specType}`
  }

  return htmlAttributes
})

onPageLoad(async sink => {
  // console.time(`onPageLoad ${sink.request.url.path}`)
  if (sink.request.url.path.includes('.php') || sink.request.url.path.includes('.cgi')) {
    console.log('Not JS path sink.request.url.path: ', sink.request.url.path)
    sink.setStatusCode(404)
    return
  }

  const params = await prepareSSRData(sink)

  if (!params) return null

  if (params.isAMP && params.authContext.token) {
    sink.redirect(params.path.replace('/amp', ''))
    return
  }

  const keyInDB = await dbCache.has(params.key)
  // const cacheData = await dbCache.get(params.key)
  // if (false) {
  if (keyInDB && !sink.request.url.path.includes('refresh=true')) {
    // console.log('Page from cache!')
    try {
      // console.log('page from cache key: ', params.key, !!keyInDB)
      const cacheData = await dbCache.get(params.key)
      const {
        initData,
        staticContext,
        html
      } = cacheData

      sink.setHeader('rfm-cache', 'HIT');
      await combineAndRenderPage(sink, initData, staticContext, html, params)
    } catch (err) {
      console.log('err', err)
      // fallback if cache rendering with err
      const {
        initData,
        staticContext,
        html
      } = await renderer(params)

      sink.setHeader('rfm-cache', 'MISS');
      sink.setHeader('rfm-cache-path', params.key);
      await combineAndRenderPage(sink, initData, staticContext, html, params)
    }
  } else {
    // console.log('Page SSR rendered!')
    const {
      initData,
      staticContext,
      html
    } = await renderer(params)

    // Cloudlare cache settings
    /*
    if (params.authContext.token) {
      sink.setHeader("Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0")
      sink.setHeader("Cache-Control', 'post-check=0, pre-check=0")
      sink.setHeader("Pragma', 'no-cache")
    }
    */
    sink.setHeader('rfm-cache', 'MISS');
    sink.setHeader('rfm-cache-path', params.key);
    await combineAndRenderPage(sink, initData, staticContext, html, params)
  }
  // console.timeEnd(`onPageLoad ${sink.request.url.path}`)
})

if (Meteor.isDevelopment && !false) {
  // generateCriticalCSS()
  // joinCss()
}
