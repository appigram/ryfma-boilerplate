import Posts from '../../../../collections/Posts'

const searchPosts = (root, args, context) => {
  const options = {}
  let fields = {}

  options.limit = args.limit || 3 // Set user limit to 3
  options.sort = {
    createdAt: -1 // Sorted by followersCount descending
  }

  if (args.keyword) {
    const regex = new RegExp(`${args.keyword}`)
    fields = {
      $or: [
        { 'title': { $regex: regex, $options: 'im' } }
      ]
    }
  }

  const posts = Posts.find(fields, options).fetch()
  return posts
}

export { searchPosts }

/* if (args.keyword) {
  const pipeline = [
    { $match: { $text: { $search: args.keyword } } },
    { $project: {
      title: 1,
      slug: 1,
      coverImg: 1,
      createdAt: 1,
      htmlBody: 1,
      userId: 1,
      excerpt: 1,
    } },
    { $limit: parseInt(args.limit || 3, 10) },
    { $sort: { score: { $meta: 'textScore' } } },
  ];

  return Posts.aggregate(pipeline);
}

return []; */
