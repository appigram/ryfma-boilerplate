

import bugsnag from 'bugsnag'

Meteor.startup(function () {
  bugsnag.register('')
})
