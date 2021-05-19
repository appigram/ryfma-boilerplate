import { Accounts } from 'meteor/appigram:accounts-base'
import Users from '/server/api/collections/Users'

Accounts.onLogin((data) => {
  if (data.user) {
    const user = data.user
    // console.log(user)
    // const service = Object.keys(user.services)[0]
    // const email = user.services[service].email

    // see if any existing user has this email address, otherwise create new
    // const existingUser = Users.findOne({'emails.address': email})
    // console.log('existingUser: ', existingUser)

    const userExists = Users.find({ _id: user._id }, { fields: { 'profile.lastLogin': 1, 'stats.strikeCount': 1 } }).fetch()[0]
    const userLastLogin = userExists.profile.lastLogin
    if (!userLastLogin) {
      Users.update(
        { _id: user._id },
        {
          $set: { 'stats.strikeCount': 1, 'profile.lastLogin': new Date() }
        }
      )
    } else {
      const currDate = new Date()
      const hours = Math.floor(Math.abs(userLastLogin - currDate) / 36e5)

      // User strike login
      if (hours > 18 && hours < 30) {
        Users.update(
          { _id: user._id },
          {
            $inc: { 'stats.strikeCount': 1 },
            $set: { 'profile.lastLogin': new Date() }
          }
        )
      } else if (hours > 30) {
        // User strike login set last strike
        let userLastStrike = userExists.stats.strikeCount || 1
        // const streakLevels = { 1: 1, 2: 2, 3: 7, 4: 14, 5: 30 }
        if (userLastStrike > 29) {
          userLastStrike = 30
        } else if (userLastStrike > 14 && userLastStrike < 30) {
          userLastStrike = 14
        } else if (userLastStrike > 7 && userLastStrike < 14) {
          userLastStrike = 7
        } else if (userLastStrike > 2 && userLastStrike < 7) {
          userLastStrike = 2
        } else {
          userLastStrike = 1
        }
        Users.update(
          { _id: user._id },
          {
            $set: { 'stats.strikeCount': userLastStrike, 'profile.lastLogin': new Date() }
          }
        )
      }
    }
  }
})
