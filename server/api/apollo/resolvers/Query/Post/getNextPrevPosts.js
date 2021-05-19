import dbCache from '/server/config/redis'
import Posts from '../../../../collections/Posts'

export default async function (root, params, context, { cacheControl }) {
  const getNextPrevPosts = await dbCache.get('post_next_prev_' + params.postId)
  if (getNextPrevPosts) {
    return getNextPrevPosts
  } else {
    const options = {}
    let getNextPrevPosts = []
    options.limit = 1 // Set post limit to 1

    // Query optimization
    options.fields = {
      _id: 1,
      createdAt: 1,
      postedAt: 1,
      title: 1,
      excerpt: 1,
      slug: 1,
      coverImg: 1,
      userId: 1,
    }

    const currPost = Posts.find({ _id: params.postId }, options).fetch()[0]

    // Find next post
    options.sort = {
      createdAt: 1
    }
    const nextPost = Posts.find({ createdAt: { $gt: currPost.createdAt }, userId: currPost.userId, status: 2 }, options).fetch()

    if (nextPost.length > 0) {
      getNextPrevPosts = [
        ...nextPost
      ]
    } else {
      options.limit = 2 // Set post limit to 2
    }

    // Find prev post
    options.sort = {
      createdAt: -1
    }
    const prevPost = Posts.find({ createdAt: { $lt: currPost.createdAt }, userId: currPost.userId, status: 2 }, options).fetch()
    // console.log('prevPost: ', prevPost)
    if (prevPost.length > 0) {
      getNextPrevPosts = [
        ...getNextPrevPosts,
        ...prevPost
      ]
    }

    if (getNextPrevPosts.length > 0) {
      dbCache.set('post_next_prev_' + params.postId, getNextPrevPosts)
    } else {
      // Exclude current post
      const fields = {
        status: 2,
        userId: currPost.userId
      }

      // Query optimization
      options.fields = {
        _id: 1,
        createdAt: 1,
        postedAt: 1,
        title: 1,
        slug: 1,
        coverImg: 1,
        userId: 1,
        tags: 1,
        excerpt: 1
      }

      const pipeline = [
        { $match: fields },
        { $sort: options.sort },
        { $limit: 50 },
        { $match: { _id: { $ne: params.postId } } },
        { $sample: { size: 2 } },
        {
          $project: {
            _id: 1,
            createdAt: 1,
            postedAt: 1,
            title: 1,
            slug: 1,
            coverImg: 1,
            userId: 1,
            tags: 1,
            excerpt: 1
          }
        }
      ]

      getNextPrevPosts = Posts.aggregate(pipeline)
      dbCache.set('post_next_prev_' + params.postId, getNextPrevPosts)
    }

    return getNextPrevPosts
  }
}
