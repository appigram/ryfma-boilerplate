import Posts from '../../../../collections/Posts'

export default function (root, params, context) {
  const options = {}
  let relatedPosts = []
  options.limit = 3 // Set book limit to 5
  options.sort = {
    createdAt: -1 // Sorted by createdAt descending
  }

  // Exclude current post
  const fields = {
    _id: { $ne: params.postId },
    coverImg: { $exists: true }// With images only
  }

  // const today = new Date();
  // const monthAgoDate = new Date();
  // monthAgoDate.setUTCDate(monthAgoDate.getDate() - 30);

  /* fields.createdAt = {
    $gte: monthAgoDate,
    $lte: today,
  }; */

  if (params.tags) {
    if (params.tags.length > 0) {
      fields.tags = { $in: params.tags }
    }
  }

  // Query optimization
  options.fields = {
    _id: 1,
    title: 1,
    slug: 1,
    coverImg: 1,
    userId: 1
  }

  const pipeline = [
    { $match: fields },
    { $group: {
      _id: '$username',
      originalId: { $first: '$_id' }, // Hold onto original ID.
      userId: { $first: '$userId' },
      title: { $first: '$title' },
      slug: { $first: '$slug' },
      coverImg: { $first: '$coverImg' }
    }
    },
    { $project: {
      _id: '$originalId',
      title: 1,
      slug: 1,
      coverImg: 1,
      userId: 1
    } },
    { $limit: 3 },
    { $sort: options.sort }
  ]

  const relatedPostsByTags = Posts.aggregate(pipeline)

  const userIds = relatedPostsByTags.map(item => item.userId)

  if (relatedPostsByTags.length < 3) {
    options.limit = 3 - relatedPostsByTags.length
    delete fields.tags
    fields.userId = {
      $nin: userIds
    }
    return relatedPostsByTags.concat(Posts.find(fields, options).fetch())
  } else {
    relatedPosts = relatedPostsByTags
  }
  return relatedPosts
}
