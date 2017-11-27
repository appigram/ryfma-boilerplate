import Tags from '../../../../collections/Tags'
import Comments from '../../../../collections/Comments'
import Users from '../../../../collections/Users'

export default {
  Post: {
    author ({ userId }, _, context) {
      const options = {}
      // Query optimization
      options.fields = {
        _id: 1,
        roles: 1,
        username: 1,
        emails: 1,
        'profile.name': 1,
        'profile.image': 1
      }
      return Users.find({_id: userId}, options).fetch()[0]
    },
    tags ({ tags }, _, context) {
      if (tags) {
        if (tags.length > 0) {
          return Tags.find({ _id: { $in: tags } }).fetch()
        }
      }
      return []
    },
    liked ({ likers }, _, context) {
      if (!context.userId) { return false }
      return context &&
        likers &&
        !!likers.find(u => typeof u === 'string' ? u === context.userId : u._id === context.userId)
    },
    saved ({ savers }, _, context) {
      if (!context.userId) { return false }
      return context &&
        savers &&
        !!savers.find(u => typeof u === 'string' ? u === context.userId : u._id === context.userId)
    },
    comments ({ _id }, _, context) {
      return Comments.find({ objectId: _id }).fetch()
    }
  }
}
