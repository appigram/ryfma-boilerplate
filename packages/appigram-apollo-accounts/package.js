/* global Package */

Package.describe({
  name: 'appigram:apollo-accounts',
  version: '3.2.12',
  // Brief, one-line summary of the package.
  summary: 'Meteor accounts in GraphQL',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/appigram/meteor-apollo-accounts',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
})

Package.onUse(function (api) {
  api.use([
    'tmeasday:check-npm-versions@1.0.0',
    'check',
    'appigram:accounts-base',
    'appigram:oauth2',
    'npm-bcrypt',
    'random',
    'ecmascript',
    'http',
    'random',
    'appigram:oauth',
    'appigram:service-configuration',
    'appigram:accounts-oauth'
  ], 'server')

  api.mainModule('src/index.js', 'server')
})

Package.onTest(function (api) {
  api.use('ecmascript')
  api.use('tinytest')
  api.use('appigram:apollo-accounts')
})
