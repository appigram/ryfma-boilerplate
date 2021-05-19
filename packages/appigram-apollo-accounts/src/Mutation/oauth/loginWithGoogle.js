import resolver from './resolver'
import { fetch } from 'meteor/fetch'

const handleAuthFromAccessToken = async function ({ accessToken, invitedByUserId = '' }) {
  const scopes = await getScopes(accessToken)
  const identity = await getIdentity(accessToken)
  const serviceData = {
    ...identity,
    accessToken,
    scopes
  }

  return {
    serviceName: 'google',
    serviceData,
    options: {
      profile: {
        name: identity.name,
        invitedByUserId
      }
    }
  }
}

const getIdentity = async function (accessToken) {
  try {
    const url = new URL("https://www.googleapis.com/oauth2/v1/userinfo")
    const params = {
      access_token: accessToken,
    }
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    const response = await fetch(url)
    const data = await response.json()
    // HTTP.get('https://www.googleapis.com/oauth2/v1/userinfo', {params: {access_token: accessToken}}).data
    return data
  } catch (err) {
    throw new Error('Failed to fetch identity from Google. ' + err.message)
  }
}

const getScopes = async function (accessToken) {
  try {
    const url = new URL("https://www.googleapis.com/oauth2/v1/tokeninfo")
    const params = {
      access_token: accessToken
    }
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    const response = await fetch(url)
    const data = await response.json()
    // return HTTP.get('https://www.googleapis.com/oauth2/v1/tokeninfo', {params: {access_token: accessToken}}).data.scope.split(' ')
    return data.scope.split(' ')
  } catch (err) {
    throw new Error('Failed to fetch tokeninfo from Google. ' + err.message)
  }
}

export default resolver(handleAuthFromAccessToken)
