import { Meteor } from 'meteor/meteor'
import fetch from 'cross-fetch'
import { createHttpLink } from 'apollo-link-http'
import { createPersistedQueryLink } from 'apollo-link-persisted-queries'
import { ApolloLink } from 'apollo-link'
import { LoggingLink } from 'apollo-logger'
import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import Accounts from '/imports/shared/meteor-react-apollo-accounts'

const isDev = process.env.NODE_ENV === 'development'

const cache = new InMemoryCache()

let uriLink = 'https://ryfma.com/graphql'
if (isDev) {
  uriLink = 'http://localhost:3000/graphql'
}

const httpLink = createPersistedQueryLink({ useGETForHashedQueries: true }).concat(
  new createHttpLink({ uri: uriLink, fetch })
)

// apply widdleware to add access token to request
const middlewareLink = new ApolloLink((operation, forward) => {
  const token = Accounts.getLoginToken()
  operation.setContext({
    headers: {
      'meteor-login-token': token
    },
    // Persisted queries
    http: {
      includeExtensions: true,
      includeQuery: false
    }
  })
  return forward(operation)
})

const link = middlewareLink.concat(httpLink)
const loggerLink = isDev ? [new LoggingLink({ logger: console.log })] : []

export const client = new ApolloClient({
  link: ApolloLink.from((loggerLink).concat([link])),
  cache: cache.restore(window.__APOLLO_STATE__ || {})
})
