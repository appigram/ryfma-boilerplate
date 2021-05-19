Package.describe({
  name: 'appigram:graphql-compiler',
  summary: 'Write graphql in .graphql files',
  version: '0.0.5',
  git: 'https://github.com/orionsoft/graphql-compiler'
})

Package.registerBuildPlugin({
  name: 'compileGraphQL',
  use: ['caching-compiler', 'ecmascript'],
  sources: ['plugin/compile-graphql.js'],
  npmDependencies: {
    'source-map': '0.7.3'
  }
})

Package.onUse(function (api) {
  api.use('isobuild:compiler-plugin')
})

Package.onTest(function (api) {
  api.use('appigram:graphql-compiler')
})
