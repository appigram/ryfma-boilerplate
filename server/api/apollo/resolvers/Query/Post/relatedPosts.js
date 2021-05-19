import dbCache from '/server/config/redis'
import Posts from '../../../../collections/Posts'

export default async function (root, params, context, { cacheControl }) {
  const relatedPosts = await dbCache.get('post_related_' + params.postId)
  if (relatedPosts) {
    return relatedPosts
  } else {
    const options = {}
    let relatedPosts = []
    options.limit = 11 // Set book limit to 18
    options.sort = {
      commentsCount: -1 // Sorted by createdAt descending
    }

    // Exclude current post
    const fields = {
      status: 2,
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
        fields.tags = { $in: params.tags.slice(0, 3) }
      }
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
      { $limit: 100 },
      { $match: { _id: { $ne: params.postId } } },
      { $sample: { size: 5 } },
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

    const relatedPostsByTags = Posts.aggregate(pipeline)
    // console.log("relatedPostsByTags: ", relatedPostsByTags)

    if (relatedPostsByTags) {
      const userIds = relatedPostsByTags.map(item => item.userId)

      if (relatedPostsByTags.length < options.limit) {
        options.sort = {
          likeCount: -1 // Sorted by createdAt descending
        }

        delete fields.tags
        if (userIds.length > 0) {
          fields.userId = {
            $nin: userIds
          }
        }

        const extraPostsLimit = options.limit - relatedPostsByTags.length
        const pipeline2 = [
          { $match: fields },
          { $sort: options.sort },
          { $limit: 100 },
          { $sample: { size: extraPostsLimit } },
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

        const extraPosts = Posts.aggregate(pipeline2)
        // const extraPosts = Posts.find(fields, options).fetch()
        moreRelatedPosts = relatedPostsByTags.concat(extraPosts)

        const editorsPostsLimit = options.limit - relatedPostsByTags.length - extraPosts.length
        delete fields.userId
        fields.isEditorsPick = true
        const pipeline3 = [
          { $match: fields },
          { $sort: options.sort },
          { $limit: 100 },
          { $sample: { size: editorsPostsLimit } },
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

        const editorsPosts = Posts.aggregate(pipeline3)
        // const editorsPosts = Posts.find(fields, options).fetch()
        relatedPosts = moreRelatedPosts.concat(editorsPosts)
      } else {
        relatedPosts = relatedPostsByTags
      }
    }
    if (relatedPosts) {
      dbCache.set('post_related_' + params.postId, relatedPosts)
    }
    return relatedPosts
  }
}
