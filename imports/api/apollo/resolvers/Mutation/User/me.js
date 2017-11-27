import { Meteor } from 'meteor/meteor'

const saveProfile = (root, args, context) => {
  const { userId } = context || { userId: null }
  if (userId) {
    return Meteor.users.update({ _id: userId }, { $set: args })
  }

  throw new Meteor.Error('Login required', 'Insufficient rights for this action.')
}

const checkIfUsernameExists = (root, args, context) => {
  return !!(Meteor.users.findOne({ username: args.username }))
}

const saveSettings = (root, args, context) => {
  const { userId } = context || { userId: null }
  if (userId) {
    const newSettings = {
      'username': args.username,
      // 'emails.0.address': args.email,
      'settings.emailCommentedPost': args.emailCommentedPost,
      'settings.emailFeaturedPost': args.emailFeaturedPost,
      'settings.emailPrivateMessage': args.emailPrivateMessage,
      'settings.emailMentionsMe': args.emailMentionsMe,
      'settings.subscribeToEmail': args.subscribeToEmail,
      'settings.subscribeSponsorEmail': args.subscribeSponsorEmail,
      'settings.allowPrivateMessages': args.allowPrivateMessages,
      'settings.adsFree': args.adsFree
    }
    const result = Meteor.users.update({ _id: userId }, { $set: newSettings })
    return result
  }

  throw new Meteor.Error('Login required', 'Insufficient rights for this action.')
}

const changeUserAvatar = (root, args, context) => {
  const { userId } = context || { userId: null }
  if (userId) {
    const newProfile = {
      'profile.image': args.avatarUrl
    }
    return Meteor.users.update({ _id: userId }, { $set: newProfile })
  }

  throw new Meteor.Error('Login required', 'Insufficient rights for this action.')
}

export { saveProfile, checkIfUsernameExists, saveSettings, changeUserAvatar }
