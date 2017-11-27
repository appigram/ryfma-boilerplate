import SimpleSchema from 'simpl-schema'

export default new SimpleSchema({
  name: {
    type: String,
    optional: true
  },
  firstname: {
    type: String,
    optional: true
  },
  lastname: {
    type: String,
    optional: true
  },
  image: {
    type: String,
    optional: true
  },
  gender: {
    type: String,
    optional: true
  },
  bio: {
    type: String,
    optional: true
  },
  locale: {
    type: String,
    optional: true
  },
  slug: {
    type: String,
    optional: true
  },
  website: {
    type: String,
    optional: true
  },
  twitterUser: {
    type: String,
    optional: true
  },
  instagramUser: {
    type: String,
    optional: true
  },
  vkUser: {
    type: String,
    optional: true
  },
  facebookUser: {
    type: String,
    optional: true
  },
  following: {
    type: Array,
    optional: true,
    maxCount: 2500
  },
  'following.$': {
    type: String,
    optional: true
  },
  saved: {
    type: Array,
    optional: true
  },
  'saved.$': {
    type: String,
    optional: true
  },
  reviewed: {
    type: Array,
    optional: true
  },
  'reviewed.$': {
    type: String,
    optional: true
  },
  invitedByUserId: {
    type: String,
    optional: true
  },
  invitesCount: {
    type: Number,
    optional: true,
    defaultValue: 0
  },
  karma: {
    type: Number,
    optional: true,
    defaultValue: 1
  },
  nextKarma: {
    type: Number,
    optional: true,
    defaultValue: 1
  },
  unreadNotifications: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  'location.$': {
    type: Object,
    optional: true
  },
  'location.$.ip': {
    type: String,
    optional: true
  },
  'location.$.city': {
    type: String,
    optional: true
  },
  'location.$.country': {
    type: String,
    optional: true
  },
  online: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  idle: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  lastLogin: {
    type: Date,
    optional: true
  },
  lastPostCreated: {
    type: Date,
    optional: true
  }
})
