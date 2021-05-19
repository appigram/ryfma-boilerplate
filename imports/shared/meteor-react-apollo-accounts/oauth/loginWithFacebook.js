import gql from 'graphql-tag'
import { handleLoginCallback, getClient, startLoggingIn, endLoggingIn } from '../store'

/**
 * Pass the accessToken
 * It's recommended to use https://github.com/keppelen/react-facebook-login
 */

export default async function ({ accessToken, invitedByUserId }) {
  startLoggingIn()
  let result
  try {
    result = await getClient().mutate({
      mutation: gql`
      mutation loginWithFacebook ($accessToken: String!, $invitedByUserId: String) {
        loginWithFacebook (accessToken: $accessToken, invitedByUserId: $invitedByUserId) {
          id
          token
          tokenExpires
        }
      }
      `,
      variables: {
        accessToken, invitedByUserId
      }
    })
  } catch (err) {
    return handleLoginCallback(err)
  } finally {
    endLoggingIn()
  }

  return handleLoginCallback(null, result.data.loginWithFacebook)
}
