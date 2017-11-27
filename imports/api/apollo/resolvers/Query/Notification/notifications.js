import { Meteor } from 'meteor/meteor'
import Notifications from '../../../../collections/Notifications'

export default function (root, params, context) {
  const options = {}
  const fields = {}
  options.limit = 100 // Set post limit to 20
  options.sort = {
    createdAt: -1 // Sorted by postedAt descending
  }

  if (context.userId) {
    fields.userId = context.userId

    Meteor.users.update({ _id: context.userId }, { $set: { 'profile.unreadNotifications': false } })
    return Notifications.find(fields, options).fetch()
  }

  return []
}
