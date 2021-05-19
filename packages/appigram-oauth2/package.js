Package.describe({
  name: "appigram:oauth2",
  summary: "Common code for OAuth2-based login services",
  version: "1.3.0",
});

Package.onUse(api => {
  api.use([
    'random'
  ], 'server');

  api.use([
    'appigram:oauth',
    'appigram:service-configuration',
    'ecmascript',
  ], ['server']);

  api.addFiles('oauth2_server.js', 'server');
});

Package.onTest(function (api) {
  api.use([
    'tinytest',
    'random',
    'appigram:oauth2',
    'appigram:oauth',
    'appigram:service-configuration',
    'oauth-encryption',
    'ecmascript',
  ], 'server');

  api.addFiles("oauth2_tests.js", 'server');
});
