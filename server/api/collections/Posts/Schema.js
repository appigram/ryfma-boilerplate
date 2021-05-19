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
    Timestamp of post scheduled
  */
  scheduledAt: {
    type: Date,
    optional: true
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
    max: 255
  },
  /**
    Slug
  */
  slug: {
    type: String,
    optional: true
  },
  /**
    SEO post title
  */
  seoTitle: {
    type: String,
    optional: true
  },
  /**
    HTML version of the post body
  */
  htmlBody: {
    type: String,
    max: 500000
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
    Price of the post
  */
  paymentType: {
    type: Number,
    optional: true,
    defaultValue: 0
  },
  /**
    Price of the post
  */
  coins: {
    type: Number,
    optional: true,
    defaultValue: 0
  },
  /**
    Array of users who bought post
  */
  buyers: {
    type: Array,
    optional: true
  },
  'buyers.$': {
    type: String,
    optional: true
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
    type: Object,
    optional: true
  },
  'likers.$.userId': {
    type: String,
    optional: true
  },
  'likers.$.likes': {
    type: Number,
    optional: true,
    defaultValue: 0,
    max: 50
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
    Count of gifts or post
  */
  giftsCount: {
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
    The post video Id
  */
  videoId: {
    type: String,
    optional: true
  },
  /**
    The post video link
  */
  videoLink: {
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
  /**
    The post album's `_id`.
  */
  albumId: {
    type: String,
    optional: true
  },
  /**
    The post album's `_id`.
  */
  albums: {
    type: Array,
    optional: true
  },
  'albums.$': {
    type: String
  },
  /**
    Is post promoted
  */
  isPromoted: {
    type: Boolean,
    optional: true
  },
  /**
    Is post have adult content
  */
  isAdultContent: {
    type: Boolean,
    optional: true
  },
  /**
    Is post certified
  */
  isCertified: {
    type: Boolean,
    optional: true
  },
  /**
    Is from  personal blog
  */
  isFromBlog: {
    type: Boolean,
    optional: true
  },
  /**
    Is post picked by editors
  */
  isEditorsPick: {
    type: Boolean,
    optional: true
  },
  /**
    Disable comments for post
  */
  disableComments: {
    type: Boolean,
    optional: true
  },
  /**
    Source of creation (Web, VK, iOS, Android)
  */
  createdFrom: {
    type: String,
    optional: true,
    defaultValue: 'web'
  },
  /**
    The post's fests
  */
  fests: {
    type: Array,
    optional: true
  },
  'fests.$': {
    type: String,
    optional: true
  },

  /**
    post audio files IDs
  */
  audioFiles: {
    type: Array,
    optional: true
  },
  'audioFiles.$': {
    type: String,
    optional: true
  },
  /**
    Source of destination post
  */
  redirectTo: {
    type: String,
    optional: true
  },
})
