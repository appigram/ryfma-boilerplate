Package.describe({
  name: "boilerplate-generator",
  summary: "Generates the boilerplate html from program's manifest",
  version: '1.7.2'
});

Npm.depends({
  "combined-stream2": "1.1.2"
});

Package.onUse(api => {
  api.use('ecmascript');
  api.use('underscore', 'server');
  api.mainModule('generator.js', 'server');
  api.export('Boilerplate', 'server');
});
