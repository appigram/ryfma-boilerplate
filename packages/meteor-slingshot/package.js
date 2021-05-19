Package.describe({
  name: "edgee:slingshot",
  summary: "Directly post files to cloud storage services, such as AWS-S3.",
  version: "0.7.5",
  git: "https://github.com/CulturalMe/meteor-slingshot"
});

Npm.depends({
  'connect-route-ext': "1.0.6"
});

Package.onUse(function (api) {
  // api.setSideEffects(false);

  api.use(["check", "ecmascript"]);
  api.use(["underscore"], "server");
  // api.use(["tracker", "reactive-var"], "client");

  api.add_files([
    "lib/restrictions.js",
    "lib/validators.js"
  ]);

  api.add_files("lib/upload.js", "client");

  api.add_files([
    "lib/directive.js",
    "lib/storage-policy.js",
    "services/aws-s3.js",
    "services/google-cloud.js",
    "services/rackspace.js"
  ], "server");

  api.export("Slingshot");
});
