import express from 'express'

import { WebApp } from 'meteor/webapp'
import { Meteor } from 'meteor/meteor'

import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginInlineTraceDisabled } from 'apollo-server-core';

// import Bugsnag from '@bugsnag/js'
// import BugsnagPluginExpress from '@bugsnag/plugin-express'

import Users from '../collections/Users'
import Pushes from '../collections/Pushes'

import schema from '../schema'
import getContext from '../getContext'

import { processNotifications } from '../../payments/paymentApi'

const bodyParser = require('body-parser')
// const Ddos = require('ddos')

// const isDev = process.env.NODE_ENV === 'development'
// const ddos = new Ddos({ burst: 20, limit: 25 })

/* Bugsnag.start({
  apiKey: '063001bb669ad47ed754600f60b1ccf9',
  plugins: [BugsnagPluginExpress]
}) */

const server = new ApolloServer({
  schema: schema,
  // typeDefs,
  // resolvers,
  context: async ({req, res}) => {
    // console.log('req.headers: ', req.headers)
    const token = req.headers['meteor-login-token'] || req.headers['meteor_login_token']
    return await getContext(token, req.headers)
  },
  introspection: false,
  tracing: false, // !isDev,
  // cache: false, // !isDev,
  // Set a max age of 30 seconds for the whole schema
  /* cacheControl: {
    defaultMaxAge: 30,
    stripFormattedExtensions: false,
    calculateCacheControlHeaders: false
  }, */
  plugins: [ApolloServerPluginInlineTraceDisabled()]
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

const app = express()

// const middleware = Bugsnag.getPlugin('express')

// This must be the first piece of middleware in the stack.
// It can only capture errors in downstream middleware
// app.use(middleware.requestHandler)

app.use(bodyParser.json({ limit: '16mb' }))

/* if (process.env.NODE_ENV === 'production') {
  app.use(ddos.express)
} */

app.post('/api/push/subscribe', (req, res) => {
  const body = req.body
  // console.log('body WEBPUSH: ', body)
  saveWebPushSubscription(body)
  res.status(201).json({})
})

app.post('/api/payments', processNotifications)

app.get('/api', (req, reply) => {
  reply.code(200).send()
})

/* app.use((req, res, next) => {
  if (req.url.indexOf('%2F') > -1) {
    res.status(400)
    // console.log('Set status code 400')
    res.send('Bad request')
    // res.end()
  } else {
    next()
  }
}) */

// app.use(middleware.errorHandler)

server.applyMiddleware({ app, path: '/graphql' })

WebApp.connectHandlers.use(app)
