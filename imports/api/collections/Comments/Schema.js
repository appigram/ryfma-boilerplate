import SimpleSchema from 'simpl-schema'

export default new SimpleSchema({
  /**
    ID
  */
  _id: {
    type: String
  },
  /**
    The timestamp of comment creation
  */
  createdAt: {
    type: Date
  },
  /**
    The timestamp of the comment being posted. For now, comments are always created and posted at the same time
  */
  postedAt: {
    type: Date
  },
  /**
    The HTML version of the comment body
  */
  content: {
    type: String
  },
  /**
    The object's type
  */
  objectType: {
    type: String
  },
  /**
    The object's' _id
  */
  objectId: {
    type: String
  },
  /**
    The comment author's `_id`
  */
  userId: {
    type: String
  },
  /**
    The comment spam score
  */
  spamScore: {
    type: Number,
    defaultValue: 0
  }
})
