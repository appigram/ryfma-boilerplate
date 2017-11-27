import React from 'react'
import { hydrate } from 'react-dom'

// Components
import { onPageLoad } from 'meteor/server-render'

// packages
import { BrowserRouter } from 'react-router-dom'
import { generateRoutes } from 'react-code-split-ssr'

import generateRoutesProps from '/imports/both/routes'

// pages & containers
import MainLayout from '/imports/ui/layouts/MainLayout'
import { authenticated } from '/imports/ui/containers/authenticated'

// Apollo
import ApolloClient from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { meteorClientConfig, createMeteorNetworkInterface } from 'meteor/apollo'

// i18n
import { I18nextProvider } from 'react-i18next'
import i18n from '/imports/both/i18n'

import { CookiesProvider } from 'react-cookie'

const networkInterface = createMeteorNetworkInterface()
const client = new ApolloClient(meteorClientConfig({
  networkInterface,
  initialState: { apollo: window.__APOLLO_STATE__ }
}))

onPageLoad(async sink => {
  const Routes = await generateRoutes({
    ...generateRoutesProps,
    pathname: window.location.pathname
  })
  const clientApp = props => (<I18nextProvider
    i18n={props.i18n || i18n}
    initialI18nStore={window.__INITIAL_I18N_STORE__}
    >
    <ApolloProvider client={client}>
      <CookiesProvider>
        <BrowserRouter>
          <MainLayout {...props}>
            <Routes />
          </MainLayout>
        </BrowserRouter>
      </CookiesProvider>
    </ApolloProvider>
  </I18nextProvider>
  )

  const App = authenticated(clientApp)

  /* if ('serviceWorker' in navigator) {
    // Unregister
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for (const registration of registrations) {
        registration.unregister();
      }
    })
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        // Successful registration
        console.log('Hooray. Registration successful, scope is:', registration.scope);
      })
      .catch(err => console.log('ServiceWorker registration failed: ', err));
  } */

  hydrate(
    <App />,
    document.getElementById('react-root')
  )
})

// Check localStorage availability (iOS private mode doesn't support it so needs to checked)
if (typeof window !== 'undefined') {
  try {
    const testKey = '___test'
    window.localStorage.setItem(testKey, '1')
    window.localStorage.removeItem(testKey)
    window.localStorageExt = window.localStorage
  } catch (e) {
    window.localStorageExt = {
      store: {},
      setItem: function (k, v) {
        this.store[k] = v
      },
      getItem: function (k) {
        if (k in this.store) {
          return this.store[k]
        }
        return undefined
      },
      removeItem: function (k) {
        if (k in this.store) {
          delete this.store[k]
        }
      },
      clear: function () {
        this.store = {}
      }
    }
  }
}
