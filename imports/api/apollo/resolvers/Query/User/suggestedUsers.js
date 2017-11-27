import Users from '../../../../collections/Users'

export default function (root, params, context) {
  const options = {}
  options.limit = 3 // Set book limit to 5
  options.sort = {
    createdAt: -1 // Sorted by createdAt descending
  }

  // Exclude current post
  const fields = {
    _id: { $ne: params.userId },
    coverImg: { $exists: true } // With images only
  }

  // Query optimization
  options.fields = {
    _id: 1,
    username: 1,
    'profile.name': 1,
    'profile.image': 1
  }

  const pipeline = [
    { $match: fields },
    { $group: {
      _id: '$username',
      originalId: { $first: '$_id' }, // Hold onto original ID.
      username: { $first: '$username' },
      'profile.name': { $first: '$profile.name' },
      'profile.image': { $first: '$profile.image' }
    }
    },
    { $project: {
      _id: '$originalId',
      username: 1,
      'profile.name': 1,
      'profile.image': 1
    } },
    { $limit: 3 },
    { $sort: options.sort }
  ]

  return Users.aggregate(pipeline)
}
