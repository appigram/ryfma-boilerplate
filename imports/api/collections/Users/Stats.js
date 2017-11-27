import SimpleSchema from 'simpl-schema'

export default new SimpleSchema({
  postsCount: {
    type: Number,
    optional: true,
    defaultValue: 0
  },
  followersCount: {
    type: Number,
    optional: true,
    defaultValue: 0
  },
  followingCount: {
    type: Number,
    optional: true,
    defaultValue: 0
  },
  savedCount: {
    type: Number,
    optional: true,
    defaultValue: 0
  },
  strikeCount: {
    type: Number,
    optional: true,
    defaultValue: 0
  },
  strikePostsCount: {
    type: Number,
    optional: true,
    defaultValue: 0
  },
  postViewsCount: {
    type: Number,
    optional: true,
    defaultValue: 0
  },
  maxPostViewsCount: {
    type: Number,
    optional: true,
    defaultValue: 0
  }
})
