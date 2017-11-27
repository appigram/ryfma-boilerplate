import SimpleSchema from 'simpl-schema'

export default new SimpleSchema({
  /**
    ID
  */
  _id: {
    type: String
  },
  /**
    Timetstamp of post creation
  */
  createdAt: {
    type: Date
  },
  /**
    Timestamp of post first appearing on the site (i.e. being approved)
  */
  postedAt: {
    type: Date
  },
  /**
    URL
  */
  url: {
    type: String,
    optional: true,
    max: 500
  },
  /**
    Title
  */
  title: {
    type: String,
    optional: false,
    max: 500
  },
  /**
    Slug
  */
  slug: {
    type: String,
    optional: true
  },
  /**
    HTML version of the post body
  */
  htmlBody: {
    type: String
  },
  /**
   Post Excerpt
   */
  excerpt: {
    type: String,
    optional: true
    // max: 255, // should not be changed the 255 is max we should load for each post/item
  },
  /**
    Count of how many times the post's page was viewed
  */
  viewCount: {
    type: Number,
    optional: true,
    defaultValue: 0
  },
  /**
    Count of how many times the post's page was viewed
  */
  likeCount: {
    type: Number,
    optional: true,
    defaultValue: 0
  },
  /**
    Array of users who liked post
  */
  likers: {
    type: Array,
    optional: true
  },
  'likers.$': {
    type: String,
    optional: true
  },
  /**
    Whether the post is likd or not
  */
  liked: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  /**
    Count of how many times the post's page was commented
  */
  commentsCount: {
    type: Number,
    optional: true,
    defaultValue: 0
  },
  /**
    Count of how many times the post's link was clicked
  */
  clickCount: {
    type: Number,
    optional: true,
    defaultValue: 0
  },
  /**
    Count of how many times the post's page was saved
  */
  savedCount: {
    type: Number,
    optional: true,
    defaultValue: 0
  },
  /**
    Array of users who saved post
  */
  savers: {
    type: Array,
    optional: true
  },
  'savers.$': {
    type: String,
    optional: true
  },
  /**
    Whether the post is saved or not
  */
  saved: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  /**
    The post's status. One of pending (`1`), approved (`2`), or deleted (`3`)
  */
  status: {
    type: Number,
    optional: true,
    defaultValue: 2
  },
  /**
    Whether the post is sticky (pinned to the top of posts lists)
  */
  sticky: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  /**
    Whether the post is colored (yellow background color to promote post)
  */
  colored: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  /**
    The post author's `_id`.
  */
  userId: {
    type: String
  },
  /**
    The post's cover image.
  */
  coverImg: {
    type: String,
    optional: true
  },
  /**
    The post's tags
  */
  tags: {
    type: Array
  },
  'tags.$': {
    type: String
  },
  /**
    Timestamp of the last comment
  */
  lastCommentedAt: {
    type: Date,
    optional: true
  },
})
