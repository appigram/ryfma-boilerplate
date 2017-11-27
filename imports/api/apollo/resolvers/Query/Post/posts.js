import Posts from '../../../../collections/Posts'

export default function (root, params, context) {
  const options = {}
  const fields = {}
  options.limit = 10 // Set post limit to 10
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
      commentCount: -1 // Sorted by commentCount descending
    }
  }

  if (params.userId) {
    fields.userId = params.userId
  }

  if (params.tagId) {
    fields.tags = { $all: [params.tagId] }
  }

  if (params.withImage) {
    fields.coverImg = { $exists: true }
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
      options.limit = 100
    } else if (params.limit < 0) {
      options.limit = 10
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
    title: 1,
    slug: 1,
    excerpt: 1,
    coverImg: 1,
    userId: 1
  }

  return Posts.find(fields, options).fetch()
}
