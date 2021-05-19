// import { LoggingLink } from 'apollo-logger'
import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client'

import { SchemaLink } from '@apollo/client/link/schema'
import schema from '../api/schema'
import getContext from '../api/getContext'

const createApolloClient = async (token, headers) => {
  // const isDev = process.env.NODE_ENV === 'development'
  // const serverPort = process.env.PORT || 3000

  /* const httpLink = createPersistedQueryLink().concat(
    new createHttpLink({
      uri: `http://localhost:${serverPort}/graphql`,
      credentials: 'same-origin',
      fetch
    })
  ) */

  const schemaLink = new SchemaLink({
    schema,
    context: async () => await getContext(token, headers)
  })

  // apply widdleware to add access token to request
  let middlewareLink = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: {
        'meteor-login-token': token || null
      },
      /* http: {
        includeExtensions: true,
        includeQuery: false
      } */
    })
    return forward(operation)
  })

  const link = middlewareLink.concat(schemaLink)

  // const loggerLink = isDev ? [new LoggingLink({ logger: console.log })] : []

  return new ApolloClient({
    ssrMode: true,
    ssrForceFetchDelay: 200,
    link, // : ApolloLink.from((loggerLink).concat([link])),
    cache: new InMemoryCache({
      typePolicies: {
        User: {
          fields: {
            settings: {
              merge(existing, incoming) {
                return { ...existing, ...incoming }
              },
            },
            stats: {
              merge(existing, incoming) {
                return { ...existing, ...incoming }
              },
            },
            profile: {
              merge(existing, incoming) {
                return { ...existing, ...incoming }
              },
            },
          },
        },
      },
    })
  })
}

export default createApolloClient
