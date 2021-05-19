import dbCache from '/server/config/redis'
import stringifyObject from '/lib/utils/helpers/stringifyObject'
import Posts from '../../../../collections/Posts'
import Albums from '../../../../collections/Albums'
import Followers from '../../../../collections/Followers'

const getPosts = async (root, params, context, { cacheControl }) => {
  const { userId } = context || { userId: null }
  const paramsE = {
    userId,
    ...params
  }
  const postsKey = stringifyObject(paramsE)
  // console.log('postsKey: ', postsKey)
  // console.log('context: ', context.headers)
  if (!params.noCache) {
    const getPosts = await dbCache.get('posts_' + postsKey)
    if (getPosts) {
      return getPosts
    }
  }

  const options = {}
  const fields = {}
  options.limit = 15 // Set post limit to 15
  options.skip = 0 // Set post limit to 0
  options.sort = {
    createdAt: -1 // Sorted by createdAt descending by default
  }

  if (params.type === 'popular') {
    options.sort = {
      likeCount: -1 // Sorted by likesCount descending
    }
  } else if (params.type === 'viewed') {
    options.sort = {
      viewCount: -1 // Sorted by viewCount descending
    }
  } else if (params.type === 'commented') {
    options.sort = {
      commentsCount: -1 // Sorted by commentsCount descending
    }
  } else if (params.type === 'alpha') {
    options.sort = {
      title: 1 // Sorted by title ascending
    }
  } else if (params.type === 'picks') {
    fields.isEditorsPick = true
  } else if (params.type === 'audios') {
    fields.audioFiles = { $exists: true, $ne: [] }
  } else if (params.type === 'videos') {
    fields.videoLink = { $ne: null }
  }

  // Exclude promoted posts for common feeds
  if (!params.personal && !(params.albumId || params.tagId || params.festId)) {
    fields.isPromoted = { $ne: true }
  }

  if (params.status) {
    fields.status = params.status
  } else {
    fields.status = 2
  }

  if (paramsE.userId && params.type === 'following') {
    const followingItems = Followers.find({ currId: paramsE.userId }, {}).fetch()
    const followingIds = followingItems.map(item => item.userId)
    // console.log('Followers: ', followingIds.length)
    fields.userId = { $in: followingIds }
  } else if (paramsE.userId && paramsE.personal && !params.albumId) {
    fields.userId = paramsE.userId
  }

  if (params.albumId) {
    const album = Albums.findOne({ _id: params.albumId })
    if (album.postIds) {
      fields._id = { $in: album.postIds }
    } else {
      fields.albumId = params.albumId
    }
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
    const regex = new RegExp(`${params.keyword.trim()}`)
    fields.title = { $regex: regex, $options: 'im' }
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
  if (options.limit === 1000) {
    options.fields = {
      _id: 1,
      createdAt: 1,
      postedAt: 1,
      title: 1,
      seoTitle: 1,
      slug: 1,
      paymentType: 1,
      coverImg: 1,
      videoLink: 1,
      audioFiles: 1,
      userId: 1,
      likeCount: 1,
      commentsCount: 1,
      viewCount: 1,
      tags: 1,
      albumId: 1,
      isPromoted: 1,
      isCertified: 1,
      isAdultContent: 1,
      isEditorsPick: 1
    }
  } else {
    options.fields = {
      _id: 1,
      createdAt: 1,
      postedAt: 1,
      title: 1,
      seoTitle: 1,
      slug: 1,
      excerpt: 1,
      paymentType: 1,
      coins: 1,
      buyers: 1,
      coverImg: 1,
      videoLink: 1,
      audioFiles: 1,
      userId: 1,
      likeCount: 1,
      commentsCount: 1,
      viewCount: 1,
      tags: 1,
      albumId: 1,
      isPromoted: 1,
      isCertified: 1,
      isAdultContent: 1,
      isEditorsPick: 1
    }
  }

  // console.log('params: ', params)
  // console.log('fields: ', fields)
  // console.log('options: ', options)
  let posts = []
  if (params.type === 'picks') { // } || params.type === 'following') {
    posts = Posts.aggregate([
      { $match: fields }, // filter the results
      { $sample: { size: options.limit } } // To get Limit docs
    ])
  } else {
    posts = Posts.find(fields, options).fetch()
  }

  if (posts) {
    if (posts.length < 100) {
      dbCache.set('posts_' + postsKey, posts)
    }
  }

  return posts
}

export default getPosts
