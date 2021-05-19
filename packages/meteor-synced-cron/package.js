Package.describe({
  summary: "Allows you to define and run scheduled jobs across multiple servers.",
  version: "1.5.3",
  name: "appigram:synced-cron",
  git: "https://github.com/percolatestudio/meteor-synced-cron.git"
});

Npm.depends({later: "1.2.0"});

Package.onUse(function (api) {
  api.use(['underscore', 'check', 'mongo', 'logging'], 'server');
  api.add_files(['synced-cron-server.js'], "server");
  api.export('SyncedCron', 'server');
});

Package.onTest(function (api) {
  api.use(['check', 'mongo'], 'server');
  api.use(['tinytest', 'underscore', 'logging']);
  api.add_files(['synced-cron-server.js', 'synced-cron-tests.js'], ['server']);
});
