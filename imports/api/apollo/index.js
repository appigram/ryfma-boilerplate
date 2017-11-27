import { createApolloServer } from 'meteor/apollo'
// import OpticsAgent from 'optics-agent'
import bodyParser from 'body-parser'
import cors from 'cors'
import schema from './apiSchema'

// OpticsAgent.instrumentSchema(schema)

createApolloServer(req => ({
  schema: schema,
  context: {
    // opticsContext: OpticsAgent.context(req)
  }
}), {
  graphiql: true,
  configServer: (graphQLServer) => {
    graphQLServer.use(cors())
    graphQLServer.use(bodyParser.json({ limit: '16mb' }))
    graphQLServer.use(bodyParser.urlencoded({ extended: false }))
    // graphQLServer.use('/graphql', OpticsAgent.middleware())
  }
})
