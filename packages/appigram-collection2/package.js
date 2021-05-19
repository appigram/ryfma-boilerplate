/* global Package */

Package.describe({
  name: "appigram:collection2",
  summary: "Automatic validation of Meteor Mongo insert and update operations on the client and server",
  version: "3.0.6",
  git: "https://github.com/aldeed/meteor-collection2.git"
});

Npm.depends({
  clone: '2.1.2',
  'lodash.isempty': '4.4.0',
  'lodash.isequal': '4.5.0',
  'lodash.isobject': '3.0.2',
});

Package.onUse(function(api) {
  api.use('mongo', 'server');
  api.imply('mongo');
  api.use('ejson@1.1.1');
  api.use('raix:eventemitter@0.1.3 || 1.0.0', 'server');
  api.use('ecmascript@0.14.3');
  api.use('tmeasday:check-npm-versions@1.0.0', 'server');

  // Allow us to detect 'insecure'.
  api.use('insecure@1.0.7', {weak: true});

  api.mainModule('collection2.js', ['server']);

  api.export('Collection2', ['server']);
});
