import gql from 'graphql-tag'
import { handleLoginCallback, getClient, startLoggingIn, endLoggingIn } from '../store'

/**
 * Pass the accessToken
 * It's recommended to use https://github.com/appigram/react-vk-login
 */

export default async function ({ code, redirectUri, userData, access_token, email, invitedByUserId }) {
  startLoggingIn()
  let result
  try {
    result = await getClient().mutate({
      mutation: gql`
      mutation loginWithVK($code: String $redirectUri: String, $userData: String, $access_token: String, $email: String, $invitedByUserId: String) {
        loginWithVK(code: $code redirectUri: $redirectUri, userData: $userData, access_token: $access_token, email: $email, invitedByUserId: $invitedByUserId) {
          id
          token
          tokenExpires
        }
      }
      `,
      variables: {
        code, redirectUri, userData, access_token, email, invitedByUserId
      }
    })
  } catch (err) {
    return handleLoginCallback(err)
  } finally {
    endLoggingIn()
  }

  return handleLoginCallback(null, result.data.loginWithVK)
}
