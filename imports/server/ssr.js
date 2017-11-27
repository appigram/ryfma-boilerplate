// Meteor
import { WebApp } from 'meteor/webapp'
import { onPageLoad } from 'meteor/server-render'

// React
import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'

// Apollo
import ApolloClient from 'apollo-client'
import { meteorClientConfig, createMeteorNetworkInterface } from 'meteor/apollo'
import { getDataFromTree, ApolloProvider } from 'react-apollo'

// Helpers
import 'cross-fetch/polyfill'
import cookieParser from 'cookie-parser'

// Routes
import { generateRoutes } from 'react-code-split-ssr'
import generateRoutesProps from '/imports/both/routes'

// SEO
import { Helmet } from 'react-helmet'

// i18n
import { I18nextProvider } from 'react-i18next'
import i18n from '/imports/both/i18nServer'

import { CookiesProvider, Cookies } from 'react-cookie'

// Layout
import MainLayout from '/imports/ui/layouts/MainLayout'

import { isMobile, isTablet } from '/lib/utils/deviceDetect'

// Cache
/* import LRUCache from 'lru-cache'
const ssrCache = new LRUCache({
  max: 100 * 1024, // the maximum size of the cache
  maxAge: 1000 * 60 * 60 * 24 * 1 // 1 days
}) */

WebApp.rawConnectHandlers.use(cookieParser())

// A workaround to pass the cookies info to the request sink object
WebApp.connectHandlers.use('/', (req, res, next) => {
  const hackBody = {}
  if (req.cookies.meteor_login_token) {
    hackBody.loginToken = req.cookies.meteor_login_token
  }
  hackBody.userAgent = req.headers['user-agent']
  // hackBody.res = res
  req.dynamicBody = `<span id='lg_tkn'>${JSON.stringify(hackBody)}</span>`
  return next()
})

onPageLoad(async sink => {
  const path = sink.request.url.path

  const hackBody = JSON.parse(sink.request.dynamicBody.replace("<span id='lg_tkn'>", '').replace('</span>', ''))
  // let browser = sink.request.browser.name.toLowerCase()
  const isMobileSSR = isMobile(hackBody.userAgent)
  const isTabletSSR = isTablet(hackBody.userAgent)
  // console.log(isMobileSSR)
  const loginToken = hackBody.loginToken
  const authenticated = !!loginToken

  const context = {
    authenticated: authenticated,
    isMobile: isMobileSSR,
    isTablet: isTabletSSR
  }

  // use createMeteorNetworkInterface to get a preconfigured network interface
  // #1 network interface can be used server-side thanks to polyfilled `fetch`
  if (!sink.request.headers) {
    sink.request.headers = new Headers()
  }

  const networkInterface = createMeteorNetworkInterface({
    opts: {
      credentials: 'same-origin',
      headers: sink.request.headers
    },
    loginToken: loginToken
  })
  // use meteorClientConfig to get a preconfigured Apollo Client options object
  const client = new ApolloClient(meteorClientConfig({ networkInterface }))

  // let htmlString = ssrCache.get(path)

  const locale = sink.request.language ? sink.request.language.split('-').shift() : 'ru'
  const i18nServer = i18n.cloneInstance({}, () => {})
  i18nServer.changeLanguage(locale)

  const Routes = await generateRoutes({
    ...generateRoutesProps,
    pathname: sink.request.url.pathname
  })

  const cookies = sink.request.cookies ? sink.request.cookies : new Cookies({ meteor_login_token: loginToken })

  const App = props => (<I18nextProvider i18n={i18nServer}>
    <ApolloProvider client={client} key='provider'>
      <CookiesProvider cookies={cookies}>
        <StaticRouter location={props.location} context={context}>
          <MainLayout locationObj={sink.request.url} isMobile={isMobileSSR} isTablet={isTabletSSR} authenticated={authenticated} {...props}>
            <Routes />
          </MainLayout>
        </StaticRouter>
      </CookiesProvider>
    </ApolloProvider>
  </I18nextProvider>
  )

  try {
    await getDataFromTree(<App location={path} />)
  } catch (error) {
    console.log(error.message)
  }

  // if (!htmlString) {
  const htmlString = renderToString(<App location={path} />)
  const helmet = Helmet.renderStatic() // Needs to be called after renderToString
    // const styles = flushToHTML()

    // ssrCache.set(path, htmlString)
    // ssrCache.set(path + '_title', helmet.title.toString())
    // ssrCache.set(path + '_meta', helmet.meta.toString())
    // ssrCache.set(path + '_link', helmet.link.toString())
    // ssrCache.set(path + '_styles', styles)
    // ssrCache.set(path + '_script', helmet.script.toString())

    // console.log(ssrCache.get(path))
  // } else {
    // console.log('caching ok')
    // console.log(ssrCache.get(path))
  // }

  // if (context.url) {
  //  sink.response.redirect(302, context.url)
  // if (context.status === 404) {
    // console.log(sink)
    // hackBody.res.status(404)
  // }

  sink.renderIntoElementById('react-root', htmlString)

  sink.appendToHead(helmet.title.toString())
  sink.appendToHead(helmet.meta.toString())
  sink.appendToHead(helmet.link.toString())
  sink.appendToHead(helmet.script.toString())

  // sink.appendToHead(ssrCache.get(path + '_title'))
  // sink.appendToHead(ssrCache.get(path + '_meta'))
  // sink.appendToHead(ssrCache.get(path + '_link'))
  // sink.appendToHead(ssrCache.get(path + '_styles'))
  // sink.appendToHead(ssrCache.get(path + '_script'))

  sink.appendToBody(`
    <script>
      window.__APOLLO_STATE__=${JSON.stringify(client.getInitialState())}
      window.__DETECTED_LOCALE__='${locale}'
      window.__INITIAL_I18N_STORE__=${JSON.stringify(i18nServer.services.resourceStore.data)}
    </script>
  `)
})
