import dbCache from '/server/config/redis'
import Posts from '../../../../collections/Posts'
// import FestPosts from '../../../../collections/FestPosts'

const topPosts = async (root, params, context, { cacheControl }) => {
  const topPosts = await dbCache.get('topPosts')
  if (topPosts) {
    return topPosts
  } else {
    const fields = {}
    fields.isEditorsPick = true
    fields.coverImg = { $exists: true }

    const options = {}
    options.limit = 15 // Set post limit to 7
    options.sort = {
      likeCount: -1 // Sorted by likeCount descending
    }

    const posts = Posts.aggregate([
      { $match: fields }, // filter the results
      { $sample: { size: options.limit } } // To get Limit docs
    ])
    /* const festPosts = FestPosts.aggregate([
      { $match: { festId: { $in: ['ivSPWb8M2FBLLoYiB', 'NEhPkSZfnPfH7ykYk'] } } }, // filter the results
      { $sort: { juryCount: -1 } },
      { $limit: 100 },
      { $sample: { size: 15 } } // To get Limit docs
    ])
    const postIds = festPosts.map(festpost => festpost.postId)
    const posts = Posts.find({ _id: { $in: postIds }, coverImg: { $ne: null } }, options).fetch() */

    /* const weekAgoDate = new Date()
    const beforeDate = new Date()
    beforeDate.setUTCDate(beforeDate.getDate())
    weekAgoDate.setUTCDate(weekAgoDate.getDate() - 5)
    const fields = {
      createdAt: {
        $lte: beforeDate,
        $gte: weekAgoDate
      },
      coverImg: { $exists: true } // With images only
    }

    // Query optimization
    options.fields = {
      createdAt: 1,
      postedAt: 1,
      title: 1,
      slug: 1,
      coverImg: 1,
      userId: 1,
      excerpt: 1
    }

    const pipeline = [
      { $match: fields },
      { $group: {
        _id: '$userId',
        originalId: { $first: '$_id' }, // Hold onto original ID.
        userId: { $first: '$userId' },
        title: { $first: '$title' },
        createdAt: { $first: '$createdAt' },
        postedAt: { $first: '$postedAt' },
        slug: { $first: '$slug' },
        excerpt: { $first: '$excerpt' },
        coverImg: { $first: '$coverImg' },
        likeCount: { $first: '$likeCount' }
      }
      },
      { $project: {
        _id: '$originalId',
        createdAt: 1,
        postedAt: 1,
        title: 1,
        slug: 1,
        excerpt: 1,
        coverImg: 1,
        userId: 1,
        likeCount: 1
      } },
      { $sort: options.sort },
      { $limit: 5 }
    ]

    let posts = Posts.aggregate(pipeline)

    const userIds = posts.map(item => item.userId)

    if (posts.length < options.limit) {
      delete fields.coverImg
      fields.userId = {
        $nin: userIds
      }
      options.limit = options.limit - posts.length
      posts = posts.concat(Posts.find(fields, options).fetch())
    } */
    if (posts) {
      dbCache.set('topPosts', posts)
    }
    return posts
  }
}

export default topPosts
