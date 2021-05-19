Package.describe({
  name: 'appigram:schema-index',
  summary: 'Control some MongoDB indexing with schema options',
  version: '3.0.1',
  documentation: 'README.md',
  git: 'https://github.com/aldeed/meteor-schema-index.git'
})

Package.onUse(function (api) {
  api.use([
    'appigram:collection2',
    'ecmascript'
  ], 'server')

  // api.mainModule('client.js', 'client');
  api.mainModule('server.js', 'server')
})
