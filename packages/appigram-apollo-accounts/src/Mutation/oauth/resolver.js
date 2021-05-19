import callMethod from '../../callMethod'
import getUserLoginMethod from './getUserLoginMethod'
import linkSocialService from './linkSocialService'
import { Random } from 'meteor/random'
import { OAuth } from 'meteor/appigram:oauth'
import { Meteor } from 'meteor/meteor'

export default function (handleAuthFromAccessToken) {
  return async function (root, params, context) {
    const oauthResult = await handleAuthFromAccessToken(params)
    // console.log('oauthResult: ', oauthResult)
    // Why any token works? :/
    const credentialToken = Random.secret()
    const credentialSecret = Random.secret()

    OAuth._storePendingCredential(credentialToken, oauthResult, credentialSecret)

    const oauth = { credentialToken, credentialSecret }
    try {
      return callMethod(context, 'login', { oauth })
    } catch (error) {
      console.log('resolver error: ', error)
      if (error.reason === 'Email already exists.') {
        const email = oauthResult.serviceData.email || oauthResult.serviceData.emailAddress
        const { _id, services, method } = getUserLoginMethod(email)

        if (method === 'no-password') {
          throw new Meteor.Error('no-password', 'User has no password set, go to forgot password')
        } else if (method) {
          console.log('linkSocialService')
          linkSocialService(context, oauthResult.serviceName, oauthResult.serviceData, oauthResult.options, _id, services)
          // throw new Error(`User is registered with ${method}.`)
        } else {
          throw new Error('User has no login methods')
        }
      } else {
        throw error
      }
    }
  }
}
