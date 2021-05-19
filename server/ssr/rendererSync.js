// React
import React from 'react'
import { StaticRouter } from 'react-router'
// import { renderToNodeStream } from 'react-dom/server'

// Apollo
import { ApolloProvider } from '@apollo/client/react'
import { renderToStringWithData } from '@apollo/client/react/ssr'
// import { getDataFromTree } from '@apollo/client/react-ssr'
import createApolloClient from '/server/config/createApolloClient'

// Routes
import { generateRoutes } from '@appigram/react-code-split-ssr'

// SEO
import { HelmetProvider } from 'react-helmet-async'

// i18n
import { I18nextProvider } from 'react-i18next'
import i18n from '/server/i18n/i18nServer'

import { AuthProvider, SettingsProvider } from '/imports/hooks'

import getApollo from './getApollo'
import getHelmet from './getHelmet'

// Generate SSR Html
const renderer = async ({path, authContext = {}, settingsContext = { locale: 'ru' }, key, isBot, headers, cookies}) => {
  const { token } = authContext
  const { locale } = settingsContext

  const client = createApolloClient(token, { ...headers, cookie: cookies })

  const i18nServer = i18n.cloneInstance({}, () => {})
  i18nServer.changeLanguage(locale)

  const helmetContext = {}
  const staticContext = {}
  // console.log('i18n: ', i18n)
  // console.log('i18nServer: ', i18nServer)
  // console.log('settingsContextSSR: ', settingsContext)

  // const stylesheet = new ServerStyleSheet()
  // const App = stylesheet.collectStyles(props => (

  let layoutImport = null
  if (authContext.currUserId && settingsContext.isMobile) {
    layoutImport = import('/imports/ui/layouts/MainLayoutMobileWithAuth')
  } else if (!authContext.currUserId && settingsContext.isMobile) {
    layoutImport = import('/imports/ui/layouts/MainLayoutMobile')
  } else if (authContext.currUserId && !settingsContext.isMobile) {
    layoutImport = import('/imports/ui/layouts/MainLayoutWithAuth')
  } else {
    layoutImport = import('/imports/ui/layouts/MainLayout')
  }

  const [
    generateRoutesProps,
    { default: MainLayout }
  ] = await Promise.all([
    import('/imports/shared/routes'),
    layoutImport
  ])

  const ServerRoutes = await generateRoutes({
    // ...generateRoutesProps,
    routes: generateRoutesProps.routes(authContext.currUserId),
    redirects: generateRoutesProps.redirects,
    notFoundComp: generateRoutesProps.notFoundComp,
    pathname: path
  })

  const App = props => (
    <HelmetProvider context={helmetContext}>
      <AuthProvider context={authContext}>
        <SettingsProvider context={settingsContext}>
          <ApolloProvider client={client}>
            <I18nextProvider i18n={i18nServer}>
              <StaticRouter location={props.location} context={staticContext}>
                <MainLayout Routes={ServerRoutes} {...props} />
              </StaticRouter>
            </I18nextProvider>
          </ApolloProvider>
        </SettingsProvider>
      </AuthProvider>
    </HelmetProvider>
  )
  // console.log('App: ', App)

  let html = ''
  // const decodedPath = decodeURI(path)

  try {
    html = await renderToStringWithData(<App location={path} />)
    // await getDataFromTree(<App location={path} />)
    // html = renderToNodeStream(<App location={path} />)
  } catch (err) {
    // const decodedPath = decodeURI(path)
    // console.log('decodedPath: ', decodedPath)
    // html = await renderToStringWithData(<App location={decodedPath} />)
    console.error('SSR path: ', path)
    console.error('SSR error: ', err)
  }

  // sink.renderIntoElementById('react-root', html)

  const initData = await Promise.all([
    getHelmet(helmetContext),
    // getI18N(i18nServer, locale),
    getApollo(client),
  ])

  return {
    html,
    staticContext,
    initData: {
      helmet: initData[0].helmet,
      locale,
      apollo: initData[1].apollo
    }
  }
}

export default renderer
