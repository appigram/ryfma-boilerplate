import { loadSchema, getSchema } from '@appigram/graphql-loader'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { initAccounts } from 'meteor/appigram:apollo-accounts'

import typeDefs from './apollo/schema'
import resolvers from './apollo/resolvers'

initAccounts()

loadSchema({ typeDefs, resolvers })

const loadedSchema = getSchema()

// Gets all the resolvers and type definitions
const schema = makeExecutableSchema(loadedSchema)

export default schema
