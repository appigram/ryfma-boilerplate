import SimpleSchema from 'simpl-schema'

export default new SimpleSchema({
  _id: {
    type: String
  },
  name: {
    type: String,
    unique: true
  },
  slug: {
    type: String
  },
  count: {
    type: Number,
    defaultValue: 0
  },
  title: {
    type: String,
    optional: true
  },
  description: {
    type: String,
    optional: true
  }
})
