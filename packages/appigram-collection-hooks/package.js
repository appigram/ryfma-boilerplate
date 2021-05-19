/* global Package */

Package.describe({
  name: 'appigram:collection-hooks',
  summary: 'Extends Mongo.Collection with before/after hooks for insert/update/remove/find/findOne',
  version: '1.0.1',
  git: 'https://github.com/Meteor-Community-Packages/meteor-collection-hooks'
})

Package.onUse(function (api, where) {
  // api.setSideEffects(false);

  api.use([
    'mongo',
    'tracker',
    'ejson',
    'minimongo',
    'ecmascript'
  ], 'server')

  api.use(['appigram:accounts-base'], ['server'], { weak: true })

  // api.mainModule('client.js', 'client')
  api.mainModule('server.js', 'server')

  api.export('CollectionHooks')
})

Package.onTest(function (api) {
  // var isTravisCI = process && process.env && process.env.TRAVIS

  api.use([
    'appigram:collection-hooks',
    'appigram:accounts-base',
    'appigram:accounts-password',
    'mongo',
    'tinytest',
    'test-helpers',
    'ecmascript'
  ])

  // api.mainModule('tests/client/main.js', 'client')
  api.mainModule('tests/server/main.js', 'server')
})
