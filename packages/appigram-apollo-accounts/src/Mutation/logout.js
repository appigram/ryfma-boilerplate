import {Accounts} from 'meteor/appigram:accounts-base'
import getConnection from '../getConnection'

export default function (root, {token}, context) {
  if (token && context.userId) {
    const hashedToken = Accounts._hashLoginToken(token)
    Accounts.destroyToken(context.userId, hashedToken)
  }
  const connection = getConnection()
  Accounts._successfulLogout(connection, context.userId)
  return { success: true }
}
