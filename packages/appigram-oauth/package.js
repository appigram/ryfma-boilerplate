Package.describe({
  name: "appigram:oauth",
  summary: "Common code for OAuth-based services",
  version: "2.0.0"
});

Package.onUse(api => {
  api.use('check', 'server');

  api.use(['ecmascript', 'localstorage', 'url']);

  api.use(['routepolicy', 'webapp', 'mongo', 'appigram:service-configuration', 'logging'], 'server');

  // api.use(['reload', 'base64'], 'client');

  api.use('oauth-encryption', 'server', { weak: true });

  api.export('OAuth');
  api.export('OAuthTest', 'server', { testOnly: true });

  // api.addFiles('oauth_client.js', 'web');
  // api.addFiles('oauth_browser.js', 'web.browser');
  // api.addFiles('oauth_cordova.js', 'web.cordova');
  api.addFiles('oauth_server.js', 'server');
  api.addFiles('pending_credentials.js', 'server');

  api.addAssets([
    'end_of_popup_response.html',
    'end_of_redirect_response.html'
  ], 'server');

  /* api.addAssets([
    'end_of_popup_response.js',
    'end_of_redirect_response.js'
  ], 'client'); */

  api.addFiles('oauth_common.js', 'server');

  // XXX COMPAT WITH 0.8.0
  api.export('Oauth');
  api.addFiles('deprecated.js', ['server']);
});

Npm.depends({
  'body-parser': '1.19.0',
});

Package.onTest(api => {
  api.use('tinytest');
  api.use('random');
  api.use('appigram:service-configuration', 'server');
  api.use('appigram:oauth', 'server');
  api.addFiles("oauth_tests.js", 'server');
});

Cordova.depends({
  'cordova-plugin-inappbrowser': '3.2.0'
});
