import callMethod from '../callMethod'
import hashPassword from './hashPassword'
import getUserLoginMethod from './oauth/getUserLoginMethod'
import {Meteor} from 'meteor/meteor'

export default function (root, {username, email, password, plainPassword}, context) {
  if (!password && !plainPassword) {
    throw new Error('Password is required')
  }
  if (!password) {
    password = hashPassword(plainPassword)
  }
  let user = {}
  if (email) {
    user = {email: email.toLowerCase()}
  } else if (username) {
    user = {username: username.toLowerCase()}
  }

  const methodArguments = {
    user: user,
    password: password
  }
  // console.log('methodArguments: ', methodArguments)
  try {
    return callMethod(context, 'login', methodArguments)
  } catch (error) {
    if (error.reason === 'User has no password set') {
      const method = getUserLoginMethod(email || username)
      if (method === 'no-password') {
        throw new Meteor.Error('no-password', 'User has no password set, go to forgot password')
      } else if (method) {
        throw new Error(`User is registered with ${method.method}.`)
      } else {
        throw new Error('User has no login methods')
      }
    } else {
      throw error
    }
  }
}
