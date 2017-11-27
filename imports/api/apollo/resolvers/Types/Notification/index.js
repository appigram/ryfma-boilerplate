import { Meteor } from 'meteor/meteor'

export default {
  Notification: {
    author ({ currId }, _, context) {
      return Meteor.users.findOne(currId)
    }
  }
}
