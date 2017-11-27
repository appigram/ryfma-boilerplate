import { Meteor } from 'meteor/meteor'
import Tags from '../../../../collections/Tags'

const insertTag = (root, args, context) => {
  const { userId } = context || { userId: null }
  if (userId) {
    const tagInDB = Tags.findOne({ slug: args.slug })
    if (!tagInDB) {
      const tagId = Tags.insert(
        {
          name: args.name,
          slug: args.slug,
          count: 1
        }
      )
      return { _id: tagId }
    }

    Tags.update(
        { slug: args.slug },
        { $inc: { count: 1 } }
      )
    return { _id: tagInDB._id }
  }

  throw new Meteor.Error('Login required', 'Insufficient rights for this action.')
}

const deleteTag = (root, args, context) => {
  const { userId } = context || { userId: null }
  if (userId) {
    const tagInDB = Tags.findOne({ _id: args._id })
    if (tagInDB.count === 1) {
      return { _id: tagInDB._id }
    }

    Tags.update(
        { _id: tagInDB._id },
        { $inc: { count: -1 } }
      )
    return { _id: tagInDB._id }
  }

  throw new Meteor.Error('Login required', 'Insufficient rights for this action.')
}

export { insertTag, deleteTag }
