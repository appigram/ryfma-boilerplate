import { Accounts } from 'meteor/appigram:accounts-base'
import { Meteor } from 'meteor/meteor'
// import Users from '/server/api/collections/Users'
// import Users from '../../../../server/api/collections/Users'

export default function (root, { token }, context) {
  let userId = null
  let user = null

  const hashedToken = Accounts._hashLoginToken(token)

  try {
    user = Meteor.users.findOne({
      'services.resume.loginTokens.hashedToken': hashedToken
    }, {
      fields: {
        _id: 1,
        'services.resume.loginTokens': { $slice: 1 },
        'profile.lastLogin': 1
      }
    })
  } catch (err) {}

  if (user) {
    const loginToken = user.services.resume.loginTokens[0]
    const expiresAt = Accounts._tokenExpiration(loginToken.when)
    const isExpired = expiresAt < new Date()

    if (!isExpired) {
      Meteor.defer(() => {
        try {
          const userLastLogin = user.profile.lastLogin
          if (!userLastLogin) {
            Meteor.users.update(
              { _id: user._id },
              {
                $inc: { 'stats.strikeCount': 1 },
                $set: { 'profile.lastLogin': new Date() }
              })
          } else {
            const currDate = new Date()
            const hours = Math.floor(Math.abs(userLastLogin - currDate) / 36e5)
            // User strike login
            if (hours > 18 && hours < 36) {
              // console.log('userId: ', user._id)
              Meteor.users.update(
                { _id: user._id },
                {
                  $inc: { 'stats.strikeCount': 1 },
                  $set: { 'profile.lastLogin': new Date() }
                })
            } else if (hours > 36) {
              // User strike login remove
              Meteor.users.update(
                { _id: user._id },
                {
                  $set: { 'stats.strikeCount': 0, 'profile.lastLogin': new Date() }
                })
            }
          }
        } catch (err) {
          console.log(err)
        }
      })

      return {
        success: !!user._id,
        userId: user._id,
        tokenExpires: expiresAt
      }
    } else {
      return {
        success: false,
        userId
      }
    }
  }

  return {
    success: false,
    userId
  }
}

// Context version
/* export default function (root, { token }, context) {
  let userId = null
  if (context && context.userId) {
    let user = context.user
    const hashedToken = Accounts._hashLoginToken(token)

    try {
      const checkInContext = context.user.services.resume.loginTokens.hashedToken === hashedToken
      if (!checkInContext) {
        user = Meteor.users.findOne({
          _id: context.userId,
          'services.resume.loginTokens.hashedToken': hashedToken
        }, {
          fields: {
            _id: 1,
            'services.resume.loginTokens': { $slice: 1 }
          }
        })
      }
    } catch (err) {}

    if (user) {
      const loginToken = user.services.resume.loginTokens[0]
      const expiresAt = Accounts._tokenExpiration(loginToken.when)
      const isExpired = expiresAt < new Date()

      if (!isExpired) {
        userId = user._id
      }
    }

    return {
      success: !!userId,
      userId
    }
  } else {
    return {
      success: false,
      userId
    }
  }
} */
