import { Meteor } from 'meteor/meteor'
import Users from '../../../../collections/Users'

export default function (root, params, context) {
  if ((context.userId === 'Qjv82jcpeJwpz6e47' && process.env.NODE_ENV === 'production') ||
    (context.userId === 'v6XGehkrZuPSQjofu' && process.env.NODE_ENV !== 'production')
  ) {
    const stat = {}
    const fields = {}

    const today = new Date()
    const todayAgoDate = new Date()
    const weekAgoDate = new Date()
    const monthAgoDate = new Date()
    const yearAgoDate = new Date()
    todayAgoDate.setUTCDate(todayAgoDate.getDate() - 7)
    weekAgoDate.setUTCDate(weekAgoDate.getDate() - 7)
    monthAgoDate.setUTCDate(monthAgoDate.getDate() - 30)
    yearAgoDate.setUTCDate(yearAgoDate.getDate() - 365)

    stat.total = Users.find().count()
    // Today registered
    fields.createdAt = {
      $gte: todayAgoDate,
      $lte: today
    }
    stat.today = Users.find(fields).count()

    // Registered last week
    fields.createdAt = {
      $gte: weekAgoDate,
      $lte: today
    }
    stat.week = Users.find(fields).count()

    // Registered last month
    fields.createdAt = {
      $gte: monthAgoDate,
      $lte: today
    }
    stat.month = Users.find(fields).count()

    // Registered last year
    fields.createdAt = {
      $gte: yearAgoDate,
      $lte: today
    }
    stat.year = Users.find(fields).count()

    return stat
  }

  throw new Meteor.Error('Admin required', 'Insufficient rights for this action.')
}
