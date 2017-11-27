import Followers from '../../../../collections/Followers'

export default {
  User: {
    email (user, _, context) {
      return user.emails[0].address
    },
    isFollowing ({ _id }, _, context) {
      const isFollower = Followers.find({ currId: context.userId, userId: _id }).fetch().length === 1
      return isFollower
    }
  }
}
