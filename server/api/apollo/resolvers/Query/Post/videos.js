import dbCache from '/server/config/redis'
import stringifyObject from '/lib/utils/helpers/stringifyObject'
import Posts from '../../../../collections/Posts'
import Followers from '../../../../collections/Followers'

const getPosts = async (root, params, context, { cacheControl }) => {
  const { userId } = context || { userId: null }
  const paramsE = {
    userId,
    ...params
  }
  const postsKey = stringifyObject(paramsE)
  const getPosts = await dbCache.get('posts_' + postsKey)
  if (getPosts) {
    return getPosts
  } else {
    const options = {}
    const fields = {}
    options.limit = 15 // Set post limit to 15
    options.skip = 0 // Set post limit to 0
    options.sort = {
      createdAt: -1
    }

    if (params.type === 'popular') {
      options.sort = {
        ...options.sort,
        likeCount: -1 // Sorted by likesCount descending
      }
    } else if (params.type === 'viewed') {
      options.sort = {
        ...options.sort,
        viewCount: -1 // Sorted by viewCount descending
      }
    } else if (params.type === 'commented') {
      options.sort = {
        ...options.sort,
        commentsCount: -1 // Sorted by commentsCount descending
      }
    } else if (params.type === 'alpha') {
      options.sort = {
        ...options.sort,
        title: 1 // Sorted by title descending
      }
    }

    // Exclude promoted posts for common feeds
    if (!params.personal) {
      fields.isPromoted = { $exists: false, $ne: true }
    }

    if (params.status) {
      fields.status = params.status
    } else {
      fields.status = 2
    }

    if (userId && params.type === 'following') {
      const followingItems = Followers.find({ currId: userId }, {}).fetch()
      const followingIds = followingItems.map(item => item.userId)
      // console.log('Followers: ', followingIds.length)
      fields.userId = { $in: followingIds }
    } else if (params.userId && params.personal) {
      fields.userId = params.userId
    }

    if (params.albumId) {
      fields.albumId = params.albumId
    }

    if (params.tagId) {
      fields.tags = { $all: [params.tagId] }
    }

    if (params.festId) {
      fields.fests = { $in: [params.festId] }
      options.sort = {
        postedAt: -1 // Sorted by postedAt descending by default
      }
    }

    if (params.withImage) {
      fields.coverImg = { $exists: true }
    }

    if (params.keyword) {
      const regex = new RegExp(`${params.keyword}`)
      fields.title = { $regex: regex, $options: 'im' }
    }

    if (params.isVideo) {
      fields.videoLink = { $ne: null }
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
        if (params.limit === 1000) {
          options.limit = 1000
        } else {
          options.limit = 100
        }
      } else if (params.limit < 0) {
        options.limit = 15
      } else {
        options.limit = params.limit
      }
    }

    if (params.duration) {
      const today = new Date()
      const weekAgoDate = new Date()
      const monthAgoDate = new Date()
      const yearAgoDate = new Date()
      // const decadeAgoDate = new Date();
      today.setUTCDate(today.getDate() - 1)
      weekAgoDate.setUTCDate(weekAgoDate.getDate() - 7)
      monthAgoDate.setUTCDate(monthAgoDate.getDate() - 30)
      yearAgoDate.setUTCDate(yearAgoDate.getDate() - 365)
      // decadeAgoDate.setUTCDate(decadeAgoDate.getDate() - 3650);

      let afterDate = today
      if (params.duration === 'week') {
        afterDate = weekAgoDate
      } else if (params.duration === 'month') {
        afterDate = monthAgoDate
      } else if (params.duration === 'year') {
        afterDate = yearAgoDate
      }

      fields.createdAt = {
        $gte: afterDate
      }
    }

    // Query optimization
    options.fields = {
      _id: 1,
      createdAt: 1,
      postedAt: 1,
      title: 1,
      slug: 1,
      excerpt: 1,
      paymentType: 1,
      coins: 1,
      buyers: 1,
      coverImg: 1,
      userId: 1,
      isPromoted: 1,
      isCertified: 1,
      isAdultContent: 1,
      videoId: 1,
      videoLink: 1
    }

    // console.log('params: ', params)
    // console.log('fields: ', fields)
    // console.log('options: ', options)
    const posts = Posts.find(fields, options).fetch()

    if (posts) {
        dbCache.set('posts_' + postsKey, posts)
    }
    return posts
  }
}

export default getPosts
