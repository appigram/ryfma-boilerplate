import {Accounts} from 'meteor/appigram:accounts-base'

export default function (root, {email}, {userId}) {
  Accounts.sendVerificationEmail(userId, email)
  return {
    success: true
  }
}
