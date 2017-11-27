import Users from '../../../../collections/Users'

export default function (root, params, context) {
  const options = {}
  const fields = {}
  options.limit = 30 // Set users limit to 20
  options.skip = 0
  options.sort = {
    'profile.nextKarma': -1 // Sorted by nextKarma descending
  }

  if (params.sortType === 'power') {
    options.sort = {
      'profile.nextKarma': -1 // Sorted by nextKarma descending
    }
  } else if (params.sortType === 'powerChange') {
    options.sort = {
      'profile.nextKarma': -1 // Sorted by nextKarma descending
    }
  }

  if (params.userId) {
    fields.userId = params.userId
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
  options.fields = {
    _id: 1,
    roles: 1,
    username: 1,
    'profile.name': 1,
    'profile.karma': 1,
    'profile.nextKarma': 1,
    'profile.image': 1,
    'profile.invitesCount': 1,
    'stats': 1
  }

  const cursor = Users.find(fields, options)
  const pageCount = Math.ceil(cursor.count() / options.limit)
  const users = cursor.fetch()
  return {
    pageCount,
    items: users
  }
}
