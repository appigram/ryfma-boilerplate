import Posts from '../../../../collections/Posts'

export default function (root, params, context) {
  const options = {}
  options.limit = 7 // Set post limit to 7
  options.sort = {
    viewCount: -1 // Sorted by viewCount descending
  }
  const weekAgoDate = new Date()
  const beforeDate = new Date()
  beforeDate.setUTCDate(beforeDate.getDate())
  weekAgoDate.setUTCDate(weekAgoDate.getDate() - 21)
  const fields = {
    createdAt: {
      $lte: beforeDate,
      $gte: weekAgoDate
    },
    coverImg: { $exists: true } // With images only
  }

  // Query optimization
  options.fields = {
    title: 1,
    slug: 1,
    coverImg: 1,
    userId: 1
  }

  const pipeline = [
    { $match: fields },
    { $group: {
      _id: '$userId',
      originalId: { $first: '$_id' }, // Hold onto original ID.
      userId: { $first: '$userId' },
      title: { $first: '$title' },
      slug: { $first: '$slug' },
      coverImg: { $first: '$coverImg' },
      viewCount: { $first: '$viewCount' }
    }
    },
    { $project: {
      _id: '$originalId',
      title: 1,
      slug: 1,
      coverImg: 1,
      userId: 1,
      viewCount: 1
    } },
    { $limit: 7 },
    { $sort: options.sort }
  ]

  const posts = Posts.aggregate(pipeline)

  const userIds = posts.map(item => item.userId)

  if (posts.length < options.limit) {
    delete fields.coverImg
    fields.userId = {
      $nin: userIds
    }
    options.limit = options.limit - posts.length
    return posts.concat(Posts.find(fields, options).fetch())
  }
  return posts
}
