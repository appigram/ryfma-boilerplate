import { WebApp } from 'meteor/webapp'
import { Meteor } from 'meteor/meteor'

import { ApolloServer } from 'apollo-server-fastify'

import Users from '../collections/Users'
import Pushes from '../collections/Pushes'

import schema from '../schema'
import getContext from '../getContext'

import { processNotifications } from '../../payments/paymentApi'

// import cors from 'cors'
// import compression from 'compression'
const fastify = require('fastify')({
  // disableRequestLogging: true,
  // ignoreTrailingSlash: true,
  // http2: true
})

const bodyParser = require('body-parser')

const isDev = process.env.NODE_ENV === 'development'

const Ddos = require('ddos')
const ddos = new Ddos({ burst: 20, limit: 25 })

const server = new ApolloServer({
  schema: schema,
  // typeDefs,
  // resolvers,
  context: ({req, res}) => {
    // console.log('req.headers: ', req.headers)
    const token = req.headers['meteor-login-token'] || req.headers['meteor_login_token']
    return getContext(token, req.headers)
  },
  // introspection: true,
  tracing: false, // !isDev,
  // cache: false, // !isDev,
  // Set a max age of 30 seconds for the whole schema
  /* cacheControl: {
    defaultMaxAge: 30,
    stripFormattedExtensions: false,
    calculateCacheControlHeaders: false
  }, */
  // We set `engine` to false, so that the new agent is not used.
  engine: false // !isDev ? { apiKey: Config.APOLLO_KEY } : false
})

// Save subscription to User info
const saveWebPushSubscription = Meteor.bindEnvironment((args) => {
  let pushId = null
  try {
    pushId = Pushes.insert({
      createdAt: new Date(),
      userId: args._id,
      type: args.type,
      guid: args._id + '_' + args.guid,
      ...args.subscription
    })
    Users.update(
      { _id: args._id },
      {
        $set: { 'disablePush': false },
        $addToSet: { 'pushSubsIds': pushId }
      }
    )
  } catch (err) {
    // console.log(err)
  }
})

// export const app = fastify({disableRequestLogging: true})
// const app = require('fastify')({})

// fastify.use(bodyParser.json({ limit: '16mb' }))
// fastify.use(ddos.fastify)

fastify.post('/api/push/subscribe', (req, reply) => {
  const body = req.body
  // console.log('body WEBPUSH: ', body)
  saveWebPushSubscription(body)
  reply
  .code(201)
  .header('Content-Type', 'application/json; charset=utf-8')
  .send({})
})

fastify.post('/api/payments', processNotifications)

fastify.get('/api', (req, reply) => {
  reply.code(200).send()
})


/* fastify.use((req, res, next) => {
  if (req.url.indexOf('%2F') > -1) {
    res.status(400)
    // console.log('Set status code 400')
    res.send('Bad request')
    // res.end()
  } else {
    next()
  }
}) */

fastify.register(server.createHandler())

/* fastify.listen(3000).then(({ url }) => {
  console.log(`🚀Server ready at ${url}`)
  WebApp.connectHandlers.use(fastify)
})
.catch((error) => console.log('apollo [error]>', error))
.finally(() => server.stop()) */

const start = async () => {
  try {
    const url = await fastify.listen(3000)
    console.log(`🚀Server ready at ${url}`)
    // WebApp.connectHandlers.use(fastify)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  } finally {
    server.stop()
  }
}

start()
