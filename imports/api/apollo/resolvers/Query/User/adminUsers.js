import { Meteor } from 'meteor/meteor'
import Users from '../../../../collections/Users'

export default function (root, params, context) {
  if ((context.userId === 'Qjv82jcpeJwpz6e47' && process.env.NODE_ENV === 'production') ||
    (context.userId === 'v6XGehkrZuPSQjofu' && process.env.NODE_ENV !== 'production')
  ) {
    const options = {}
    const fields = {}
    options.limit = 20 // Set post limit to 20
    options.skip = 0
    options.sort = {
      createdAt: -1 // Sorted by postedAt descending
    }

    if (params.skip) {
      if (params.skip < 0) {
        options.skip = 0
      } else {
        options.skip = params.skip
      }
    }

    if (params.limit) {
      if (params.limit > 100) {
        options.limit = 100
      } else if (params.limit < 0) {
        options.limit = 10
      } else {
        options.limit = params.limit
      }
    }

    // Query optimization
    /* options.fields = {
      _id: 1,
      createdAt: 1,
      username: 1,
      email: 1,
      'emails.verified': 1,
      'profile.name': 1,
      'profile.karma': 1,
      'profile.image': 1,
      'stats.postsCount': 1,
      'stats.followingCount': 1,
      'stats.followersCount': 1,
    }; */

    const cursor = Users.find(fields, options)
    const pageCount = Math.ceil(cursor.count() / options.limit)
    const users = cursor.fetch()
    return {
      pageCount,
      items: users
    }
  }

  throw new Meteor.Error('Admin required', 'Insufficient rights for this action.')
}
