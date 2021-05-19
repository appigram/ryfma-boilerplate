import React from 'react'
// import { Meteor } from 'meteor/meteor'
import { hydrate } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { generateRoutes } from '@appigram/react-code-split-ssr'
import { onPageLoad } from 'meteor/server-render'
import { AuthProvider } from '/imports/hooks/useAuth'
import { SettingsProvider } from '/imports/hooks/useSettings'

// SEO
import { HelmetProvider } from 'react-helmet-async'

// Apollo
import { client } from '/imports/shared/ApolloClient'
import { ApolloProvider } from '@apollo/client/react'
import {initWithClient, onLogout} from '/imports/shared/meteor-react-apollo-accounts/store'

// i18n
import { withSSR } from 'react-i18next'
import '/imports/shared/i18n'

// import Loader from '/imports/ui/components/Common/Loader'

import store from '/lib/store'
import Cookies from 'js-cookie'
import { detectMobile, detectTablet, detectBot } from '/lib/utils/deviceDetect'

import Bugsnag, { ErrorBoundary } from '/imports/shared/bugsnagClient'


// Disable DDP
// Meteor.disconnect()

initWithClient(client)

onLogout(() => client.resetStore())

export const renderAsync = async (props) => {
  // const path = decodeURIComponent(window.location.pathname)
  const path = window.location.pathname
  // console.log('path: ', path)

  let authContext = {
    token: null,
    currUser: null,
    currUserId: null,
    isPremium: false,
  }

  const settingsContext = {
    isMobile: detectMobile(),
    isTablet: detectTablet(),
    isBot: detectBot(),
    feedView: Cookies.get('feedView') || 'default',
    rTheme: Cookies.get('rTheme') || 'sun',
    readCookie: Cookies.get('readCookie') ? parseInt(Cookies.get('readCookie'), 10) : 0,
    readAnounce: Cookies.get('readAnounce') ? parseInt(Cookies.get('readAnounce'), 10) === 3 : 3,
    readWebPush: Cookies.get('webPushSubscribed') ? parseInt(Cookies.get('webPushSubscribed'), 10) : 0
  }
  const currDate = new Date()
  const currHour = currDate.getHours()

  try {
    if (window.__USER_STATE__) {
      const currUser = window.__USER_STATE__

      authContext = {
        ...authContext,
        token: Cookies.get('meteor_login_token'),
        currUser: currUser,
        currUserId: currUser._id,
        isPremium: currUser.roles.includes('premium')
      }
      if (!currUser.pushSubsIds) {
        if (settingsContext.readWebPush) {
          settingsContext.readWebPush = 0
        }
        Cookies.remove('webPushSubscribed')
      }
      if (store.setItem('Meteor.currUser')) {
        try {
          store.removeItem('Meteor.currUser')
        } catch (err) {
          console.log(err)
        }
      }
      const autoTheme = currUser.settings.autoTheme
      const lastTheme = Cookies.get('rThemeLast')
      if (!!autoTheme && autoTheme !== undefined) {
        if (window.matchMedia) {
          // dark mode
          if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            settingsContext.rTheme = 'moon'
            Cookies.set('rTheme', 'moon', { expires: 365 })
            // Cookies.set('rThemeLast', lastTheme, { expires: 365 })
          }
          window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            const newColorScheme = e.matches ? "dark" : "light";
            if (newColorScheme === 'dark') {
              settingsContext.rTheme = 'moon'
              Cookies.set('rTheme', 'moon', { expires: 365 })
              // Cookies.set('rThemeLast', lastTheme, { expires: 365 })
            } else {
              Cookies.set('rTheme', lastTheme, { expires: 365 })
            }
          })
        } else {
          if (currHour > 6 && currHour < 21) {
            Cookies.set('rTheme', lastTheme, { expires: 365 })
          } else {
            settingsContext.rTheme = 'moon'
            Cookies.set('rTheme', 'moon', { expires: 365 })
            Cookies.set('rThemeLast', lastTheme, { expires: 365 })
          }
        }
      }
      Bugsnag.setUser(currUser._id, '', currUser.profile.name)
    }
  } catch (err) {
    console.log(err)
  }

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

  const [
    generateRoutesProps,
    { default: MainLayout }
  ] = await Promise.all([
    import('/imports/shared/routes'),
    layoutImport
  ])

  const Routes = await generateRoutes({
    routes: generateRoutesProps.routes({ currUserId: authContext.currUserId, isMobile: settingsContext.isMobile }),
    redirects: generateRoutesProps.redirects,
    notFoundComp: generateRoutesProps.notFoundComp,
    // ...generateRoutesProps,
    pathname: path
  })

  const App = props => (
    <ErrorBoundary>
      <HelmetProvider>
        <ApolloProvider client={client}>
          <AuthProvider context={authContext}>
            <SettingsProvider context={settingsContext}>
              <BrowserRouter>
                <MainLayout
                  {...props}
                  Routes={Routes}
                />
              </BrowserRouter>
            </SettingsProvider>
          </AuthProvider>
        </ApolloProvider>
      </HelmetProvider>
    </ErrorBoundary>
    )

  const ExtendedApp = withSSR()(App);
  // hydrate(<App />, document.getElementById('react-root'))
  hydrate(<ExtendedApp initialLanguage={window.__DETECTED_LOCALE__} initialI18nStore={window.__INITIAL_I18N_STORE__} />, document.getElementById('react-root'))
}

onPageLoad(() => {
  Cookies.set('userTime', new Date())
  // const renderStart = Date.now()
  // const startupTime = renderStart - window.performance.timing.responseStart
  // console.log(`Meteor.startup took: ${startupTime}ms`)

  // Register service worker
  import('./service-worker').then(() => {})
  renderAsync()

  /* renderAsync().then(() => {
    const renderTime = Date.now() - renderStart
    // console.log(`renderAsync took: ${renderTime}ms`)
    // console.log(`Total time: ${startupTime + renderTime}ms`)
  }) */
})
