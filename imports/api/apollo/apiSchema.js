import { makeExecutableSchema } from 'graphql-tools'
import { loadSchema, getSchema } from 'graphql-loader'
import { initAccounts } from 'meteor/appigram:apollo-accounts'
import typeDefs from './schema'
import resolvers from './resolvers'

// Load all accounts related resolvers and type definitions into graphql-loader
initAccounts({
  loginWithFacebook: true,
  loginWithGoogle: true,
  loginWithTwitter: true,
  loginWithVK: true,
  loginWithPassword: true
})

// Load all your resolvers and type definitions into graphql-loader
loadSchema({ typeDefs, resolvers })

// Gets all the resolvers and type definitions loaded in graphql-loader
const schema = makeExecutableSchema(getSchema())

export default schema
