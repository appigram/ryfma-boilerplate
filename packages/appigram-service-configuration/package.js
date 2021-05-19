Package.describe({
  name: "appigram:service-configuration",
  summary: "Manage the configuration for third-party services",
  version: "1.0.11"
});

Package.onUse(function(api) {
  api.use('appigram:accounts-base', ['server']);
  api.use('mongo', ['server']);
  api.export('ServiceConfiguration');
  api.addFiles('service_configuration_common.js', ['server']);
  api.addFiles('service_configuration_server.js', 'server');
});
