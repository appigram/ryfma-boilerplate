import { Meteor } from 'meteor/meteor'
import Followers from '/imports/api/collections/Followers'
import { sendMultiEmails } from '/imports/server/emails/send'
import { Accounts } from 'meteor/accounts-base'

const followUser = (root, args, context) => {
  const { userId } = context || { userId: null }
  if (userId && userId !== args._id) {
    const followed = Followers.insert(
      { currId: userId,
        userId: args._id,
        followedAt: new Date()
      })
    if (followed) {
      // update Current user
      Meteor.users.update(
        { _id: userId },
        { $inc: { 'stats.followingCount': 1 }, $push: { 'profile.following': args._id } }
      )
      // update Another user
      Meteor.users.update(
        { _id: args._id },
        { $inc: { 'stats.followersCount': 1, 'profile.nextKarma': 1 } }
      )

      return true
    }

    throw new Meteor.Error('user-following-error', 'Error of following user')
  } else {
    throw new Meteor.Error('Login required', 'Insufficient rights for this action.')
  }
}

const unFollowUser = (root, args, context) => {
  const { userId } = context || { userId: null }
  if (userId && userId !== args._id) {
    const unFollowed = Followers.remove({ currId: userId, userId: args._id })

    if (unFollowed) {
      // update Current user
      Meteor.users.update(
        { _id: userId },
        { $inc: { 'stats.followingCount': -1 }, $pull: { 'profile.following': args._id } }
      )
      // update Another user
      Meteor.users.update(
        { _id: args._id },
        { $inc: { 'stats.followersCount': -1, 'profile.nextKarma': -1 } }
      )
      return true
    }

    throw new Meteor.Error('user-following-error', 'Error of following user')
  } else {
    throw new Meteor.Error('Login required', 'Insufficient rights for this action.')
  }
}

const sendInvitesEmail = (root, args, context) => {
  const { userId } = context || { userId: null }
  if (userId) {
    const author = Meteor.users.findOne(userId)
    const emails = args.emails// .filter(item => item !== author.emails[0].address);
    sendMultiEmails({
      subject: 'Invite to MO.ST😎',
      data: { user: author, url: `http://sf1.welyx.com/r/${author._id}`, title: `Thank you ${author.profile.name}` },
      template: 'invite',
      addresses: emails
    })
    return true
  }

  throw new Meteor.Error('Login required', 'Insufficient rights for this action.')
}

const changeLevitanCount = (root, args, context) => {
  return Meteor.users.update(
    { _id: args._id },
    { $inc: { 'stats.levitanDownloads': 1 } }
  )
}

const sendVerificationLink = (root, args, context) => {
  const { userId } = context || { userId: null }
  if (userId) {
    Accounts.sendVerificationEmail(userId)
    return true
  }
}

export { followUser, unFollowUser, sendInvitesEmail, changeLevitanCount, sendVerificationLink }
