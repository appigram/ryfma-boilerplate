Package.describe({
  summary: 'Minifier for Meteor with PostCSS processing - use Autoprefixer and others with ease',
  version: '3.0.0',
  name: 'appigram:postcss',
  git: 'https://github.com/appigram/meteor-postcss.git'
});

Package.registerBuildPlugin({
  name: 'minifier-postcss',
  use: [
    'ecmascript',
    'minifier-css',
    'tmeasday:check-npm-versions'
  ],
  npmDependencies: {
    'source-map': '0.8.0-beta.0',
    'app-module-path': '2.2.0'
  },
  sources: [
    'plugin/minify-css.js'
  ]
});

Package.onUse(function (api) {
  api.use('isobuild:minifier-plugin');
});

Package.onTest(function (api) {

});
