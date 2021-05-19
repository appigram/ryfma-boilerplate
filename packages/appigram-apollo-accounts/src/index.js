import './checkNpm'
import SchemaTypes from './Auth'
import SchemaMutations from './Mutations'
import SchemaQueries from './Queries'
import Mutation from './Mutation'
import Query from './Query'
import callMethod from './callMethod'
import {loadSchema} from '@appigram/graphql-loader'

const initAccounts = function (givenOptions) {
  const defaultOptions = {
    CreateUserProfileInput: 'name: String',
    loginWithFacebook: true,
    loginWithGoogle: true,
    loginWithLinkedIn: false,
    loginWithVK: true,
    loginWithPassword: true
  }

  const options = {
    ...defaultOptions,
    // ...givenOptions
  }


  const typeDefs = [SchemaTypes(options), ...SchemaMutations(options), ...SchemaQueries(options)]
  const resolvers = {...Mutation(options), ...Query(options)}

  loadSchema({typeDefs, resolvers})
}


export {
  callMethod,
  initAccounts
}
