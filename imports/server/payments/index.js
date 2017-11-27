import { Meteor } from 'meteor/meteor'
import { setupPaymentApi } from './paymentApi' // import our API

Meteor.startup(() => {
  setupPaymentApi() // instantiate our new Express app
})
