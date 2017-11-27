import Users from '../../../../collections/Users'

const searchUsers = (root, args, context) => {
  const options = {}
  let fields = {}

  options.limit = args.limit || 3 // Set user limit to 3
  options.sort = {
    'profile.karma': -1 // Sorted by followersCount descending
  }

  if (args.keyword) {
    const regex = new RegExp(`${args.keyword}`)
    fields = {
      $or: [
        { 'username': { $regex: regex, $options: 'im' } },
        { 'profile.name': { $regex: regex, $options: 'im' } }
      ]
    }
  }

  const users = Users.find(fields, options).fetch()
  return users
}

export { searchUsers }
/*
if (args.keyword) {
  const pipeline = [
    { $match: { $text: { $search: args.keyword } } },
    { $project: {
      username: 1,
      'profile.name': 1,
      'profile.image': 1,
      'profile.bio': 1,
      roles: 1,
    } },
    { $limit: parseInt(args.limit || 3, 10) },
    { $sort: { score: { $meta: 'textScore' } } },
  ];

  return Users.aggregate(pipeline);
}

return [];
*/
