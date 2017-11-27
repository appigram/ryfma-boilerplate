import SimpleSchema from 'simpl-schema'

export default new SimpleSchema({
  /**
    The document `_id`
  */
  _id: {
    type: String
  },
  /**
    ID of current user
  */
  currId: {
    type: String
  },
  /**
    ID of followed user
  */
  userId: {
    type: String
  },
  /**
    Date of following user
  */
  followedAt: {
    type: Date
  }
})
