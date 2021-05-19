// React
import React from 'react'
import { StaticRouter } from 'react-router'
// import { renderToNodeStream } from 'react-dom/server'

import getUserForContext from '/server/utils/getUserForContext'

// import { ServerStyleSheet } from 'styled-components'

// Apollo
import { ApolloProvider } from '@apollo/client/react'
import { renderToStringWithData } from '@apollo/client/react/ssr'
// import { renderToNodeStream } from 'react-dom/server';
// import { getDataFromTree } from '@apollo/client/react-ssr'
import createApolloClient from '/server/config/createApolloClient'

// Routes
import { generateRoutes } from '@appigram/react-code-split-ssr'
// import generateRoutesProps from '/imports/shared/routes'

// SEO
import { HelmetProvider } from 'react-helmet-async'

// i18n
import { I18nextProvider } from 'react-i18next'
import i18n from '/server/i18n/i18nServer'

import { AuthProvider, SettingsProvider } from '/imports/hooks'

import dbCache from '/server/config/redis'

// import MainLayout from '/imports/ui/layouts/MainLayout'

import getApollo from './getApollo'
import getHelmet from './getHelmet'
import getUser from './getUser'
import getI18N from './getI18N'

const getI18nServer = async (locale) => {
  const i18nServer = i18n.cloneInstance({}, () => { })
  i18nServer.changeLanguage(locale)
  return i18nServer
}

// Generate SSR Html
const renderer = async ({ path, authContext = {}, settingsContext = {}, key, isBot, headers, cookies, isAMP }) => {
  const { token } = authContext
  const { locale } = settingsContext

  let currUser = null
  if (token) {
    currUser = await getUserForContext(token)
    // console.log('get currUser SSR: ', currUser)
    if (currUser.user) {
      authContext.currUser = currUser.user
      authContext.currUserId = currUser.userId
      authContext.isPremium = currUser.user.roles.includes('premium')

      /* if (currUser.user.settings) {
        if (currUser.user.settings.autoTheme) {
          const { rThemeLast, userTime } = cookies
          const userClientTime = userTime ? new Date(userTime) : new Date()
          const currHour = userClientTime.getHours()
          if (currHour > 6 && currHour < 21) {
            settingsContext.rTheme = rThemeLast
          } else {
            settingsContext.rTheme = 'moon'
          }
        }
      } */
    }
  }

  const helmetContext = {}
  const staticContext = {}
  // console.log('i18n: ', i18n)
  // console.log('i18nServer: ', i18nServer)
  // console.log('settingsContextSSR: ', settingsContext)

  // const stylesheet = new ServerStyleSheet()
  // const App = stylesheet.collectStyles(props => (

  let layoutImport = null
  if (authContext.currUserId && (settingsContext.isMobile || settingsContext.isTablet)) {
    layoutImport = import('/imports/ui/layouts/MainLayoutMobileWithAuth')
  } else if (!authContext.currUserId && (settingsContext.isMobile || settingsContext.isTablet)) {
    layoutImport = import('/imports/ui/layouts/MainLayoutMobile')
  } else if (authContext.currUserId && !(settingsContext.isMobile && settingsContext.isTablet)) {
    layoutImport = import('/imports/ui/layouts/MainLayoutWithAuth')
  } else {
    layoutImport = import('/imports/ui/layouts/MainLayout')
  }

  if (isAMP) {
    settingsContext.isAMP = isAMP
  }

  const [
    generateRoutesProps,
    { default: MainLayout },
    client,
    i18nServer
  ] = await Promise.all([
    import('/imports/shared/routes'),
    layoutImport,
    createApolloClient(token, { ...headers, cookie: cookies }),
    getI18nServer(locale)
  ])

  const ServerRoutes = await generateRoutes({
    routes: generateRoutesProps.routes({ currUserId: authContext.currUserId, isMobile: settingsContext.isMobile }),
    redirects: generateRoutesProps.redirects,
    notFoundComp: generateRoutesProps.notFoundComp,
    pathname: path
  })

  const App = props => (
    <HelmetProvider context={helmetContext}>
      <ApolloProvider client={client}>
        <AuthProvider context={authContext}>
          <SettingsProvider context={settingsContext}>
            <I18nextProvider i18n={i18nServer}>
              <StaticRouter location={props.location} context={staticContext}>
                <MainLayout Routes={ServerRoutes} {...props} />
              </StaticRouter>
            </I18nextProvider>
          </SettingsProvider>
        </AuthProvider>
      </ApolloProvider>
    </HelmetProvider>
  )

  let html = ''
  // const decodedPath = decodeURI(path)

  try {
    html = await renderToStringWithData(<App location={path} />)
    // await getDataFromTree(<App location={path} />)
    // html = renderToNodeStream(<App location={path} />)
  } catch (err) {
    // console.error('SSR params: ', authContext)
    console.error('SSR params: ', settingsContext)
    console.error('SSR params: ', key)
    console.error('SSR error: ', err)
  }


  const getInitData = await Promise.all([
    getHelmet(helmetContext),
    getI18N(i18nServer, locale),
    getApollo(client),
    getUser(authContext)
  ])

  /*if (
    path.indexOf('/me') === 0 ||
    path === '/new-album' ||
    path === '/new-contest' ||
    path === '/new-book' ||
    path === '/new-chapter' ||
    path === '/new-post' ||
    path.indexOf('/edit') > -1
  ) {
  } else { */
  const initData = {
    helmet: getInitData[0].helmet,
    i18n: getInitData[1].i18n,
    locale,
    apollo: getInitData[2].apollo,
    user: getInitData[3].user
  }

  // if (false) {
  if (!token) {
    const hideFromCache = key.includes('saved_') || key.includes('.xml_')
    if (!hideFromCache && (staticContext && staticContext.status !== 404 && staticContext.status !== 301)) {
      const newSSRCache = { html, staticContext, initData }
      // console.log('Set key', key)
      // console.log('Set cache', newSSRCache)
      const cacheTime = isAMP ? 1000 * 60 * 60 * 24 * 7 : 1000 * 60 * 60 * 24 * 2
      dbCache.set(key, newSSRCache, cacheTime)
    }
  }

  return {
    html,
    staticContext,
    initData
  }
}

export default renderer
