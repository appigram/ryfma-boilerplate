Package.describe({
  name: "appigram:accounts-oauth",
  summary: "Common code for OAuth-based login services",
  version: "1.2.0",
});

Package.onUse(api => {
  api.use('check', 'server');
  api.use('webapp', 'server');
  api.use(['appigram:accounts-base', 'ecmascript'], ['server']);
  // Export Accounts (etc) to packages using this one.
  api.imply('appigram:accounts-base', [ 'server']);
  api.use('appigram:oauth');

  api.addFiles('oauth_common.js', 'server');
  // api.addFiles('oauth_client.js', 'client');
  api.addFiles('oauth_server.js', 'server');
});


Package.onTest(api => {
  api.addFiles("oauth_tests.js", 'server');
});
